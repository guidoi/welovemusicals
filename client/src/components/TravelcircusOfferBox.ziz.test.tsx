import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TravelcircusOfferBox from "./TravelcircusOfferBox";
import { getAovoCampaigns } from "./AovoCampaignBanner";
import { getTravelcircusOffer, ZIZ_TRAVELCIRCUS_OFFER as offer } from "@/lib/travelcircus-offers";
const html = () => renderToStaticMarkup(<TravelcircusOfferBox offer={offer} />);
describe("ZIZ Travelcircus-Reisebox – Nutzerfreigabe 27.11.2026", () => {
  it("verwendet den exakten eigenen Awin-Deeplink", () => {
    expect(getTravelcircusOffer("ziz")).toBe(offer);
    expect(offer.affiliateUrl).toBe("https://www.awin1.com/cread.php?awinmid=9151&awinaffid=2865727&ued=https%3A%2F%2Fwww.travelcircus.de%2Fzurueck-in-die-zukunft-das-musical");
    const url = new URL(offer.affiliateUrl);
    expect(Array.from(url.searchParams.keys()).sort()).toEqual(["awinaffid", "awinmid", "ued"]);
    expect(html()).toContain(offer.affiliateUrl.replace(/&/g, "&amp;"));
  });
  it("zeigt Preise, goldenen Streichpreis und genau die vier Leistungen ohne Shuttle", () => {
    const h = html();
    expect(h).toContain("109,00");
    expect(h).toContain("140,00");
    expect(h).toMatch(/<del[^>]*text-gold/);
    expect(h).toContain("Nur für kurze Zeit");
    expect(h).toContain("pro Person");
    expect(h).toContain("Übernachtung im Premium Hotel deiner Wahl");
    expect(h).toContain("Tägliches Frühstück im gewählten Hotel");
    expect(h).toContain("Tickets für ZURÜCK IN DIE ZUKUNFT – Das Musical im Stage Operettenhaus");
    expect(h).toContain("Weitere Extras, je nach gewähltem Hotel");
    expect(h).not.toMatch(/Schiff|Shuttle|Bestpreisgarantie|Stornierung|Kostenlos stornierbar/);
  });
  it("zeigt das volle Querformat-Foto ohne Crop", () => {
    expect(html()).toContain("XxADQYrfPPmcfRnP.webp");
    expect(html()).toContain("Key Art · ZURÜCK IN DIE ZUKUNFT – Das Musical");
    expect(html()).toContain("object-contain");
    expect(html()).not.toMatch(/object-cover|scale-|manus-storage/);
  });
  it("behält Logo und Stage-Banner unverändert", () => {
    expect(html()).toContain("NFyuZHcQZdnHEeat.jpg");
    expect((html().match(/<a /g) ?? []).length).toBe(2);
    expect(html()).not.toMatch(/<script|<iframe|cshow\.php|noreferrer/);
    expect(getAovoCampaigns("ziz").length).toBeGreaterThan(0);
    const detail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    expect(detail).toContain('const relocatedStageCampaign = travelcircusOffer');
    expect(readFileSync(new URL("../pages/CityDetail.tsx", import.meta.url), "utf8")).not.toContain("ZIZ_TRAVELCIRCUS_OFFER");
  });
});
