import type { CSSProperties } from "react";

export const WARM_NEUTRAL_THEME = {
  background: "#373431",
  card: "#423E3A",
  popover: "#3D3936",
  muted: "#3D3936",
  border: "#655E57",
  input: "#4A443F",
  foreground: "#F2EDE7",
  mutedForeground: "#C4BAB0",
};

// Offline artwork quantization + HSV-weighted hue, normalized for dark surfaces.
// The three explicitly approved overrides keep their exact color values.
// Extraction script/data live outside the repository; no runtime image requests.
export const MUSICAL_VISUAL_THEMES: Record<string, { color: string; deep: string }> = {
  "weihnachten-mit-bibi-tina": { color: "#1B4262", deep: "#15334C" },
  dracula: { color: "#204F56", deep: "#193E43" },
  moulinrouge: { color: "#631D1A", deep: "#4D1714" },
  "phantom-der-oper": { color: "#61221C", deep: "#4C1B16" },
  "der-kleine-lord": { color: "#23265A", deep: "#1B1E46" },
  fackjugoehte: { color: "#145550", deep: "#10423E" },
  dreihaselnuesse: { color: "#1A3E63", deep: "#14304D" },
  rapunzel: { color: "#4F1C61", deep: "#3E164C" },
  "schoene-und-das-biest": { color: "#491A63", deep: "#39144D" },
  "gloeckner-von-notre-dame": { color: "#1A2163", deep: "#141A4D" },
  "starlight-express": { color: "#1F305E", deep: "#182549" },
  "koenig-der-loewen": { color: "#514516", deep: "#3F3611" },
  "mj-musical": { color: "#7B252C", deep: "#601D22" },
  eiskoenigin: { color: "#164568", deep: "#113651" },
  tarzan: { color: "#165129", deep: "#113F20" },
  ziz: { color: "#1A3263", deep: "#14274D" },
  "teufel-traegt-prada": { color: "#631B1A", deep: "#4D1514" },
  "wir-sind-am-leben": { color: "#631C1A", deep: "#4D1614" },
  "tanz-der-vampire": { color: "#631A2A", deep: "#4D1421" },
  "salon-rosie": { color: "#573B25", deep: "#442E1D" },
  "und-julia": { color: "#631A31", deep: "#4D1426" },
  "tina-das-musical": { color: "#58421E", deep: "#453317" },
};

const FALLBACK_THEME = { color: "#423E3A", deep: "#302D2A" };

export function getMusicalVisualTheme(id: string): { color: string; deep: string } {
  return Object.prototype.hasOwnProperty.call(MUSICAL_VISUAL_THEMES, id)
    ? MUSICAL_VISUAL_THEMES[id]
    : FALLBACK_THEME;
}

export function getMusicalVisualThemeStyle(id: string): CSSProperties & {
  "--musical-color": string;
  "--musical-color-deep": string;
} {
  const { color, deep } = getMusicalVisualTheme(id);
  return {
    "--musical-color": color,
    "--musical-color-deep": deep,
  };
}
