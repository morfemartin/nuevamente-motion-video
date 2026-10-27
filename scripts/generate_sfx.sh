#!/usr/bin/env bash
# Synthesizes every sound effect and the ambient pad with ffmpeg's lavfi sources.
# No samples are downloaded, so there are no third-party licenses involved.
# Output: public/sfx/*.wav
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/sfx && cd public/sfx
A=(-ar 48000 -ac 2)
fx() { ffmpeg -y -v error -f lavfi -i "$1" "${@:3}" "${A[@]}" "$2"; }

# whoosh: band-limited pink noise with an exponential swell
fx "anoisesrc=c=pink:d=0.9:a=0.6" whoosh.wav -af "highpass=f=300,lowpass=f=3500,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.55,volume=0.7"
# click: two fast-decaying sines (UI tap)
fx "aevalsrc='0.5*sin(2*PI*1900*t)*exp(-t*90)+0.3*sin(2*PI*3200*t)*exp(-t*140)':d=0.08" click.wav
# pop: short pitch-bent sine
fx "aevalsrc='0.6*sin(2*PI*(500*t+40*(1-exp(-t*30))))*exp(-t*22)':d=0.25" pop.wav
# ding: E6 + B6 + E7 bell partials
fx "aevalsrc='0.35*sin(2*PI*1318.5*t)*exp(-t*5)+0.25*sin(2*PI*1975.5*t)*exp(-t*6)+0.15*sin(2*PI*2637*t)*exp(-t*8)':d=1.4" ding.wav
# shimmer: high C-major partials with a 9 Hz tremolo and a short echo (the prism sound)
fx "aevalsrc='(0.12*sin(2*PI*2093*t)+0.1*sin(2*PI*2637*t)+0.09*sin(2*PI*3136*t)+0.07*sin(2*PI*4186*t))*(0.6+0.4*sin(2*PI*9*t))':d=2.2" shimmer.wav -af "afade=t=in:d=0.6,afade=t=out:st=1.0:d=1.2,aecho=0.8:0.6:120:0.35"
# key: 35 ms white-noise tick (typing)
fx "anoisesrc=c=white:d=0.035:a=0.5" key.wav -af "highpass=f=2000,afade=t=out:d=0.035,volume=0.6"
# rise: upward chirp
fx "aevalsrc='0.4*sin(2*PI*(200*t+700*t*t))*min(1\,t*6)*exp(-t*1.5)':d=0.8" rise.wav -af "afade=t=out:st=0.5:d=0.3"
# boom: low sine thump
fx "aevalsrc='0.7*sin(2*PI*55*t)*exp(-t*3)+0.3*sin(2*PI*110*t)*exp(-t*4)':d=1.6" boom.wav
# pad: Fmaj7 <-> Cadd9 crossfading every 16 s, low-passed, with echo; sits at -28 dB under the voice
fx "aevalsrc='(0.5+0.5*sin(2*PI*t/16))*(sin(2*PI*174.6*t)+sin(2*PI*220*t)+sin(2*PI*261.6*t)+0.6*sin(2*PI*329.6*t)) + (0.5-0.5*sin(2*PI*t/16))*(sin(2*PI*130.8*t)+sin(2*PI*196*t)+sin(2*PI*293.7*t)+0.6*sin(2*PI*329.6*t))':d=320:s=48000" pad.wav -af "volume=0.05,lowpass=f=1200,aecho=0.8:0.7:400|700:0.4|0.3,afade=t=in:d=4,afade=t=out:st=314:d=6"

echo "[generate_sfx] $(ls | wc -l | tr -d ' ') files in public/sfx"
