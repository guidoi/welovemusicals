import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  getMusicalVisualTheme,
  getMusicalVisualThemeForeground,
  getMusicalVisualThemeStyle,
  WARM_NEUTRAL_THEME,
} from "@/lib/musical-visual-theme";

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const detail = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
const rules = [...cssWithoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
  ([, selector, body]) => ({ selector: normalize(selector), body: normalize(body) })
);
const scope = '.musical-detail-page[data-musical-id="koenig-der-loewen"]';
const heroSelector = `${scope} .musical-detail-hero`;
const overlaySelector = `${scope} .musical-hero-overlay`;
const contentSelector = `${heroSelector} > .container`;
const textSelector = `${heroSelector} :is(h1, .text-gold, [class*="text-gold/"], [class*="text-cream"])`;
const badgeSelector = `${heroSelector} [data-testid="detail-experience-category"]`;
const ruleBody = (selector: string) => rules.find(rule => rule.selector === selector)?.body ?? "";
const hero = detail.match(/<section data-visual-surface="hero"[\s\S]*?<\/section>/)?.[0] ?? "";

// Gleiche WCAG-sRGB-Berechnung wie in musical-visual-theme.test.ts;
// die tatsächliche Schriftfarbe liefert der bestehende produktive Theme-Helfer.
function luminance(hex: string): number {
  const channels = [1, 3, 5].map(offset => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(a: string, b: string): number {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

describe("MusicalDetail: leuchtend gelber KDL-Hero mit eigenem unteren Fadebereich", () => {
  it("begrenzt sämtliche KDL-Regeln auf die vorhandene Show-ID und ihre Hero-Nachfahren", () => {
    expect(detail).toContain('data-testid="musical-detail-page" data-musical-id={musical.id}');
    expect(detail).toContain("style={getMusicalVisualThemeStyle(musical.id)}");
    const kdlRules = rules.filter(rule => rule.selector.includes('data-musical-id="koenig-der-loewen"'));
    expect(kdlRules.map(rule => rule.selector)).toEqual([
      heroSelector,
      overlaySelector,
      heroSelector,
      contentSelector,
      textSelector,
      badgeSelector,
    ]);
    expect(kdlRules.every(rule => rule.selector.startsWith(`${scope} .musical-`))).toBe(true);
  });

  it("verwendet unverändertes klares Gelb direkt statt Oliv oder der neutralen Foto-Hero-Tokens", () => {
    expect(getMusicalVisualTheme("koenig-der-loewen")).toEqual({
      color: "#FFDD00",
      deep: "#E6C700",
    });
    const style = getMusicalVisualThemeStyle("koenig-der-loewen");
    expect(style["--musical-color"]).toBe("#FFDD00");
    expect(style["--musical-color-deep"]).toBe("#E6C700");
    expect(style["--musical-hero-color"]).toBe("#171717");
    expect(style["--musical-hero-deep"]).toBe("#111111");
    const overlay = ruleBody(overlaySelector);
    expect(overlay).toContain("var(--musical-color) 68%");
    expect(overlay).toContain("var(--musical-color) calc(100% - var(--hero-content-fade-space))");
    expect(overlay).not.toMatch(/--musical-hero-(?:color|deep)|--musical-color-deep|#[0-9a-f]{6}/i);
    expect(style["--musical-color"]).not.toBe(style["--musical-hero-color"]);
  });

  it("lässt den oberen Bildbereich transparent und erreicht schon bei 68 Prozent deckendes Gelb", () => {
    expect(ruleBody(overlaySelector)).toBe(
      "background: linear-gradient( 180deg, transparent 15%, color-mix(in srgb, var(--musical-color) 40%, transparent) 45%, var(--musical-color) 68%, var(--musical-color) calc(100% - var(--hero-content-fade-space)), var(--background) 100% );"
    );
  });

  it("endet nach dem gelben Plateau exakt im neutralen Contenthintergrund #171717", () => {
    expect(WARM_NEUTRAL_THEME.background).toBe("#171717");
    expect(ruleBody(":root")).toContain("--background: #171717;");
    const overlay = ruleBody(overlaySelector);
    expect(overlay).toMatch(/var\(--background\) 100% \);$/);
    expect(overlay).not.toContain("var(--musical-color) 100%");
  });

  it("nutzt den bestehenden dunklen Foreground-Helfer mit mindestens 7:1 Kontrast auf beiden Gelbtönen", () => {
    const foreground = getMusicalVisualThemeForeground("koenig-der-loewen");
    const style = getMusicalVisualThemeStyle("koenig-der-loewen");
    expect(foreground).toBe("#111111");
    expect(style["--musical-foreground"]).toBe(foreground);
    for (const background of Object.values(getMusicalVisualTheme("koenig-der-loewen"))) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(7);
    }
    expect(ruleBody(textSelector)).toBe("color: var(--musical-foreground);");
    expect(ruleBody(badgeSelector)).toBe("border-color: currentColor;");
    expect(hero).toContain('<motion.h1');
    expect(hero).toContain('text-white mb-2 leading-tight');
    expect(hero).toContain('text-gold/80');
    expect(hero).toContain('className="flex items-center gap-2 text-cream/70"');
    expect(hero).toContain('<MapPin className="w-4 h-4 shrink-0 text-gold" />');
    expect(hero).toContain('<Tag className="h-3.5 w-3.5" />');
    expect(hero).toContain('border-gold bg-transparent');
  });

  it("ändert weder den Standardverlauf bis 85/100 Prozent noch die Textregeln anderer Heroes", () => {
    expect(ruleBody(".musical-hero-overlay")).toBe(
      "background: linear-gradient( 180deg, transparent 15%, color-mix(in srgb, var(--musical-hero-deep) 35%, transparent) 45%, color-mix(in srgb, var(--musical-hero-deep) 90%, transparent) 75%, var(--musical-hero-color) 85%, var(--background) 100% );"
    );
    const overlayRules = rules.filter(rule => rule.selector.includes(".musical-hero-overlay"));
    expect(overlayRules.map(rule => rule.selector)).toEqual([
      ".musical-hero-overlay",
      '.musical-detail-page[data-musical-id="moulinrouge"] .musical-hero-overlay',
      overlaySelector,
    ]);
    const textRules = rules.filter(
      rule => rule.selector.includes(".musical-detail-hero") && /(?:^|;)\s*(?:color|border-color)\s*:/.test(rule.body)
    );
    expect(textRules.map(rule => rule.selector)).toEqual([
      '.musical-detail-hero :is(.text-gold, [class*="text-gold/"])',
      textSelector,
      badgeSelector,
    ]);
    expect(textRules[0].body).toBe("color: var(--color-gold-light);");
    expect(textRules.filter(rule => rule.body.includes("--musical-foreground")).every(
      rule => rule.selector.startsWith(`${scope} `)
    )).toBe(true);
  });

  it("reserviert hinter der letzten Textzeile einen separaten Fadebereich von 48 px mobil und 64 px ab md", () => {
    const fadeRules = rules.filter(rule => rule.selector === heroSelector);
    expect(fadeRules.map(rule => rule.body)).toEqual([
      "--hero-content-fade-space: 3rem;",
      "--hero-content-fade-space: 4rem;",
    ]);
    const fadePixels = fadeRules.map(rule => Number.parseFloat(rule.body.split(":")[1]) * 16);
    expect(fadePixels).toEqual([48, 64]);
    const desktop = cssWithoutComments.match(/@media\s*\(min-width:\s*768px\)\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";
    expect(desktop).toContain(heroSelector);
    expect(desktop).toContain("--hero-content-fade-space: 4rem;");
    expect(ruleBody(contentSelector)).toBe("padding-bottom: var(--hero-content-fade-space);");
    expect(ruleBody(overlaySelector)).toContain("var(--musical-color) calc(100% - var(--hero-content-fade-space))");
    expect(hero).toContain('<div className="relative z-10 container pb-6 md:pb-10 pt-40">');
    expect(hero).toMatch(/<div className="flex items-center gap-2 text-cream\/70">[\s\S]*?<\/div>\s*<\/motion\.div>\s*<\/div>\s*<\/section>$/);
    expect(fadeRules.every(rule => !/height|min-height|margin/.test(rule.body))).toBe(true);
  });

  it("legt das KDL-Fade-Padding in den Utility-Layer, damit pb-6 und md:pb-10 es nicht überschreiben", () => {
    const components = cssWithoutComments.match(/^\s*@layer components\s*\{([\s\S]*?)^\}/m)?.[1] ?? "";
    const utilities = cssWithoutComments.match(/^\s*@layer utilities\s*\{([\s\S]*?)^\}/m)?.[1] ?? "";
    expect(components).not.toContain(contentSelector);
    expect(normalize(utilities)).toContain(`${contentSelector} { padding-bottom: var(--hero-content-fade-space); }`);
    expect(rules.filter(rule => rule.selector === contentSelector)).toHaveLength(1);
    expect(hero).toContain('className="relative z-10 container pb-6 md:pb-10 pt-40"');
  });

  it("bleibt ein statischer CSS-Verlauf auf dem bestehenden Overlay ohne neue Assets oder Animationen", () => {
    const kdlRules = rules.filter(rule => rule.selector.startsWith(`${scope} `));
    expect(kdlRules).toHaveLength(6);
    for (const rule of kdlRules) {
      expect(rule.body).not.toMatch(/url\(|image-set\(|animation|transition|transform|filter|@keyframes/i);
    }
    expect(ruleBody(overlaySelector).match(/;/g)).toHaveLength(1);
    expect(hero.match(/data-testid="musical-hero-overlay"/g)).toHaveLength(1);
    expect(hero).toContain('<div data-testid="musical-hero-overlay" className="absolute inset-0 musical-hero-overlay" />');
    expect(hero.match(/<img\b/g)).toHaveLength(1);
    expect(hero).toContain("src={musical.heroImage || musical.image}");
    expect(hero).toContain('className="w-full h-full object-cover object-top"');
    expect(hero).not.toContain('musical.id === "koenig-der-loewen"');
  });
});
