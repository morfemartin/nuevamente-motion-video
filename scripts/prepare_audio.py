#!/usr/bin/env python3
"""Turn the raw voice-over MP3s into render-ready WAVs.

For every locale and voice listed in inputs/voiceover/manifest.json:
  1. cut the ranges listed under "cut" (e.g. stage directions read aloud by mistake),
  2. loudness-normalize to -16 LUFS (EBU R128, YouTube's reference),
  3. write public/voice/<locale>/<voice>.wav (48 kHz mono),
and record each duration in src/locales/<locale>/voices.json, which drives the timeline.

Usage: python3 scripts/prepare_audio.py [es|en ...]
Requires ffmpeg and ffprobe on PATH.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / "inputs/voiceover/manifest.json").read_text())


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(out.stdout.strip())


def build_filter(spec: dict) -> str:
    filters = []
    if spec.get("cut"):
        keep = "*".join(f"not(between(t,{a},{b}))" for a, b in spec["cut"])
        filters += [f"aselect='{keep}'", "asetpts=N/SR/TB"]
    filters.append(f"loudnorm={MANIFEST['loudnorm']}")
    return ",".join(filters)


def prepare(locale: str) -> None:
    voices = MANIFEST["locales"][locale]
    out_dir = ROOT / "public/voice" / locale
    out_dir.mkdir(parents=True, exist_ok=True)
    durations = {}
    for voice, spec in voices.items():
        src = ROOT / "inputs/voiceover" / locale / f"{voice}.mp3"
        dst = out_dir / f"{voice}.wav"
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-af", build_filter(spec),
             "-ar", str(MANIFEST["sampleRate"]), "-ac", "1", str(dst)],
            check=True,
        )
        durations[voice] = round(duration(dst), 2)
        print(f"  {locale}/{voice}: {durations[voice]:6.2f}s  <- {spec['source']}")
    (ROOT / "src/locales" / locale / "voices.json").write_text(json.dumps(durations, indent=2) + "\n")


if __name__ == "__main__":
    for loc in sys.argv[1:] or list(MANIFEST["locales"]):
        print(f"[prepare_audio] {loc}")
        prepare(loc)
