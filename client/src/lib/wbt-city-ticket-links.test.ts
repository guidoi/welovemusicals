import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getCityTicketSelection } from "./city-ticket-links";
import { getTicketProviderBrand } from "./ticket-provider-brand";
import { getSafeAffiliateTicketLink, getAffiliateOverridePartner } from "./affiliate-link-safety";

const Berlin = "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442";
const Hamburg = "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26175768";
const wbt = { ticketUrlsByCity: { Berlin, Hamburg }, defaultTicketCity: "Berlin" };

describe("WBT: explizite Stadtproduktseiten", () => {
  it("wählt Berlin nachvollziehbar als Standard und Hamburg ausschließlich über die Stadtauswahl", () => {
    expect(getCityTicketSelection(wbt, "")).toEqual({ cities: ["Berlin", "Hamburg"], city: "Berlin", url: Berlin });
    expect(getCityTicketSelection(wbt, "Hamburg").url).toBe(Hamburg);
    expect(getCityTicketSelection(wbt, "Berlin").url).toBe(Berlin);
    expect(getCityTicketSelection(wbt, "Stuttgart").url).toBe(Berlin);
    expect(getCityTicketSelection({}, "Berlin").url).toBeUndefined();
  });

  it("bewahrt beide Original-URLs ohne Fallback oder Eventim-/Awin-Umlenkung", () => {
    for (const url of [Berlin, Hamburg]) {
      expect(getSafeAffiliateTicketLink(url)).toEqual({ url, usedFallback: false });
      expect(getAffiliateOverridePartner(url)).toBe("stage");
      expect(getTicketProviderBrand("weihnachten-mit-bibi-tina", url)).toMatchObject({ id: "stage", name: "Stage Entertainment" });
    }
    expect(getTicketProviderBrand("example", "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=123").id).not.toBe("stage");
  });

  it("teilt die sichtbare Spielortwahl zwischen Keyvisual, allen CTAs, Bannern und Stadtterminen", () => {
    const detail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    for (const field of ["keyvisualLink", "ticketCtaUrl", "awinHeroUrl", "awinStickyUrl", "awinBoxUrl"]) {
      expect(detail).toContain(`cityTicketCandidate ?? musical.${field}`);
    }
    expect(detail).toContain("campaign.city === citySelection.city");
    expect(detail).toContain("onSelectedCityChange={cityTicketCandidate ? setSelectedTicketCity : undefined}");
    expect(detail).toContain('const ticketCtaCityLabel = cityTicketCandidate ? `${ticketCta.label} · ${citySelection.city}`');
    const selector = readFileSync(new URL("../components/TicketCitySelector.tsx", import.meta.url), "utf8");
    expect(selector).toContain("Produktseite & Tickets: Spielort");
    expect(selector).toContain("min-h-11");
  });
});
