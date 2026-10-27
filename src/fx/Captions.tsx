import React from "react";
import { useCurrentFrame } from "remotion";
import { L } from "../locale";
import { SCENES, SCENE_START } from "../timeline";
import { FPS } from "../lib";
import { C, INTER } from "../theme";

type W = { text: string; s: number; e: number };
type Line = { words: W[]; s: number; e: number };

// Groups words into short readable lines (break on punctuation or at 7 words)
const buildLines = (): Line[] => {
  const lines: Line[] = [];
  for (const sc of SCENES) {
    const tracks: [string, number][] = [[sc.voice, SCENE_START[sc.id] + sc.pre]];
    if (sc.extra) tracks.push([sc.extra.voice, SCENE_START[sc.id] + sc.extraAt]);
    for (const [voice, off] of tracks) {
      let cur: W[] = [];
      const flush = () => {
        if (cur.length) lines.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
        cur = [];
      };
      for (const [text, s, e] of L.words[voice]) {
        cur.push({ text, s: s + off, e: e + off });
        if ((/[.,?;:]$/.test(text) && cur.length >= 3) || cur.length >= 7) flush();
      }
      flush();
    }
  }
  // extend each line up to the next one (max 0.6 s) so captions do not flicker
  lines.forEach((l, i) => {
    const next = lines[i + 1];
    l.e = Math.min(l.e + 0.6, next ? next.s : l.e + 0.6);
  });
  return lines;
};

const LINES = buildLines();

export const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const line = LINES.find((l) => t >= l.s - 0.05 && t < l.e);
  if (!line) return null;
  const inP = Math.min(1, (t - line.s + 0.05) / 0.18);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, display: "flex", justifyContent: "center", zIndex: 100 }}>
      <div
        style={{
          padding: "14px 30px", borderRadius: 18, background: "rgba(2,6,23,.55)", border: "1px solid rgba(255,255,255,.10)",
          backdropFilter: "blur(14px)", fontFamily: INTER, fontWeight: 600, fontSize: 40, letterSpacing: -0.4, maxWidth: 1500, textAlign: "center",
          opacity: inP, transform: `translateY(${(1 - inP) * 10}px)`, boxShadow: "0 10px 40px rgba(0,0,0,.4)",
        }}
      >
        {line.words.map((w, i) => {
          const active = t >= w.s && t < w.e + 0.05;
          const said = t >= w.e;
          return (
            <span key={i} style={active ? { background: `linear-gradient(90deg, ${C.mente2}, ${C.accent400})`, WebkitBackgroundClip: "text", color: "transparent" } : { color: said ? "#f8fafc" : "rgba(248,250,252,.42)" }}>
              {w.text}
              {i < line.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Caption lines, also used to export .srt */
export const CAPTION_LINES = LINES;
