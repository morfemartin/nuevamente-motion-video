# Creative process

This document records how the video was made: the brief, the inputs, the engineering decisions and every feedback round, as a case study of producing motion graphics with software rather than with an editing suite.

## 1. The brief

The goal was a video that best expresses NuevaMente's script **and** shows the program that the team built. The director (Martin Morfe, morfe.studio) set these constraints:

| Constraint | What it meant in practice |
|---|---|
| Start from the recorded voice-overs | Transcribe them and build one animation per sentence. |
| Use the pitch deck as visual guide and base structure | Slides 6 ("Different responsibilities / Different information needs") and 9 ("NuevaMente: the source stays, the experience changes") are recreated as animations. |
| Take the visual identity and the UX from the product repository | The demo is a replica of the real React/Tailwind frontend, not a mock-up. |
| Simple, dazzling motion graphics; realism is not the point | Gradients, icons, text, simple shapes, color and movement. Every sentence gets an animation. |
| Subtitles, simple vector "icon" characters, references | Burned-in word-highlight captions; round vector characters. |
| Present the program as if a person were using it, immersively | A scripted virtual user with cursor, clicks and drag-and-drop, and a camera that zooms and pans. |
| Simple sound effects that focus important actions | Synthesized SFX on clicks, uploads, reveals and answers. |
| "A programmer's animation, not an artist's" | Only what code does well: SVG, CSS, interpolation and springs. No illustration. |
| Prism look: liquid glass and small rainbow gradients | A reusable prism component and glass cards with a rainbow border. |
| Efficient in time and tokens; no DaVinci needed | Everything rendered from code. |
| Maximum 5 minutes | Spanish cut 4:37, English cut 4:58. |

### Inputs provided

- **Voice-overs**: 8 recordings in Spanish, later revised (V2: 9 recordings), then 9 recordings in English. They are kept in [`inputs/voiceover`](../inputs/voiceover) with a [manifest](../inputs/voiceover/manifest.json) mapping every file to its dialogue.
- **Pitch deck**: 24 slides used as the visual reference (not included in this repo).
- **Style references**: dark motion-graphic reels with glowing outline icons, round "emotion" characters and centered captions.
- **Product repository**: [bitcoinkio/nuevamente-demo-video-lab](https://github.com/bitcoinkio/nuevamente-demo-video-lab) (FastAPI + RAG backend, React + Tailwind frontend).
- **Logo**: a glass prism splitting white light into a spectrum, with the wordmark "Nueva" (navy) + "Mente" (blue).
- **Dialogue handoffs**: Spanish V2 and English handoff documents describing the script changes (summarized below).

## 2. Key decisions

**Remotion instead of an editor.** The product is React + Tailwind + lucide-react, so React was the natural medium: the demo UI could be rebuilt with the same tokens and icons, and every animation could be a pure function of the frame number. That makes the video deterministic, diffable and re-renderable.

**Transcription before animation.** whisper.cpp (`ggml-small`, multilingual) produced per-word timestamps. The scene code references words, not seconds. This turned "make each sentence have its animation" into data: a cue table per language.

**Recreate rather than import.** The logo was rebuilt as SVG instead of placing the PNG, so the beam can enter the prism and the spectrum can disperse. Flags are simplified vectors. The world map uses Natural Earth country shapes with an orthographic projection.

**Synthesized audio.** All sound effects and the pad are ffmpeg expressions (sines, filtered noise, envelopes), with no downloads and no licensing questions. Voices are normalized to −16 LUFS; the pad sits around −28 dB under them.

**Cut what was read by mistake.** The Spanish D6 recording contains two stage directions read aloud ("Mientras aparecen los países", "Cierre"). They were removed at silence boundaries detected with `silencedetect`, and the direction itself became the animation (countries appear at that moment).

## 3. Iterations

| # | Feedback / input | Change | Technique |
|---|---|---|---|
| 1 | Initial brief | First cut, Spanish, 3:53, 8 scenes | Plan → transcription → components → scenes → stills review → render |
| 2 | "Show each member's name, their flag, and make the map visible" | Real-map globe; country pins with flags; member cards appear when their country is named; disciplines highlight who covers them | d3-geo + world-atlas; cue per country |
| 3 | "Add credits under the logo and slogan at the end" | Logo moves up; team grid with country, role and email; audiovisual credit | Last scene extended |
| 4 | "You clicked one option and another got selected" (quiz) | Cursor target moved onto the correct answer | Measured option geometry from a still |
| 5 | Typo in a member's name, "without re-rendering the whole video and without a visible cut" | Only the affected frame ranges (1,757 of 7,450) re-rendered in ProRes and spliced in; audio stream copied untouched | Frame-exact `trim` + `concat`, PSNR > 50 dB across every splice |
| 6 | Spanish dialogues V2 (named character "Alex", D5 split in 5A/5B, new D7) | Demo re-choreographed to the new narration (quiz → flashcards → summary); second voice per scene; S7 reworked | `extra` voice in the timeline; new cues |
| 7 | English version | Same video, English voices and on-screen text, D4 played before D3, fitted under 5:00 by tightening pauses | Locale-specific scene order and pauses |
| 8 | YouTube thumbnails, ES and EN | 3 key frames + the credits frame, without captions | `thumb` input prop hides captions |
| 9 | Publish as a reproducible engineering project | The two copies were merged into one codebase with locales; scripts for the whole pipeline | Verified against the delivered renders |

### Script changes worth noting

- **ES V2:** the opening introduces a named character ("Conoce a Alex"), and the closing returns to Alex, so the story is circular. D5 is split into **5A** (the product in action: choosing a quiz, answering, switching to flashcards and to the executive summary) and **5B** (the conceptual wrap-up "one source, many ways to learn").
- **EN:** the character is **Martin**. The playback order is D1 → D2 → **D4 → D3** → D5A → D5B → D6 → D7 → D8, which is intentional for a startup pitch (problem → needs → solution → how it works → demo → …).
- **Known recording quirks** (kept as recorded, captions show what is said): the English D7 says "what Alex actually needs" once; the Spanish D8 recording is the earlier wording ("Que recibir un manual nunca más signifique…").

## 4. How the work was verified

- **Visual review from stills.** For each change, key frames were rendered with `remotion still` and tiled into contact sheets (ffmpeg `hstack`/`vstack`), which is faster and cheaper than watching full renders.
- **Sync checks.** The final MP4's audio was re-transcribed and compared against the expected lines at several timestamps.
- **Loudness.** `ffmpeg -af ebur128` reported −16.3 to −16.7 LUFS integrated.
- **Splice invisibility.** PSNR between spliced and original frames on both sides of every cut was above 50 dB.
- **Refactor equivalence.** After merging the Spanish and English projects into one codebase, sampled frames were rendered from both and compared: PSNR = ∞ (pixel-identical) on 19 of 20 frames, and 74.9 dB on the last one (sub-pixel blur rounding). The prepared WAVs were bit-identical (MD5) to those used in the delivered videos.

## 5. Lessons

- Keying animations to words instead of timestamps is what made three rounds of new recordings cheap.
- The cheapest feedback loop is a contact sheet of stills, not a full render.
- Small renders spliced at exact frames are a practical way to fix late typos in a long video.
- Keep language-specific choices (scene order, pauses, scene variants) in data, so one codebase can serve both cuts.
