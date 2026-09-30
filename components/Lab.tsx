"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import { endpoint, initial, reducer, score, steps, tools } from "@/lib/lab";
import HazardLegend from "./HazardLegend";
import Logo from "./Logo";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <p className="loading">Menyiapkan meja praktikum…</p>,
});
const Preview = dynamic(
  () => import("./Scene").then((module) => module.Preview),
  { ssr: false },
);

const stepDetails = [
  "Tekan tombol Kenakan pada kacamata keselamatan, jas laboratorium, dan sarung tangan. Ketiganya harus terpasang sebelum bahan kimia digunakan.",
  "Seret statif ke lingkaran panduan. Setelah terpasang, seret buret ke klem sampai keduanya terkunci pada posisi yang benar.",
  "Letakkan gelas limbah di meja, lalu seret botol NaOH mendekati buret. Bilasan pertama akan ditampung sebagai limbah.",
  "Seret corong ke mulut buret. Setelah corong terpasang, seret botol NaOH ke buret sekali lagi untuk mengisi buret dan membuang gelembung.",
  "Seret corong menjauh dari buret. Corong harus dilepas agar pembacaan volume awal tidak berubah oleh tetesan sisa.",
  "Seret pipet ke botol HCl untuk mengambil sampel, kemudian seret pipet yang sudah terisi ke Erlenmeyer.",
  "Seret botol fenolftalein ke Erlenmeyer. Indikator akan membantu menunjukkan titik akhir titrasi.",
  "Seret Erlenmeyer ke lingkaran tepat di bawah ujung buret sampai posisinya sesuai.",
  "Gunakan kontrol pada jendela titrasi. Tambahkan NaOH dalam 5 mL saat masih jauh dari titik akhir, lalu beralih ke 1 mL atau 0,5 mL. Aduk setelah setiap penambahan.",
  "Saat warna berubah menjadi merah muda pucat, tekan Selesaikan titrasi. Baca bagian bawah meniskus sejajar dengan mata, lalu catat volume awal, volume akhir, dan hasil perhitungan.",
];

export default function Lab() {
  const params = useSearchParams();
  const mode = params.get("mode") === "ujian" ? "ujian" : "latihan";
  const [state, dispatch] = useReducer(reducer, mode, initial);
  const [selected, select] = useState<string | null>(null);
  const [preview, setPreview] = useState("flask");
  const [muted, setMuted] = useState(false);
  const [drawer, setDrawer] = useState("");
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [titrationOpen, setTitrationOpen] = useState(false);
  const [toolTip, setToolTip] = useState({ visible: false, x: 250, y: 110 });
  const [answers, setAnswers] = useState({
    initial: "",
    final: "",
    molarity: "",
  });
  const start = useRef(0);
  const soundPlayed = useRef(false);
  const audio = useRef<AudioContext | null>(null);
  const lastLogAt = useRef(0);
  const lastStep = useRef(0);
  const tipHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    start.current = Date.now();
    const interval = setInterval(
      () =>
        dispatch({
          type: "tick",
          value: 600 - Math.floor((Date.now() - start.current) / 1000),
        }),
      500,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.step !== 8 || !state.mixed || !endpoint(state)) return;
    const id = setInterval(() => dispatch({ type: "stable" }), 1000);
    return () => clearInterval(id);
  }, [state.step, state.mixed, state.volume, state.indicator]);

  useEffect(() => {
    const latest = state.log.at(-1);
    if (!latest || latest.at === lastLogAt.current) return;
    const advanced = state.step > lastStep.current;
    playSound(state.feedback ? "error" : advanced ? "stage" : "confirm");
    lastLogAt.current = latest.at;
    lastStep.current = state.step;
  }, [state.log, state.step, state.feedback]);

  useEffect(() => {
    if (!endpoint(state) || soundPlayed.current) return;
    soundPlayed.current = true;
    playSound("endpoint");
  }, [state.volume, state.indicator]);

  useEffect(() => {
    if (state.step === 8) setTitrationOpen(true);
  }, [state.step]);

  function unlockAudio() {
    if (!audio.current) audio.current = new AudioContext();
    void audio.current.resume();
  }
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
  function playSound(
    kind:
      | "touch"
      | "confirm"
      | "stage"
      | "endpoint"
      | "dose"
      | "swirl"
      | "error",
  ) {
    if (muted) return;
    unlockAudio();
    const ctx = audio.current;
    if (!ctx) return;
    const notes = {
      touch: [360],
      confirm: [520],
      stage: [620, 820],
      endpoint: [880, 1174],
      dose: [280, 340],
      swirl: [230, 300, 380],
      error: [170],
    }[kind];
    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type =
        kind === "error" ? "sawtooth" : kind === "swirl" ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      const time = ctx.currentTime + index * 0.08;
      gain.gain.setValueAtTime(kind === "touch" ? 0.035 : 0.075, time);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        time + (kind === "stage" || kind === "endpoint" ? 0.55 : 0.2),
      );
      oscillator.start(time);
      oscillator.stop(time + 0.6);
    });
  }
  function reset() {
    dispatch({ type: "reset" });
    select(null);
    start.current = Date.now();
    soundPlayed.current = false;
    lastLogAt.current = 0;
    lastStep.current = 0;
    setTitrationOpen(false);
    setAnswers({ initial: "", final: "", molarity: "" });
    playSound("touch");
  }

  const item = tools.find((tool) => tool.id === preview)!;
  const progress = state.finished ? 100 : Math.round((state.step / 10) * 100);
  if (state.finished) return <Results state={state} reset={reset} />;

  return (
    <div className="lab-shell" onPointerDown={unlockAudio}>
      <header className="lab-header">
        <Logo compact />
        <div>
          <strong>Titrasi asam–basa</strong>
          <small>
            {mode === "ujian" ? "Ujian mandiri" : "Latihan terpandu"}
          </small>
        </div>
        <div className="lab-progress">
          <label htmlFor="progress">
            Progres <span>{progress}%</span>
          </label>
          <progress id="progress" max={100} value={progress} />
        </div>
        {mode === "ujian" && (
          <time className={state.remaining < 60 ? "chemistry" : ""}>
            {Math.floor(state.remaining / 60)
              .toString()
              .padStart(2, "0")}
            :{(state.remaining % 60).toString().padStart(2, "0")}
          </time>
        )}
        <button
          aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
          onClick={() => setMuted(!muted)}
        >
          {muted ? "Suara mati" : "Suara aktif"}
        </button>
        <Link href="/kimia/titrasi">Keluar</Link>
      </header>
      <div className="mobile-tabs">
        <button onClick={() => setDrawer(drawer === "tools" ? "" : "tools")}>
          Alat & bahan
        </button>
        <span>{mode === "latihan" ? "Latihan" : "Ujian"}</span>
        <button onClick={() => setDrawer(drawer === "notes" ? "" : "notes")}>
          Catatan
        </button>
      </div>
      <div className="lab-body">
        <aside className={`inventory ${drawer === "tools" ? "opened" : ""}`}>
          <div className="panel-heading">
            <h2>Alat & bahan</h2>
            <small>Seret ke meja</small>
          </div>
          <div className="inventory-list">
            {tools
              .filter(
                (tool) =>
                  mode === "ujian" || !["tube", "cylinder"].includes(tool.id),
              )
              .map((tool) => {
                const isPpe = tool.kind === "ppe";
                const equipped = state.ppe.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    draggable={!isPpe}
                    className={`${preview === tool.id ? "inventory-item active" : "inventory-item"}${isPpe ? " ppe-item" : ""}`}
                    onDragStart={(event) => {
                      if (isPpe) return;
                      playSound("touch");
                      event.dataTransfer.setData("text/lab-tool", tool.id);
                      event.dataTransfer.effectAllowed = "copy";
                      setPreview(tool.id);
                    }}
                    onMouseEnter={(event) => showToolTip(event, tool.id)}
                    onMouseLeave={hideToolTip}
                    onFocus={() => {
                      keepToolTip();
                      setPreview(tool.id);
                      setToolTip({ visible: true, x: 270, y: 110 });
                    }}
                    onBlur={hideToolTip}
                    onClick={() => {
                      setPreview(tool.id);
                      if (isPpe && !equipped)
                        dispatch({ type: "add", id: tool.id });
                    }}
                    onKeyDown={(event) => {
                      if (
                        !isPpe &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        dispatch({ type: "add", id: tool.id });
                      }
                    }}
                  >
                    <span>{tool.name}</span>
                    <span>
                      {isPpe
                        ? equipped
                          ? "Dipakai"
                          : "Kenakan"
                        : state.objects.some((object) => object.id === tool.id)
                          ? "✓"
                          : "⋮⋮"}
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
              <span>Kenali alat</span>
              <h3>{item.name}</h3>
              <p>{item.info}</p>
              <p className="safety-copy">
                <strong>Keselamatan</strong>
                {item.safety}
              </p>
              {item.kind === "bottle" && item.id !== "water" && (
                <details>
                  <summary>Kenali simbol bahaya</summary>
                  <HazardLegend />
                  <p>
                    Korosi: cairan mengenai tangan/logam. Tengkorak: toksisitas
                    akut. Ikan/pohon: bahaya lingkungan.
                  </p>
                  <p>
                    Label aktual mengikuti SDS produk dan konsentrasinya; simbol
                    tidak otomatis berlaku untuk semua larutan.
                  </p>
                </details>
              )}
            </div>
            <div className="popover-preview">
              <Preview id={preview} />
              <small>Model dapat diputar</small>
            </div>
          </div>
        </aside>
        <main className="lab-center">
          <div className="scene-meta">
            <span>25,00 mL HCl · NaOH 0,100 M</span>
          </div>
          <div className={`camera-toolbar${cameraMode ? " active" : ""}`}>
            <button
              aria-pressed={cameraMode}
              onClick={() => {
                playSound("touch");
                setCameraMode(!cameraMode);
                select(null);
              }}
            >
              {cameraMode ? "Selesai menggeser" : "Geser kamera"}
            </button>
            <button
              onClick={() => {
                playSound("touch");
                setCameraReset((value) => value + 1);
                setCameraMode(false);
              }}
            >
              Pusatkan
            </button>
          </div>
          <div className="lab-toast" key={state.log.at(-1)?.at || state.step}>
            <span className={state.feedback ? "error" : ""} />
            {state.log.at(-1)?.text || steps[state.step]}
          </div>
          <div
            className={`scene${cameraMode ? " camera-active" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(event) => {
              event.preventDefault();
              playSound("confirm");
              const id = event.dataTransfer.getData("text/lab-tool");
              if (id) {
                dispatch({ type: "add", id });
                select(id);
              }
            }}
          >
            <Scene
              state={state}
              dispatch={dispatch}
              selected={selected}
              select={select}
              cameraMode={cameraMode}
              resetKey={cameraReset}
              onInteract={() => playSound("touch")}
            />
          </div>
          <div className="scene-help">
            {cameraMode
              ? "Tarik area lab untuk menggeser pandangan. Klik “Selesai menggeser” untuk kembali memindahkan alat."
              : "Kamera terkunci · Seret alat dari panel dan interaksikan langsung di meja · Scroll / cubit untuk zoom"}
          </div>
          {state.step === 8 && !titrationOpen && (
            <button
              className="open-titration"
              onClick={() => {
                playSound("touch");
                setTitrationOpen(true);
              }}
            >
              Buka kontrol titrasi
            </button>
          )}
        </main>
        <aside className={`notes ${drawer === "notes" ? "opened" : ""}`}>
          {mode === "latihan" && (
            <section>
              <h2>Panduan praktikum</h2>
              <div className="step-accordions">
                {steps.map((step, index) => (
                  <details
                    key={step}
                    open={index === state.step}
                    className={
                      index === state.step
                        ? "current"
                        : index < state.step
                          ? "done"
                          : ""
                    }
                  >
                    <summary>
                      <span>{index < state.step ? "✓" : index + 1}</span>
                      {step}
                    </summary>
                    <p>{stepDetails[index]}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2>Catatan reaksi</h2>
            <p>HCl + NaOH → NaCl + H₂O</p>
            <p className="formula">MₐVₐ = MᵦVᵦ</p>
            <p>
              Gunakan selisih pembacaan buret untuk memperoleh volume titran.
            </p>
            <p className="muted">APD: {state.ppe.length}/3 terpasang</p>
          </section>
          <section>
            <h2>Log aktivitas</h2>
            <ol className="event-log">
              {state.log.slice(-8).map((entry, index) => (
                <li key={index}>
                  {mode === "ujian"
                    ? `Tindakan ${state.log.length - Math.min(8, state.log.length) + index + 1} dicatat.`
                    : entry.text}
                </li>
              ))}
            </ol>
          </section>
          {mode === "latihan" && (
            <button onClick={reset}>Ulangi dari awal</button>
          )}
        </aside>
      </div>
      <div className="rotate-notice">
        <h2>Putar perangkatmu.</h2>
        <p>
          Gunakan posisi landscape agar meja dan alat praktikum terlihat jelas.
        </p>
        <Link href="/kimia/titrasi">Kembali ke pengantar</Link>
      </div>
      {state.step === 8 && titrationOpen && (
        <TitrationDialog
          state={state}
          close={() => setTitrationOpen(false)}
          dose={(value) => {
            playSound("dose");
            dispatch({ type: "dose", value });
          }}
          swirl={() => {
            playSound("swirl");
            dispatch({ type: "mix" });
          }}
          finish={() => {
            playSound(endpoint(state) ? "stage" : "error");
            dispatch({ type: "finish" });
          }}
        />
      )}
      {state.step === 9 && (
        <div className="assessment-overlay">
          <section className="assessment assessment-split">
            <div className="meniscus-side">
              <span className="modal-kicker">Hasil pengukuran</span>
              <h2>Baca meniskus.</h2>
              <p>
                Gunakan bagian bawah lengkungan cairan dan baca sejajar dengan
                mata.
              </p>
              <div className="meniscus-pair">
                <Meniscus value={0.15} label="Pembacaan awal" />
                <Meniscus value={0.15 + state.volume} label="Pembacaan akhir" />
              </div>
            </div>
            <div className="answer-side">
              <span className="modal-kicker">Uji pemahaman</span>
              <h2>Catat hasilmu.</h2>
              <p>Masukkan pembacaan buret dan hitung konsentrasi sampel.</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  playSound("stage");
                  dispatch({ type: "submit", answers });
                }}
              >
                {[
                  ["initial", "Volume awal (mL)"],
                  ["final", "Volume akhir (mL)"],
                  ["molarity", "Molaritas HCl (M)"],
                ].map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      required
                      inputMode="decimal"
                      pattern="[0-9]+([.,][0-9]+)?"
                      value={answers[key as keyof typeof answers]}
                      onChange={(event) =>
                        setAnswers({ ...answers, [key]: event.target.value })
                      }
                    />
                  </label>
                ))}
                <button className="primary" type="submit">
                  Kumpulkan hasil ↗
                </button>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function TitrationDialog({
  state,
  dose,
  swirl,
  finish,
  close,
}: {
  state: ReturnType<typeof initial>;
  dose: (value: number) => void;
  swirl: () => void;
  finish: () => void;
  close: () => void;
}) {
  const pink = endpoint(state);
  return (
    <div className="titration-overlay">
      <section className="titration-dialog">
        <button
          className="modal-close"
          onClick={close}
          aria-label="Tutup kontrol titrasi"
        >
          ×
        </button>
        <div className="titration-visual">
          <div className={`modal-flask${pink ? " pink" : ""}`}>
            <div className="modal-liquid">
              <span />
              <span />
              <span />
            </div>
          </div>
          <p>{pink ? "Warna pink pucat tercapai." : "Larutan masih bening."}</p>
        </div>
        <div className="titration-panel">
          <span className="modal-kicker">Titrasi berlangsung</span>
          <h2>Tambahkan titran perlahan.</h2>
          <p>
            Tambahkan NaOH, lalu aduk labu untuk meratakan larutan. Hentikan
            ketika warna berubah menjadi pink pucat.
          </p>
          <div className="volume-display">
            <span>NaOH dialirkan</span>
            <strong>{state.volume.toFixed(2)} mL</strong>
          </div>
          <div className="dose-grid">
            <button onClick={() => dose(5)}>Tambahkan 5 mL</button>
            <button onClick={() => dose(1)}>Tambahkan 1 mL</button>
            <button onClick={() => dose(0.5)}>Tambahkan 0,5 mL</button>
          </div>
          <button
            className={`swirl-button${state.mixed ? " complete" : ""}`}
            onClick={swirl}
          >
            {state.mixed ? "✓ Sudah diaduk" : "Swirl / aduk labu"}
          </button>
          <button
            className="primary finish-titration"
            disabled={!pink}
            onClick={finish}
          >
            Selesaikan titrasi
          </button>
        </div>
      </section>
    </div>
  );
}

function Results({
  state,
  reset,
}: {
  state: ReturnType<typeof initial>;
  reset: () => void;
}) {
  const finalScore = score(state);
  return (
    <main className="results content">
      <Link href="/kimia">← Kimia</Link>
      <h1 className="page-title">
        Percobaan
        <br />
        <span className="chemistry">selesai.</span>
      </h1>
      <div className="score-summary">
        <span>Nilai praktikum</span>
        <strong>
          {finalScore}
          <small>/100</small>
        </strong>
        <p>
          {finalScore >= 90
            ? "Sangat baik. Pembacaan dan perhitunganmu akurat."
            : finalScore >= 75
              ? "Baik. Tinjau kembali bagian yang masih dikurangi."
              : "Pelajari kembali pembacaan meniskus dan perhitungannya."}
        </p>
      </div>
      {state.expired && (
        <p>Waktu habis. Tahap yang belum selesai tercatat pada penilaian.</p>
      )}
      <div className="result-grid">
        <section>
          <h2>Catatan pengukuran</h2>
          <dl>
            <dt>Volume awal</dt>
            <dd>0,15 mL</dd>
            <dt>Volume akhir</dt>
            <dd>{(0.15 + state.volume).toFixed(2)} mL</dd>
            <dt>NaOH terpakai</dt>
            <dd>{state.volume.toFixed(2)} mL</dd>
            <dt>Molaritas terhitung</dt>
            <dd>{((0.1 * state.volume) / 25).toFixed(4)} M</dd>
            <dt>Interpretasi</dt>
            <dd>
              {endpoint(state)
                ? "Titik akhir berada dalam rentang simulasi."
                : "Titik akhir belum tepat; hasil tidak dianggap pengukuran valid."}
            </dd>
          </dl>
          <p>M HCl = (M NaOH × V NaOH) / V HCl</p>
          <p>
            Volume terpakai diperoleh dari pembacaan akhir dikurangi pembacaan
            awal, bukan sisa cairan dalam buret.
          </p>
          {state.answers && (
            <p>
              Jawabanmu: {state.answers.initial} mL → {state.answers.final} mL;{" "}
              {state.answers.molarity} M.
            </p>
          )}
          <button className="primary" onClick={reset}>
            Ulangi {state.mode}
          </button>{" "}
          <Link className="button" href="/kimia/titrasi">
            Pilih mode
          </Link>
        </section>
        <section>
          <h2>Rincian penilaian</h2>
          {Object.keys(state.penalties).length === 0 ? (
            <p>Tidak ada pengurangan nilai.</p>
          ) : (
            Object.entries(state.penalties).map(([key, value]) => (
              <p key={key} className="score-deduction">
                <span>
                  {
                    (
                      {
                        ppe: "APD",
                        selection: "Pemilihan alat",
                        procedure: "Prosedur",
                        endpoint: "Titik akhir",
                        meniscus: "Pembacaan meniskus",
                        calculation: "Perhitungan molaritas",
                        time: "Waktu",
                        incomplete: "Tahap belum selesai",
                      } as Record<string, string>
                    )[key]
                  }
                </span>
                <strong>−{value}</strong>
              </p>
            ))
          )}
          <h2>Rekaman praktikum</h2>
          <ol className="event-log">
            {state.log.map((entry, index) => (
              <li key={index}>{entry.text}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

function Meniscus({ value, label }: { value: number; label: string }) {
  const base = Math.floor(value);
  const y = 30 + (value - base) * 120;
  return (
    <figure>
      <figcaption>{label}</figcaption>
      <svg
        viewBox="0 0 130 180"
        role="img"
        aria-label={`${label}, skala buret ${base} sampai ${base + 1} mL`}
      >
        <path
          d={`M35 ${y - 8} Q55 ${y + 8} 75 ${y - 8} L75 170 L35 170Z`}
          fill="#d6e5e1"
        />
        <path
          d={`M35 ${y - 8} Q55 ${y + 8} 75 ${y - 8}`}
          fill="none"
          stroke="#293f3c"
          strokeWidth="2"
        />
        <path d="M35 10V170M75 10V170" stroke="#778983" />
        {Array.from({ length: 11 }, (_, index) => (
          <g key={index}>
            <path
              d={`M75 ${30 + index * 12}h${index % 5 === 0 ? 16 : 9}`}
              stroke="#222"
            />
            {index % 5 === 0 && (
              <text x="96" y={34 + index * 12} fontSize="11">
                {(base + index / 10).toFixed(1)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </figure>
  );
}
