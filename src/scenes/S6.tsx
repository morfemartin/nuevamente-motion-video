import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sparkles, GraduationCap, Library, TrendingUp } from "lucide-react";
import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { Background, Glass, Grad, Prism, RainbowText, Sfx, Title } from "../fx";
import { COUNTRY_GEO, Country, Flag, TEAM } from "../fx/team";
import {keys, lerp, prog, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER, SPECTRUM } from "../theme";

// Vision and multinational team (globe drawn from Natural Earth 1:110m country shapes)
const PRE = scenePre("s6");
const v = (c: Cue) => PRE + cueAt("v6", c);

const LAND = (feature(world as any, (world as any).objects.countries) as any).features as any[];
const GRATICULE = geoGraticule10();
const ORDER: Country[] = ["Perú", "Ecuador", "Colombia", "Venezuela", "México"];
const COUNTRY_COLOR: Record<Country, string> = { "Perú": SPECTRUM[4], Ecuador: SPECTRUM[3], Colombia: SPECTRUM[2], Venezuela: SPECTRUM[1], "México": SPECTRUM[0] };
const DISCIPLINES = L.t.disciplines;
const PILLARS = L.t.pillars.map(([label, needle], i) => [label, needle, [GraduationCap, Library, TrendingUp][i]] as [string, string, any]);

// member cards, in the order the voice-over names their countries
const MEMBERS = ORDER.flatMap((c) => TEAM.filter((m) => m.country === c));
const CARD = { w: 400, h: 118, x0: 1060, y0: 200, gap: 14 };

export const S6: React.FC = () => {
  const t = useT();
  const f = useCurrentFrame();
  const tVision = 0.2;
  const tIA = v(cue("s6IA"));
  const pillarT = PILLARS.map((p) => v(p[1]));
  const tRef = v(cue("s6Ref"));
  const tTeam = v(cue("s6Team"));
  const countryT = Object.fromEntries(ORDER.map((c) => [c, v(L.countryName[c].toLowerCase())])) as Record<Country, number>;
  const discT = DISCIPLINES.map((d) => v(d[1]));
  const tOne = v(cue("s6One"));
  const tVisionEnd = v(cue("s6VisionEnd"));

  const phaseA = 1 - prog(t, tRef - 0.3, 0.6);
  const globeIn = prog(t, tRef - 0.2, 1.0);
  const toLeft = prog(t, tTeam - 0.3, 1.2);
  const converge = prog(t, tOne, 1.4);
  const gx = lerp(960, 560, toLeft), gy = lerp(540, 590, toLeft), R = lerp(270, 430, toLeft) * (0.6 + 0.4 * globeIn);
  // the globe spins from Africa/Europe until Latin America is centered
  const lon = keys(t, [[tRef - 0.2, 10], [tTeam + 0.8, -82]]);
  const lat = keys(t, [[tRef - 0.2, 20], [tTeam + 0.8, 4]]);
  const proj = geoOrthographic().scale(R).translate([gx, gy]).rotate([-lon, -lat]).clipAngle(90);
  const path = geoPath(proj);
  const center = { x: 960, y: 540 };

  return (
    <AbsoluteFill>
      <Background hue="#0e7490" />

      {/* A · broader vision: orbits + pillars */}
      <div style={{ position: "absolute", inset: 0, opacity: phaseA }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {[150, 250, 350].map((r, i) => {
            const p = prog(t, tVision + i * 0.35, 1.0);
            return <circle key={r} cx={960} cy={540} r={r * p} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth={1.5} />;
          })}
          {[150, 250, 350].map((r, i) => {
            const a = f / (60 + i * 25) + i * 2;
            return <circle key={`d${r}`} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={7} fill="#fff" opacity={prog(t, tVision + i * 0.35 + 0.6, 0.4)} />;
          })}
        </svg>
        <Prism cx={960} cy={548} size={150} inP={prog(t, 0.2, 0.8)} outP={prog(t, 0.8, 0.8)} outLen={220} spread={36} inAngle={10} />
        <Glass rainbow={0.7} style={{ left: 960 - 120, top: 250, width: 240, height: 64, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: prog(t, tIA, 0.5) }}>
          <Sparkles size={26} color={C.accent400} />
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, color: "#f8fafc" }}>{L.t.appliedAI}</span>
        </Glass>
        {PILLARS.map(([label, , Icon], i) => {
          const p = prog(t, pillarT[i], 0.5);
          const pos = [[520, 600], [960, 860], [1400, 600]][i];
          return (
            <Glass key={label} style={{ left: pos[0] - 170, top: pos[1] - 34, width: 340, height: 68, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
              <Icon size={24} color={SPECTRUM[i + 1]} />
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 23, color: "#f1f5f9" }}>{label}</span>
            </Glass>
          );
        })}
      </div>

      {/* B · globe with map */}
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: globeIn * (1 - converge * 0.85) }}>
        <defs>
          <radialGradient id="s6g" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#0ea5e9" stopOpacity={0.28} /><stop offset="1" stopColor="#1e3a8a" stopOpacity={0.08} /></radialGradient>
          <radialGradient id="s6h" cx="0.35" cy="0.3" r="0.7"><stop offset="0" stopColor="#fff" stopOpacity={0.14} /><stop offset="0.6" stopColor="#fff" stopOpacity={0} /></radialGradient>
          <filter id="s6b"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <circle cx={gx} cy={gy} r={R + 18} fill="#38bdf8" opacity={0.12} filter="url(#s6b)" />
        <circle cx={gx} cy={gy} r={R} fill="url(#s6g)" stroke="rgba(125,211,252,.55)" strokeWidth={1.5} />
        <path d={path(GRATICULE) ?? ""} fill="none" stroke="rgba(186,230,253,.12)" strokeWidth={1} />
        {LAND.map((c, i) => {
          const name = (Object.keys(COUNTRY_GEO) as Country[]).find((k) => COUNTRY_GEO[k].id === c.id);
          const lit = name ? prog(t, countryT[name], 0.5) : 0;
          return <path key={i} d={path(c) ?? ""} fill={name && lit > 0 ? COUNTRY_COLOR[name] : "rgba(148,197,233,.22)"} fillOpacity={name && lit > 0 ? 0.25 + 0.5 * lit : 1} stroke={name && lit > 0 ? COUNTRY_COLOR[name] : "rgba(186,230,253,.35)"} strokeWidth={name && lit > 0 ? 1.6 : 0.6} />;
        })}
        <circle cx={gx} cy={gy} r={R} fill="url(#s6h)" />
        {/* arcs between countries */}
        {ORDER.slice(1).map((c, i) => {
          const a = proj([COUNTRY_GEO[ORDER[i]].lon, COUNTRY_GEO[ORDER[i]].lat])!, b = proj([COUNTRY_GEO[c].lon, COUNTRY_GEO[c].lat])!;
          const p = prog(t, countryT[c], 0.6);
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 70;
          return <path key={c} d={`M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`} fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="6 8" strokeDashoffset={-f} opacity={p * 0.8 * (1 - converge)} />;
        })}
      </svg>
      <Title p={prog(t, tRef, 0.7) * (1 - prog(t, tTeam - 0.4, 0.4))} y={70} size={56}>
        {L.t.refTitle}
        <br />
        <span style={{ fontSize: 34, fontWeight: 500, color: C.slate300 }}>{L.t.refSub}</span>
      </Title>

      {/* C · pins with flags */}
      {ORDER.map((name) => {
        const q = proj([COUNTRY_GEO[name].lon, COUNTRY_GEO[name].lat])!;
        const p = prog(t, countryT[name], 0.5);
        const x = lerp(q[0], center.x, converge), y = lerp(q[1], center.y, converge);
        const right = name === "Venezuela";
        return (
          <div key={name} style={{ position: "absolute", left: x, top: y, opacity: p * (1 - converge) }}>
            <div style={{ position: "absolute", left: -20, top: -20, width: 40, height: 40, borderRadius: 20, background: COUNTRY_COLOR[name], opacity: 0.4 + 0.25 * Math.sin(t * 5), filter: "blur(8px)" }} />
            <div style={{ position: "absolute", left: -7, top: -7, width: 14, height: 14, borderRadius: 7, background: "#fff", boxShadow: `0 0 14px ${COUNTRY_COLOR[name]}` }} />
            <div style={{ position: "absolute", top: name === "Colombia" ? -46 : -20, [right ? "left" : "right"]: 18, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", padding: "5px 12px 5px 6px", borderRadius: 10, background: "rgba(15,23,42,.8)", border: `1px solid ${COUNTRY_COLOR[name]}99`, fontFamily: INTER, fontWeight: 600, fontSize: 20, color: "#f8fafc", transform: `scale(${0.7 + 0.3 * p})` } as React.CSSProperties}>
              <Flag country={name} w={30} /> {L.countryName[name]}
            </div>
          </div>
        );
      })}

      {/* D · team members */}
      {MEMBERS.map((m, i) => {
        const p = prog(t, countryT[m.country] + (i > 0 && MEMBERS[i - 1].country === m.country ? 0.3 : 0), 0.5);
        const hl = Math.max(0, ...discT.map((dt, k) => (m.tags.includes(DISCIPLINES[k][2]) ? prog(t, dt, 0.25) * (1 - prog(t, dt + 0.9, 0.4)) : 0)));
        const col = i % 2, row = Math.floor(i / 2);
        const x0 = CARD.x0 + col * (CARD.w + CARD.gap), y0 = CARD.y0 + row * (CARD.h + CARD.gap);
        const x = lerp(x0, center.x - CARD.w / 2, converge), y = lerp(y0, center.y - CARD.h / 2, converge);
        const cc = COUNTRY_COLOR[m.country];
        return (
          <Glass key={m.name} tint={cc} rainbow={hl} style={{ left: x, top: y, width: CARD.w, height: CARD.h, padding: "14px 18px", boxSizing: "border-box", opacity: p * (1 - converge), transform: `translateX(${(1 - p) * 60}px) scale(${(1 - converge * 0.5) * (1 + hl * 0.03)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Flag country={m.country} w={38} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, color: "#f8fafc", whiteSpace: "nowrap" }}>{m.name}</div>
                <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 12.5, letterSpacing: 1.4, color: cc, textTransform: "uppercase" }}>{L.countryName[m.country]}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontFamily: INTER, fontSize: 15, lineHeight: 1.3, color: C.slate300 }}>{m.role}</div>
          </Glass>
        );
      })}
      {/* disciplines named by the voice-over */}
      <div style={{ position: "absolute", left: CARD.x0, width: CARD.w * 2 + CARD.gap, top: CARD.y0 + 3 * (CARD.h + CARD.gap) + 14, display: "flex", flexWrap: "wrap", gap: 10, opacity: 1 - converge }}>
        {DISCIPLINES.map(([label], k) => {
          const p = prog(t, discT[k], 0.35);
          return (
            <span key={label} style={{ padding: "8px 16px", borderRadius: 99, border: `1px solid ${SPECTRUM[k % 5]}`, background: `${SPECTRUM[k % 5]}${p > 0.5 ? "33" : "11"}`, fontFamily: INTER, fontWeight: 600, fontSize: 18, color: "#f1f5f9", opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>{label}</span>
          );
        })}
      </div>
      <Title p={prog(t, tTeam, 0.6) * (1 - prog(t, tOne - 0.3, 0.4))} y={84} size={50} style={{ left: CARD.x0 - 40, right: 40, textAlign: "left" }}>
        {L.t.teamTitle}
      </Title>

      {/* E · one team, one vision */}
      <Prism cx={960} cy={560} size={keys(t, [[tOne, 120], [tOne + 1.4, 260]])} inP={1} outP={prog(t, tOne + 1.0, 1.0)} outLen={900} spread={40} opacity={converge} pulse={converge} />
      <Title p={prog(t, tVisionEnd - 1.6, 0.7)} y={150} size={64}>
        {L.t.oneTeam}
      </Title>

      <Sfx at={tVision} name="shimmer" vol={0.35} />
      <Sfx at={tIA} name="pop" vol={0.35} />
      {pillarT.map((x, i) => <Sfx key={`p${i}`} at={x} name="click" vol={0.4} />)}
      <Sfx at={tRef - 0.2} name="whoosh" vol={0.35} />
      {ORDER.map((c) => <Sfx key={c} at={countryT[c]} name="pop" vol={0.4} />)}
      {discT.map((x, i) => <Sfx key={`r${i}`} at={x} name="click" vol={0.3} />)}
      <Sfx at={tOne} name="rise" vol={0.35} />
      <Sfx at={tOne + 1.2} name="shimmer" vol={0.4} />
    </AbsoluteFill>
  );
};
