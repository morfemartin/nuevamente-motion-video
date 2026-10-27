import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FileText, Scissors, Search, SlidersHorizontal, Braces, GraduationCap } from "lucide-react";
import { Background, Doc, Glass, Grad, RainbowText, Sfx, Title } from "../fx";
import {prog, useT } from "../lib";
import { cue, cueAt, cues, type Cue } from "../sync";
import { L } from "../locale";
import { scenePre } from "../timeline";
import { C, INTER, SPECTRUM } from "../theme";

// How it works: from the source to the learning experience without losing context
const PRE = scenePre("s3");
const v = (c: Cue) => PRE + cueAt("v3", c);

const NX = [210, 560, 910, 1260, 1610];
const NY = 520;
const NODE = 250;

const JSON_LINES = L.t.s3Json;

export const S3: React.FC = () => {
  const t = useT();
  const f = useCurrentFrame();
  const T = cues("s3Steps").map(v);
  const tExp = v(cue("s3Exp"));
  const tEnd = v(cue("s3End"));
  const LABELS = L.t.s3Labels;
  const ICONS = [FileText, Scissors, Search, SlidersHorizontal, Braces];
  const travel = prog(t, tExp, 2.2, (x) => x);
  const pullOut = prog(t, tEnd - 0.3, 0.9);

  return (
    <AbsoluteFill>
      <Background hue="#312e81" />
      <Title p={prog(t, 0.2, 0.7) * (1 - prog(t, T[0] - 0.3, 0.4))} y={130} size={60}>
        {L.t.s3Title}
      </Title>

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - pullOut * 0.12}) translateY(${pullOut * 40}px)`, opacity: 1 - pullOut * 0.35 }}>
        {/* connector line between pipeline nodes */}
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="s3l" x1="0" x2="1">
              {SPECTRUM.map((c, i) => <stop key={i} offset={i / (SPECTRUM.length - 1)} stopColor={c} />)}
            </linearGradient>
            <filter id="s3g"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          {NX.slice(0, -1).map((x, i) => {
            const p = prog(t, T[i + 1] - 0.5, 0.6);
            const x0 = x + NODE / 2, x1 = NX[i + 1] - NODE / 2;
            return <line key={i} x1={x0} y1={NY} x2={x0 + (x1 - x0) * p} y2={NY} stroke="rgba(255,255,255,.35)" strokeWidth={3} strokeDasharray="8 10" strokeDashoffset={-f * 1.5} />;
          })}
          {/* light pulse travelling through the whole pipeline */}
          {travel > 0 && travel < 1 && (
            <circle cx={NX[0] + (1820 - NX[0]) * travel} cy={NY} r={18} fill="#fff" filter="url(#s3g)" />
          )}
          <line x1={NX[0]} y1={NY} x2={NX[0] + (1820 - NX[0]) * travel} y2={NY} stroke="url(#s3l)" strokeWidth={6} opacity={0.9} filter="url(#s3g)" />
          <line x1={NX[0]} y1={NY} x2={NX[0] + (1820 - NX[0]) * travel} y2={NY} stroke="url(#s3l)" strokeWidth={3} />
        </svg>

        {NX.map((x, i) => {
          const p = prog(t, T[i], 0.6);
          const Icon = ICONS[i];
          const lit = travel * 5 > i ? 1 : 0;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
              <Glass rainbow={lit * 0.8} style={{ left: x - NODE / 2, top: NY - NODE / 2, width: NODE, height: NODE, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 18, left: 18, width: 44, height: 44, borderRadius: 12, background: `${C.brand600}55`, border: `1px solid ${C.brand400}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={24} color={C.brand400} />
                </div>
                <NodeBody i={i} t={t} t0={T[i]} />
              </Glass>
              <div style={{ position: "absolute", left: x - 170, width: 340, top: NY + NODE / 2 + 22, textAlign: "center", fontFamily: INTER, fontSize: 24, fontWeight: 600, color: C.slate200 }}>{LABELS[i]}</div>
            </div>
          );
        })}

        {/* destination: the learning experience */}
        {(() => {
          const p = prog(t, tExp + 1.6, 0.6);
          return (
            <div style={{ position: "absolute", left: 1790, top: NY - 50, width: 100, height: 100, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle, ${C.mente2}55, transparent 70%)`, opacity: p, transform: `scale(${0.5 + p * 0.5})` }}>
              <GraduationCap size={56} color="#fff" />
            </div>
          );
        })()}
      </div>

      <Title p={prog(t, tEnd - 1.4, 0.8)} y={130} size={62}>
        {L.t.s3End}
      </Title>

      {T.map((x, i) => <Sfx key={i} at={x} name="pop" vol={0.35} />)}
      <Sfx at={T[1] + 0.2} name="click" vol={0.4} />
      <Sfx at={tExp} name="rise" vol={0.3} />
      <Sfx at={tExp + 1.6} name="ding" vol={0.35} />
      <Sfx at={tEnd - 1.4} name="shimmer" vol={0.3} />
    </AbsoluteFill>
  );
};

const NodeBody: React.FC<{ i: number; t: number; t0: number }> = ({ i, t, t0 }) => {
  const cx = NODE / 2, cy = NODE / 2 + 16;
  if (i === 0) return <Doc x={cx} y={cy} w={92} glow={0.5} />;
  if (i === 1) {
    // the document splits into chunks
    return (
      <>
        {Array.from({ length: 6 }).map((_, k) => {
          const p = prog(t, t0 + 0.2 + k * 0.08, 0.5);
          const col = k % 2, row = Math.floor(k / 2);
          const x = cx - 50 + col * 60, y = cy - 50 + row * 38;
          return <div key={k} style={{ position: "absolute", left: cx - 25 + (x - cx + 25) * p, top: cy - 15 + (y - cy + 15) * p, width: 52, height: 28, borderRadius: 6, background: "rgba(226,232,240,.85)", boxShadow: `0 0 ${12 * p}px ${C.brand400}` }} />;
        })}
      </>
    );
  }
  if (i === 2) {
    // vector space: the nearest points to the query light up
    const pts = Array.from({ length: 22 }).map((_, k) => [30 + ((k * 73) % 190), 70 + ((k * 47) % 150)]);
    const q = [cx, cy + 10];
    const lit = prog(t, t0 + 0.8, 0.8);
    return (
      <svg width={NODE} height={NODE} style={{ position: "absolute" }}>
        {pts.map(([x, y], k) => {
          const d = Math.hypot(x - q[0], y - q[1]);
          const near = d < 62;
          return (
            <g key={k}>
              {near && <line x1={q[0]} y1={q[1]} x2={q[0] + (x - q[0]) * lit} y2={q[1] + (y - q[1]) * lit} stroke={C.mente2} strokeWidth={1.5} />}
              <circle cx={x} cy={y} r={near ? 5 : 3.5} fill={near && lit > 0.5 ? C.mente2 : "rgba(203,213,225,.6)"} opacity={prog(t, t0 + k * 0.02, 0.3)} />
            </g>
          );
        })}
        <circle cx={q[0]} cy={q[1]} r={8} fill="#fff" />
      </svg>
    );
  }
  if (i === 3) {
    const chips = L.t.s3Chips.map((label, k) => [label, [C.junior, C.engineer, C.manager][k]]);
    return (
      <>
        {chips.map(([label, color], k) => {
          const p = prog(t, t0 + 0.4 + k * 0.45, 0.5);
          return (
            <div key={k} style={{ position: "absolute", left: 40, right: 40, top: 80 + k * 50, height: 40, borderRadius: 20, border: `1.5px solid ${color}`, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 600, fontSize: 20, color: "#f1f5f9", opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
              {label}
            </div>
          );
        })}
      </>
    );
  }
  // i === 4: structured JSON being typed
  const chars = Math.floor(prog(t, t0 + 0.2, 2.2, (x) => x) * JSON_LINES.join("\n").length);
  let left = chars;
  return (
    <div style={{ position: "absolute", left: 22, top: 74, fontFamily: "Menlo, monospace", fontSize: 13.5, lineHeight: 1.6, color: C.slate300, whiteSpace: "pre" }}>
      {JSON_LINES.map((l, k) => {
        const s = l.slice(0, Math.max(0, left));
        left -= l.length + 1;
        return <div key={k} style={{ color: s.includes('"') ? C.brand400 : C.slate300 }}>{s || " "}</div>;
      })}
    </div>
  );
};
