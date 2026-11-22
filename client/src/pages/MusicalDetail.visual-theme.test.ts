import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { WARM_NEUTRAL_THEME } from "@/lib/musical-visual-theme";

const detail = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../index.css", import.meta.url), "utf8").toLowerCase();
const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8").toLowerCase();
const gallery = readFileSync(new URL("../components/MusicalGallery.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../components/Header.tsx", import.meta.url), "utf8");

function surfaceTag(source: string, surface: string) {
  return source.match(new RegExp(`<section[^>]*data-visual-surface="${surface}"[^>]*>`))?.[0] ?? "";
}

describe("Freigegebenes warmgraues Musical-Farbkonzept", () => {
  it("verwendet den gleichen warmgrauen Grundton in CSS, Critical CSS und Theme-Bootstrap", () => {
    const neutral = WARM_NEUTRAL_THEME.background.toLowerCase();
    expect(css).toContain(`--background: ${neutral};`);
    expect(css).toContain("background-color: var(--background);");
    expect(html).toContain(`background-color:${neutral}`);
    expect(html).toContain(`style.backgroundcolor = '${neutral}'`);
    expect(html).not.toContain("#1a1a2e");
    const themeColors = [...html.matchAll(/<meta name="theme-color" content="([^"]+)"/g)].map(match => match[1]);
    expect(themeColors.length).toBeGreaterThan(0);
    expect(themeColors.every(color => color === neutral)).toBe(true);
  });

  it("ordnet jeder aktiven Detailseite lokal ihre Showfarbe zu, ohne globale Showfarbe zu setzen", () => {
    expect(detail).toContain('data-testid="musical-detail-page" data-musical-id={musical.id}');
    expect(detail).toContain("style={getMusicalVisualThemeStyle(musical.id)}");
    expect(surfaceTag(detail, "hero")).toContain("musical-detail-hero");
    expect(detail).toContain('data-testid="musical-hero-overlay"');
    expect(detail).toContain("src={musical.heroImage || musical.image}");
    expect(home).not.toContain("getMusicalVisualThemeStyle");
  });

  it("färbt nur die emotionalen vorhandenen Bereiche und lässt Beschreibung und Ticketbereich neutral", () => {
    expect(surfaceTag(detail, "story")).toContain("musical-tone-section");
    expect(surfaceTag(detail, "highlights")).toContain("musical-tone-section");
    expect(surfaceTag(gallery, "gallery")).toContain("musical-tone-section");
    expect(surfaceTag(detail, "introduction")).not.toContain("musical-tone-section");
    expect(surfaceTag(detail, "tickets")).toContain("bg-background");
    expect(surfaceTag(detail, "tickets")).not.toContain("musical-tone-section");
    expect(detail).toContain("<MusicalShowFacts facts={musical.showFacts ?? []}");
    expect(detail).toContain("musical.gallery && musical.gallery.length > 0");
    expect(detail).toContain("musical.quotes && musical.quotes.length > 0");
    expect(gallery).toContain("if (!images || images.length === 0) return null;");
  });

  it("nutzt statische CSS-Verläufe ohne neue Hintergrundgrafiken oder neue Animation", () => {
    const coloredSurface = css.match(/\.musical-tone-section \{[^}]*\}/)?.[0] ?? "";
    expect(coloredSurface).toContain("linear-gradient(");
    expect(coloredSurface).toContain("var(--musical-color-deep)");
    expect(coloredSurface).toContain("var(--musical-color)");
    expect(coloredSurface).not.toContain("url(");
    expect(coloredSurface).not.toContain("animation");
    expect(css).toContain('.musical-tone-section [class*="text-cream/"]');
    expect(css).toContain('.musical-tone-section :is(.text-gold, [class*="text-gold/"])');
    expect(css).toContain("color: var(--color-gold-light);");
  });

  it("gleicht den universellen Hero-Abstand an die unveränderte Höhe des deckenden Fix-Headers an", () => {
    const headerClasses = header.match(/<header className="([^"]+)"/ )?.[1] ?? "";
    expect(headerClasses).toBe("fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-[#111111]");
    const headerContainer = header.match(/<div className="container flex items-center justify-between ([^"]+)"/)?.[1] ?? "";
    const headerHeights = headerContainer.split(/\s+/).filter(className => /(?:^|:)h-/.test(className));
    expect(headerHeights).toEqual(["h-16", "md:h-20"]);
    const heroClasses = surfaceTag(detail, "hero").match(/className="([^"]+)"/)?.[1] ?? "";
    const heroMargins = heroClasses.split(/\s+/).filter(className => /(?:^|:)mt-/.test(className));
    expect(heroMargins).toEqual(["mt-[calc(4rem+1px)]", "md:mt-[calc(5rem+1px)]"]);
    expect(heroClasses).toBe("musical-detail-hero relative mt-[calc(4rem+1px)] md:mt-[calc(5rem+1px)] min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden");
    expect(heroClasses).not.toContain("lg:mt-0");
  });

  it("behält Abschnitte, Ticketpfade und Bildmaße bei dem universellen Headerabstand unverändert bei", () => {
    const markers = ["{/* Content */}", "{/* Tour Dates */}", "{/* Story */}", "{/* Ticket CTA", "{/* Pressequotes */}", "{/* Gallery */}", "{/* Show Facts + FAQ */}", "{/* Related Musicals"];
    const positions = markers.map(marker => detail.indexOf(marker));
    expect(positions.every(position => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(surfaceTag(detail, "hero")).toContain('className="musical-detail-hero relative mt-[calc(4rem+1px)] md:mt-[calc(5rem+1px)] min-h-[60vh] md:min-h-[70vh] flex items-end overflow-hidden"');
    expect(detail).toContain('className="w-full h-full object-cover object-top"');
    expect(detail).toContain("href={boxTicketLink}");
    expect(detail).toContain("href={heroTicketLink}");
    expect(detail).toContain("href={stickyTicketLink}");
    expect(detail).toContain("landscape={desktopKeyvisualLandscape}");
    expect(detail).toContain("analyticsConsent: consent?.analytics === true");
    expect(gallery).toContain('src={image.url}');
    expect(gallery).toContain('height: "clamp(220px, 56vw, 480px)"');
    expect(home).toContain("HOME_HERO_CONTENT_TOP_CLASS");
    expect(html).toContain('id="home-scroll-bootstrap"');
  });
});
