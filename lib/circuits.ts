import type { ToolItem } from "./lab";
import type { SoundKind } from "./labSound";

export type Mode = "latihan" | "ujian";
export type CircuitConfig =
  | "none"
  | "powered"
  | "single"
  | "series2"
  | "parallel3"
  | "combo3"
  | "challenge";

// Source and lamp constants — single source of truth for the analytic physics and the tests.
export const V_SOURCE = 6; // volt (mis. 4×1,5 V paket baterai)
export const R_LAMP = 100; // ohm, model ohmik identik untuk setiap LED

// Indexed by `step` (count of completed langkah). configForStep[step] is the config currently observed.
export const configForStep: CircuitConfig[] = [
  "none",
  "none",
  "powered",
  "single",
  "series2",
  "parallel3",
  "combo3",
  "challenge",
];

const item = (
  id: string,
  name: string,
  kind: string,
  category: string,
  spec: string,
  info: string,
  safety: string,
): ToolItem => ({ id, name, kind, category, spec, info, safety });
export const circuitTools: ToolItem[] = [
  item(
    "battery",
    "Sumber tegangan (baterai)",
    "battery",
    "Sumber Daya",
    "Paket baterai 6 V (4×1,5 V) · terminal + dan −",
    "Menyediakan beda potensial yang mendorong arus mengalir pada rangkaian. Hubungkan kutub + dan − ke rel daya project board.",
    "Perhatikan polaritas; jangan menghubung-singkat kutub + dan − secara langsung.",
  ),
  item(
    "board",
    "Project board",
    "board",
    "Papan Rangkai",
    "Breadboard dengan rel daya + (merah) dan − (biru)",
    "Papan rangkai tempat komponen dipasang dan dihubungkan tanpa menyolder. Lubang pada satu baris saling terhubung.",
    "Pasang komponen dengan rapi; jangan menancapkan kawat ke lubang yang tidak sesuai.",
  ),
  item(
    "led",
    "LED",
    "led",
    "Komponen",
    "Dioda pemancar cahaya · dimodelkan sebagai resistor 100 Ω",
    "Lampu indikator yang menyala saat dialiri arus. Pada modul ini LED dimodelkan sebagai resistor ohmik identik agar perbandingan kecerahan mudah diamati.",
    "Pasang sesuai arah dan slot yang ditentukan; arus berlebih dapat merusak LED sungguhan.",
  ),
  item(
    "jumper",
    "Kawat jumper",
    "jumper",
    "Penghubung",
    "Kawat berisolasi dengan ujung pin · merah/biru",
    "Menghubungkan sumber tegangan ke rel daya dan menyambung antar komponen pada project board.",
    "Gunakan kawat sesuai polaritas; periksa sambungan agar tidak longgar.",
  ),
  item(
    "switch",
    "Sakelar",
    "switch",
    "Kendali",
    "Sakelar tuas dua posisi (buka/tutup)",
    "Memutus atau menyambung rangkaian. Saat sakelar ditutup, arus mengalir dan lampu menyala; saat dibuka, rangkaian terputus dan lampu padam.",
    "Pastikan sakelar terbuka saat memasang komponen agar aman dari arus mendadak.",
  ),
];
export type CircuitToolId = (typeof circuitTools)[number]["id"];

// The seven LANGKAH KERJA (FR-3.1..FR-3.7): [title, detail] Indonesian pairs.
export const steps = [
  [
    "Siapkan alat-alat",
    "Tambahkan sumber tegangan (baterai), project board, LED, kawat jumper, dan sakelar dari panel alat ke area kerja.",
  ],
  [
    "Hubungkan sumber tegangan",
    "Seret kawat jumper ke rel daya untuk menghubungkan kutub + dan − baterai ke project board, lalu tutup sakelar agar rangkaian siap dialiri arus.",
  ],
  [
    "Pasang satu buah LED",
    "Pasang satu LED pada slot utama. Amati kecerahan lampu tunggal sebagai acuan sebelum menyusun rangkaian seri atau paralel.",
  ],
  [
    "Susun rangkaian seri 2 LED",
    "Tambahkan LED kedua secara seri. Amati kedua lampu meredup dibandingkan dengan lampu tunggal karena hambatan total bertambah.",
  ],
  [
    "Susun rangkaian paralel 3 LED",
    "Susun tiga LED secara paralel. Amati setiap lampu menyala hampir seterang lampu tunggal karena masing-masing cabang menerima tegangan penuh.",
  ],
  [
    "Buat rangkaian gabungan",
    "Susun rangkaian gabungan seri–paralel: satu LED seri dengan dua LED paralel. Amati kecerahan yang berbeda antara lampu seri dan lampu paralel.",
  ],
  [
    "Rangkaian tantangan",
    "Buat rangkaian sesuai gambar yang diminta tanpa petunjuk slot. Pasang ketiga LED pada slot yang tepat lalu amati kecerahannya.",
  ],
] as const;

// Ohm's-law / resistance quiz folded into the ujian flow and shown as non-penalized "Cek pemahaman"
// blocks inside the latihan step accordions. `step` is the completed-langkah count at which the
// question's topology is observed (used for accordion placement).
export const ohmQuestions = [
  {
    q: "Berapa arus yang mengalir bila V = 6 V dan R = 100 Ω pada satu LED?",
    options: ["0,06 A", "0,6 A", "6 A"],
    answer: 0,
    explanation: "Dengan hukum Ohm, I = V/R = 6/100 = 0,06 A.",
    step: 3,
  },
  {
    q: "Berapa hambatan total dua LED identik (100 Ω) yang disusun seri?",
    options: ["50 Ω", "100 Ω", "200 Ω"],
    answer: 2,
    explanation:
      "Pada rangkaian seri hambatan dijumlahkan: R_total = 100 + 100 = 200 Ω.",
    step: 4,
  },
  {
    q: "Berapa arus yang mengalir pada rangkaian seri 2 LED tersebut?",
    options: ["0,03 A", "0,06 A", "0,12 A"],
    answer: 0,
    explanation:
      "I = V/R_total = 6/200 = 0,03 A, yaitu setengah dari arus lampu tunggal.",
    step: 4,
  },
  {
    q: "Berapa hambatan total tiga LED identik (100 Ω) yang disusun paralel?",
    options: ["≈33,3 Ω", "100 Ω", "300 Ω"],
    answer: 0,
    explanation:
      "Untuk resistor paralel identik, R_total = R/n = 100/3 ≈ 33,3 Ω.",
    step: 5,
  },
  {
    q: "Berapa arus total yang ditarik rangkaian paralel 3 LED tersebut?",
    options: ["0,06 A", "0,18 A", "0,02 A"],
    answer: 1,
    explanation:
      "Setiap cabang menarik 0,06 A, sehingga arus total = 3 × 0,06 = 0,18 A.",
    step: 5,
  },
  {
    q: "Berapa hambatan total rangkaian gabungan (A seri dengan B∥C)?",
    options: ["50 Ω", "150 Ω", "300 Ω"],
    answer: 1,
    explanation:
      "B∥C = 100/2 = 50 Ω, lalu seri dengan A: R_total = 100 + 50 = 150 Ω.",
    step: 6,
  },
  {
    q: "Berapa hambatan total rangkaian tantangan (topologi sama dengan gabungan)?",
    options: ["100 Ω", "150 Ω", "200 Ω"],
    answer: 1,
    explanation:
      "Topologi tantangan sama dengan rangkaian gabungan, jadi R_total = 150 Ω.",
    step: 7,
  },
] as const;

// The required componentId -> slotId map for the Langkah 7 challenge (equal to combo3's final assignment).
export const challengeTargetSlots: Record<string, string> = {
  ledA: "seri",
  ledB: "paralel-1",
  ledC: "paralel-2",
};

export type LampState = { id: string; current: number; brightness: number };
export type Readout = {
  rTotal: number;
  iSource: number;
  vSource: number;
  lamps: LampState[];
};

const I_REF = V_SOURCE / R_LAMP; // arus acuan lampu tunggal (0,06 A)
const P_REF = I_REF * I_REF * R_LAMP; // daya acuan
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const brightness = (current: number) =>
  clamp((current * current * R_LAMP) / P_REF, 0, 1);
const lamp = (id: string, current: number): LampState => ({
  id,
  current,
  brightness: brightness(current),
});

// Pure function of `config` only — switch state is applied one layer out in the view.
export function solve(config: CircuitConfig): Readout {
  switch (config) {
    case "single": {
      const i = V_SOURCE / R_LAMP;
      return {
        rTotal: R_LAMP,
        iSource: i,
        vSource: V_SOURCE,
        lamps: [lamp("ledA", i)],
      };
    }
    case "series2": {
      const rTotal = 2 * R_LAMP,
        i = V_SOURCE / rTotal;
      return {
        rTotal,
        iSource: i,
        vSource: V_SOURCE,
        lamps: [lamp("ledA", i), lamp("ledB", i)],
      };
    }
    case "parallel3": {
      const branch = V_SOURCE / R_LAMP,
        rTotal = R_LAMP / 3;
      return {
        rTotal,
        iSource: 3 * branch,
        vSource: V_SOURCE,
        lamps: [
          lamp("ledA", branch),
          lamp("ledB", branch),
          lamp("ledC", branch),
        ],
      };
    }
    case "combo3":
    case "challenge": {
      const rTotal = R_LAMP + R_LAMP / 2,
        iTotal = V_SOURCE / rTotal;
      return {
        rTotal,
        iSource: iTotal,
        vSource: V_SOURCE,
        lamps: [
          lamp("ledA", iTotal),
          lamp("ledB", iTotal / 2),
          lamp("ledC", iTotal / 2),
        ],
      };
    }
    default:
      return { rTotal: 0, iSource: 0, vSource: V_SOURCE, lamps: [] };
  }
}

export type State = {
  mode: Mode;
  step: number;
  placed: string[];
  readout: Readout;
  remaining: number;
  finished: boolean;
  expired: boolean;
  quiz: number[];
  switchOn: boolean;
  penalties: Record<string, number>;
  attempts: number[];
  event: number;
  sound: SoundKind;
  log: string[];
  feedback: string;
  motion?: { kind: string; event: number };
};

export const initial = (mode: Mode): State => ({
  mode,
  step: 0,
  placed: [],
  readout: solve("none"),
  remaining: 600,
  finished: false,
  expired: false,
  quiz: Array(7).fill(-1),
  switchOn: false,
  penalties: {},
  attempts: Array(7).fill(0),
  event: 0,
  sound: "touch",
  log: [],
  feedback: "",
});

export const score = (s: State) =>
  Math.max(0, 100 - Object.values(s.penalties).reduce((a, b) => a + b, 0));

export type Action =
  | { type: "add"; id: string }
  | { type: "connect"; source: string; target: string }
  | { type: "toggleSwitch" }
  | { type: "advance" }
  | { type: "answerQuiz"; index: number; choice: number }
  | { type: "submit" }
  | { type: "tick"; seconds: number }
  | { type: "reset" }
  | { type: "resetStep"; snapshot: State };

function message(s: State, text: string, sound: SoundKind): State {
  return {
    ...s,
    event: s.event + 1,
    log: [...s.log, text],
    sound,
    feedback: "",
  };
}
function fail(s: State, text: string, category = "Perakitan", cap = 20): State {
  return {
    ...message(
      s,
      s.mode === "latihan"
        ? text
        : "Tindakan dicatat. Periksa kembali prosedur.",
      "error",
    ),
    feedback: s.mode === "latihan" ? text : "Tindakan belum sesuai.",
    penalties:
      s.mode === "ujian"
        ? {
            ...s.penalties,
            [category]: Math.min(cap, (s.penalties[category] || 0) + 5),
          }
        : s.penalties,
  };
}

// Advance from step k-1 to k, recompute readout from the derived config, log success.
function advanceStep(
  s: State,
  text: string,
  sound: SoundKind = "confirm",
): State {
  const step = s.step + 1;
  return {
    ...message(
      { ...s, step, readout: solve(configForStep[step]) },
      text,
      sound,
    ),
    motion: { kind: configForStep[step], event: s.event + 1 },
  };
}

// The required assembly `connect` for each step index (step = completed-langkah count being attempted).
const connectForStep: Record<number, [string, string, string]> = {
  1: [
    "jumper",
    "rail",
    "Kawat jumper menghubungkan sumber tegangan ke rel daya project board.",
  ],
  2: [
    "ledA",
    "seri",
    "Satu LED dipasang pada slot utama; amati kecerahan acuan.",
  ],
  3: ["ledB", "seri", "LED kedua dipasang seri; kedua lampu meredup."],
  4: [
    "ledC",
    "paralel",
    "LED ketiga dipasang paralel; ketiga lampu menyala hampir penuh.",
  ],
  5: ["ledB", "paralel-1", "Rangkaian gabungan terbentuk: A seri dengan B∥C."],
  6: [
    "ledC",
    "paralel-2",
    "Rangkaian tantangan selesai dirakit sesuai gambar.",
  ],
};
const requiredComponents = circuitTools.map((t) => t.id);

export function reducer(s: State, a: Action): State {
  if (a.type === "reset") return initial(s.mode);
  if (a.type === "resetStep")
    return s.mode === "latihan"
      ? { ...a.snapshot, event: s.event + 1, sound: "touch", motion: undefined }
      : s;
  if (s.finished) return s;
  if (a.type === "tick") {
    if (!Number.isFinite(a.seconds) || a.seconds < 0 || s.mode !== "ujian")
      return s;
    const remaining = Math.max(0, s.remaining - a.seconds);
    return remaining
      ? { ...s, remaining }
      : {
          ...message(s, "Waktu ujian selesai.", "error"),
          remaining: 0,
          finished: true,
          expired: true,
          penalties: {
            ...s.penalties,
            Waktu: 10,
            "Langkah belum selesai": (7 - s.step) * 5,
            "Soal belum dijawab": s.quiz.filter((c) => c < 0).length * 5,
          },
        };
  }
  if (a.type === "add") {
    if (!requiredComponents.includes(a.id) || s.placed.includes(a.id)) return s;
    const tool = circuitTools.find((t) => t.id === a.id)!;
    const placed = [...s.placed, a.id];
    const done =
      s.step === 0 && requiredComponents.every((id) => placed.includes(id));
    const n = message(
      { ...s, placed },
      `${tool.name} ditempatkan di area kerja.`,
      done ? "stage" : "clink",
    );
    return done
      ? advanceStep(
          n,
          "Semua alat siap. Hubungkan sumber tegangan ke project board.",
          "stage",
        )
      : n;
  }
  if (a.type === "toggleSwitch") {
    if (!s.placed.includes("switch"))
      return fail(
        s,
        "Pasang sakelar terlebih dahulu sebelum menutup rangkaian.",
      );
    const switchOn = !s.switchOn;
    const n = message(
      { ...s, switchOn },
      switchOn ? "Sakelar ditutup." : "Sakelar dibuka.",
      "confirm",
    );
    // Closing the sakelar at Langkah 2 confirms the `powered` observation and advances the step.
    return switchOn && s.step === 1
      ? advanceStep(
          n,
          "Rangkaian tersambung dan sakelar ditutup. Rel daya kini aktif.",
        )
      : n;
  }
  if (a.type === "connect") {
    const expected = connectForStep[s.step];
    if (!expected || a.source !== expected[0] || a.target !== expected[1]) {
      const n = fail(
        s,
        "Periksa komponen dan slot yang dituju sesuai panduan langkah.",
      );
      return {
        ...n,
        attempts: n.attempts.map((v, i) => (i === s.step ? v + 1 : v)),
      };
    }
    return advanceStep(s, expected[2]);
  }
  if (a.type === "advance")
    return s.step >= 7
      ? s
      : {
          ...message(s, "Lanjut ke langkah berikutnya.", "touch"),
          step: s.step + 1,
        };
  if (a.type === "answerQuiz") {
    if (
      !Number.isInteger(a.index) ||
      a.index < 0 ||
      a.index >= ohmQuestions.length ||
      !Number.isInteger(a.choice) ||
      a.choice < 0 ||
      a.choice >= ohmQuestions[a.index].options.length
    )
      return s;
    const quiz = s.quiz.map((v, i) => (i === a.index ? a.choice : v));
    if (s.mode !== "ujian") return { ...s, quiz };
    const correct = a.choice === ohmQuestions[a.index].answer;
    return correct
      ? { ...s, quiz }
      : {
          ...s,
          quiz,
          penalties: {
            ...s.penalties,
            Perhitungan: Math.min(15, (s.penalties.Perhitungan || 0) + 5),
          },
        };
  }
  if (a.type === "submit") {
    if (s.mode === "ujian")
      return {
        ...message(s, "Hasil pengamatan dikumpulkan.", "stage"),
        finished: true,
      };
    return s.step === 7
      ? {
          ...message(s, "Hasil pengamatan dikumpulkan.", "stage"),
          finished: true,
        }
      : s;
  }
  return s;
}

export const physicsCircuitsCompletionKey =
  "nalaraya:physics-circuits-complete";
export function readPhysicsCircuitsCompletion(
  storage: Pick<Storage, "getItem">,
) {
  try {
    return storage.getItem(physicsCircuitsCompletionKey) === "true";
  } catch {
    return false;
  }
}
export function savePhysicsCircuitsCompletion(
  storage: Pick<Storage, "setItem">,
) {
  try {
    storage.setItem(physicsCircuitsCompletionKey, "true");
    return true;
  } catch {
    return false;
  }
}
