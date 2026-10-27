import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;

/** Local scene time in seconds. */
export const useT = () => useCurrentFrame() / FPS;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** 0..1 eased progress between t0 and t0+dur. */
export const prog = (t: number, t0: number, dur = 0.6, ease = EASE) =>
  interpolate(t, [t0, t0 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** fade in at t0, fade out at t1 */
export const window_ = (t: number, t0: number, t1: number, d = 0.5) =>
  Math.min(prog(t, t0, d), 1 - prog(t, t1, d));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const useSpring = (t0: number, cfg = { damping: 14, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - t0 * fps, fps, config: cfg });
};

/** Piecewise interpolation of keyframes [[t, v], ...] with easing. */
export const keys = (t: number, k: [number, number][]) =>
  interpolate(t, k.map((x) => x[0]), k.map((x) => x[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
