import { FPS } from "./lib";
import { L } from "./locale";

// Scene timeline for the active locale. Each scene lasts: pre-roll + voice-over (+ optional
// second voice-over after `gap`) + tail. Voice durations come from voices.json (ffprobe).
export const VOICE_DUR = L.voices;

export const SCENES = L.scenes.map((s) => {
  const extraAt = s.extra ? s.pre + VOICE_DUR[s.voice] + s.extra.gap : 0;
  const end = s.extra ? extraAt + VOICE_DUR[s.extra.voice] : s.pre + VOICE_DUR[s.voice];
  return { ...s, extraAt, dur: end + s.tail };
});

let acc = 0;
export const SCENE_START: Record<string, number> = {};
for (const s of SCENES) {
  SCENE_START[s.id] = acc;
  acc += s.dur;
}
export const TOTAL_SEC = acc;
export const TOTAL_FRAMES = Math.ceil(acc * FPS);

/** Pre-roll (s) before the voice-over of a scene. */
export const scenePre = (id: string) => SCENES.find((s) => s.id === id)!.pre;
