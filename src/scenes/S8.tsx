import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background, Doc, Logo, Sfx } from "../fx";
import {prog, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER, SPECTRUM } from "../theme";
import { Flag, TEAM } from "../fx/team";

// Closing: "This is NuevaMente" + credits
const PRE = scenePre("s8");
const v = (c: Cue) => PRE + cueAt("v8", c);

export const S8: React.FC = () => {
  const t = useT();
  const f = useCurrentFrame();
  const tEsto = v(cue("s8This"));
  const ring = prog(t, 0.3, tEsto - 0.6, (x) => x);
  const docOut = prog(t, tEsto - 0.3, 0.4);
  const flash = prog(t, tEsto - 0.15, 0.15) * (1 - prog(t, tEsto, 0.6));
  const tag = prog(t, tEsto + 2.4, 0.8);
  const cred = prog(t, tEsto + L.creditsDelay, 1.2);
  const R = 170;
  const circ = 2 * Math.PI * R;

  return (
    <AbsoluteFill>
      <Background hue="#1d4ed8" grid={false} />
      {/* the manual: this time with a clear starting point */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - docOut, transform: `scale(${1 + docOut * 0.4})` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="s8r" x1="0" x2="1" y1="0" y2="1">{SPECTRUM.map((c, i) => <stop key={i} offset={i / 4} stopColor={c} />)}</linearGradient>
            <filter id="s8b"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          <circle cx={960} cy={500} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={6} />
          <circle cx={960} cy={500} r={R} fill="none" stroke="url(#s8r)" strokeWidth={6} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} strokeLinecap="round" transform={`rotate(-90 960 500)`} filter="url(#s8b)" />
          <circle cx={960} cy={500} r={R} fill="none" stroke="url(#s8r)" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} strokeLinecap="round" transform={`rotate(-90 960 500)`} />
        </svg>
        <Doc x={960} y={500} w={130} glow={0.5 + ring * 0.5} rot={Math.sin(f / 30) * 2} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.5 }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 440px", transform: `translateY(${-270 * cred}px) scale(${1 - 0.45 * cred})` }}>
      {t >= tEsto - 0.1 && <Logo x={960} y={440} scale={1.25} p={prog(t, tEsto - 0.1, 2.4, (x) => x)} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: INTER, fontSize: 34, fontWeight: 500, color: C.slate300, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)`, letterSpacing: 0.2 }}>
        {L.t.tagline}
      </div>
      </div>
      <Credits t={t} t0={tEsto + L.creditsDelay + 0.4} />
      <Sfx at={0.3} name="rise" vol={0.2} />
      <Sfx at={tEsto - 0.1} name="boom" vol={0.45} />
      <Sfx at={tEsto} name="shimmer" vol={0.5} />
      <Sfx at={tEsto + 2.4} name="ding" vol={0.25} />
      <Sfx at={tEsto + L.creditsDelay} name="whoosh" vol={0.25} />
    </AbsoluteFill>
  );
};

// Credits: G10-LATAM team and audiovisual credits
const Credits: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const head = prog(t, t0, 0.6);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.slate200, opacity: head }}>
        {L.t.creditsTeam}
      </div>
      {TEAM.map((m, i) => {
        const p = prog(t, t0 + 0.4 + i * 0.18, 0.6);
        const col = i % 3, row = Math.floor(i / 3);
        return (
          <div key={m.name} style={{ position: "absolute", left: 130 + col * 560, top: 510 + row * 130, width: 540, padding: "16px 20px", boxSizing: "border-box", borderRadius: 16, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.10)", opacity: p, transform: `translateY(${(1 - p) * 20}px)`, fontFamily: INTER }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Flag country={m.country} w={30} />
              <span style={{ fontWeight: 700, fontSize: 21, color: "#f8fafc", whiteSpace: "nowrap" }}>{m.name}</span>
              <span style={{ fontSize: 15, color: C.slate400 }}>— {L.countryName[m.country]}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 15.5, color: C.slate300 }}>{m.role}</div>
            <div style={{ marginTop: 4, fontSize: 14.5, color: C.mente2 }}>{m.email}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: INTER, opacity: prog(t, t0 + 2.0, 0.8) }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: C.slate500 }}>{L.t.creditsLabel}</div>
        <div style={{ marginTop: 8, fontSize: 18, color: C.slate300 }}>{L.t.creditsRole}</div>
        <div style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: "#f8fafc" }}>Martin Morfe .°. · <span style={{ background: `linear-gradient(90deg, ${SPECTRUM.join(",")})`, WebkitBackgroundClip: "text", color: "transparent" }}>morfe.studio</span></div>
        <div style={{ marginTop: 6, fontSize: 15, color: C.slate500 }}>{L.t.creditsDate}</div>
      </div>
    </>
  );
};
