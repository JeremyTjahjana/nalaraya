"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import Logo from "./Logo";
import { PhysicsIcon, ToolIcon } from "./ScienceIcons";
import {
  initial,
  reducer,
  score,
  steps,
  ohmQuestions,
  circuitTools,
  configForStep,
  savePhysicsCircuitsCompletion,
  type State,
} from "@/lib/circuits";
import { playLabSound, type SoundKind } from "@/lib/labSound";

const Scene = dynamic(() => import("./CircuitScene"), {
  ssr: false,
  loading: () => <p className="loading">Menyiapkan papan…</p>,
});
const Preview = dynamic(() => import("./CircuitToolPreview"), { ssr: false });

// Ordered component -> target-slot pairs for the keyboard select-then-target panel. Mirrors the
// reducer's internal connectForStep so the keyboard path can drive the same assembly as dragging.
const CONNECT_TARGETS: { id: string; label: string }[] = [
  { id: "rail", label: "Rel daya project board" },
  { id: "seri", label: "Slot seri (utama)" },
  { id: "paralel", label: "Slot paralel" },
  { id: "paralel-1", label: "Slot paralel 1" },
  { id: "paralel-2", label: "Slot paralel 2" },
];
const CONNECT_SOURCES: { id: string; label: string }[] = [
  { id: "jumper", label: "Kawat jumper" },
  { id: "ledA", label: "LED A" },
  { id: "ledB", label: "LED B" },
  { id: "ledC", label: "LED C" },
];

export default function CircuitLab() {
  const mode = useSearchParams().get("mode") === "ujian" ? "ujian" : "latihan";
  const [state, dispatch] = useReducer(reducer, mode, initial);
  const [drawer, setDrawer] = useState<"tools" | "notes" | "">("");
  const [preview, setPreview] = useState("battery"),
    [camera, setCamera] = useState(false),
    [cameraKey, setCameraKey] = useState(0);
  const [source, setSource] = useState(""),
    [target, setTarget] = useState("rail");
  const [muted, setMuted] = useState(false),
    [portrait, setPortrait] = useState(true),
    [reduced, setReduced] = useState(false),
    [audioError, setAudioError] = useState(false);
  const audio = useRef<AudioContext | null>(null),
    lastEvent = useRef(0),
    lastStep = useRef(0),
    snapshots = useRef<Record<number, State>>({ 0: initial(mode) });
  const [toolTip, setToolTip] = useState({ visible: false, x: 300, y: 100 });
  const tipHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const orientation = matchMedia(
        "(max-width: 900px) and (orientation: portrait)",
      ),
      motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setPortrait(orientation.matches);
      setReduced(motion.matches);
    };
    update();
    orientation.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      orientation.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (state.finished || mode !== "ujian") return;
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now(),
        seconds = Math.floor((now - last) / 1000);
      if (seconds) {
        last += seconds * 1000;
        dispatch({ type: "tick", seconds });
      }
    }, 250);
    return () => clearInterval(timer);
  }, [mode, state.finished]);
  useEffect(() => {
    if (!snapshots.current[state.step])
      snapshots.current[state.step] = structuredClone(state);
  }, [state]);

  function unlock() {
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => setAudioError(true));
    } catch {
      setAudioError(true);
    }
  }
  function sound(kind: SoundKind, force = false) {
    if (muted && !force) return;
    unlock();
    if (audio.current) playLabSound(audio.current, kind);
  }
  useEffect(() => {
    if (state.event !== lastEvent.current) {
      lastEvent.current = state.event;
      sound(state.sound);
      if (state.step > lastStep.current && state.sound !== "stage") {
        if (stageTimer.current) clearTimeout(stageTimer.current);
        stageTimer.current = setTimeout(() => sound("stage"), 350);
      }
      lastStep.current = state.step;
    }
  }, [state.event]);
  useEffect(
    () => () => {
      if (tipHideTimer.current) clearTimeout(tipHideTimer.current);
      if (stageTimer.current) clearTimeout(stageTimer.current);
      void audio.current?.close();
    },
    [],
  );

  function keepToolTip() {
    if (tipHideTimer.current) clearTimeout(tipHideTimer.current);
  }
  function hideToolTip() {
    keepToolTip();
    tipHideTimer.current = setTimeout(
      () => setToolTip((value) => ({ ...value, visible: false })),
      220,
    );
  }
  function showToolTip(event: React.MouseEvent<HTMLButtonElement>, id: string) {
    keepToolTip();
    const rect = event.currentTarget.getBoundingClientRect();
    setPreview(id);
    setToolTip({
      visible: true,
      x: rect.right,
      y: Math.max(92, Math.min(rect.top - 26, window.innerHeight - 455)),
    });
  }
  // A bare click on a 3D mesh. The switch toggles; other ids select the component for a target.
  function click(id: string) {
    if (id === "switch") {
      dispatch({ type: "toggleSwitch" });
      return;
    }
    setSource(id);
    sound("touch");
  }
  function connect(src: string, dst: string) {
    dispatch({ type: "connect", source: src, target: dst });
    setSource("");
  }
  function reset() {
    dispatch({ type: "reset" });
    snapshots.current = { 0: initial(mode) };
    lastEvent.current = 0;
    lastStep.current = 0;
    setSource("");
  }

  if (state.finished) return <CircuitResults state={state} reset={reset} />;

  const item = circuitTools.find((t) => t.id === preview)!;
  const progress = Math.round((state.step / 7) * 100);
  const config = configForStep[state.step];
  const switchPlaced = state.placed.includes("switch");

  return (
    <div className="lab-shell physics-lab" onPointerDown={unlock}>
      <header className="lab-header">
        <div className="lab-brand-group">
          <Logo compact />
          <div className="lab-title-wrap">
            <h1 className="lab-title">Rangkaian seri dan paralel</h1>
            <span className="lab-mode-badge">
              {mode === "latihan" ? "Latihan terpandu" : "Ujian mandiri"}
            </span>
          </div>
        </div>
        <div className="mobile-tabs">
          <button
            className={drawer === "tools" ? "tab-btn active" : "tab-btn"}
            aria-expanded={drawer === "tools"}
            onClick={() => setDrawer(drawer === "tools" ? "" : "tools")}
          >
            Alat & komponen
          </button>
          <button
            className={drawer === "notes" ? "tab-btn active" : "tab-btn"}
            aria-expanded={drawer === "notes"}
            onClick={() => setDrawer(drawer === "notes" ? "" : "notes")}
          >
            Panduan
          </button>
        </div>
        <div className="lab-progress">
          <label htmlFor="phys-progress">
            Progres <span>{progress}%</span>
          </label>
          <progress id="phys-progress" max={100} value={progress} />
        </div>
        {mode === "ujian" && (
          <time>
            {Math.floor(state.remaining / 60)
              .toString()
              .padStart(2, "0")}
            :{(state.remaining % 60).toString().padStart(2, "0")}
          </time>
        )}
        <button
          className="sound-toggle"
          aria-pressed={muted}
          aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
          onClick={() => {
            sound(muted ? "confirm" : "touch", true);
            setMuted(!muted);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10v4h4l5 4V6L8 10H4Z" />
            {muted ? (
              <path d="m17 9 4 6m0-6-4 6" />
            ) : (
              <path d="M16 9c1.5 1.7 1.5 4.3 0 6m2-8c2.8 2.8 2.8 7.2 0 10" />
            )}
          </svg>
        </button>
        <Link className="lab-exit" href="/fisika/rangkaian-seri-paralel">
          Keluar
        </Link>
      </header>
      <div className={drawer ? "lab-body drawer-" + drawer : "lab-body"}>
        <aside
          className={`inventory ${drawer === "tools" ? "opened" : ""}`}
          onMouseLeave={hideToolTip}
        >
          <div className="panel-heading">
            <div>
              <h2>Alat & komponen</h2>
              <small>Ketuk untuk menambah · Seret di papan</small>
            </div>
            <button
              type="button"
              className="panel-close-btn"
              onClick={() => setDrawer("")}
              aria-label="Tutup panel"
            >
              ✕
            </button>
          </div>
          <div className="inventory-list">
            {circuitTools.map((t) => {
              const deployed = state.placed.includes(t.id);
              // led/jumper are gathered at Langkah 1, then assembled on the board step by step via
              // the scene token or the keyboard "Rangkai" control — so their badge guides to the
              // board rather than implying the panel click finished the placement.
              const assembleOnBoard =
                deployed && (t.id === "led" || t.id === "jumper");
              return (
                <button
                  key={t.id}
                  draggable
                  className={`${preview === t.id ? "inventory-item active" : "inventory-item"}${deployed ? " item-deployed" : ""}`}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/circuit-tool", t.id);
                    e.dataTransfer.effectAllowed = "copy";
                    setPreview(t.id);
                  }}
                  onMouseEnter={(e) => showToolTip(e, t.id)}
                  onMouseLeave={hideToolTip}
                  onFocus={() => {
                    keepToolTip();
                    setPreview(t.id);
                    setToolTip({ visible: true, x: 300, y: 110 });
                  }}
                  onBlur={hideToolTip}
                  onClick={() => {
                    setPreview(t.id);
                    if (!deployed) dispatch({ type: "add", id: t.id });
                    setToolTip((value) => ({ ...value, visible: false }));
                  }}
                >
                  <div className="item-icon-box">
                    <ToolIcon id={t.id} className="item-icon" />
                  </div>
                  <div className="item-meta">
                    <span className="item-name">{t.name}</span>
                    <span className="item-category">{t.category}</span>
                  </div>
                  <span
                    className={`item-badge${deployed ? " active-badge" : ""}`}
                  >
                    {assembleOnBoard
                      ? "⋮⋮ Rakit di papan"
                      : deployed
                        ? "✓ Di papan"
                        : "⋮⋮ Pasang"}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            className={`tool-info${toolTip.visible ? " visible" : ""}`}
            style={{ left: toolTip.x, top: toolTip.y }}
            role="status"
            onMouseEnter={keepToolTip}
            onMouseLeave={hideToolTip}
          >
            <div className="tool-info-copy">
              <div className="tool-tags">
                <span>Kenali komponen</span>
                <span className="tool-category-badge">{item.category}</span>
              </div>
              <h3>{item.name}</h3>
              <div className="tool-spec-box">
                <strong>Spesifikasi:</strong> {item.spec}
              </div>
              <p>{item.info}</p>
              <div className="tool-safety">
                <p className="safety-copy">
                  <strong>Keselamatan</strong>
                  {item.safety}
                </p>
              </div>
            </div>
            <div className="popover-preview">
              {toolTip.visible && <Preview key={preview} id={preview} />}
            </div>
          </div>
        </aside>

        <main className="lab-center">
          <div className="scene-meta">
            <span>Rangkaian LED · Project board 6 V</span>
          </div>
          <div className={camera ? "camera-toolbar active" : "camera-toolbar"}>
            {mode === "latihan" && (
              <button
                className="toolbar-step-btn"
                onClick={() => {
                  dispatch({
                    type: "resetStep",
                    snapshot: snapshots.current[state.step] || initial(mode),
                  });
                  setSource("");
                }}
              >
                Reset langkah {state.step + 1}
              </button>
            )}
            <button
              aria-pressed={switchPlaced && state.switchOn}
              disabled={!switchPlaced}
              onClick={() => dispatch({ type: "toggleSwitch" })}
            >
              {state.switchOn ? "Buka sakelar" : "Tutup sakelar"}
            </button>
            <button
              aria-pressed={camera}
              onClick={() => {
                sound("touch");
                setCamera(!camera);
              }}
            >
              {camera ? "Selesai menggeser" : "Geser kamera"}
            </button>
            <button
              onClick={() => {
                sound("touch");
                setCameraKey((k) => k + 1);
                setCamera(false);
              }}
            >
              Pusatkan
            </button>
          </div>
          <div className="lab-toast" role="status" key={state.event}>
            <span className={state.feedback ? "error" : ""} />
            {state.log.at(-1) ||
              "Mulai dengan menambahkan komponen dari panel alat."}
          </div>
          <div
            className={camera ? "scene camera-active" : "scene"}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/circuit-tool");
              if (id) {
                dispatch({ type: "add", id });
                setToolTip((v) => ({ ...v, visible: false }));
              }
            }}
          >
            {!portrait && (
              <Scene
                state={state}
                cameraMode={camera}
                resetKey={cameraKey}
                reduced={reduced}
                onConnect={connect}
                onDrop={connect}
                onClick={click}
              />
            )}
          </div>
          <div className="scene-help">
            {camera
              ? "Geser pandangan; matikan Geser kamera untuk kembali merangkai komponen."
              : source
                ? "Dipilih: " +
                  (CONNECT_SOURCES.find((s) => s.id === source)?.label ||
                    circuitTools.find((t) => t.id === source)?.name ||
                    source) +
                  " · Seret ke slot tujuan atau gunakan panel kontrol."
                : "Kamera terkunci · Seret komponen ke slot · Scroll / cubit untuk zoom"}
          </div>
          <ReadoutPanel state={state} />
          <div className="phys-controls">
            <details>
              <summary>Kontrol sentuh & keyboard</summary>
              <p>
                Pilih komponen dan slot tujuan untuk merangkai tanpa menyeret.
              </p>
              <div>
                <label>
                  Komponen
                  <select
                    aria-label="Komponen"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="">Pilih komponen</option>
                    {CONNECT_SOURCES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Slot tujuan
                  <select
                    aria-label="Slot tujuan"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  >
                    {CONNECT_TARGETS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  disabled={!source}
                  onClick={() => connect(source, target)}
                >
                  Rangkai
                </button>
              </div>
              <button
                className="toolbar-step-btn"
                aria-pressed={switchPlaced && state.switchOn}
                disabled={!switchPlaced}
                onClick={() => dispatch({ type: "toggleSwitch" })}
              >
                {state.switchOn ? "Buka sakelar" : "Tutup sakelar"}
              </button>
            </details>
          </div>
        </main>
        <aside className={drawer === "notes" ? "notes opened" : "notes"}>
          <div className="panel-heading mobile-notes-heading">
            <div>
              <h2>
                {mode === "latihan" ? "Panduan praktikum" : "Catatan percobaan"}
              </h2>
              <small>Langkah {state.step + 1} dari 7</small>
            </div>
            <button
              type="button"
              className="panel-close-btn"
              aria-label="Tutup panel"
              onClick={() => setDrawer("")}
            >
              ×
            </button>
          </div>
          {mode === "latihan" ? (
            <div className="step-accordions">
              {steps.map(([title, detail], i) => {
                const checks = ohmQuestions.filter((q) => q.step === i + 1);
                return (
                  <details
                    key={title}
                    open={i === state.step}
                    className={
                      i === state.step
                        ? "current"
                        : i < state.step
                          ? "done"
                          : ""
                    }
                  >
                    <summary>
                      <span>{i < state.step ? "✓" : i + 1}</span>
                      {title}
                    </summary>
                    <p>{detail}</p>
                    {checks.map((q) => (
                      <details key={q.q} className="phys-check">
                        <summary>Cek pemahaman</summary>
                        <p>{q.q}</p>
                        <details className="phys-check-answer">
                          <summary>Lihat jawaban</summary>
                          <p>
                            <strong>{q.options[q.answer]}</strong> ·{" "}
                            {q.explanation}
                          </p>
                        </details>
                      </details>
                    ))}
                  </details>
                );
              })}
            </div>
          ) : (
            <>
              <p>
                Rakit rangkaian sesuai urutan langkah, tutup sakelar agar lampu
                menyala, lalu jawab soal perhitungan hukum Ohm. Gunakan I = V/R
                dan aturan hambatan seri (dijumlahkan) serta paralel (1/R_total
                = Σ 1/R).
              </p>
              <section className="phys-quiz">
                <h2>Soal perhitungan</h2>
                {ohmQuestions.map((q, index) => (
                  <fieldset key={q.q}>
                    <legend>{q.q}</legend>
                    {q.options.map((opt, choice) => (
                      <label key={opt}>
                        <input
                          type="radio"
                          name={`ohm-${index}`}
                          checked={state.quiz[index] === choice}
                          onChange={() =>
                            dispatch({ type: "answerQuiz", index, choice })
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </fieldset>
                ))}
                <button onClick={() => dispatch({ type: "submit" })}>
                  Kumpulkan hasil ujian
                </button>
              </section>
            </>
          )}
          <section>
            <h2>Catatan pengamatan</h2>
            <p>
              Pada rangkaian seri, hambatan total bertambah sehingga arus
              mengecil dan lampu meredup. Pada rangkaian paralel, setiap cabang
              menerima tegangan penuh sehingga lampu menyala hampir seterang
              lampu tunggal.
            </p>
            <p className="safety-copy">
              <strong>Catatan model: </strong>
              LED di sini dimodelkan sebagai resistor ohmik identik (100 Ω) agar
              perbandingan kecerahan mudah dihitung. LED sungguhan bersifat
              non-ohmik, sehingga nilai arus dan kecerahan sebenarnya dapat
              berbeda.
            </p>
          </section>
          {audioError && (
            <p role="status">
              Suara tidak tersedia. Konfirmasi visual tetap aktif.
            </p>
          )}
        </aside>
      </div>
      {drawer !== "" && (
        <div className="drawer-backdrop" onClick={() => setDrawer("")} />
      )}
      <div className="portrait-gate" role="status">
        <PhysicsIcon />
        <h2>Putar perangkat ke landscape.</h2>
        <p>
          Papan rangkai membutuhkan bidang kerja mendatar agar komponen dapat
          dipasang dengan akurat.
        </p>
      </div>
      {/* config currently observed, surfaced for assistive context */}
      <span className="sr-only" aria-hidden="true" data-config={config} />
    </div>
  );
}

function ReadoutPanel({ state }: { state: State }) {
  const { readout, switchOn } = state;
  const amps = (v: number) => `${v.toFixed(3)} A`;
  return (
    <div className="phys-readout" role="group" aria-label="Pembacaan rangkaian">
      <div className="phys-readout-row">
        <div>
          <span className="phys-readout-label">Tegangan sumber</span>
          <strong>{readout.vSource.toFixed(1)} V</strong>
        </div>
        <div>
          <span className="phys-readout-label">Hambatan total</span>
          <strong>
            {readout.rTotal ? `${readout.rTotal.toFixed(1)} Ω` : "—"}
          </strong>
        </div>
        <div>
          <span className="phys-readout-label">Arus sumber</span>
          <strong>{switchOn ? amps(readout.iSource) : "0,000 A"}</strong>
        </div>
      </div>
      {readout.lamps.length > 0 && (
        <ul className="phys-lamp-bars">
          {readout.lamps.map((lamp, i) => {
            const displayed = switchOn ? lamp.brightness : 0;
            const label = lamp.id.replace("led", "LED ");
            return (
              <li key={lamp.id}>
                <span className="phys-lamp-name">{label}</span>
                <span
                  className="phys-lamp-track"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(displayed * 100)}
                  aria-label={`Kecerahan ${label}`}
                >
                  <svg viewBox="0 0 100 10" aria-hidden="true">
                    <rect x="0" y="0" width="100" height="10" rx="5" />
                    <rect
                      x="0"
                      y="0"
                      width={Math.max(0, Math.min(100, displayed * 100))}
                      height="10"
                      rx="5"
                      className="phys-lamp-fill"
                    />
                  </svg>
                </span>
                <span className="phys-lamp-value">
                  {Math.round(displayed * 100)}%
                </span>
                {i === 0 && !switchOn && (
                  <span className="sr-only">Sakelar terbuka · lampu padam</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CircuitResults({ state, reset }: { state: State; reset: () => void }) {
  const [saveFailed, setSaveFailed] = useState(false);
  useEffect(() => {
    if (!savePhysicsCircuitsCompletion(window.localStorage))
      setSaveFailed(true);
  }, []);
  const config = configForStep[state.step];
  return (
    <main className="content physics-page circuit-results">
      <Logo />
      <h1>{state.expired ? "Waktu ujian selesai" : "Rangkaian selesai"}</h1>
      <p className="result-score">
        Nilai praktikum <strong>{score(state)}/100</strong>
      </p>
      <p>
        {state.expired
          ? "Tinjau langkah dan soal yang belum selesai, lalu coba kembali."
          : "Kamu telah merangkai rangkaian seri, paralel, dan gabungan, serta mengamati perbedaan kecerahan antar lampu."}
      </p>
      <section>
        <h2>Hasil pengamatan</h2>
        <p>
          Rangkaian terakhir yang diamati:{" "}
          <strong>
            {config === "challenge"
              ? "rangkaian tantangan (gabungan seri–paralel)"
              : config === "combo3"
                ? "rangkaian gabungan seri–paralel"
                : config === "parallel3"
                  ? "rangkaian paralel 3 LED"
                  : config === "series2"
                    ? "rangkaian seri 2 LED"
                    : config === "single"
                      ? "satu LED tunggal"
                      : config === "powered"
                        ? "rel daya aktif"
                        : "persiapan alat"}
          </strong>
          . Hambatan total {state.readout.rTotal.toFixed(1)} Ω dengan arus
          sumber {state.readout.iSource.toFixed(3)} A pada tegangan{" "}
          {state.readout.vSource.toFixed(1)} V.
        </p>
        <p className="safety-copy">
          <strong>Catatan model: </strong>
          LED dimodelkan sebagai resistor ohmik identik (100 Ω). LED sungguhan
          non-ohmik, sehingga nilai arus dan kecerahan sebenarnya dapat berbeda.
        </p>
      </section>
      <section>
        <h2>Rincian penilaian</h2>
        {Object.keys(state.penalties).length ? (
          <dl>
            {Object.entries(state.penalties).map(([name, n]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>−{n}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>Seluruh langkah dan soal selesai tanpa pengurangan nilai.</p>
        )}
      </section>
      <details>
        <summary>Rekaman praktikum · {state.log.length} tindakan</summary>
        <ol>
          {state.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </details>
      {saveFailed && (
        <p role="status">
          Status penyelesaian tidak dapat disimpan di perangkat ini.
        </p>
      )}
      <div className="result-actions">
        <button onClick={reset}>Ulangi {state.mode}</button>
        <Link className="button" href="/fisika/rangkaian-seri-paralel">
          Pilih mode
        </Link>
        <Link href="/fisika">Kembali ke fisika</Link>
      </div>
    </main>
  );
}
