import { tools, type ToolItem } from "./lab";
import type { SoundKind } from "./labSound";

export type Point = [number, number, number];
export type Mode = "latihan" | "ujian";
const shared = (id: string) => tools.find((t) => t.id === id)!;
const item = (
  id: string,
  name: string,
  category: string,
  spec: string,
  info: string,
  safety: string,
): ToolItem => ({ id, name, kind: id, category, spec, info, safety });
export const epidermisTools: ToolItem[] = [
  shared("goggles"),
  shared("coat"),
  shared("gloves"),
  item(
    "microscope",
    "Mikroskop cahaya",
    "Alat Pengamatan",
    "Okuler 10× · Objektif 10× · Pembesaran total 100×",
    "Memperbesar preparat tipis. Pusatkan jaringan pada bidang pandang lalu sesuaikan fokus hingga batas sel jelas.",
    "Mulai dari objektif rendah; jangan biarkan lensa menyentuh preparat. Bawa dengan dua tangan.",
  ),
  item(
    "slide",
    "Kaca objek",
    "Preparat",
    "Kaca datar 75 × 25 mm",
    "Menopang jaringan tipis dan tetesan cairan selama pengamatan.",
    "Pegang tepinya. Jangan gunakan kaca retak.",
  ),
  item(
    "onion",
    "Bawang merah",
    "Sampel Biologi",
    "Bagian dalam sisik umbi · epidermis tipis",
    "Lapisan epidermis yang tipis memungkinkan cahaya melewati satu lapis sel. Ambil dengan pinset.",
    "Gunakan sampel yang disiapkan guru; jangan konsumsi sampel praktikum.",
  ),
  item(
    "forceps",
    "Pinset",
    "Alat Pemindah",
    "Ujung halus · baja tahan karat",
    "Mengangkat epidermis tipis dan meratakannya di atas kaca objek.",
    "Jepit perlahan agar jaringan tidak sobek atau terlipat.",
  ),
  {
    ...shared("water"),
    info: "Air deionisasi membentuk medium preparat basah. Teteskan sedikit pada kaca objek agar epidermis dapat diratakan.",
  },
  item(
    "lugol",
    "Lugol",
    "Pewarna Preparat",
    "Larutan iodin–kalium iodida encer",
    "Menambah kontras preparat. Teteskan sedikit dari tepi epidermis agar struktur lebih mudah diamati.",
    "Hindari kontak kulit dan mata. Gunakan sesuai petunjuk guru dan label produk.",
  ),
  item(
    "coverslip",
    "Kaca penutup",
    "Preparat",
    "Kaca tipis 18 × 18 mm",
    "Menutup dan meratakan preparat. Turunkan secara miring untuk mengurangi gelembung udara.",
    "Sangat tipis dan mudah pecah; jangan ditekan.",
  ),
  item(
    "tissue",
    "Tisu laboratorium",
    "Bahan Penyerap",
    "Tisu bersih tanpa pewangi",
    "Sentuhkan ke tepi kaca penutup untuk menyerap cairan berlebih.",
    "Jangan menggosok preparat atau menyentuh lensa dengan tisu biasa.",
  ),
];
export const steps = [
  [
    "Kenakan APD",
    "Kenakan kacamata, jas laboratorium, dan sarung tangan melalui panel alat.",
  ],
  [
    "Siapkan kaca objek",
    "Tambahkan kaca objek dan tisu. Seret tisu ke kaca objek untuk membersihkannya; kaca akan terpasang di area kerja.",
  ],
  [
    "Ambil epidermis tipis",
    "Tambahkan bawang merah dan pinset. Seret pinset ke bawang untuk mengambil lapisan tipis bagian dalam sisik umbi.",
  ],
  [
    "Teteskan air",
    "Tambahkan air deionisasi. Seret botol air ke kaca objek untuk membentuk satu tetesan.",
  ],
  [
    "Letakkan epidermis",
    "Seret pinset yang membawa epidermis ke kaca objek. Ratakan jaringan dalam tetesan air.",
  ],
  [
    "Tambahkan Lugol",
    "Tambahkan Lugol, lalu seret botolnya ke kaca objek. Sedikit pewarna mengalir dari tepi jaringan.",
  ],
  [
    "Pasang kaca penutup",
    "Seret kaca penutup ke kaca objek. Kaca akan diturunkan miring agar tidak menjebak banyak udara.",
  ],
  [
    "Serap cairan berlebih",
    "Seret tisu ke kaca objek. Sentuhkan pada tepi kaca penutup tanpa menggosok jaringan.",
  ],
  [
    "Pasang preparat",
    "Tambahkan mikroskop. Seret kaca objek ke mikroskop; penjepit akan mengunci preparat.",
  ],
  [
    "Atur posisi dan fokus",
    "Klik mikroskop atau Buka mikroskop. Seret bidang pandang untuk memusatkan jaringan; putar knob fokus hingga sel jelas.",
  ],
  [
    "Tandai struktur sel",
    "Tekan Selesai pengamatan setelah posisi dan fokus tepat. Tandai dinding sel, vakuola, dan inti sel langsung pada citra.",
  ],
] as const;
export const homes: Record<string, Point> = {
  microscope: [1.55, 0.92, -0.5],
  slide: [-0.7, 0.94, 0.25],
  onion: [-2.25, 0.92, -0.7],
  forceps: [-1.65, 0.94, 1.1],
  water: [-2.65, 0.92, 0.5],
  lugol: [-2.35, 0.92, 1.35],
  coverslip: [0.2, 0.94, 1.25],
  tissue: [0.85, 0.94, 1.25],
};
export const structures = ["Dinding sel", "Vakuola", "Inti sel"] as const;
export const cells = Array.from({ length: 20 }, (_, i) => ({
  x: (i % 4) * 140 - 30 + (Math.floor(i / 4) % 2) * 25,
  y: Math.floor(i / 4) * 100 - 5,
}));
// Shared with the SVG renderer: all visible cells are valid, not one hidden answer region.
export function structureAt(x: number, y: number): number | null {
  for (const c of cells) {
    const dx = x - c.x,
      dy = y - c.y;
    if (dx < 0 || dx > 138 || dy < 0 || dy > 98) continue;
    if (((dx - 23) / 10) ** 2 + ((dy - 48) / 14) ** 2 <= 1) return 2;
    if (dx >= 40 && dx <= 120 && dy >= 18 && dy <= 80) return 1;
    if (dx <= 7 || dx >= 131 || dy <= 7 || dy >= 91) return 0;
  }
  return null;
}
export type State = {
  mode: Mode;
  step: number;
  objects: { id: string; pos: Point }[];
  ppe: string[];
  remaining: number;
  finished: boolean;
  expired: boolean;
  focus: number;
  offset: [number, number];
  marked: number[];
  attempts: number[];
  penalties: Record<string, number>;
  event: number;
  sound: SoundKind;
  log: string[];
  feedback: string;
  motion?: { source: string; target: string; event: number };
};
export const initial = (mode: Mode): State => ({
  mode,
  step: 0,
  objects: [],
  ppe: [],
  remaining: 600,
  finished: false,
  expired: false,
  focus: 12,
  offset: [150, -110],
  marked: [],
  attempts: [0, 0, 0],
  penalties: {},
  event: 0,
  sound: "touch",
  log: [],
  feedback: "",
});
export const ready = (s: State) =>
  Math.abs(s.focus - 68) <= 4 && Math.hypot(...s.offset) <= 24;
export const score = (s: State) =>
  Math.max(0, 100 - Object.values(s.penalties).reduce((a, b) => a + b, 0));
export type Action =
  | { type: "add"; id: string }
  | { type: "move"; id: string; pos: Point }
  | { type: "interact"; source: string; target: string }
  | { type: "adjust"; focus?: number; offset?: [number, number] }
  | { type: "observe" }
  | { type: "mark"; x: number; y: number }
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
function fail(s: State, text: string, category = "Prosedur"): State {
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
            [category]: Math.min(
              category === "APD" ? 15 : 20,
              (s.penalties[category] || 0) + 5,
            ),
          }
        : s.penalties,
  };
}
const interactions: [string, string, SoundKind, string][] = [
  [
    "tissue",
    "slide",
    "dry",
    "Kaca objek dibersihkan dan ditempatkan di area kerja.",
  ],
  ["forceps", "onion", "touch", "Epidermis tipis diangkat dengan pinset."],
  ["water", "slide", "drop", "Satu tetes air ditambahkan ke kaca objek."],
  ["forceps", "slide", "touch", "Epidermis diletakkan rata dalam tetesan air."],
  ["lugol", "slide", "drop", "Lugol diteteskan dari tepi epidermis."],
  ["coverslip", "slide", "clink", "Kaca penutup diturunkan miring."],
  ["tissue", "slide", "dry", "Cairan berlebih diserap dari tepi preparat."],
  [
    "slide",
    "microscope",
    "clink",
    "Preparat dipasang dan penjepit mikroskop dikunci.",
  ],
];
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
            "Tahap belum selesai": (11 - s.step) * 5,
            "Struktur belum ditandai": (3 - s.marked.length) * 10,
          },
        };
  }
  if (a.type === "add") {
    const tool = epidermisTools.find((t) => t.id === a.id);
    if (!tool) return s;
    if (tool.kind === "ppe") {
      if (s.ppe.includes(a.id)) return s;
      const ppe = [...s.ppe, a.id];
      return message(
        { ...s, ppe, step: ppe.length === 3 && s.step === 0 ? 1 : s.step },
        `${tool.name} dikenakan.`,
        ppe.length === 3 ? "stage" : "confirm",
      );
    }
    if (s.ppe.length < 3)
      return fail(s, "Kenakan seluruh APD sebelum menggunakan alat.", "APD");
    if (s.objects.some((o) => o.id === a.id)) return s;
    return message(
      { ...s, objects: [...s.objects, { id: a.id, pos: homes[a.id] }] },
      `${tool.name} ditempatkan di meja.`,
      "clink",
    );
  }
  if (a.type === "move") {
    if (
      !a.pos.every(Number.isFinite) ||
      a.id === "microscope" ||
      (a.id === "slide" && s.step >= 9) ||
      (a.id === "coverslip" && s.step >= 7)
    )
      return s;
    return {
      ...s,
      objects: s.objects.map((o) =>
        o.id === a.id
          ? {
              ...o,
              pos: [
                Math.max(-3, Math.min(3, a.pos[0])),
                0.94,
                Math.max(-1.6, Math.min(1.6, a.pos[2])),
              ],
            }
          : o,
      ),
    };
  }
  if (a.type === "adjust") {
    if (s.step !== 9) return s;
    return {
      ...s,
      focus:
        a.focus !== undefined && Number.isFinite(a.focus)
          ? Math.max(0, Math.min(100, a.focus))
          : s.focus,
      offset: a.offset?.every(Number.isFinite)
        ? (a.offset.map((v) => Math.max(-220, Math.min(220, v))) as [
            number,
            number,
          ])
        : s.offset,
    };
  }
  if (a.type === "observe") {
    if (s.step !== 9) return s;
    if (!ready(s))
      return fail(s, "Pusatkan jaringan dan tajamkan fokus terlebih dahulu.");
    return message(
      { ...s, step: 10, offset: [0, 0], focus: 68 },
      "Pengamatan selesai. Tandai struktur sel yang diamati.",
      "stage",
    );
  }
  if (a.type === "mark") {
    if (
      s.step !== 10 ||
      s.marked.length === 3 ||
      ![a.x, a.y].every(Number.isFinite) ||
      Math.hypot(a.x - 250, a.y - 250) > 240
    )
      return s;
    const index = s.marked.length,
      correct = structureAt(a.x, a.y) === index,
      attempts = s.attempts.map((n, i) => (i === index ? n + 1 : n));
    if (correct)
      return message(
        { ...s, attempts, marked: [...s.marked, index] },
        `${structures[index]} ditandai.`,
        "confirm",
      );
    const hints = [
      "Pilih batas tebal yang mengelilingi sebuah sel.",
      "Pilih ruang besar di bagian tengah sel.",
      "Pilih struktur kecil, gelap, dan oval di tepi bagian dalam sel.",
    ];
    return {
      ...message(
        { ...s, attempts },
        s.mode === "latihan"
          ? hints[index]
          : "Penandaan belum tepat. Amati kembali.",
        "error",
      ),
      feedback: "Penandaan belum tepat.",
      penalties: {
        ...s.penalties,
        [structures[index]]: Math.min(
          10,
          (s.penalties[structures[index]] || 0) + 5,
        ),
      },
    };
  }
  if (a.type === "submit")
    return s.step === 10 && s.marked.length === 3
      ? {
          ...message(s, "Hasil pengamatan dikumpulkan.", "stage"),
          finished: true,
        }
      : s;
  if (a.type === "interact") {
    if (
      !s.objects.some((o) => o.id === a.source) ||
      !s.objects.some((o) => o.id === a.target)
    )
      return fail(s, "Letakkan kedua alat di meja terlebih dahulu.");
    const expected = interactions[s.step - 1];
    if (!expected || a.source !== expected[0] || a.target !== expected[1])
      return fail(s, "Periksa pasangan alat dan urutan langkah pada panduan.");
    const step = s.step + 1,
      n = message({ ...s, step }, expected[3], expected[2]);
    return {
      ...n,
      motion: { source: a.source, target: a.target, event: n.event },
      objects: n.objects.map((o) =>
        o.id === "slide"
          ? { ...o, pos: step >= 9 ? [1.55, 1.6, -0.45] : homes.slide }
          : o.id === "coverslip" && step >= 7
            ? { ...o, pos: homes.slide }
            : o.id === a.source
              ? { ...o, pos: homes[o.id] }
              : o,
      ),
    };
  }
  return s;
}
