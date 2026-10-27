import React from "react";
import { AbsoluteFill } from "remotion";
import { ShieldCheck } from "lucide-react";
import { Background, Doc, Glass, Grad, Person, Sfx, Title } from "../fx";
import {keys, prog, useSpring, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER } from "../theme";

// The problem: the new hire, surrounded by documentation
const PRE = scenePre("s1");
const v = (c: Cue) => PRE + cueAt("v1", c);

const DOCS = [
  { label: L.t.s1Docs[0], x: 470, y: 330, r: -8 },
  { label: L.t.s1Docs[1], x: 1450, y: 330, r: 7 },
  { label: L.t.s1Docs[2], x: 380, y: 640, r: 6 },
  { label: L.t.s1Docs[3], x: 1540, y: 640, r: -6 },
  { label: L.t.s1Docs[4], x: 640, y: 180, r: 4 },
  { label: L.t.s1Docs[5], x: 1280, y: 180, r: -4 },
];

export const S1: React.FC = () => {
  const t = useT();
  const tPerson = 1.2;
  const tName = v(cue("s1Name"));
  const tBadge = v(cue("s1Badge"));
  const tDocs = v(cue("s1Docs"));
  const tNoise = v(cue("s1Noise"));
  const tTitle = v(cue("s1Title"));
  const sp = useSpring(tPerson, { damping: 13, mass: 0.9 });
  const spot = prog(t, 0.2, 1.4);
  const noise = prog(t, tNoise, 2.2);
  const confused = keys(t, [[tNoise, 0], [tNoise + 1, -1]]);
  const look = Math.sin(t * 1.4) * (t > tDocs ? 1 : 0.2);
  const title = prog(t, tTitle, 0.8);

  return (
    <AbsoluteFill>
      <Background hue="#1d4ed8" />
      {/* spotlight from above */}
      <div
        style={{
          position: "absolute", left: 960 - 520, top: -80, width: 1040, height: 1000, opacity: spot * 0.55,
          background: "linear-gradient(180deg, rgba(165,180,252,.45), rgba(165,180,252,0) 85%)",
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", filter: "blur(20px)",
        }}
      />
      <div style={{ position: "absolute", left: 760, top: 830, width: 400, height: 60, borderRadius: "50%", background: "rgba(199,210,254,.35)", filter: "blur(18px)", opacity: spot }} />

      {/* documents fly in, then turn into noise */}
      {DOCS.map((d, i) => {
        const p = prog(t, tDocs + i * 0.35, 0.7);
        const fx = 960 + (d.x - 960) * (0.4 + 0.6 * p);
        const fy = 560 + (d.y - 560) * (0.4 + 0.6 * p);
        const jitter = noise * Math.sin(t * 7 + i * 2) * 10;
        return (
          <Doc key={i} x={fx + jitter} y={fy + jitter * 0.6} w={110} rot={d.r + noise * (i % 2 ? 14 : -14)} opacity={p * (1 - noise * 0.55)} label={d.label} glow={p * (1 - noise)} blur={noise * 4} />
        );
      })}
      {/* noise pile: more and more documents */}
      {Array.from({ length: 26 }).map((_, i) => {
        const p = prog(t, tNoise + 0.3 + i * 0.07, 0.5);
        const ang = (i / 26) * Math.PI * 2 + t * 0.15;
        const rad = 330 + (i % 3) * 90;
        return <Doc key={`n${i}`} x={960 + Math.cos(ang) * rad * 1.5} y={540 + Math.sin(ang) * rad * 0.75} w={60} rot={i * 23} opacity={p * 0.35} blur={2 + (i % 3) * 2} />;
      })}

      {/* the hero */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - sp) * 120}px)`, opacity: Math.min(1, sp * 1.4) }}>
        <Person x={960} y={640} scale={1.25} mood={confused} look={look} glow={0.4} />
      </div>
      {/* question mark */}
      <div
        style={{
          position: "absolute", left: 1040, top: 380, fontFamily: INTER, fontWeight: 800, fontSize: 90, color: C.brand400,
          opacity: prog(t, tNoise + 0.8, 0.5), transform: `scale(${0.6 + 0.4 * prog(t, tNoise + 0.8, 0.5) + Math.sin(t * 4) * 0.04}) rotate(12deg)`,
          textShadow: `0 0 30px ${C.brand500}`,
        }}
      >
        ?
      </div>

      {/* hero name */}
      <div style={{ position: "absolute", left: 960 - 90, width: 180, top: 800, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: 34, letterSpacing: 1, color: "#f8fafc", opacity: prog(t, tName, 0.5) * (1 - noise * 0.4), transform: `translateY(${(1 - prog(t, tName, 0.5)) * 12}px)`, textShadow: `0 0 24px ${C.brand500}` }}>
        {L.heroName}
      </div>
      {/* team badge */}
      <Glass rainbow={0.6} style={{ left: 960 - 250, top: 880, width: 500, height: 64, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: prog(t, tBadge, 0.5) * (1 - prog(t, tDocs + 2, 0.6)), transform: `scale(${0.9 + 0.1 * prog(t, tBadge, 0.5)})` }}>
        <ShieldCheck size={30} color={C.mente2} />
        <span style={{ fontFamily: INTER, fontSize: 26, fontWeight: 600, color: C.slate200 }}>{L.t.s1Badge}</span>
      </Glass>

      <Title p={title} y={70} size={60}>
        {L.t.s1Title}
      </Title>

      <Sfx at={tPerson + 0.1} name="pop" vol={0.45} />
      <Sfx at={tName} name="pop" vol={0.35} />
      <Sfx at={tBadge} name="click" vol={0.5} />
      {DOCS.map((_, i) => <Sfx key={i} at={tDocs + i * 0.35} name="whoosh" vol={0.18} />)}
      <Sfx at={tNoise + 0.2} name="rise" vol={0.25} />
      <Sfx at={tTitle} name="boom" vol={0.35} />
    </AbsoluteFill>
  );
};
