import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, INTER, OUTFIT, SPECTRUM } from "../theme";
import { FPS, lerp, prog } from "../lib";

// ── Background: deep gradient, faint grid, breathing glows, vignette ─────

export const Background: React.FC<{ hue?: string; grid?: boolean }> = ({ hue = C.brand600, grid = true }) => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 90) * 60;
  const b = Math.cos(f / 110) * 50;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)` }}>
      <div style={{ position: "absolute", left: 300 + a, top: 120 + b, width: 900, height: 900, borderRadius: "50%", background: hue, opacity: 0.10, filter: "blur(160px)" }} />
      <div style={{ position: "absolute", right: 200 - a, bottom: -200 - b, width: 800, height: 800, borderRadius: "50%", background: C.accent500, opacity: 0.08, filter: "blur(160px)" }} />
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at 50% 50%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 20%, transparent 75%)",
          }}
        />
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};

// ── Liquid glass ─────────────────────────────────────────────────────────────

export const Glass: React.FC<{
  style?: React.CSSProperties;
  radius?: number;
  rainbow?: number; // 0..1 strength of the rainbow border
  tint?: string;
  children?: React.ReactNode;
}> = ({ style, radius = 22, rainbow = 0, tint, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: radius,
        background: tint
          ? `linear-gradient(160deg, ${tint}22, rgba(255,255,255,.03) 60%)`
          : "linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03) 60%)",
        border: "1px solid rgba(255,255,255,.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(255,255,255,.04), 0 30px 80px rgba(0,0,0,.45)",
        backdropFilter: "blur(18px)",
        ...style,
      }}
    >
      {rainbow > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: radius,
            padding: 1.6,
            background: `conic-gradient(from ${f * 2}deg, ${SPECTRUM.join(",")}, ${SPECTRUM[0]})`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: rainbow,
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </div>
  );
};

// ── Prism with incoming beam and dispersion ─────────────────────────────────────

export const Prism: React.FC<{
  cx: number;
  cy: number;
  size: number;
  inP?: number; // 0..1 incoming white beam
  outP?: number; // 0..1 dispersion
  outLen?: number;
  spread?: number; // degrees
  inAngle?: number; // incoming beam angle in degrees (positive = from top-left)
  colors?: string[];
  opacity?: number;
  pulse?: number;
}> = ({ cx, cy, size: s, inP = 1, outP = 1, outLen = 900, spread = 30, inAngle = 12, colors = SPECTRUM, opacity = 1, pulse = 0 }) => {
  const f = useCurrentFrame();
  const h = s * 0.866;
  const A = [cx, cy - h * 0.62];
  const BL = [cx - s / 2, cy + h * 0.38];
  const BR = [cx + s / 2, cy + h * 0.38];
  const L = [lerp(A[0], BL[0], 0.55), lerp(A[1], BL[1], 0.55)];
  const R = [lerp(A[0], BR[0], 0.5), lerp(A[1], BR[1], 0.5)];
  const ia = (inAngle * Math.PI) / 180;
  const inLen = 1400;
  const inStart = [L[0] - Math.cos(ia) * inLen, L[1] - Math.sin(ia) * inLen];
  const inHead = [lerp(inStart[0], L[0], inP), lerp(inStart[1], L[1], inP)];
  const id = `p${Math.round(cx)}${Math.round(cy)}`;
  const shimmer = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity, overflow: "visible" }}>
      <defs>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id={`${id}s`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.38} />
          <stop offset="0.5" stopColor="#c7d2fe" stopOpacity={0.10} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.22} />
        </linearGradient>
        <linearGradient id={`${id}in`} x1={inStart[0]} y1={inStart[1]} x2={L[0]} y2={L[1]} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        {colors.map((c, i) => {
          const ang = ((-spread / 2 + (spread * i) / Math.max(1, colors.length - 1)) * Math.PI) / 180;
          const E = [R[0] + Math.cos(ang) * outLen, R[1] + Math.sin(ang) * outLen];
          return (
            <linearGradient key={i} id={`${id}o${i}`} x1={R[0]} y1={R[1]} x2={E[0]} y2={E[1]} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={c} stopOpacity={1} />
              <stop offset="1" stopColor={c} stopOpacity={0} />
            </linearGradient>
          );
        })}
      </defs>
      {/* incoming beam */}
      {inP > 0 && (
        <g>
          <line x1={inStart[0]} y1={inStart[1]} x2={inHead[0]} y2={inHead[1]} stroke={`url(#${id}in)`} strokeWidth={s * 0.09} filter={`url(#${id}b)`} />
          <line x1={inStart[0]} y1={inStart[1]} x2={inHead[0]} y2={inHead[1]} stroke={`url(#${id}in)`} strokeWidth={s * 0.022} strokeLinecap="round" />
        </g>
      )}
      {/* dispersion */}
      {outP > 0 &&
        colors.map((c, i) => {
          const ang = ((-spread / 2 + (spread * i) / Math.max(1, colors.length - 1)) * Math.PI) / 180;
          const len = outLen * outP;
          const w0 = s * 0.012;
          const w1 = s * 0.06 + len * 0.025;
          const nx = -Math.sin(ang), ny = Math.cos(ang);
          const E = [R[0] + Math.cos(ang) * len, R[1] + Math.sin(ang) * len];
          const pts = [
            [R[0] + nx * w0, R[1] + ny * w0],
            [E[0] + nx * w1, E[1] + ny * w1],
            [E[0] - nx * w1, E[1] - ny * w1],
            [R[0] - nx * w0, R[1] - ny * w0],
          ].map((p) => p.join(",")).join(" ");
          return (
            <g key={i}>
              <polygon points={pts} fill={`url(#${id}o${i})`} filter={`url(#${id}b)`} opacity={0.9} />
              <polygon points={pts} fill={`url(#${id}o${i})`} opacity={0.55} />
            </g>
          );
        })}
      {/* glass body */}
      <polygon points={`${A} ${BL} ${BR}`} fill="#a5b4fc" opacity={0.10 + pulse * 0.2} filter={`url(#${id}b)`} />
      <polygon points={`${A} ${BL} ${BR}`} fill={`url(#${id}g)`} stroke="rgba(255,255,255,.75)" strokeWidth={Math.max(1.5, s * 0.008)} strokeLinejoin="round" />
      <polygon points={`${A} ${[lerp(BL[0], BR[0], 0.38), BL[1]]} ${BR}`} fill="rgba(255,255,255,.07)" />
      <line x1={A[0]} y1={A[1]} x2={lerp(BL[0], BR[0], 0.38)} y2={BL[1]} stroke="rgba(255,255,255,.35)" strokeWidth={1.2} />
      {inP >= 1 && <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke="#fff" strokeOpacity={0.5 + 0.3 * shimmer} strokeWidth={s * 0.02} filter={`url(#${id}s)`} />}
      {inP >= 1 && <circle cx={L[0]} cy={L[1]} r={s * 0.05} fill="#fff" opacity={0.85} filter={`url(#${id}s)`} />}
    </svg>
  );
};

// ── Simple vector character ───────────────────────────────────────────────

export const Person: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  mood?: number; // -1 confused · 0 neutral · 1 happy
  look?: number; // -1..1 gaze direction
  opacity?: number;
  glow?: number;
}> = ({ x, y, scale = 1, color = "#e2e8f0", mood = 0, look = 0, opacity = 1, glow = 0 }) => {
  const f = useCurrentFrame();
  const blink = f % 110 < 4 ? 0.15 : 1;
  const id = `pp${Math.round(x)}${Math.round(y)}`;
  const mouth = mood * 8;
  return (
    <svg width={260} height={300} viewBox="0 0 260 300" style={{ position: "absolute", left: x - 130 * scale, top: y - 150 * scale, width: 260 * scale, height: 300 * scale, opacity, overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}h`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor={color} stopOpacity={0.55} />
          <stop offset="1" stopColor={color} stopOpacity={0.15} />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="0.5" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity={0.85} />
          <stop offset="0.5" stopColor={color} stopOpacity={0.35} />
          <stop offset="1" stopColor={color} stopOpacity={0.02} />
        </radialGradient>
        <filter id={`${id}g`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
      </defs>
      {glow > 0 && <circle cx={130} cy={150} r={110} fill={color} opacity={glow * 0.5} filter={`url(#${id}g)`} />}
      <path d="M20 300 Q20 190 130 185 Q240 190 240 300 Z" fill={`url(#${id}b)`} />
      <circle cx={130} cy={105} r={62} fill={`url(#${id}h)`} />
      <g transform={`translate(${look * 8},0)`}>
        <ellipse cx={110} cy={104} rx={5} ry={7 * blink} fill="#0f172a" />
        <ellipse cx={150} cy={104} rx={5} ry={7 * blink} fill="#0f172a" />
        <path d={`M116 ${132 - mouth / 2} Q130 ${132 + mouth} 144 ${132 - mouth / 2}`} stroke="#0f172a" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {mood < -0.3 && <path d="M100 90 L118 82 M160 90 L142 82" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />}
      </g>
    </svg>
  );
};

// ── Document ────────────────────────────────────────────────────────────────

export const Doc: React.FC<{ x: number; y: number; w?: number; glow?: number; rot?: number; opacity?: number; label?: string; color?: string; blur?: number }> = ({
  x, y, w = 120, glow = 0, rot = 0, opacity = 1, label, color = "#fff", blur = 0,
}) => {
  const h = w * 1.3;
  const fold = w * 0.26;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, opacity, filter: blur ? `blur(${blur}px)` : undefined }}>
      {glow > 0 && <div style={{ position: "absolute", inset: -w * 0.3, borderRadius: "50%", background: color, opacity: glow * 0.35, filter: `blur(${w * 0.35}px)` }} />}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <linearGradient id={`dg${w}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.95} />
            <stop offset="1" stopColor="#cbd5e1" stopOpacity={0.75} />
          </linearGradient>
        </defs>
        <path d={`M8 0 H${w - fold} L${w} ${fold} V${h - 8} Q${w} ${h} ${w - 8} ${h} H8 Q0 ${h} 0 ${h - 8} V8 Q0 0 8 0 Z`} fill={`url(#dg${w})`} />
        <path d={`M${w - fold} 0 V${fold - 6} Q${w - fold} ${fold} ${w - fold + 6} ${fold} H${w} Z`} fill="#94a3b8" opacity={0.8} />
        {[0.32, 0.44, 0.56, 0.68, 0.8].map((p, i) => (
          <rect key={i} x={w * 0.16} y={h * p} width={w * (i % 2 ? 0.5 : 0.68)} height={Math.max(2, w * 0.035)} rx={2} fill="#64748b" opacity={0.6} />
        ))}
      </svg>
      {label && (
        <div style={{ position: "absolute", top: h + 14, left: -60, right: -60, textAlign: "center", fontFamily: INTER, fontSize: 20, color: C.slate300, fontWeight: 500 }}>{label}</div>
      )}
    </div>
  );
};

// ── NuevaMente logo (rebuilt as vector) ─────────────────────────────────────

export const Logo: React.FC<{ x: number; y: number; scale?: number; p?: number }> = ({ x, y, scale = 1, p = 1 }) => {
  const word = prog(p, 0.45, 0.4);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <Prism cx={x - 30 * scale} cy={y - 60 * scale} size={260 * scale} inP={prog(p, 0, 0.25)} outP={prog(p, 0.2, 0.35)} outLen={430 * scale} spread={34} inAngle={8} />
      <div
        style={{
          position: "absolute", left: x - 600, width: 1200, top: y + 110 * scale, textAlign: "center",
          fontFamily: OUTFIT, fontWeight: 600, fontSize: 132 * scale, letterSpacing: -2 * scale, lineHeight: 1,
          opacity: word, transform: `translateY(${(1 - word) * 30}px)`,
        }}
      >
        <span style={{ color: "#f1f5f9" }}>Nueva</span>
        <span style={{ background: `linear-gradient(90deg, ${C.mente1}, ${C.mente2})`, WebkitBackgroundClip: "text", color: "transparent" }}>Mente</span>
      </div>
    </div>
  );
};

/** Small logo mark for corners and the sidebar */
export const MiniPrism: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size * 1.8} height={size} viewBox="0 0 72 40">
    <defs>
      {SPECTRUM.map((c, i) => (
        <linearGradient key={i} id={`mp${i}`} x1="0" x2="1"><stop offset="0" stopColor={c} /><stop offset="1" stopColor={c} stopOpacity={0} /></linearGradient>
      ))}
    </defs>
    <line x1={0} y1={22} x2={14} y2={22} stroke="#fff" strokeWidth={1.5} opacity={0.8} />
    {SPECTRUM.map((c, i) => <polygon key={i} points={`26,${20} 72,${4 + i * 7} 72,${9 + i * 7}`} fill={`url(#mp${i})`} />)}
    <polygon points="20,4 4,36 36,36" fill="rgba(147,197,253,.35)" stroke="#e0f2fe" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

// ── Cursor with click ripple ────────────────────────────────────────────────

export const Cursor: React.FC<{ x: number; y: number; clicks?: number[]; t: number; opacity?: number }> = ({ x, y, clicks = [], t, opacity = 1 }) => {
  const last = clicks.filter((c) => c <= t).pop();
  const dt = last !== undefined ? t - last : 99;
  const press = dt < 0.15 ? 0.85 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, zIndex: 50 }}>
      {dt < 0.6 && (
        <div style={{ position: "absolute", left: -30 - dt * 40, top: -30 - dt * 40, width: 60 + dt * 80, height: 60 + dt * 80, borderRadius: "50%", border: `2px solid ${C.brand400}`, opacity: 1 - dt / 0.6 }} />
      )}
      <svg width={34} height={40} viewBox="0 0 24 28" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}>
        <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#0f172a" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ── Supporting text ───────────────────────────────────────────────────────────

export const Title: React.FC<{ children: React.ReactNode; p: number; y?: number; size?: number; style?: React.CSSProperties }> = ({ children, p, y = 140, size = 64, style }) => (
  <div
    style={{
      position: "absolute", left: 120, right: 120, top: y, textAlign: "center", fontFamily: INTER, fontWeight: 700,
      fontSize: size, letterSpacing: -1.5, color: "#f8fafc", lineHeight: 1.12,
      opacity: p, transform: `translateY(${(1 - p) * 24}px)`, filter: `blur(${(1 - p) * 8}px)`, ...style,
    }}
  >
    {children}
  </div>
);

export const Grad: React.FC<{ children: React.ReactNode; from?: string; to?: string }> = ({ children, from = C.brand400, to = C.accent400 }) => (
  <span style={{ background: `linear-gradient(90deg, ${from}, ${to})`, WebkitBackgroundClip: "text", color: "transparent" }}>{children}</span>
);

export const RainbowText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: `linear-gradient(90deg, ${SPECTRUM.join(",")})`, WebkitBackgroundClip: "text", color: "transparent" }}>{children}</span>
);

// ── Sound effects ────────────────────────────────────────────────────────

export const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.5 }) => (
  <Sequence from={Math.round(at * FPS)} durationInFrames={FPS * 3} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
  </Sequence>
);
