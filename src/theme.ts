import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";

export const INTER = loadInter("normal", { weights: ["300", "400", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const OUTFIT = loadOutfit("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const C = {
  bg: "#020617",
  bg2: "#0b1224",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  brand400: "#818cf8",
  brand500: "#6366f1",
  brand600: "#4f46e5",
  accent400: "#a78bfa",
  accent500: "#8b5cf6",
  emerald: "#34d399",
  mente1: "#1e88e5",
  mente2: "#4fc3f7",
  // Prism spectrum (logo order, top to bottom)
  violet: "#8b5cf6",
  blue: "#3b82f6",
  green: "#22d3a0",
  yellow: "#facc15",
  orange: "#fb7185",
  // Persona colors (deck slide 6)
  junior: "#7aa7ff",
  engineer: "#f472b6",
  manager: "#fbbf77",
};

export const SPECTRUM = [C.violet, C.blue, C.green, C.yellow, C.orange];
export const RAINBOW_CONIC = `conic-gradient(from var(--a, 0deg), ${C.violet}, ${C.blue}, ${C.green}, ${C.yellow}, ${C.orange}, ${C.violet})`;
