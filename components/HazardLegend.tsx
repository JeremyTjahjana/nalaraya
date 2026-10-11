export const hazards = [
  {
    id: "explosive",
    name: "Eksplosif",
    meaning:
      "Dapat meledak; mencakup beberapa bahan reaktif dan peroksida organik.",
    precaution:
      "Hindari panas, benturan, dan gesekan; penanganan hanya oleh petugas terlatih.",
  },
  {
    id: "flammable",
    name: "Mudah terbakar",
    meaning:
      "Dapat mudah menyala; juga dapat menandai bahan yang memanas sendiri atau melepas gas mudah terbakar.",
    precaution: "Jauhkan api, percikan, dan permukaan panas.",
  },
  {
    id: "oxidizer",
    name: "Pengoksidasi",
    meaning: "Dapat menyebabkan atau memperhebat kebakaran.",
    precaution: "Pisahkan dari bahan mudah terbakar dan bahan pereduksi.",
  },
  {
    id: "gas",
    name: "Gas bertekanan",
    meaning:
      "Gas bertekanan dapat meledak jika dipanaskan; gas sangat dingin dapat melukai kulit.",
    precaution: "Amankan tabung dan lindungi dari panas.",
  },
  {
    id: "corrosive",
    name: "Korosif",
    meaning:
      "Dapat membakar kulit, merusak mata secara serius, atau mengkorosi logam.",
    precaution: "Gunakan APD yang sesuai dan hindari percikan.",
  },
  {
    id: "toxic",
    name: "Toksisitas akut",
    meaning:
      "Dapat fatal atau toksik jika tertelan, terhirup, atau terkena kulit.",
    precaution:
      "Hindari paparan; ikuti pengendalian dan prosedur darurat pada SDS.",
  },
  {
    id: "exclamation",
    name: "Tanda seru",
    meaning:
      "Dapat menandai iritasi, alergi kulit, atau toksisitas akut kategori berbahaya.",
    precaution: "Hindari kontak dan menghirup uap atau debu.",
  },
  {
    id: "health",
    name: "Bahaya kesehatan serius",
    meaning:
      "Dapat menandai kanker, kerusakan organ, gangguan reproduksi, atau bahaya aspirasi.",
    precaution: "Batasi paparan sesuai SDS dan arahan guru.",
  },
  {
    id: "environment",
    name: "Bahaya lingkungan",
    meaning: "Berbahaya bagi organisme air, termasuk dampak jangka panjang.",
    precaution:
      "Jangan buang ke saluran air; kumpulkan sebagai limbah sesuai prosedur.",
  },
];

export default function HazardLegend({
  detailed = false,
}: {
  detailed?: boolean;
}) {
  return (
    <div
      className={"hazard-legend" + (detailed ? " detailed" : "")}
      aria-label="Sembilan simbol GHS"
    >
      {hazards.map((hazard) => (
        <figure key={hazard.id}>
          <img
            src={"/ghs/" + hazard.id + ".svg"}
            width={80}
            height={80}
            alt={"Pictogram " + hazard.name}
            loading="lazy"
          />
          <figcaption>
            <strong>{hazard.name}</strong>
            {detailed && (
              <>
                <span>{hazard.meaning}</span>
                <span className="hazard-precaution">{hazard.precaution}</span>
              </>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
