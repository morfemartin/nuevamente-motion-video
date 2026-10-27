// Word-level sync: animations are keyed to words of the voice-over, not to hard-coded times,
// so re-recording a line only requires re-running the transcription.
import { L } from "./locale";

/** Start time (s, relative to the voice-over) of the nth word that contains `needle`. */
export const wordAt = (voice: string, needle: string, nth = 0) => {
  const n = needle.toLowerCase();
  const hits = L.words[voice].filter((w) => w[0].toLowerCase().includes(n));
  if (!hits[nth]) throw new Error(`wordAt: "${needle}" #${nth} not found in ${L.id}/${voice}`);
  return hits[nth][1];
};

/** A sync cue: a word of the voice-over, optionally with which occurrence to use. */
export type Cue = string | [string, number];
export const cueAt = (voice: string, c: Cue) => (typeof c === "string" ? wordAt(voice, c) : wordAt(voice, c[0], c[1]));

/** Named cue(s) of the active locale (see locales/*.tsx → cue). */
export const cue = (key: string) => L.cue[key] as Cue;
export const cues = (key: string) => L.cue[key] as Cue[];
