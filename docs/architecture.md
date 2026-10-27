# Architecture

The video is a single Remotion composition (`NuevaMente`, 1920×1080, 30 fps). Its content, timing and language are fully determined by data in `src/locales/` and by the prepared audio.

## Modules

| Module | Responsibility |
|---|---|
| `src/locale.ts` | Picks the active locale from the render's input props (`--props='{"locale":"en"}'`, default `es`). |
| `src/locales/{en,es}.tsx` | All on-screen strings (including JSX fragments for styled titles), sync cues, hero name, country names, scene variants and credit timing. `es` is typed as `Locale = typeof en`, so a missing key is a compile error. |
| `src/locales/<locale>/scenes.json` | Playback order and pauses: `{ id, voice, pre, tail, extra? }`. Shared by the renderer and `scripts/export_srt.mjs`. |
| `src/locales/<locale>/voices.json` | Voice-over durations in seconds, written by `scripts/prepare_audio.py`. |
| `src/locales/<locale>/words.json` | Word-level transcript `{voice: [[word, start, end], …]}`, written by `scripts/transcribe.py`. |
| `src/timeline.ts` | Computes each scene's start and duration and the total frame count. |
| `src/sync.ts` | `cueAt(voice, cue)` → seconds. A cue is a word, or `[word, n]` for its n-th occurrence (case-insensitive substring match). |
| `src/Video.tsx` | Sequences the scenes with 0.5 s crossfades, plays each voice-over after its pre-roll, plays the pad, overlays captions. |
| `src/scenes/S1…S8.tsx` | One scene per dialogue. Each is a pure function of its local time. |
| `src/fx/` | Reusable visuals: background, `Prism`, `Glass`, `Person`, `Doc`, `Logo`, `Cursor`, `Title`, `Sfx`, captions, team data and flags. |
| `src/ui/App.tsx` | Replica of the NuevaMente web app (sidebar, dashboard, upload, wizard, generation status, result views) driven by a state object. |

## Timeline math

For each scene in `scenes.json`:

```
voiceAt  = pre
extraAt  = pre + dur(voice) + extra.gap          (when a second voice-over exists, e.g. 5A → 5B)
duration = (extra ? extraAt + dur(extra.voice) : pre + dur(voice)) + tail
start    = Σ durations of the previous scenes
```

Scenes overlap by 0.5 s for the crossfade. The same arithmetic places the captions in absolute time, so captions, voice and animation can never drift apart.

## Word-level sync

Inside a scene, every animation time is derived from a cue:

```ts
const PRE = scenePre("s5");
const v = (c: Cue) => PRE + cueAt("v5a", c);   // seconds, local to the scene
const tQuizAnswered = v(cue("s5Ans"));          // en: "feedback", es: "retroalimentación"
```

Cues fail loudly: if a re-recording drops a word, `wordAt` throws `"<word>" #n not found in <locale>/<voice>` at render time instead of silently mistiming the scene.

Substring matching needs care with repeated words. In the English D5B, for example, "different" first appears in "different learning experiences", so the closing title uses `["Different", 1]`.

## Program UI replica and virtual user

`S5` computes a `NewState` (scroll, dragging, uploading, uploaded, wizard step, selections, hovered option, generation progress) and the active result tab purely from cue times. The cursor path is a keyframe list `[time, x, y]` in window coordinates, interpolated with ease-in-out; clicks are a list of times that trigger a ripple and a click sound. The camera is three keyframed values (scale and focus x/y) applied as a transform on the browser window, plus a perspective `rotateX` for the entrance.

## Captions

`src/fx/Captions.tsx` groups words into lines: it breaks after punctuation once a line has 3 or more words, or at 7 words. Each line is extended up to 0.6 s into the gap before the next one so captions don't flicker. The word being spoken is painted with a gradient; spoken words are white, upcoming ones translucent. `scripts/export_srt.mjs` applies the same grouping to produce `.srt` files. Render with `--props='{"thumb":true}'` to hide captions (used for thumbnails).

## Audio

- **Voice:** `prepare_audio.py` cuts the ranges in `manifest.json` (`aselect` + `asetpts`), then `loudnorm=I=-16:TP=-1.5:LRA=11`, 48 kHz mono.
- **SFX and pad:** `generate_sfx.sh` synthesizes them with `aevalsrc`/`anoisesrc` plus filters. The pad crossfades Fmaj7 ↔ Cadd9 every 16 s and is 320 s long, so it covers either cut; `Video.tsx` fades it out over the last 4 s.
- **Placement:** `<Sfx at={seconds} name="…"/>` wraps a `<Sequence>` + `<Audio>`, so sound effects share the scene's local clock and cues.

## Rendering

```bash
npm run render:es   # remotion render … --codec=h264 --crf=18 --audio-bitrate=320k --props='{"locale":"es"}'
npm run render:en
```

### Partial re-render

To fix a few seconds without re-rendering the whole video, render only the affected frames as an intermediate ProRes file and splice them in at exact frame numbers, copying the original audio:

```bash
npx remotion render src/index.ts NuevaMente fix.mov --frames=4472-5778 --codec=prores --prores-profile=hq --muted --props='{"locale":"es"}'

ffmpeg -i original.mp4 -i fix.mov -filter_complex "\
[0:v]trim=start_frame=0:end_frame=4472,setpts=PTS-STARTPTS,format=yuv420p,setsar=1[a];\
[1:v]setpts=PTS-STARTPTS,format=yuv420p,setsar=1[b];\
[0:v]trim=start_frame=5779,setpts=PTS-STARTPTS,format=yuv420p,setsar=1[c];\
[a][b][c]concat=n=3:v=1:a=0[v]" \
-map "[v]" -map 0:a -c:v libx264 -crf 18 -preset slow -c:a copy fixed.mp4
```

Then confirm the cuts are invisible with `ffmpeg -lavfi psnr` on a few frames around each splice point (> 50 dB means visually identical).

## Dependencies

Remotion 4, React 19, d3-geo + topojson-client + world-atlas (Natural Earth 1:110m), lucide-react, `@remotion/google-fonts` (Inter, Outfit). External tools: ffmpeg/ffprobe, Python 3 (standard library only) and, optionally, whisper.cpp.
