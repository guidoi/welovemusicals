import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getMusicalVisualTheme, getMusicalVisualThemeStyle } from "@/lib/musical-visual-theme";

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const detail = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/data.ts", import.meta.url), "utf8");
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
  ([, selector, body]) => ({ selector: normalize(selector), body: normalize(body) })
);
const scope = '.musical-detail-page[data-musical-id="moulinrouge"]';
const overlaySelector = `${scope} .musical-hero-overlay`;
const kdlScope = '.musical-detail-page[data-musical-id="koenig-der-loewen"]';
const ruleBody = (selector: string) => rules.find(rule => rule.selector === selector)?.body ?? "";
const overlay = ruleBody(overlaySelector);
const hero = detail.match(/<section data-visual-surface="hero"[\s\S]*?<\/section>/)?.[0] ?? "";

describe("MusicalDetail: mehr sichtbares Moulin-Rouge-Herobild nur durch den Overlay-Verlauf", () => {
  it("begrenzt die Änderung auf genau einen statischen Hintergrund der vorhandenen Moulin-Show-ID", () => {
    expect(detail).toContain('data-testid="musical-detail-page" data-musical-id={musical.id}');
    expect(detail).toContain("style={getMusicalVisualThemeStyle(musical.id)}");
    expect(rules.filter(rule => rule.selector.includes('data-musical-id="moulinrouge"'))).toEqual([
      { selector: overlaySelector, body: overlay },
    ]);
    expect(overlay).toMatch(/^background: linear-gradient\( 180deg,/);
    expect(overlay.match(/;/g)).toHaveLength(1);
    expect(overlay).not.toMatch(/url\(|image-set\(|animation|transition|transform|filter|height|width|padding|margin|position|color\s*:/i);
    expect(rules.filter(rule => rule.selector.includes(".musical-hero-overlay")).map(rule => rule.selector)).toEqual([
      ".musical-hero-overlay",
      overlaySelector,
      `${kdlScope} .musical-hero-overlay`,
    ]);
  });

  it("lässt die oberen 30 Prozent frei und senkt die mittlere Überdeckung auf 25 Prozent erst bei 55 Prozent", () => {
    expect(overlay).toContain("180deg, transparent 30%, color-mix(in srgb, var(--musical-hero-deep) 25%, transparent) 55%,");
    expect(overlay).not.toContain("transparent 15%");
    expect(overlay).not.toContain("35%, transparent) 45%");
  });

  it("verschiebt die 90-Prozent-Überdeckung auf 80 Prozent und behält den roten und neutralen Abschluss bei 85/100 bei", () => {
    expect(overlay).toBe(
      "background: linear-gradient( 180deg, transparent 30%, color-mix(in srgb, var(--musical-hero-deep) 25%, transparent) 55%, color-mix(in srgb, var(--musical-hero-deep) 90%, transparent) 80%, var(--musical-hero-color) 85%, var(--background) 100% );"
    );
    expect(getMusicalVisualTheme("moulinrouge")).toEqual({ color: "#E6140B", deep: "#CF120A" });
    expect(ruleBody(":root")).toContain("--background: #171717;");
  });

  it("belässt den generischen Verlauf sowie alle KDL-Hero-Regeln, Gelbtöne und die dunkle Schrift unverändert", () => {
    expect(ruleBody(".musical-hero-overlay")).toBe(
      "background: linear-gradient( 180deg, transparent 15%, color-mix(in srgb, var(--musical-hero-deep) 35%, transparent) 45%, color-mix(in srgb, var(--musical-hero-deep) 90%, transparent) 75%, var(--musical-hero-color) 85%, var(--background) 100% );"
    );
    expect(rules.filter(rule => rule.selector.includes('data-musical-id="koenig-der-loewen"'))).toEqual([
      { selector: `${kdlScope} .musical-detail-hero`, body: "--hero-content-fade-space: 3rem;" },
      {
        selector: `${kdlScope} .musical-hero-overlay`,
        body: "background: linear-gradient( 180deg, transparent 15%, color-mix(in srgb, var(--musical-color) 40%, transparent) 45%, var(--musical-color) 68%, var(--musical-color) calc(100% - var(--hero-content-fade-space)), var(--background) 100% );",
      },
      { selector: `${kdlScope} .musical-detail-hero`, body: "--hero-content-fade-space: 4rem;" },
      { selector: `${kdlScope} .musical-detail-hero > .container`, body: "padding-bottom: var(--hero-content-fade-space);" },
      {
        selector: `${kdlScope} .musical-detail-hero :is(h1, .text-gold, [class*="text-gold/"], [class*="text-cream"])`,
        body: "color: var(--musical-foreground);",
      },
      { selector: `${kdlScope} .musical-detail-hero [data-testid="detail-experience-category"]`, body: "border-color: currentColor;" },
    ]);
    expect(getMusicalVisualThemeStyle("koenig-der-loewen")).toEqual({
      "--musical-color": "#FFDD00",
      "--musical-color-deep": "#E6C700",
      "--musical-foreground": "#111111",
      "--musical-hero-color": "#171717",
      "--musical-hero-deep": "#111111",
    });
    expect(ruleBody('.musical-detail-hero :is(.text-gold, [class*="text-gold/"])')).toBe("color: var(--color-gold-light);");
  });

  it("verwendet weiterhin die Originalbildquellen und genau ein unverändertes Hero-Bild mit dem bestehenden Fallback", () => {
    const moulinImageFields = data.match(/id: "moulinrouge",[\s\S]*?keyvisual:/)?.[0] ?? "";
    expect(moulinImageFields).toContain('image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/mIYGgCjKwguACpBm.webp"');
    expect(moulinImageFields).toContain('heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/mr-01_751f70f4.webp"');
    expect(hero.match(/<img\b/g)).toHaveLength(1);
    expect(normalize(hero.match(/<img\b[\s\S]*?\/>/)?.[0] ?? "")).toBe(
      '<img src={musical.heroImage || musical.image} alt={musical.title} className="w-full h-full object-cover object-top" decoding="async" sizes="100vw" />'
    );
    expect(hero.match(/data-testid="musical-hero-overlay"/g)).toHaveLength(1);
    expect(hero).toContain('<div data-testid="musical-hero-overlay" className="absolute inset-0 musical-hero-overlay" />');
  });

  it("ändert weder Hero-Geometrie, Crop oder Abstände noch Bildhandler, Show-Verzweigungen oder den vorhandenen Ticket-Handler", () => {
    expect(hero).toContain('className="musical-detail-hero relative mt-[calc(4rem+1px)] md:mt-[calc(5rem+1px)] min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden"');
    expect(hero).toContain('<div className="absolute inset-0">');
    expect(hero).toContain('className="relative z-10 container pb-6 md:pb-10 pt-40"');
    expect(hero).not.toMatch(/object-contain|object-center|scale-|transform:|objectPosition|objectFit|on(?:Load|Error|Click)\s*=|moulinrouge/);
    const mobileCta = detail.match(/\{\/\* Mobile CTA[\s\S]*?\{\/\* Content \*\/\}/)?.[0] ?? "";
    expect(mobileCta).toContain("href={heroTicketLink}");
    expect(mobileCta).toContain('onClick={() => trackDetailTicketClick("mobile-hero", heroTicketLink)}');
  });
});
