#!/usr/bin/env python3
"""Word-level transcription of the prepared voice-overs with whisper.cpp.

Writes src/locales/<locale>/words.json: {voice: [[word, start_s, end_s], ...]}.
These timestamps are what scene code syncs to (see src/sync.ts), and they also drive the
burned-in captions and the exported .srt.

The committed words.json files are the reviewed output, so this step is only needed after
re-recording a voice-over.

Usage:
  WHISPER_MODEL=/path/to/ggml-small.bin python3 scripts/transcribe.py [es|en ...]
Requires whisper-cli (brew install whisper-cpp). If WHISPER_MODEL is unset, the multilingual
"small" model is downloaded once to .cache/.
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODEL_URL = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"
BRAND = "NuevaMente"
# whisper hears the brand name in many ways ("Nuevamente", "Nueva Mint", "NuevaMend they"...)
GHOST_SYLLABLES = {"this", "there", "they"}


def model_path() -> Path:
    if os.environ.get("WHISPER_MODEL"):
        return Path(os.environ["WHISPER_MODEL"])
    path = ROOT / ".cache/ggml-small.bin"
    if not path.exists():
        path.parent.mkdir(exist_ok=True)
        print(f"downloading {MODEL_URL}")
        urllib.request.urlretrieve(MODEL_URL, path)
    return path


def normalize_brand(words: list) -> list:
    """Merge whisper's renderings of the brand into a single "NuevaMente" token."""
    out, i = [], 0
    while i < len(words):
        text, start, end = words[i]
        if re.match(r"(?i)^nuevamente\W*$", text):  # Spanish: one token, wrong casing
            out.append([BRAND + re.sub(r"^\w+", "", text), start, end])
        elif re.match(r"(?i)^nueva(mend|mint)?\W*$", text):  # English: split / misheard
            punct = re.sub(r"^\w+", "", text)
            if re.match(r"(?i)^nueva\W*$", text) and i + 1 < len(words) and re.match(r"(?i)^m(int|ente|end)", words[i + 1][0]):
                punct, end = re.sub(r"^[\w-]+", "", words[i + 1][0]), words[i + 1][2]
                i += 1
            if not punct and i + 1 < len(words) and words[i + 1][0].lower().strip(".,") in GHOST_SYLLABLES:
                end = words[i + 1][2]
                i += 1
            out.append([BRAND + punct, start, end])
        else:
            out.append([text, start, end])
        i += 1
    if out:
        out[0][0] = out[0][0][:1].upper() + out[0][0][1:]
    return out


def transcribe(locale: str, model: Path) -> None:
    result = {}
    voices = json.loads((ROOT / "inputs/voiceover/manifest.json").read_text())["locales"][locale]
    with tempfile.TemporaryDirectory() as tmp:
        for voice in voices:
            wav16 = Path(tmp) / f"{voice}.wav"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(ROOT / "public/voice" / locale / f"{voice}.wav"),
                            "-ar", "16000", str(wav16)], check=True)
            base = Path(tmp) / voice
            # -ml 1 -sow: one segment per word, split on word boundaries
            subprocess.run(["whisper-cli", "-m", str(model), "-l", locale, "-np", "-ml", "1", "-sow", "-oj",
                            "-of", str(base), "-f", str(wav16)], check=True, capture_output=True)
            segments = json.loads(base.with_suffix(".json").read_text())["transcription"]
            words = [[s["text"].strip(), round(s["offsets"]["from"] / 1000, 2), round(s["offsets"]["to"] / 1000, 2)]
                     for s in segments if s["text"].strip()]
            result[voice] = normalize_brand(words)
            print(f"  {locale}/{voice}: {len(result[voice])} words")
    (ROOT / "src/locales" / locale / "words.json").write_text(json.dumps(result, ensure_ascii=False, indent=0) + "\n")


if __name__ == "__main__":
    model = model_path()
    for loc in sys.argv[1:] or ["es", "en"]:
        print(f"[transcribe] {loc}")
        transcribe(loc, model)
