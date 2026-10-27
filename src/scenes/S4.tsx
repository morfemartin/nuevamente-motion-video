import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, Doc, Glass, Logo, Prism, RainbowText, Sfx, Title } from "../fx";
import {prog, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER } from "../theme";

// "That's why we built NuevaMente": logo reveal, then the prism from pitch deck slide 9
const PRE = scenePre("s4");
const v = (c: Cue) => PRE + cueAt("v4", c);

const TAGS = [
  { text: L.t.s4Tags[0], color: C.blue, y: 455 },
  { text: L.t.s4Tags[1], color: C.engineer, y: 600 },
  { text: L.t.s4Tags[2], color: C.manager, y: 745 },
];

export const S4: React.FC = () => {
  const t = useT();
  const tLogo = 0.1;
  const tDoc = v(cue("s4Doc"));
  const tTrans = v(cue("s4Trans"));
  const tAdapt = v(cue("s4Adapt"));
  const tSame = v(cue("s4Same"));
  const tChange = v(cue("s4Change"));
  const logoOut = prog(t, tDoc - 0.4, 0.6);
  const logoP = prog(t, tLogo, 2.2, (x) => x);
  const scene = prog(t, tDoc - 0.1, 0.6);
  const inP = prog(t, tDoc + 0.2, 1.4);
  const outP = prog(t, tTrans, 1.6);

  return (
    <AbsoluteFill>
      <Background hue="#1e40af" grid={false} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - logoOut, transform: `scale(${1 + logoOut * 0.3})` }}>
        <Logo x={960} y={430} scale={1.15} p={logoP} />
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: scene }}>
        {/* warm light coming from the left */}
        <div style={{ position: "absolute", left: -300, top: 200, width: 1000, height: 600, background: "rgba(255,255,255,.08)", filter: "blur(120px)", opacity: inP }} />
        <Prism cx={960} cy={610} size={360} inP={inP} outP={outP} outLen={1100} spread={30} inAngle={14} colors={[C.blue, C.violet, C.engineer, C.manager, C.yellow]} pulse={outP} />
        {/* the document travels with the beam */}
        <Doc x={180 + 560 * inP} y={360 + 140 * inP} w={86} glow={1} opacity={(1 - prog(t, tDoc + 1.3, 0.3)) * prog(t, tDoc, 0.3)} rot={-8} />
        <Glass style={{ left: 200, top: 300, padding: "12px 22px", opacity: prog(t, tDoc + 0.3, 0.5) }}>
          <span style={{ fontFamily: INTER, fontSize: 26, color: C.slate200 }}>{L.t.s4Orig}</span>
        </Glass>
        <Glass style={{ left: 1320, top: 300, padding: "12px 22px", opacity: prog(t, tTrans + 0.4, 0.5) }}>
          <span style={{ fontFamily: INTER, fontSize: 26, color: C.slate200 }}>{L.t.s4Exp}</span>
        </Glass>
        {TAGS.map((g, i) => {
          const p = prog(t, tAdapt + i * 0.55, 0.5);
          return (
            <Glass key={i} rainbow={0} tint={g.color} style={{ left: 1500, top: g.y, padding: "14px 28px", opacity: p, transform: `translateX(${(1 - p) * 60}px) rotate(${-4 + i * 4}deg)` }}>
              <span style={{ fontFamily: INTER, fontSize: 30, fontWeight: 600, color: "#f8fafc" }}>{g.text}</span>
            </Glass>
          );
        })}
        <Title p={prog(t, tSame, 0.6)} y={110} size={60}>
          {L.t.s4Title1}<span style={{ opacity: prog(t, tChange, 0.6) }}><RainbowText>{L.t.s4Title2}</RainbowText></span>
        </Title>
      </div>

      <Sfx at={tLogo} name="shimmer" vol={0.45} />
      <Sfx at={tLogo + 0.9} name="boom" vol={0.3} />
      <Sfx at={tDoc + 0.2} name="whoosh" vol={0.35} />
      <Sfx at={tTrans} name="shimmer" vol={0.4} />
      {TAGS.map((_, i) => <Sfx key={i} at={tAdapt + i * 0.55} name="pop" vol={0.3} />)}
      <Sfx at={tChange} name="ding" vol={0.3} />
    </AbsoluteFill>
  );
};
