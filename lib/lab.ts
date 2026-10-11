export type Mode = "latihan" | "ujian";
export type ToolItem = {
  id: string;
  name: string;
  kind: string;
  category: string;
  spec: string;
  info: string;
  safety: string;
  hazards?: ("corrosive" | "flammable" | "irritant")[];
};
export const tools: ToolItem[] = [
  {
    id: "goggles",
    name: "Kacamata keselamatan",
    kind: "ppe",
    category: "Alat Pelindung Diri",
    spec: "Polikarbonat jernih · EN166 / ANSI Z87.1",
    info: "Pelindung mata dengan lensa bening dan sisi tertutup untuk mengurangi risiko percikan larutan masuk dari depan maupun samping.",
    safety:
      "Pastikan terpasang rapat sebelum botol bahan dibuka. Kacamata biasa tidak menggantikan kacamata keselamatan.",
  },
  {
    id: "coat",
    name: "Jas laboratorium",
    kind: "ppe",
    category: "Alat Pelindung Diri",
    spec: "Katun poliester lengan panjang · Kancing tertutup",
    info: "Lapisan pelindung berlengan panjang yang membantu mencegah percikan langsung mengenai kulit dan pakaian.",
    safety:
      "Kancingkan jas, rapikan rambut panjang, dan lepaskan jas sebelum meninggalkan area praktikum.",
  },
  {
    id: "gloves",
    name: "Sarung tangan",
    kind: "ppe",
    category: "Alat Pelindung Diri",
    spec: "Nitrile bebas serbuk · Ketahanan asam/basa sedang",
    info: "Sarung tangan laboratorium membantu mengurangi kontak kulit dengan larutan selama penanganan alat dan bahan.",
    safety:
      "Periksa sobekan sebelum dipakai. Ganti segera jika terkena bahan dan jangan menyentuh wajah atau perangkat pribadi.",
  },
  {
    id: "stand",
    name: "Statif & klem",
    kind: "stand",
    category: "Penyangga",
    spec: "Batang baja krom 60 cm · Alas besi cor & klem buret",
    info: "Menahan buret tegak lurus di atas meja praktikum dengan alas keramik putih pembantu kontras.",
    safety:
      "Pastikan baut klem kencang dan alas statif stabil menghadap ke depan.",
  },
  {
    id: "burette",
    name: "Buret 50 mL",
    kind: "burette",
    category: "Volumetrik Presisi",
    spec: "Borosilikat 3.3 · Kelas A · 50,00 mL (skala 0,10 mL) · Keran PTFE",
    info: "Mengukur volume titran yang dialirkan secara akurat hingga dua angka di belakang koma.",
    safety:
      "Klem dengan hati-hati; periksa kelancaran dan kerapatan keran sebelum pengisian.",
  },
  {
    id: "flask",
    name: "Erlenmeyer 250 mL",
    kind: "flask",
    category: "Wadah Reaksi",
    spec: "Kaca borosilikat 250 mL · Leher sempit mudah digoyang",
    info: "Wadah sampel HCl selama titrasi; bentuk kerucut meminimalkan risiko tumpah saat labu digoyang.",
    safety:
      "Periksa retak sebelum digunakan. Goyang perlahan tanpa mengangkat Erlenmeyer dari meja.",
  },
  {
    id: "pipette",
    name: "Pipet 25 mL & propipet",
    kind: "pipette",
    category: "Volumetrik Presisi",
    spec: "Pipet gondok 25,00 mL (±0,03 mL) · Bola hisap 3 katup",
    info: "Memindahkan tepat 25,00 mL sampel analit dengan presisi analitik tinggi (satu garis tanda batas).",
    safety:
      "Gunakan propipet; dilarang memipet dengan mulut. Bersihkan tetesan di ujung luar pipet.",
  },
  {
    id: "funnel",
    name: "Corong kaca",
    kind: "funnel",
    category: "Alat Bantu",
    spec: "Kaca borosilikat Ø 50 mm · Batang pendek",
    info: "Membantu memasukkan titran NaOH ke mulut buret tanpa tumpah atau tercecer.",
    safety:
      "Angkat sedikit saat menuang agar udara keluar; wajib dilepas sebelum pembacaan awal buret.",
  },
  {
    id: "waste",
    name: "Gelas limbah 500 mL",
    kind: "beaker",
    category: "Pengelolaan Limbah",
    spec: "Gelas piala Griffin 500 mL · Kaca tahan kimia",
    info: "Menampung larutan pembilas, kondisioner, dan cairan buangan awal dari ujung buret.",
    safety: "Pisahkan limbah asam-basa sesuai petunjuk keselamatan praktikum.",
  },
  {
    id: "naoh",
    name: "NaOH 0,100 M",
    kind: "bottle",
    category: "Titran Basa",
    spec: "Natrium hidroksida standar 0,100 M · Baku sekunder",
    info: "Titran basa kuat dengan konsentrasi telah dibakukan untuk menetralkan asam analit.",
    safety:
      "Hindari kontak kulit dan mata. Segera bilas air mengalir jika terkena larutan.",
    hazards: ["irritant"],
  },
  {
    id: "hcl",
    name: "HCl (Sampel)",
    kind: "bottle",
    category: "Sampel Analit",
    spec: "Asam klorida encer · Konsentrasi belum diketahui",
    info: "Larutan analit yang akan dicari nilai molaritas pastinya melalui proses titrasi.",
    safety:
      "Hindari kontak langsung; wajib kenakan APD lengkap saat menangani larutan.",
    hazards: ["corrosive"],
  },
  {
    id: "indicator",
    name: "Fenolftalein (PP)",
    kind: "bottle",
    category: "Indikator pH",
    spec: "Larutan 1% dlm etanol · Trayek pH 8,2–10,0",
    info: "Indikator sintetis; tidak berwarna pada lingkungan asam dan berubah pink pucat di titik akhir.",
    safety:
      "Gunakan 2–3 tetes dan jauhkan dari sumber api karena pelarut etanol mudah terbakar.",
    hazards: ["flammable"],
  },
  {
    id: "water",
    name: "Air deionisasi",
    kind: "bottle",
    category: "Pelarut / Pembilas",
    spec: "Aquades murni · Botol semprot PE 500 mL",
    info: "Air bebas ion mineral untuk membilas dinding Erlenmeyer agar analit turun ke larutan tanpa mengubah mol asam.",
    safety:
      "Bukan air minum. Hindari menyentuhkan moncong botol ke dinding alat agar tetap steril.",
  },
  {
    id: "tube",
    name: "Tabung reaksi",
    kind: "burette",
    category: "Pengecoh / Non-analitik",
    spec: "Kaca soda-lime 15×150 mm · Uji kualitatif",
    info: "Wadah reaksi skala kecil untuk pengamatan kualitatif; tidak memiliki skala volume analitik.",
    safety: "Tidak diperlukan pada percobaan titrasi kuantitatif ini.",
  },
  {
    id: "cylinder",
    name: "Gelas ukur 100 mL",
    kind: "beaker",
    category: "Pengecoh / Non-analitik",
    spec: "Kaca borosilikat 100 mL · Toleransi ±1,0 mL",
    info: "Mengukur volume perkiraan kasar; tidak memenuhi standar presisi analitik titrasi.",
    safety:
      "Jangan menggantikan pipet volumetrik dengan gelas ukur untuk mengukur sampel.",
  },
];
export const steps = [
  "Kenakan seluruh APD",
  "Pasang statif dan buret",
  "Kondisikan buret dengan NaOH",
  "Isi buret dan buang gelembung",
  "Lepas corong; catat volume awal",
  "Pipet 25,00 mL HCl",
  "Tambahkan fenolftalein",
  "Tempatkan labu di bawah buret",
  "Titrasi hingga pink pucat menetap",
  "Baca meniskus dan hitung hasil",
];
// All mounted equipment shares the same world-space axis at x=-.37.
export const targets: Record<string, [number, number, number]> = {
  stand: [-0.65, 0.87, 0],
  burette: [-0.37, 1.36, 0],
  flask: [-0.37, 0.87, 0],
  funnel: [-0.37, 2.86, 0],
};
export type Obj = {
  id: string;
  pos: [number, number, number];
  locked: boolean;
};
export type StepSnapshot = {
  objects: Obj[];
  ppe: string[];
  volume: number;
  mixed: boolean;
  stable: number;
  indicator: boolean;
  funnelPlaced: boolean;
  pipetteLoaded: boolean;
};
export type State = {
  mode: Mode;
  step: number;
  objects: Obj[];
  ppe: string[];
  log: { text: string; at: number }[];
  penalties: Record<string, number>;
  volume: number;
  mixed: boolean;
  stable: number;
  indicator: boolean;
  funnelPlaced: boolean;
  pipetteLoaded: boolean;
  finished: boolean;
  expired: boolean;
  answers?: { initial: string; final: string; molarity: string };
  remaining: number;
  feedback: string;
  stepSnapshots?: Record<number, StepSnapshot>;
};
export const initial = (mode: Mode): State => ({
  mode,
  step: 0,
  objects: [],
  ppe: [],
  log: [],
  penalties: {},
  volume: 0,
  mixed: false,
  stable: 0,
  indicator: false,
  funnelPlaced: false,
  pipetteLoaded: false,
  finished: false,
  expired: false,
  remaining: 600,
  feedback: "",
  stepSnapshots: {
    0: {
      objects: [],
      ppe: [],
      volume: 0,
      mixed: false,
      stable: 0,
      indicator: false,
      funnelPlaced: false,
      pipetteLoaded: false,
    },
  },
});
export type Action = {
  type: string;
  id?: string;
  pos?: [number, number, number];
  value?: number;
  answers?: State["answers"];
};
const has = (s: State, id: string) => s.objects.some((o) => o.id === id);
const locked = (s: State, id: string) =>
  s.objects.some((o) => o.id === id && o.locked);
const log = (s: State, text: string) => ({
  ...s,
  feedback: "",
  log: [...s.log, { text, at: Date.now() }].slice(-120),
});
const createSnapshot = (s: State): StepSnapshot => ({
  objects: s.objects.map((o) => ({
    ...o,
    pos: [...o.pos] as [number, number, number],
  })),
  ppe: [...s.ppe],
  volume: s.volume,
  mixed: s.mixed,
  stable: s.stable,
  indicator: s.indicator,
  funnelPlaced: s.funnelPlaced,
  pipetteLoaded: s.pipetteLoaded,
});
function fail(
  s: State,
  message: string,
  category = "procedure",
  points = 5,
  cap = 20,
) {
  const next = log(s, message);
  return {
    ...next,
    feedback: s.mode === "latihan" ? message : "Tindakan dicatat.",
    penalties:
      s.mode === "ujian"
        ? {
            ...s.penalties,
            [category]: Math.min(cap, (s.penalties[category] || 0) + points),
          }
        : s.penalties,
  };
}
export function score(s: State) {
  return Math.max(
    0,
    100 - Object.values(s.penalties).reduce((a, b) => a + b, 0),
  );
}
export const endpoint = (s: State) => s.indicator && s.volume >= 24.8;
function rawReducer(s: State, a: Action): State {
  if (a.type === "reset") return initial(s.mode);
  if (a.type === "resetStep") {
    const snap = s.stepSnapshots?.[s.step];
    if (!snap) return s;
    return {
      ...s,
      objects: snap.objects.map((o) => ({
        ...o,
        pos: [...o.pos] as [number, number, number],
      })),
      ppe: [...snap.ppe],
      volume: snap.volume,
      mixed: snap.mixed,
      stable: snap.stable,
      indicator: snap.indicator,
      funnelPlaced: snap.funnelPlaced,
      pipetteLoaded: snap.pipetteLoaded,
      feedback: "",
      log: [
        ...s.log,
        {
          text: `Langkah ${s.step + 1} (${steps[s.step]}) diulang.`,
          at: Date.now(),
        },
      ].slice(-120),
    };
  }
  if (a.type === "prevStep") {
    if (s.step <= 0) return s;
    const prev = s.step - 1;
    const snap = s.stepSnapshots?.[prev];
    if (!snap) return { ...s, step: prev };
    return {
      ...s,
      objects: snap.objects.map((o) => ({
        ...o,
        pos: [...o.pos] as [number, number, number],
      })),
      ppe: [...snap.ppe],
      volume: snap.volume,
      mixed: snap.mixed,
      stable: snap.stable,
      indicator: snap.indicator,
      funnelPlaced: snap.funnelPlaced,
      pipetteLoaded: snap.pipetteLoaded,
      step: prev,
      feedback: "",
      log: [
        ...s.log,
        {
          text: `Kembali ke langkah ${prev + 1}: ${steps[prev]}.`,
          at: Date.now(),
        },
      ].slice(-120),
    };
  }
  if (s.finished) return s;
  if (a.type === "tick") {
    if (s.mode !== "ujian") return s;
    const remaining = Math.max(0, a.value ?? s.remaining - 1);
    return remaining
      ? { ...s, remaining }
      : {
          ...log(s, "Waktu ujian habis."),
          remaining: 0,
          finished: true,
          expired: true,
          penalties: {
            ...s.penalties,
            time: 20,
            incomplete: Math.max(0, 9 - s.step) * 5,
          },
        };
  }
  if (a.type === "add" && a.id) {
    const id = a.id;
    if (has(s, id)) return s;
    if (tools.find((t) => t.id === id)?.kind === "ppe") {
      const ppe = [...new Set([...s.ppe, id])];
      return {
        ...log(s, `${tools.find((t) => t.id === id)?.name} dipakai.`),
        ppe,
        step: ppe.length === 3 ? Math.max(1, s.step) : s.step,
      };
    }
    let n = {
      ...s,
      objects: [
        ...s.objects,
        {
          id,
          pos: [
            0.45 + (s.objects.length % 4) * 0.58,
            0.87,
            -0.72 + Math.floor(s.objects.length / 4) * 0.52,
          ] as [number, number, number],
          locked: false,
        },
      ],
    };
    if (["naoh", "hcl", "indicator"].includes(id) && s.ppe.length < 3)
      n = fail(n, "Lengkapi APD sebelum menangani bahan.", "ppe", 15, 15);
    if (["tube", "cylinder"].includes(id))
      n = fail(
        n,
        "Alat ini tidak sesuai pengukuran titrasi.",
        "selection",
        5,
        15,
      );
    return log(n, `${tools.find((t) => t.id === id)?.name} diambil.`);
  }
  if (a.type === "move" && a.id && a.pos) {
    return {
      ...s,
      objects: s.objects.map((o) =>
        o.id === a.id && !o.locked ? { ...o, pos: a.pos! } : o,
      ),
    };
  }
  if (a.type === "lock" && a.id) {
    const target = targets[a.id];
    const o = s.objects.find((o) => o.id === a.id);
    if (!o) return s;
    const valid =
      target && Math.hypot(o.pos[0] - target[0], o.pos[2] - target[2]) < 0.6;
    let n = {
      ...s,
      objects: s.objects.map((x) =>
        x.id === a.id
          ? { ...x, pos: valid ? target : x.pos, locked: !x.locked }
          : x,
      ),
    };
    if (locked(n, "stand") && locked(n, "burette") && s.step === 1) n.step = 2;
    return log(
      n,
      `${tools.find((t) => t.id === a.id)?.name}: posisi ${o.locked ? "dibuka" : "dikunci"}.`,
    );
  }
  if (a.type === "rinse") {
    if (s.step !== 2 || !has(s, "naoh") || !has(s, "waste"))
      return fail(
        s,
        "Pasang buret, siapkan NaOH dan gelas limbah terlebih dahulu.",
      );
    return {
      ...log(s, "Buret dikondisikan dengan NaOH; bilasan ditampung."),
      step: 3,
    };
  }
  if (a.type === "placeFunnel") {
    if (s.step !== 3 || !has(s, "funnel") || !locked(s, "burette"))
      return fail(s, "Pasang corong pada mulut buret setelah buret dibilas.");
    return {
      ...log(s, "Corong dipasang pada mulut buret."),
      funnelPlaced: true,
      objects: s.objects.map((o) =>
        o.id === "funnel" ? { ...o, pos: targets.funnel, locked: true } : o,
      ),
    };
  }
  if (a.type === "fill") {
    if (s.step !== 3 || !s.funnelPlaced)
      return fail(s, "Pasang corong pada mulut buret sebelum mengisi NaOH.");
    return {
      ...log(s, "Buret diisi dengan NaOH dan ujung buret bebas gelembung."),
      step: 4,
      objects: s.objects.map((o) =>
        o.id === "funnel" ? { ...o, locked: false } : o,
      ),
    };
  }
  if (a.type === "record") {
    if (s.step !== 4 || !s.funnelPlaced)
      return fail(
        s,
        "Isi buret terlebih dahulu, lalu angkat corong dari mulut buret.",
      );
    return {
      ...log(s, "Corong diangkat. Pembacaan awal dicatat untuk kuis."),
      funnelPlaced: false,
      step: 5,
    };
  }
  if (a.type === "loadPipette") {
    if (s.step !== 5 || !has(s, "pipette") || !has(s, "hcl"))
      return fail(
        s,
        "Sentuhkan pipet ke botol sampel HCl setelah pembacaan awal.",
      );
    return {
      ...log(s, "Pipet diisi sampel HCl menggunakan propipet."),
      pipetteLoaded: true,
    };
  }
  if (a.type === "pipette") {
    if (s.step !== 5 || !s.pipetteLoaded || !has(s, "flask"))
      return fail(s, "Isi pipet dari botol HCl, lalu pindahkan ke Erlenmeyer.");
    return {
      ...log(s, "25,00 mL HCl dipindahkan ke Erlenmeyer."),
      pipetteLoaded: false,
      step: 6,
    };
  }
  if (a.type === "indicator") {
    if (s.step !== 6 || !has(s, "indicator"))
      return fail(s, "Pipet HCl dan siapkan fenolftalein terlebih dahulu.");
    return {
      ...log(s, "Tiga tetes fenolftalein ditambahkan."),
      indicator: true,
      step: 7,
    };
  }
  if (a.type === "ready") {
    const f = s.objects.find((o) => o.id === "flask");
    if (
      s.step !== 7 ||
      !f ||
      Math.hypot(f.pos[0] - targets.flask[0], f.pos[2] - targets.flask[2]) >
        0.65
    )
      return fail(s, "Tempatkan Erlenmeyer tepat di bawah buret.");
    return { ...log(s, "Labu berada di bawah ujung buret."), step: 8 };
  }
  if (a.type === "dose") {
    if (s.step !== 8) return fail(s, "Rangkaian belum siap untuk titrasi.");
    const volume = Math.min(
      25,
      Math.round((s.volume + (a.value || 0.05)) * 100) / 100,
    );
    return { ...s, volume, mixed: false, stable: 0 };
  }
  if (a.type === "resetTitration") {
    if (s.step !== 8) return s;
    return {
      ...log(
        s,
        "Titrasi diulang. Buret diisi kembali ke volume awal (0,00 mL).",
      ),
      volume: 0,
      mixed: false,
      stable: 0,
    };
  }
  if (a.type === "mix") {
    if (s.step !== 8)
      return fail(s, "Pengadukan titrasi dilakukan setelah rangkaian siap.");
    return { ...log(s, "Labu diaduk perlahan."), mixed: true };
  }
  if (a.type === "stable") {
    return endpoint(s) && s.mixed
      ? { ...s, stable: Math.min(15, s.stable + 1) }
      : s;
  }
  if (a.type === "finish") {
    if (s.step !== 8)
      return fail(s, "Selesaikan persiapan sebelum menutup titrasi.");
    if (s.mode === "latihan" && (!endpoint(s) || !s.mixed))
      return fail(
        s,
        "Capai warna pink pucat, lalu aduk labu sebelum menyelesaikan titrasi.",
      );
    let n = s;
    if (!endpoint(s) || !s.mixed)
      n = fail(
        s,
        "Titik akhir belum tepat atau larutan belum diaduk.",
        "endpoint",
        10,
        10,
      );
    return { ...log(n, "Titrasi diakhiri pada warna pink pucat."), step: 9 };
  }
  if (a.type === "submit" && a.answers) {
    if (s.step !== 9) return s;
    const num = (v: string) => (v.trim() ? Number(v.replace(",", ".")) : NaN);
    const ans = a.answers;
    let n: State = { ...s, answers: ans };
    const meniscusWrong =
      !Number.isFinite(num(ans.initial)) ||
      !Number.isFinite(num(ans.final)) ||
      Math.abs(num(ans.initial) - 0.15) > 0.02 ||
      Math.abs(num(ans.final) - (0.15 + s.volume)) > 0.02;
    const calculationWrong =
      !Number.isFinite(num(ans.molarity)) ||
      Math.abs(num(ans.molarity) - (0.1 * s.volume) / 25) > 0.0005;
    if (meniscusWrong) {
      n = fail(n, "Pembacaan meniskus belum tepat.", "meniscus", 15, 15);
      if (s.mode === "latihan")
        n = { ...n, penalties: { ...n.penalties, meniscus: 15 } };
    }
    if (calculationWrong) {
      n = fail(n, "Perhitungan molaritas belum tepat.", "calculation", 15, 15);
      if (s.mode === "latihan")
        n = { ...n, penalties: { ...n.penalties, calculation: 15 } };
    }
    return { ...log(n, "Jawaban dikumpulkan."), finished: true };
  }
  return s;
}

export function reducer(s: State, a: Action): State {
  const next = rawReducer(s, a);
  if (next.step > s.step) {
    return {
      ...next,
      stepSnapshots: {
        ...(s.stepSnapshots || {}),
        ...(next.stepSnapshots || {}),
        [next.step]: createSnapshot(next),
      },
    };
  }
  return next;
}
