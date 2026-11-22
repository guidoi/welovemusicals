import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "./data";
import {
  getMusicalVisualTheme,
  getMusicalVisualThemeForeground,
  getMusicalVisualThemeStyle,
  MUSICAL_VISUAL_THEMES,
  WARM_NEUTRAL_THEME,
} from "./musical-visual-theme";

const ACTIVE_IDS = [
  "weihnachten-mit-bibi-tina",
  "dracula",
  "moulinrouge",
  "phantom-der-oper",
  "der-kleine-lord",
  "fackjugoehte",
  "dreihaselnuesse",
  "rapunzel",
  "schoene-und-das-biest",
  "gloeckner-von-notre-dame",
  "starlight-express",
  "koenig-der-loewen",
  "mj-musical",
  "eiskoenigin",
  "tarzan",
  "ziz",
  "teufel-traegt-prada",
  "wir-sind-am-leben",
  "tanz-der-vampire",
  "salon-rosie",
  "und-julia",
  "tina-das-musical",
];
const VALID_HEX = /^#[0-9A-F]{6}$/;
const OPAQUE_GOLD = "#ECC980";
const FALLBACK = { color: "#423E3A", deep: "#302D2A" };
const channels = (hex: string) =>
  [1, 3, 5].map(
    offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
  );
function luminance(hex: string): number {
  const c = channels(hex).map(v =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  );
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function contrast(a: string, b: string): number {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}
const sorted = (values: string[]) => [...values].sort();

describe("Kräftige Musical-Visual-Themes", () => {
  it("deckt genau die 22 aktiven Artwork-IDs statisch ab", () => {
    expect(ACTIVE_IDS).toHaveLength(22);
    expect(sorted(Object.keys(MUSICAL_VISUAL_THEMES))).toEqual(
      sorted(ACTIVE_IDS)
    );
    expect(sorted(getActiveMusicals().map(m => m.id))).toEqual(
      sorted(ACTIVE_IDS)
    );
  });
  it.each([
    ["koenig-der-loewen", "#FFDD00", "#E6C700"],
    ["eiskoenigin", "#0B88E6", "#0A80D8"],
    ["mj-musical", "#E60B1D", "#CF0A1A"],
    ["fackjugoehte", "#0BE6D5", "#0ACFBF"],
  ])("verwendet die kräftigere Showfarbe für %s", (id, color, deep) => {
    expect(getMusicalVisualTheme(id)).toEqual({ color, deep });
  });
  it("zeigt KDL in klarem leuchtendem Gelb statt Oliv/Ocker", () => {
    for (const color of Object.values(
      getMusicalVisualTheme("koenig-der-loewen")
    )) {
      const [r, g, b] = channels(color);
      expect(r).toBeGreaterThanOrEqual(0.9);
      expect(g).toBeGreaterThanOrEqual(0.75);
      expect(b).toBe(0);
    }
    expect(getMusicalVisualThemeForeground("koenig-der-loewen")).toBe(
      "#111111"
    );
  });
  it.each(["unbekannte-show", "", "__proto__", "constructor", "toString"])(
    "liefert für %s den sicheren unveränderten Fallback",
    id => {
      expect(getMusicalVisualTheme(id)).toEqual(FALLBACK);
      const style = getMusicalVisualThemeStyle(id);
      expect(style["--musical-color"]).toBe(FALLBACK.color);
      expect(style["--musical-color-deep"]).toBe(FALLBACK.deep);
      expect(style["--musical-foreground"]).toBe("#FFFFFF");
    }
  );
  it.each([...ACTIVE_IDS, "fallback"])(
    "verwendet valide HEX-Werte und einen dunkleren Deep-Ton für %s",
    id => {
      const { color, deep } = getMusicalVisualTheme(id);
      expect(color).toMatch(VALID_HEX);
      expect(deep).toMatch(VALID_HEX);
      expect(luminance(deep)).toBeLessThan(luminance(color));
    }
  );
  it.each(ACTIVE_IDS)(
    "ist für %s kräftig und hoch gesättigt, nicht gedeckt",
    id => {
      const c = channels(getMusicalVisualTheme(id).color);
      const max = Math.max(...c),
        min = Math.min(...c);
      expect(max).toBeGreaterThanOrEqual(0.89);
      expect((max - min) / max).toBeGreaterThanOrEqual(0.94);
    }
  );
  it.each(ACTIVE_IDS)(
    "erreicht mindestens 4,5:1 für die passende Schrift/Akzente auf %s",
    id => {
      const foreground = getMusicalVisualThemeForeground(id);
      const { color, deep } = getMusicalVisualTheme(id);
      expect(contrast(foreground, color)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(foreground, deep)).toBeGreaterThanOrEqual(4.5);
    }
  );
  it.each(ACTIVE_IDS)(
    "hält den Foto-Hero für %s mit heller Schrift und Gold lesbar",
    id => {
      const style = getMusicalVisualThemeStyle(id);
      for (const background of [
        style["--musical-hero-color"],
        style["--musical-hero-deep"],
      ]) {
        expect(contrast("#FFFFFF", background)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(OPAQUE_GOLD, background)).toBeGreaterThanOrEqual(4.5);
      }
    }
  );
  it.each(ACTIVE_IDS)(
    "exportiert für %s nur die fünf lokal benötigten CSS-Variablen",
    id => {
      const style = getMusicalVisualThemeStyle(id);
      expect(style["--musical-color"]).toBe(MUSICAL_VISUAL_THEMES[id].color);
      expect(style["--musical-color-deep"]).toBe(
        MUSICAL_VISUAL_THEMES[id].deep
      );
      expect(style["--musical-foreground"]).toBe(
        getMusicalVisualThemeForeground(id)
      );
      expect(Object.keys(style)).toEqual([
        "--musical-color",
        "--musical-color-deep",
        "--musical-foreground",
        "--musical-hero-color",
        "--musical-hero-deep",
      ]);
      for (const value of Object.values(style))
        expect(value).toMatch(VALID_HEX);
    }
  );
});

describe("Unveränderte Stage-Neutralpalette", () => {
  it("bewahrt exakt den Stage-Hintergrund #171717 statt des zu hellen Vorgängers", () => {
    expect(WARM_NEUTRAL_THEME.background).toBe("#171717");
    expect(luminance(WARM_NEUTRAL_THEME.background)).toBeLessThan(
      luminance("#373431")
    );
    expect(luminance(WARM_NEUTRAL_THEME.card)).toBeLessThan(
      luminance("#423E3A")
    );
  });
  it("exportiert exakt die freigegebenen Neutralfarben", () => {
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
    for (const color of Object.values(WARM_NEUTRAL_THEME))
      expect(color).toMatch(VALID_HEX);
  });
  it.each(["background", "card", "muted", "popover", "input"] as const)(
    "erreicht weiterhin mindestens 4,5:1 für beide Textfarben auf %s",
    surface => {
      for (const foreground of [
        WARM_NEUTRAL_THEME.foreground,
        WARM_NEUTRAL_THEME.mutedForeground,
      ]) {
        expect(
          contrast(foreground, WARM_NEUTRAL_THEME[surface])
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  );
});
