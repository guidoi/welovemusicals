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

  it("rendert den einfachen goldenen Rahmen ohne Lichtpunkte, Glüheffekt oder Animation", () => {
    const markup = render(campaign);
    const notice = markup.match(/<aside[^>]*>/)?.[0];
    expect(notice).toContain("rounded-xl border border-gold/45 bg-black");
    expect(markup).not.toMatch(/black-sale-frame-lights|black-sale-notice-(?:frame|light)|--black-sale-light/);
    expect(markup.match(/<span\b/g)).toHaveLength(1); // Nur das BLACK-SALE-Label, keine dekorativen Lichtpunkte.
    expect(markup).not.toContain('style="');
    expect(markup).not.toMatch(/animate-|shadow-|theat(?:re|er)-light/);
    expect(noticeSource).not.toMatch(/FRAME_LIGHT_POSITIONS|setTimeout|setInterval|useEffect|requestAnimationFrame|animation|animate-/);
    expect(indexCss).not.toMatch(/\.black-sale-notice\b|black-sale-frame-light|--black-sale-light|theat(?:re|er)-light/);
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
