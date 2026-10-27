#!/usr/bin/env node
// Exports the burned-in captions as an .srt file per locale, using the same phrase grouping
// as src/fx/Captions.tsx (break on punctuation after 3+ words, or at 7 words).
// Usage: node scripts/export_srt.mjs [es|en ...]  →  out/NuevaMente_<locale>.srt
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ts = (x) => {
  const ms = Math.round(x * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

for (const locale of process.argv.slice(2).length ? process.argv.slice(2) : ["es", "en"]) {
  const words = JSON.parse(readFileSync(join(ROOT, `src/locales/${locale}/words.json`), "utf8"));
  const dur = JSON.parse(readFileSync(join(ROOT, `src/locales/${locale}/voices.json`), "utf8"));
  const scenes = JSON.parse(readFileSync(join(ROOT, `src/locales/${locale}/scenes.json`), "utf8"));
  const lines = [];
  let acc = 0;
  for (const { voice, pre, tail, extra } of scenes) {
    const tracks = [[voice, acc + pre]];
    let end = pre + dur[voice];
    if (extra) {
      const at = end + extra.gap;
      tracks.push([extra.voice, acc + at]);
      end = at + dur[extra.voice];
    }
    for (const [v, off] of tracks) {
      let cur = [];
      for (const [t, s, e] of words[v]) {
        cur.push([t, s + off, e + off]);
        if ((/[.,?;:]$/.test(t) && cur.length >= 3) || cur.length >= 7) { lines.push(cur); cur = []; }
      }
      if (cur.length) lines.push(cur);
    }
    acc += end + tail;
  }
  const srt = lines.map((l, i) => {
    const next = lines[i + 1];
    const e = Math.min(l[l.length - 1][2] + 0.6, next ? next[0][1] : Infinity);
    return `${i + 1}\n${ts(l[0][1])} --> ${ts(e)}\n${l.map((w) => w[0]).join(" ")}\n`;
  }).join("\n");
  mkdirSync(join(ROOT, "out"), { recursive: true });
  writeFileSync(join(ROOT, `out/NuevaMente_${locale}.srt`), srt);
  console.log(`[export_srt] ${locale}: ${lines.length} lines, ${acc.toFixed(1)} s`);
}
