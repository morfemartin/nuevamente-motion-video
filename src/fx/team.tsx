import React from "react";

export type Country = "Perú" | "Ecuador" | "Colombia" | "Venezuela" | "México";

// id = ISO 3166 numeric code used by world-atlas
export const COUNTRY_GEO: Record<Country, { id: string; lat: number; lon: number }> = {
  "Perú": { id: "604", lat: -9.2, lon: -75 },
  Ecuador: { id: "218", lat: -1.8, lon: -78.2 },
  Colombia: { id: "170", lat: 4.6, lon: -74.1 },
  Venezuela: { id: "862", lat: 7.1, lon: -66.2 },
  "México": { id: "484", lat: 21.5, lon: -100 },
};

export const TEAM: { name: string; country: Country; role: string; email: string; tags: string[] }[] = [
  { name: "Martin Morfe .°.", country: "Venezuela", role: "Project Manager · Product Governance & Acceptance Lead", email: "morfefloresm@uvm.edu.ve", tags: ["product", "project"] },
  { name: "Heiner Jair Godoy Zamora", country: "Colombia", role: "Full-Stack Engineer · Integration & Quality Lead", email: "heiner.godoy@correounivalle.edu.co", tags: ["full"] },
  { name: "Arianna Lizzette Aponte Vera", country: "Ecuador", role: "PMO Project Controls & Reporting Analyst", email: "arilizaponte@gmail.com", tags: ["project", "pmo"] },
  { name: "Harol Benjamin Medina Zárate", country: "Perú", role: "Full-Stack Engineer · Systems Integration & Backend Support", email: "benja15mz@gmail.com", tags: ["full", "back"] },
  { name: "Diana Castaño Zapata", country: "Colombia", role: "Frontend Engineer · Product Experience & Demo Lead", email: "dianaczapata@gmail.com", tags: ["front", "product"] },
  { name: "Juan David Villegas Anaya", country: "México", role: "Backend Engineer · RAG, Grounding & AI Integration", email: "daavidanaya@gmail.com", tags: ["back", "architecture"] },
];

// Simplified vector flags
export const Flag: React.FC<{ country: Country; w?: number }> = ({ country, w = 40 }) => {
  const h = w * (2 / 3);
  const tri = (a: string, b: string, c: string, vertical: boolean, split = [1 / 3, 1 / 3, 1 / 3]) =>
    vertical ? (
      <>
        <rect x={0} y={0} width={30 * split[0]} height={20} fill={a} />
        <rect x={30 * split[0]} y={0} width={30 * split[1]} height={20} fill={b} />
        <rect x={30 * (split[0] + split[1])} y={0} width={30 * split[2]} height={20} fill={c} />
      </>
    ) : (
      <>
        <rect x={0} y={0} width={30} height={20 * split[0]} fill={a} />
        <rect x={0} y={20 * split[0]} width={30} height={20 * split[1]} fill={b} />
        <rect x={0} y={20 * (split[0] + split[1])} width={30} height={20 * split[2]} fill={c} />
      </>
    );
  const body: Record<Country, React.ReactNode> = {
    "Perú": tri("#D91023", "#fff", "#D91023", true),
    Ecuador: <>{tri("#FFDD00", "#034EA2", "#ED1C24", false, [0.5, 0.25, 0.25])}<circle cx={15} cy={10} r={2.6} fill="#7a5c2e" /></>,
    Colombia: tri("#FCD116", "#003893", "#CE1126", false, [0.5, 0.25, 0.25]),
    Venezuela: <>{tri("#FFCC00", "#00247D", "#CF142B", false)}{Array.from({ length: 8 }).map((_, i) => { const a = Math.PI * (0.15 + (0.7 * i) / 7); return <circle key={i} cx={15 - Math.cos(a) * 6} cy={12.5 - Math.sin(a) * 4.5} r={0.7} fill="#fff" />; })}</>,
    "México": <>{tri("#006847", "#fff", "#CE1126", true)}<circle cx={15} cy={10} r={2.4} fill="#8a6a2f" /></>,
  };
  return (
    <svg width={w} height={h} viewBox="0 0 30 20" style={{ borderRadius: 3, boxShadow: "0 0 0 1px rgba(255,255,255,.25), 0 4px 12px rgba(0,0,0,.4)", flexShrink: 0 }}>
      {body[country]}
    </svg>
  );
};
