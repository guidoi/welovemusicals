import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const detail = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");
const overlayRules = [...css.matchAll(/^\s*\.musical-hero-overlay\s*\{([^}]*)\}/gm)];
const overlay = overlayRules[0]?.[1].replace(/\s+/g, " ").trim() ?? "";

describe("MusicalDetail: weicher Übergang nur an der unteren Hero-Bildkante", () => {
  it("behält den oberen und mittleren Verlauf bei und blendet die letzten 15 Prozent in den Contentgrund aus", () => {
    expect(overlayRules).toHaveLength(1);
    expect(overlay).toBe(
      "background: linear-gradient( 180deg, transparent 15%, color-mix(in srgb, var(--musical-hero-deep) 35%, transparent) 45%, color-mix(in srgb, var(--musical-hero-deep) 90%, transparent) 75%, var(--musical-hero-color) 85%, var(--background) 100% );"
    );
  });

  it("endet neutral in der vorhandenen Contentfarbe statt abrupt in der Showfarbe", () => {
    const root = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(root).toContain("--background: #171717;");
    expect(overlay).toMatch(/var\(--musical-hero-color\) 85%, var\(--background\) 100% \);$/);
    expect(overlay).not.toContain("var(--musical-hero-color) 100%");
  });

  it("verwendet nur einen statischen CSS-Hintergrund ohne Bildasset, Animation oder Layoutregel", () => {
    expect(overlay.match(/;/g)).toHaveLength(1);
    expect(overlay).toMatch(/^background: linear-gradient\(/);
    expect(overlay).not.toMatch(/url\(|animation|transition|height|width|padding|margin|position|transform/);
  });

  it("belässt den Verlauf auf dem vorhandenen Bildoverlay und hält Herohöhe, Crop und Inhaltsabstände fest", () => {
    expect(detail).toContain('<div data-testid="musical-hero-overlay" className="absolute inset-0 musical-hero-overlay" />');
    expect(detail).toContain('className="musical-detail-hero relative mt-[calc(4rem+1px)] md:mt-[calc(5rem+1px)] min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden"');
    expect(detail).toContain("src={musical.heroImage || musical.image}");
    expect(detail).toContain('className="w-full h-full object-cover object-top"');
    expect(detail).toContain('className="relative z-10 container pb-6 md:pb-10 pt-40"');
    expect(detail.match(/data-testid="musical-hero-overlay"/g)).toHaveLength(1);
  });

  it("zeigt oben mehr vom bestehenden Hero allein durch den Startabstand, nicht durch neue Assets oder andere Skalierung", () => {
    const hero = detail.match(/<section data-visual-surface="hero"[\s\S]*?<\/section>/)?.[0] ?? "";
    expect(hero).toContain('className="musical-detail-hero relative mt-[calc(4rem+1px)] md:mt-[calc(5rem+1px)] min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden"');
    expect(hero).toContain('<div className="absolute inset-0">');
    expect(hero.match(/<img\b/g)).toHaveLength(1);
    const imageTag = hero.match(/<img\b[\s\S]*?\/>/)?.[0].replace(/\s+/g, " ").trim();
    expect(imageTag).toBe('<img src={musical.heroImage || musical.image} alt={musical.title} className="w-full h-full object-cover object-top" decoding="async" sizes="100vw" />');
    expect(hero).not.toMatch(/object-contain|object-center|scale-|transform:|objectPosition|objectFit/);
  });
});
