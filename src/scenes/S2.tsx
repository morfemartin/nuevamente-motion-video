import React from "react";
import { AbsoluteFill } from "remotion";
import { BookOpen, Wrench, BarChart3 } from "lucide-react";
import { Background, Doc, Glass, Grad, Person, RainbowText, Sfx, Title } from "../fx";
import {prog, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER } from "../theme";

// Same document, three people, three needs (pitch deck slide 6)
const PRE = scenePre("s2");
const v = (c: Cue) => PRE + cueAt("v2", c);

const ROLES = [
  { ...L.t.s2Roles[0], color: C.junior, Icon: BookOpen, key: cues("s2Roles")[0] },
  { ...L.t.s2Roles[1], color: C.engineer, Icon: Wrench, key: cues("s2Roles")[1] },
  { ...L.t.s2Roles[2], color: C.manager, Icon: BarChart3, key: cues("s2Roles")[2] },
];
const CX = [380, 960, 1540];
const CARD_W = 500, CARD_TOP = 380, CARD_H = 520;
const DOC = { x: 960, y: 150 };

const Typed: React.FC<{ text: string; p: number }> = ({ text, p }) => {
  const n = Math.floor(text.length * p);
  return (
    <>
      {text.slice(0, n)}
      <span style={{ opacity: p > 0 && p < 1 ? 1 : 0, color: C.brand400 }}>▍</span>
    </>
  );
};

export const S2: React.FC = () => {
  const t = useT();
  const tDoc = v(cue("s2Doc"));
  const tPeople = v(cue("s2People"));
  const roleT = ROLES.map((r) => v(r.key));
  const tSame = v(cue("s2Same"));
  const tWhy = v(cue("s2Why"));
  const dim = prog(t, tSame - 0.2, 0.6);
  const docP = prog(t, 0.2, 0.8);

  return (
    <AbsoluteFill>
      <Background hue="#4338ca" />
      {/* light cones from the document to each card */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <filter id="s2b"><feGaussianBlur stdDeviation="18" /></filter>
          {ROLES.map((r, i) => (
            <linearGradient key={i} id={`s2c${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.85} />
              <stop offset="0.5" stopColor={r.color} stopOpacity={0.45} />
              <stop offset="1" stopColor={r.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {ROLES.map((r, i) => {
          const p = prog(t, roleT[i] - 0.3, 0.7) * (1 - dim * 0.6);
          const tx = CX[i];
          const ty = DOC.y + 60 + (CARD_TOP + 300 - DOC.y) * prog(t, roleT[i] - 0.3, 0.7);
          return (
            <polygon key={i} points={`${DOC.x - 12},${DOC.y + 60} ${DOC.x + 12},${DOC.y + 60} ${tx + 190},${ty} ${tx - 190},${ty}`} fill={`url(#s2c${i})`} opacity={p * 0.75} filter="url(#s2b)" />
          );
        })}
      </svg>

      <Doc x={DOC.x} y={DOC.y} w={96} glow={docP} opacity={docP} />

      {ROLES.map((r, i) => {
        const appear = prog(t, tPeople + i * 0.25, 0.7);
        const act = prog(t, roleT[i], 0.6);
        const typed = prog(t, roleT[i] + 0.5, 2.6, (x) => x);
        const o = appear * (0.35 + 0.65 * act) * (1 - dim * 0.7);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - appear) * 50}px)` }}>
            <Glass tint={act > 0 ? r.color : undefined} style={{ left: CX[i] - CARD_W / 2, top: CARD_TOP, width: CARD_W, height: CARD_H, borderColor: `${r.color}${act > 0.5 ? "aa" : "33"}` }}>
              <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 74, borderRadius: 16, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <r.Icon size={30} color={r.color} />
                <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 32, color: "#f1f5f9" }}>{r.name}</span>
              </div>
              <div style={{ position: "absolute", top: 330, left: 40, right: 40, textAlign: "center", fontFamily: INTER }}>
                <div style={{ fontWeight: 700, fontSize: 26, color: C.slate200, marginBottom: 8 }}>{L.t.s2Need}</div>
                <div style={{ fontSize: 27, lineHeight: 1.35, color: C.slate300, minHeight: 110 }}>
                  <Typed text={r.need} p={typed} />
                </div>
              </div>
            </Glass>
            <Person x={CX[i]} y={CARD_TOP + 215} scale={0.62} color={r.color} mood={act * 0.6} glow={act * 0.6} />
          </div>
        );
      })}

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(2,6,23,.85) 0%, rgba(2,6,23,0) 60%)", opacity: dim }} />
      <Title p={prog(t, tSame, 0.7) * (1 - prog(t, tWhy - 0.4, 0.4))} y={560} size={76}>
        {L.t.s2Same}
      </Title>
      <Title p={prog(t, tWhy, 0.7)} y={560} size={76}>
        {L.t.s2Why}
      </Title>

      <Sfx at={0.2} name="shimmer" vol={0.3} />
      {ROLES.map((_, i) => <Sfx key={i} at={roleT[i]} name="pop" vol={0.4} />)}
      {ROLES.map((_, i) => <Sfx key={`k${i}`} at={roleT[i] + 0.5} name="key" vol={0.15} />)}
      <Sfx at={tSame} name="whoosh" vol={0.3} />
      <Sfx at={tWhy} name="boom" vol={0.35} />
    </AbsoluteFill>
  );
};
