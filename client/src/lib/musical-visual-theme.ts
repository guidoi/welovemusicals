import type { CSSProperties } from "react";

// Stage-Entertainment-Startseite: main/#musicals, computed rgb(23, 23, 23), 22.11.2026.
// Exportname bleibt für bestehende Importe stabil; die Grundfläche ist neutral-dunkelgrau.
export const WARM_NEUTRAL_THEME = {
  background: "#171717",
  card: "#242424",
  popover: "#202020",
  muted: "#202020",
  border: "#4A4A4A",
  input: "#2C2C2C",
  foreground: "#F2EDE7",
  mutedForeground: "#C4BAB0",
};

// Nutzer22.11.2026: kräftige Artworkfarben statt gedeckter Töne; KDL klares Gelb.
// Gleiche vorhandene Artwork-Farbfamilien, einheitlich höhere Sättigung/Helligkeit.
// Statische Werte; keine neuen Bilder, Laufzeitdownloads oder globalen Showfarben.
export const MUSICAL_VISUAL_THEMES: Record<
  string,
  { color: string; deep: string }
> = {
  "weihnachten-mit-bibi-tina": { color: "#0C86EB", deep: "#0B7EDD" },
  dracula: { color: "#0BC9E6", deep: "#0AB5CF" },
  moulinrouge: { color: "#E6140B", deep: "#CF120A" },
  "phantom-der-oper": { color: "#E61E0B", deep: "#CF1B0A" },
  "der-kleine-lord": { color: "#0B17E6", deep: "#0A15CF" },
  fackjugoehte: { color: "#0BE6D5", deep: "#0ACFBF" },
  dreihaselnuesse: { color: "#0C82FA", deep: "#0C7DF0" },
  rapunzel: { color: "#AD0BE6", deep: "#9B0ACF" },
  "schoene-und-das-biest": { color: "#980BE6", deep: "#890ACF" },
  "gloeckner-von-notre-dame": { color: "#0B20E6", deep: "#0A1DCF" },
  "starlight-express": { color: "#0B46E6", deep: "#0A3FCF" },
  "koenig-der-loewen": { color: "#FFDD00", deep: "#E6C700" },
  "mj-musical": { color: "#E60B1D", deep: "#CF0A1A" },
  eiskoenigin: { color: "#0B88E6", deep: "#0A80D8" },
  tarzan: { color: "#0BE652", deep: "#0ACF4A" },
  ziz: { color: "#0B53E6", deep: "#0A4BCF" },
  "teufel-traegt-prada": { color: "#E60E0B", deep: "#CF0D0A" },
  "wir-sind-am-leben": { color: "#E6110B", deep: "#CF100A" },
  "tanz-der-vampire": { color: "#E60B3B", deep: "#CF0A35" },
  "salon-rosie": { color: "#E66B0B", deep: "#CF610A" },
  "und-julia": { color: "#E60B50", deep: "#CF0A48" },
  "tina-das-musical": { color: "#E6930B", deep: "#CF840A" },
};

const FALLBACK_THEME = { color: "#423E3A", deep: "#302D2A" };

export function getMusicalVisualTheme(id: string): {
  color: string;
  deep: string;
} {
  return Object.prototype.hasOwnProperty.call(MUSICAL_VISUAL_THEMES, id)
    ? MUSICAL_VISUAL_THEMES[id]
    : FALLBACK_THEME;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map(offset => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function getMusicalVisualThemeForeground(
  id: string
): "#FFFFFF" | "#111111" {
  const { color } = getMusicalVisualTheme(id);
  return 1.05 / (luminance(color) + 0.05) >= 4.5 ? "#FFFFFF" : "#111111";
}

function darken(hex: string, factor: number): string {
  return (
    "#" +
    [1, 3, 5]
      .map(offset =>
        Math.round(Number.parseInt(hex.slice(offset, offset + 2), 16) * factor)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()
      )
      .join("")
  );
}

export function getMusicalVisualThemeStyle(id: string): CSSProperties & {
  "--musical-color": string;
  "--musical-color-deep": string;
  "--musical-foreground": string;
  "--musical-hero-color": string;
  "--musical-hero-deep": string;
} {
  const { color, deep } = getMusicalVisualTheme(id);
  const foreground = getMusicalVisualThemeForeground(id);
  // Helle Showflächen bekommen dunkle Schrift. Der Foto-Hero bleibt separat
  // dunkel und lesbar, ohne Gelb in einen schmutzigen Olivton abzudunkeln.
  const lightSurface = foreground === "#111111";
  return {
    "--musical-color": color,
    "--musical-color-deep": deep,
    "--musical-foreground": foreground,
    "--musical-hero-color": lightSurface ? "#171717" : darken(color, 0.7),
    "--musical-hero-deep": lightSurface ? "#111111" : darken(color, 0.48),
  };
}
