import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BlackSaleNotice from "./BlackSaleNotice";
import type { BlackSaleCampaign } from "@/lib/black-sale";

const campaign: BlackSaleCampaign = {
  musicalIds: ["und-julia", "mj-musical"], maxDiscountPercent: 40, endsOn: "2026-11-30",
};

function render(value: BlackSaleCampaign | null) {
  return renderToStaticMarkup(<BlackSaleNotice campaign={value} onViewShows={() => undefined} />);
}

const noticeSource = readFileSync(new URL("./BlackSaleNotice.tsx", import.meta.url), "utf8");
const indexCss = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const frameCss = indexCss.slice(indexCss.indexOf("/* BLACK SALE:"));

// Extract complete CSS blocks, including nested media queries / keyframes.
function cssBlock(css: string, selector: string) {
  const start = css.indexOf(selector);
  expect(start, `Missing CSS block: ${selector}`).toBeGreaterThanOrEqual(0);
  const opening = css.indexOf("{", start);
  let depth = 1;
  let end = opening + 1;
  while (end < css.length && depth > 0) {
    if (css[end] === "{") depth++;
    if (css[end] === "}") depth--;
    end++;
  }
  expect(depth).toBe(0);
  return css.slice(opening + 1, end - 1);
}

describe("BlackSaleNotice", () => {
  it("rendert ohne aktives Angebot gar nichts und reserviert keinen Platz", () => {
    expect(render(null)).toBe("");
  });

  it("zeigt die dynamische Ersparnis, das Sheet-Ende, den CTA und Anbieterbedingungen", () => {
    const markup = render(campaign);
    expect(markup).toContain("BLACK SALE");
    expect(markup).toContain("Bis zu 40 % sparen");
    expect(markup).toContain('<time dateTime="2026-11-30">30.11.2026</time>');
    expect(markup).toContain("Aktionsshows ansehen");
    expect(markup).toContain("Ausgewählte Shows und Vorstellungen; Bedingungen beim Anbieter");
    expect(markup).not.toContain("Stuttgart");
    expect(markup).not.toContain("<img");
    expect(markup).not.toMatch(/fixed|sticky|role="dialog"/);
  });

  it("rendert ausschließlich am Außenrahmen verborgene, nicht-interaktive Goldlichter", () => {
    const markup = render(campaign);
    const frame = markup.match(/<div[^>]*data-testid="black-sale-frame-lights"[^>]*>(.*?)<\/div>/)?.[0];
    expect(frame).toContain('aria-hidden="true"');
    expect(frame).toContain("pointer-events-none");
    expect(frame).not.toMatch(/BLACK SALE|<button|<a\b|tabindex|<img|<svg/);
    const lights = Array.from((frame ?? "").matchAll(/<span class="black-sale-notice-light" style="([^"]+)"/g));
    expect(lights).toHaveLength(24);
    const coordinates = lights.map(([, style]) => ({
      x: Number(style.match(/--black-sale-light-x:(\d+)%/)?.[1]),
      y: Number(style.match(/--black-sale-light-y:(\d+)%/)?.[1]),
    }));
    expect(coordinates.every(({ x, y }) => x === 0 || x === 100 || y === 0 || y === 100)).toBe(true);
    for (const side of [0, 100]) {
      expect(coordinates.some(({ x }) => x === side)).toBe(true);
      expect(coordinates.some(({ y }) => y === side)).toBe(true);
    }
    expect(cssBlock(frameCss, ".black-sale-notice-frame")).toContain("pointer-events: none;");
    expect(cssBlock(frameCss, ".black-sale-notice-light")).toContain("width: 3px;");
    expect(cssBlock(frameCss, ".black-sale-notice-light")).toContain("height: 3px;");
  });

  it("läuft einmal sanft gestaffelt und endet einschließlich der letzten Verzögerung innerhalb von fünf Sekunden", () => {
    const motion = cssBlock(frameCss, "@media (prefers-reduced-motion: no-preference)");
    const animation = cssBlock(motion, ".black-sale-notice-light::after");
    expect(animation).toContain("animation-name: black-sale-frame-light-once;");
    expect(animation).toContain("animation-iteration-count: 1;");
    expect(animation).toContain("animation-fill-mode: both;");
    const duration = Number(animation.match(/animation-duration:\s*(\d+)ms;/)?.[1]);
    const stagger = Number(animation.match(/animation-delay:\s*calc\(var\(--black-sale-light-order\) \* (\d+)ms\);/)?.[1]);
    const orders = Array.from(render(campaign).matchAll(/--black-sale-light-order:(\d+)/g)).map(([, order]) => Number(order));
    expect(orders).toEqual(Array.from({ length: 24 }, (_, order) => order));
    expect(duration).toBeGreaterThan(0);
    expect(stagger).toBeGreaterThan(0);
    expect(duration + Math.max(...orders) * stagger).toBeLessThanOrEqual(5000);
    expect(frameCss).not.toMatch(/infinite|rotate|animation-play-state/);
    expect(noticeSource).not.toMatch(/setTimeout|setInterval|useEffect|requestAnimationFrame|animate-/);
  });

  it("bleibt bei Reduced Motion von Anfang an statisch und verändert nur die Deckkraft/Skalierung der Lichtdeko", () => {
    const mediaSelector = "@media (prefers-reduced-motion: no-preference)";
    const motion = cssBlock(frameCss, mediaSelector);
    const outsideMotion = frameCss.replace(`${mediaSelector} {${motion}}`, "");
    // Without no-preference, no animation declaration can apply at all.
    expect(outsideMotion).not.toMatch(/animation(?:-[a-z-]+)?\s*:/);
    expect(motion.match(/\.black-sale-[^{]+\{/g)).toEqual([".black-sale-notice-light::after {"]);
    const glow = cssBlock(frameCss, ".black-sale-notice-light::after");
    expect(glow).toContain("opacity: 0.35;");
    expect(glow).toContain("transform: scale(0.92);");
    const keyframes = cssBlock(frameCss, "@keyframes black-sale-frame-light-once");
    const finalState = cssBlock(keyframes, "0%, 100%");
    expect(finalState).toContain("opacity: 0.35;");
    expect(finalState).toContain("transform: scale(0.92);");
    const animatedProperties = Array.from(keyframes.matchAll(/([a-z-]+)\s*:/g)).map(([, property]) => property);
    expect(Array.from(new Set(animatedProperties)).sort()).toEqual(["opacity", "transform"]);
  });

  it("bleibt weiß lesbar mit mobilem Padding und Tastaturfokus", () => {
    const markup = render(campaign);
    const cta = markup.match(/<button[^>]*>/)?.[0];
    expect(cta).toContain('type="button"');
    expect(cta).toContain("min-h-11");
    expect(cta).toContain("px-5 py-3");
    expect(cta).toContain("text-white");
    expect(cta).toContain("focus-visible:ring-2");
    expect(cta).toContain("w-full");
  });

  it("erfindet keine Prozente für nicht-prozentuale Ticketaktionen", () => {
    const markup = render({ ...campaign, maxDiscountPercent: null, endsOn: "2026-11-26" });
    expect(markup).toContain("Ticketangebote sichern");
    expect(markup).toContain("26.11.2026");
    expect(markup).not.toContain("% sparen");
  });

  it("steht direkt vor den Top-Musicals, ohne Hero-Abstand oder zusätzlichen Kartenkatalog", () => {
    const home = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
    const highlights = home.indexOf('{/* ===== FEATURED MUSICALS ===== */}');
    const notice = home.indexOf("<BlackSaleNotice");
    const heading = home.indexOf("Top Musical-Empfehlungen");
    expect(notice).toBeGreaterThan(highlights);
    expect(notice).toBeLessThan(heading);
    expect(home).toContain('${MOBILE_HERO_NAVIGATION_BOTTOM_CLASS} ${DESKTOP_HERO_HIGHLIGHTS_TOP_CLASS} pb-16');
    expect(home.match(/<MusicalCard\b/g)).toHaveLength(2); // Bestehende Highlights + bestehender Katalog.
    expect(home).toContain("getBlackSaleCampaign(managedMusicals, saleNow)");
    expect(home).toContain("result = result.filter((musical) => saleIds.has(musical.id))");
    expect(home).not.toContain("blackSaleCampaign.musicalIds.map");
  });

  it("verknüpft CTA und sichtbaren Reset mit dem existierenden Katalog und Standardfiltern", () => {
    const home = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
    const ctaHandler = home.slice(home.indexOf("const handleViewSaleShows"), home.indexOf("const handleViewSaleShows") + 600);
    expect(ctaHandler).toContain("resetToAdditionalOverview()");
    expect(ctaHandler).toContain("setSaleOnly(true)");
    expect(ctaHandler).toContain("setShowCompleteCatalog(true)");
    expect(ctaHandler).toContain("setShowAllMusicals(true)");
    expect(ctaHandler).toContain("window.setTimeout(scrollToFilterPanel, 80)");
    expect(home).toContain("BLACK SALE-Filter aufheben");
    expect(home).toContain('if (category === "alle") setSaleOnly(false)');
    expect(home).toContain("onFiltersReset={resetToAdditionalOverview}");
    const reset = home.slice(home.indexOf("const resetToAdditionalOverview"), home.indexOf("const handleViewSaleShows"));
    expect(reset).toContain("setSaleOnly(false)");
    expect(reset).toContain('setCategoryFilter("alle")');
    expect(reset).toContain('setCountryFilter("alle")');
    expect(reset).toContain('setCityFilter("alle")');
  });
});
