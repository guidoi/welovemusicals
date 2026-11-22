import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "./data";
import {
  getMusicalVisualTheme,
  getMusicalVisualThemeStyle,
  MUSICAL_VISUAL_THEMES,
  WARM_NEUTRAL_THEME,
} from "./musical-visual-theme";

const ACTIVE_IDS = [
  "weihnachten-mit-bibi-tina", "dracula", "moulinrouge", "phantom-der-oper",
  "der-kleine-lord", "fackjugoehte", "dreihaselnuesse", "rapunzel",
  "schoene-und-das-biest", "gloeckner-von-notre-dame", "starlight-express",
  "koenig-der-loewen", "mj-musical", "eiskoenigin", "tarzan", "ziz",
  "teufel-traegt-prada", "wir-sind-am-leben", "tanz-der-vampire", "salon-rosie",
  "und-julia", "tina-das-musical",
];
const VALID_HEX = /^#[0-9A-F]{6}$/;
// Deterministic OKLCH -> linear sRGB -> encoded sRGB, rounded to 8-bit HEX.
// Colored surfaces use the existing gold-light token: oklch(0.85 0.1 85).
const OPAQUE_GOLD = "#ECC980";
const FALLBACK = { color: "#423E3A", deep: "#302D2A" };

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const srgb = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function sorted(values: string[]): string[] {
  return [...values].sort();
}

describe("Musical-Visual-Themes", () => {
  it("deckt genau die 22 aktiven Artwork-IDs statisch ab", () => {
    expect(ACTIVE_IDS).toHaveLength(22);
    expect(Object.keys(MUSICAL_VISUAL_THEMES)).toHaveLength(22);
    expect(sorted(Object.keys(MUSICAL_VISUAL_THEMES))).toEqual(sorted(ACTIVE_IDS));
    // The active allowlist also contains slugs; compare resolved catalog IDs.
    expect(sorted(getActiveMusicals().map((musical) => musical.id))).toEqual(sorted(ACTIVE_IDS));
  });

  it.each([
    ["eiskoenigin", "#164568", "#113651"],
    ["mj-musical", "#7B252C", "#601D22"],
    ["fackjugoehte", "#145550", "#10423E"],
  ])("bewahrt den freigegebenen Override für %s", (id, color, deep) => {
    expect(getMusicalVisualTheme(id)).toEqual({ color, deep });
  });

  it.each(["unbekannte-show", "", "__proto__", "constructor", "toString"])(
    "liefert für %s einen sicheren warmgrauen Fallback",
    (id) => {
      expect(getMusicalVisualTheme(id)).toEqual(FALLBACK);
      expect(getMusicalVisualThemeStyle(id)).toEqual({
        "--musical-color": "#423E3A",
        "--musical-color-deep": "#302D2A",
      });
    },
  );

  it.each([...ACTIVE_IDS, "fallback"])("verwendet valide HEX-Werte und einen dunkleren Deep-Ton für %s", (id) => {
    const { color, deep } = getMusicalVisualTheme(id);
    expect(color).toMatch(VALID_HEX);
    expect(deep).toMatch(VALID_HEX);
    expect(luminance(deep)).toBeLessThan(luminance(color));
  });

  it.each(ACTIVE_IDS)("erreicht mindestens 4,5:1 für Weiß und Creme auf %s", (id) => {
    const { color, deep } = getMusicalVisualTheme(id);
    for (const foreground of ["#FFFFFF", "#F2EDE7"]) {
      expect(contrast(foreground, color)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(foreground, deep)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(ACTIVE_IDS)(
    "erreicht mindestens 4,5:1 für den voll deckenden helleren Goldakzent auf %s",
    (id) => {
      const { color, deep } = getMusicalVisualTheme(id);
      expect(contrast(OPAQUE_GOLD, color)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(OPAQUE_GOLD, deep)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("bewahrt den FJG-Petrolton und löst den Gold-Kontrast mit dem vorhandenen helleren Akzent", () => {
    const { color, deep } = getMusicalVisualTheme("fackjugoehte");
    expect(color).toBe("#145550");
    expect(contrast(OPAQUE_GOLD, color)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(OPAQUE_GOLD, deep)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(ACTIVE_IDS)("exportiert für %s exakt die beiden vereinbarten CSS-Variablen", (id) => {
    const theme = MUSICAL_VISUAL_THEMES[id];
    expect(getMusicalVisualThemeStyle(id)).toEqual({
      "--musical-color": theme.color,
      "--musical-color-deep": theme.deep,
    });
    expect(Object.keys(getMusicalVisualThemeStyle(id))).toEqual([
      "--musical-color", "--musical-color-deep",
    ]);
  });
});

describe("Warme Neutralpalette", () => {
  it("übernimmt exakt den Stage-Hintergrund #171717 statt des zu hellen Vorgängers", () => {
    expect(WARM_NEUTRAL_THEME.background).toBe("#171717");
    expect(luminance(WARM_NEUTRAL_THEME.background)).toBeLessThan(luminance("#373431"));
    expect(luminance(WARM_NEUTRAL_THEME.card)).toBeLessThan(luminance("#423E3A"));
  });

  it("exportiert exakt die freigegebenen acht Neutralfarben", () => {
    expect(WARM_NEUTRAL_THEME).toEqual({
      background: "#171717",
      card: "#242424",
      popover: "#202020",
      muted: "#202020",
      border: "#4A4A4A",
      input: "#2C2C2C",
      foreground: "#F2EDE7",
      mutedForeground: "#C4BAB0",
    });
    for (const color of Object.values(WARM_NEUTRAL_THEME)) {
      expect(color).toMatch(VALID_HEX);
    }
  });

  it.each(["background", "card", "muted", "popover", "input"] as const)(
    "erreicht mindestens 4,5:1 für beide Textfarben auf %s",
    (surface) => {
      for (const foreground of [WARM_NEUTRAL_THEME.foreground, WARM_NEUTRAL_THEME.mutedForeground]) {
        expect(contrast(foreground, WARM_NEUTRAL_THEME[surface])).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});
