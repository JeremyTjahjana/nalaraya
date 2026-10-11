"use client";
import { useEffect, useRef, useState, type Dispatch } from "react";
import {
  cells,
  ready,
  structures,
  type State,
  type Action,
} from "@/lib/epidermis";

export default function MicroscopeView({
  state,
  dispatch,
  open,
  onClose,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    previousFocus = useRef<HTMLElement | null>(null);
  const drag = useRef<{
      pointerId: number;
      x: number;
      y: number;
      offset: [number, number];
    } | null>(null),
    knob = useRef<{ pointerId: number; x: number; value: number } | null>(null);
  const [cursor, setCursor] = useState<[number, number]>([250, 250]);
  const assessing = state.step === 10,
    complete = state.marked.length === 3;
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      previousFocus.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    const stopDrag = () => {
      drag.current = null;
      knob.current = null;
    };
    window.addEventListener("blur", stopDrag);
    return () => window.removeEventListener("blur", stopDrag);
  }, []);
  const shift = (x: number, y: number) =>
    dispatch({
      type: "adjust",
      offset: [state.offset[0] + x, state.offset[1] + y],
    });
  return (
    <dialog
      ref={dialog}
      className="epidermis-scope"
      aria-labelledby="scope-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <header>
        <div>
          <h2 id="scope-title">
            {assessing
              ? "Apa yang kamu amati?"
              : "Pengamatan epidermis bawang merah"}
          </h2>
          <p>
            Okuler 10× · Objektif 10× · Ilustrasi struktur sel, bukan mikrograf
          </p>
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Kembali ke meja"
        >
          Kembali ke meja
        </button>
      </header>
      <div className="eyepiece-layout">
        <div className="eyepiece-stage">
          <svg
            className="eyepiece"
            viewBox="0 0 500 500"
            tabIndex={0}
            role="application"
            aria-label={
              assessing
                ? "Bidang sel. Gunakan tombol panah untuk menggeser penunjuk, Enter untuk menandai."
                : "Bidang pandang mikroskop. Seret atau gunakan tombol panah untuk memusatkan jaringan."
            }
            onPointerDown={(e) => {
              if (assessing) {
                const r = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 500,
                  y = ((e.clientY - r.top) / r.height) * 500;
                setCursor([x, y]);
                dispatch({ type: "mark", x, y });
                return;
              }
              if (drag.current) return;
              drag.current = {
                pointerId: e.pointerId,
                x: e.clientX,
                y: e.clientY,
                offset: state.offset,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current || drag.current.pointerId !== e.pointerId)
                return;
              const scale = 500 / e.currentTarget.getBoundingClientRect().width;
              dispatch({
                type: "adjust",
                offset: [
                  drag.current.offset[0] + (e.clientX - drag.current.x) * scale,
                  drag.current.offset[1] + (e.clientY - drag.current.y) * scale,
                ],
              });
            }}
            onPointerUp={(e) => {
              if (drag.current?.pointerId !== e.pointerId) return;
              drag.current = null;
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={(e) => {
              if (drag.current?.pointerId === e.pointerId) drag.current = null;
            }}
            onLostPointerCapture={(e) => {
              if (drag.current?.pointerId === e.pointerId) drag.current = null;
            }}
            onKeyDown={(e) => {
              const d: Record<string, [number, number]> = {
                ArrowLeft: [-8, 0],
                ArrowRight: [8, 0],
                ArrowUp: [0, -8],
                ArrowDown: [0, 8],
              };
              if (d[e.key]) {
                e.preventDefault();
                const [x, y] = d[e.key];
                if (assessing)
                  setCursor((p) => [
                    Math.max(15, Math.min(485, p[0] + x)),
                    Math.max(15, Math.min(485, p[1] + y)),
                  ]);
                else shift(x, y);
              }
              if (assessing && e.key === "Enter") {
                e.preventDefault();
                dispatch({ type: "mark", x: cursor[0], y: cursor[1] });
              }
            }}
          >
            <defs>
              <clipPath id="epidermis-field">
                <circle cx="250" cy="250" r="240" />
              </clipPath>
              <filter
                id="focus-blur"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur
                  stdDeviation={Math.abs(state.focus - 68) * 0.22}
                />
              </filter>
            </defs>
            <circle
              cx="250"
              cy="250"
              r="244"
              fill="#1f2522"
              stroke="#748177"
              strokeWidth="2"
            />
            <g clipPath="url(#epidermis-field)">
              <rect width="500" height="500" fill="#efe1bc" />
              <g
                transform={`translate(${state.offset[0]} ${state.offset[1]})`}
                filter="url(#focus-blur)"
              >
                {cells.map((c, i) => (
                  <g key={i} transform={`translate(${c.x} ${c.y})`}>
                    <rect
                      x="2"
                      y="2"
                      width="134"
                      height="94"
                      rx="5"
                      fill="#d4b991"
                      stroke="#886445"
                      strokeWidth="4"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="122"
                      height="82"
                      rx="9"
                      fill="#dac19f"
                      stroke="#b08465"
                      strokeWidth="1"
                    />
                    <rect
                      x="40"
                      y="18"
                      width="80"
                      height="62"
                      rx="15"
                      fill={i % 3 === 0 ? "#e9d2b5" : "#ebd7b9"}
                    />
                    <ellipse
                      cx="23"
                      cy="48"
                      rx="10"
                      ry="14"
                      fill="#785347"
                      stroke="#9c705a"
                      strokeWidth="2"
                    />
                    <ellipse cx="24" cy="46" rx="3" ry="4" fill="#503e36" />
                  </g>
                ))}
              </g>
            </g>
            <path
              d="M236 250h28M250 236v28"
              stroke="#4c4d36"
              strokeWidth="1"
              opacity=".65"
              pointerEvents="none"
            />
            {assessing && (
              <g
                transform={`translate(${cursor[0]} ${cursor[1]})`}
                pointerEvents="none"
              >
                <circle r="9" fill="none" stroke="#183e30" strokeWidth="2" />
                <path d="M-14 0h8m12 0h8M0-14v8m0 12v8" stroke="#183e30" />
              </g>
            )}
          </svg>
          <p>
            {assessing
              ? "Klik struktur pada citra · Panah + Enter juga dapat digunakan"
              : "Seret bidang pandang untuk menggeser preparat"}
          </p>
        </div>
        <section
          className="scope-controls"
          aria-label={assessing ? "Penandaan struktur" : "Pengaturan mikroskop"}
        >
          {assessing ? (
            <>
              <h3>
                {complete
                  ? "Semua struktur ditandai"
                  : `Tandai ${structures[state.marked.length].toLowerCase()}`}
              </h3>
              <p>
                {complete
                  ? "Kumpulkan hasil untuk melihat catatan dan nilai pengamatan."
                  : `Penandaan ${state.marked.length + 1} dari 3. Pilih langsung pada salah satu sel yang terlihat.`}
              </p>
              <ol className="structure-checks">
                {structures.map((name, i) => (
                  <li key={name}>
                    {name}
                    <span>
                      {state.marked.includes(i) ? "Ditandai" : "Belum"}
                    </span>
                  </li>
                ))}
              </ol>
              <p role="status">{state.log.at(-1)}</p>
              <button
                className="primary"
                disabled={!complete}
                onClick={() => dispatch({ type: "submit" })}
              >
                Kumpulkan hasil pengamatan
              </button>
            </>
          ) : (
            <>
              <h3>Posisi preparat</h3>
              <p>Pusatkan jaringan hingga seluruh bidang pandang terisi sel.</p>
              <div className="stage-arrows">
                <button
                  aria-label="Geser preparat ke kiri"
                  onClick={() => shift(-12, 0)}
                >
                  ←
                </button>
                <button
                  aria-label="Geser preparat ke atas"
                  onClick={() => shift(0, -12)}
                >
                  ↑
                </button>
                <button
                  aria-label="Geser preparat ke bawah"
                  onClick={() => shift(0, 12)}
                >
                  ↓
                </button>
                <button
                  aria-label="Geser preparat ke kanan"
                  onClick={() => shift(12, 0)}
                >
                  →
                </button>
              </div>
              <h3>Fokus mikroskop</h3>
              <div className="focus-control">
                <div
                  className="focus-knob"
                  role="slider"
                  tabIndex={0}
                  aria-label="Knob fokus"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={state.focus}
                  aria-valuetext={
                    ready(state)
                      ? "Citra tajam dan terpusat"
                      : `Posisi knob ${Math.round(state.focus)}`
                  }
                  onPointerDown={(e) => {
                    if (knob.current) return;
                    knob.current = {
                      pointerId: e.pointerId,
                      x: e.clientX,
                      value: state.focus,
                    };
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (knob.current?.pointerId === e.pointerId)
                      dispatch({
                        type: "adjust",
                        focus:
                          knob.current.value +
                          (e.clientX - knob.current.x) * 0.4,
                      });
                  }}
                  onPointerUp={(e) => {
                    if (knob.current?.pointerId !== e.pointerId) return;
                    knob.current = null;
                    if (e.currentTarget.hasPointerCapture(e.pointerId))
                      e.currentTarget.releasePointerCapture(e.pointerId);
                  }}
                  onPointerCancel={(e) => {
                    if (knob.current?.pointerId === e.pointerId)
                      knob.current = null;
                  }}
                  onLostPointerCapture={(e) => {
                    if (knob.current?.pointerId === e.pointerId)
                      knob.current = null;
                  }}
                  onKeyDown={(e) => {
                    if (
                      [
                        "ArrowLeft",
                        "ArrowDown",
                        "ArrowRight",
                        "ArrowUp",
                        "Home",
                        "End",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                      dispatch({
                        type: "adjust",
                        focus:
                          e.key === "Home"
                            ? 0
                            : e.key === "End"
                              ? 100
                              : state.focus +
                                (["ArrowLeft", "ArrowDown"].includes(e.key)
                                  ? -1
                                  : 1),
                      });
                    }
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    style={{
                      transform: `rotate(${state.focus * 2.7 - 135}deg)`,
                    }}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="43"
                      fill="#29362f"
                      stroke="#829286"
                      strokeWidth="2"
                    />
                    {Array.from({ length: 24 }, (_, i) => (
                      <path
                        key={i}
                        d="M50 8v6"
                        transform={`rotate(${i * 15} 50 50)`}
                        stroke="#829286"
                      />
                    ))}
                    <path
                      d="M50 21v17"
                      stroke="#e7f2e5"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p>Putar dengan menyeret ke kiri atau kanan.</p>
                  <div className="focus-buttons">
                    <button
                      aria-label="Kurangi fokus"
                      onClick={() =>
                        dispatch({ type: "adjust", focus: state.focus - 1 })
                      }
                    >
                      −
                    </button>
                    <button
                      aria-label="Tambah fokus"
                      onClick={() =>
                        dispatch({ type: "adjust", focus: state.focus + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <p className="scope-readiness" role="status">
                {ready(state)
                  ? "Citra sudah tajam dan posisi tepat."
                  : state.mode === "latihan"
                    ? Math.hypot(...state.offset) > 24
                      ? "Geser jaringan hingga terpusat."
                      : "Posisi tepat. Sesuaikan fokus hingga batas sel tajam."
                    : "Sesuaikan posisi dan fokus untuk menyelesaikan pengamatan."}
              </p>
              <button
                className="primary"
                disabled={!ready(state)}
                onClick={() => dispatch({ type: "observe" })}
              >
                Selesai pengamatan
              </button>
            </>
          )}
        </section>
      </div>
    </dialog>
  );
}
