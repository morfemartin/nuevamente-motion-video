import React from "react";
import { Clock } from "lucide-react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background, Doc, Grad, Person, Prism, RainbowText, Sfx, Title } from "../fx";
import {keys, lerp, prog, useT } from "../lib";
import { cue, cueAt, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER } from "../theme";

// Recap: from the hero to anyone learning
const PRE = scenePre("s7");
const v = (c: Cue) => PRE + cueAt("v7", c);

const PEOPLE = [
  { x: 560, color: C.junior },
  { x: 960, color: C.engineer },
  { x: 1360, color: C.manager },
];

export const S7: React.FC = () => {
  const t = useT();
  const f = useCurrentFrame();
  const tConv = v(cue("s7Conv"));
  const tMeta = v(cue("s7Meta"));
  const tBeat = v(cue("s7Beat"));
  const tAny = v(cue("s7Any"));
  const tLink = v(cue("s7Link"));

  const a = 1 - prog(t, tMeta - 0.3, 0.6); // hero + prism phase
  const conv = prog(t, tConv, 1.2);
  const meta = prog(t, tMeta, 0.6) * (1 - prog(t, tAny - 0.4, 0.5));
  const d = prog(t, tAny - 0.2, 0.8);
  const link = prog(t, tLink, 1.2);
  const src = { x: 960, y: 230 };

  return (
    <AbsoluteFill>
      <Background hue="#6d28d9" />

      {/* A · the hero from the opening, now with NuevaMente */}
      <div style={{ position: "absolute", inset: 0, opacity: a }}>
        <Prism cx={960} cy={540} size={220} inP={conv} outP={prog(t, tConv + 0.9, 1.0)} outLen={420} spread={26} inAngle={8} opacity={prog(t, tConv - 0.3, 0.4)} />
        <Doc x={keys(t, [[0, 520], [tConv, 520], [tConv + 1, 420]])} y={keys(t, [[0, 500], [tConv, 500], [tConv + 1, 470]])} w={120} glow={0.4 + conv * 0.6} label={L.t.manual} />
        <Person x={keys(t, [[0, 1100], [tConv, 1100], [tConv + 1, 1420]])} y={600} scale={1.1} mood={keys(t, [[tConv + 1.2, -0.7], [tConv + 2, 1]])} glow={conv} color={conv > 0.5 ? C.mente2 : "#e2e8f0"} look={-0.6} />
        <div style={{ position: "absolute", left: keys(t, [[0, 1100], [tConv, 1100], [tConv + 1, 1420]]) - 90, width: 180, top: 760, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "#f8fafc", textShadow: `0 0 24px ${C.brand500}`, opacity: prog(t, 0.6, 0.5) }}>{L.heroName}</div>
      </div>

      {/* C · the goal. "hours": crossing out the hours spent figuring out where to begin (EN);
          "beyond": the goal goes beyond one person, many people appear around the hero (ES) */}
      <div style={{ position: "absolute", inset: 0, opacity: meta }}>
        {L.s7Variant === "hours" ? (
          <>
            <Title p={1} y={250} size={70}>{L.t.goalTitle}</Title>
            <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: prog(t, tBeat - 0.2, 0.5) }}>
              <Clock size={64} color={C.slate300} style={{ transform: `rotate(${f * 6}deg)` }} />
              <div style={{ position: "relative", fontFamily: INTER, fontSize: 52, fontWeight: 600, color: C.slate300 }}>
                {L.t.goalHours}
                <div style={{ position: "absolute", left: -10, top: "52%", height: 6, width: `${prog(t, tBeat + 1.2, 0.6) * 104}%`, borderRadius: 3, background: `linear-gradient(90deg, ${C.orange}, ${C.accent400})` }} />
              </div>
            </div>
          </>
        ) : (
          <>
            <Title p={1} y={170} size={64}>{L.t.goalTitle}</Title>
            <Person x={960} y={620} scale={0.9} color={C.mente2} mood={1} glow={1} />
            {Array.from({ length: 16 }).map((_, k) => {
              const ang = (k / 16) * Math.PI * 2;
              const r = 260 + (k % 2) * 90;
              const p = prog(t, tBeat - 0.4 + k * 0.06, 0.5);
              return <Person key={k} x={960 + Math.cos(ang) * r * 1.6 * p} y={620 + Math.sin(ang) * r * 0.7 * p} scale={0.42} color={["#7aa7ff", "#f472b6", "#fbbf77", "#22d3a0"][k % 4]} mood={0.6} opacity={p * 0.85} />;
            })}
          </>
        )}
      </div>

      {/* D · anyone, from the first document, without losing the source */}
      <div style={{ position: "absolute", inset: 0, opacity: d }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <defs><filter id="s7b"><feGaussianBlur stdDeviation="14" /></filter></defs>
          {PEOPLE.map((p, i) => {
            const b = prog(t, tAny + 0.3 + i * 0.35, 0.8);
            const ex = lerp(src.x, p.x, b), ey = lerp(src.y + 60, 640, b);
            return (
              <g key={i}>
                <polygon points={`${src.x - 10},${src.y + 60} ${src.x + 10},${src.y + 60} ${ex + 90},${ey} ${ex - 90},${ey}`} fill={p.color} opacity={0.22} filter="url(#s7b)" />
                <line x1={src.x} y1={src.y + 60} x2={ex} y2={ey} stroke={p.color} strokeWidth={3} opacity={0.8} />
                {/* golden link back to the source */}
                <path d={`M${p.x} 700 Q${(p.x + src.x) / 2 + (i - 1) * 160} 420 ${src.x} ${src.y + 40}`} fill="none" stroke={C.yellow} strokeWidth={2.5} strokeDasharray="8 10" strokeDashoffset={-f * 1.2} opacity={link * 0.9} />
              </g>
            );
          })}
        </svg>
        <Doc x={src.x} y={src.y} w={100} glow={1} color={link > 0 ? C.yellow : "#fff"} />
        {PEOPLE.map((p, i) => (
          <Person key={i} x={p.x} y={740} scale={0.85} color={p.color} mood={prog(t, tAny + 0.8 + i * 0.35, 0.5)} glow={prog(t, tAny + 0.8 + i * 0.35, 0.5)} opacity={prog(t, tAny + i * 0.2, 0.5)} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: INTER, fontSize: 30, fontWeight: 600, color: C.yellow, opacity: link }}>
          <RainbowText>{L.t.linked}</RainbowText>
        </div>
      </div>

      <Sfx at={0.2} name="pop" vol={0.3} />
      <Sfx at={tConv} name="whoosh" vol={0.35} />
      <Sfx at={tConv + 0.9} name="shimmer" vol={0.4} />
      <Sfx at={tMeta} name="boom" vol={0.3} />
      <Sfx at={L.s7Variant === "hours" ? tBeat + 1.2 : tBeat - 0.4} name="whoosh" vol={0.3} />
      {PEOPLE.map((_, i) => <Sfx key={i} at={tAny + 0.8 + i * 0.35} name="pop" vol={0.35} />)}
      <Sfx at={tLink} name="ding" vol={0.35} />
    </AbsoluteFill>
  );
};
