#!/usr/bin/env node
// Exports YouTube thumbnails (1920×1080 JPG, captions hidden) for both locales.
// Frames were picked by hand from the final cut; see docs/creative-process.md.
// Usage: node scripts/thumbnails.mjs  →  out/thumbnails/<locale>_<name>.jpg
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const SHOTS = {
  es: { "1_prism_logo": 2521, "2_one_source": 4938, "3_team_globe": 6486, "4_team_credits": 8066 },
  en: { "1_prism_logo": 1662, "2_one_source": 5371, "3_team_globe": 6941, "4_team_credits": 8817 },
};

mkdirSync("out/thumbnails", { recursive: true });
for (const [locale, shots] of Object.entries(SHOTS)) {
  for (const [name, frame] of Object.entries(shots)) {
    const out = `out/thumbnails/${locale}_${name}.jpg`;
    const r = spawnSync("npx", ["remotion", "still", "src/index.ts", "NuevaMente", out, `--frame=${frame}`,
      "--image-format=jpeg", "--jpeg-quality=92", `--props=${JSON.stringify({ locale, thumb: true })}`], { stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}
