import { getInputProps } from "remotion";
import { en } from "./locales/en";
import { es } from "./locales/es";

// The locale is chosen at render time: `--props='{"locale":"en"}'` (defaults to Spanish).
export const LOCALES = { es, en };
export type LocaleId = keyof typeof LOCALES;

const requested = (getInputProps() as { locale?: string }).locale;
export const L = LOCALES[(requested && requested in LOCALES ? requested : "es") as LocaleId];
