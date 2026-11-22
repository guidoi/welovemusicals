import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getCityTicketSelection } from "./city-ticket-links";
import { getTicketProviderBrand } from "./ticket-provider-brand";
import { getSafeAffiliateTicketLink, getAffiliateOverridePartner } from "./affiliate-link-safety";
import { getMusicalBySlug } from "./data";

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
    expect(getCityTicketSelection(wbt, "alle").url).toBe(Berlin);
  });

  it("bewahrt beide Original-URLs ohne Fallback oder Eventim-/Awin-Umlenkung", () => {
    for (const url of [Berlin, Hamburg]) {
      expect(getSafeAffiliateTicketLink(url)).toEqual({ url, usedFallback: false });
      expect(getAffiliateOverridePartner(url)).toBe("stage");
      expect(getTicketProviderBrand("weihnachten-mit-bibi-tina", url)).toMatchObject({ id: "stage", name: "Stage Entertainment" });
    }
    expect(getTicketProviderBrand("example", "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=123").id).not.toBe("stage");
  });

  it("bewahrt die Stadtlinks ohne zusätzliche Spielort-Auswahlfelder außerhalb der Tourtermine", () => {
    const detail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    for (const field of ["keyvisualLink", "ticketCtaUrl", "awinHeroUrl", "awinStickyUrl", "awinBoxUrl"]) {
      expect(detail).toContain(`cityTicketCandidate ?? musical.${field}`);
    }
    expect(detail).toContain("campaign.city === citySelection.city");
    expect(detail).toContain("onSelectedCityChange={cityTicketCandidate ? setSelectedTicketCity : undefined}");
    expect(detail).toContain('const ticketCtaCityLabel = showTicketCityInLabel ? `${ticketCta.label} · ${citySelection.city}`');
    expect(detail).not.toContain("TicketCitySelector");
    expect(detail).not.toContain("ticketCitySelector");
    expect(detail).not.toContain("Produktseite & Tickets: Spielort");
    expect(detail).toContain('selectedCity={cityTicketCandidate ? selectedTicketCity || "alle" : undefined}');
    expect(detail).toContain('hideCityFilter={musical.id === "weihnachten-mit-bibi-tina"}');
    expect(detail).toContain('`Aktuell: ${ticketCtaCityLabel} – direkt bei ${ticketProviderName}.`');
  });

  it("nennt bei WBT in allgemeinen Aktions- und Preis-CTAs keine einzelne Stadt", () => {
    const detail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    expect(detail).toContain('const showTicketCityInLabel = Boolean(cityTicketCandidate) && musical.id !== "weihnachten-mit-bibi-tina";');
    expect(detail).toContain('const stickyTicketCtaCityLabel = showTicketCityInLabel ? `${stickyTicketCta.label} · ${citySelection.city}` : stickyTicketCta.label;');
    expect(detail).toContain('${showTicketCityInLabel ? ` in ${citySelection.city}` : ""}');
    expect(detail).toContain("href={heroTicketLink}");
    expect(detail).toContain("href={boxTicketLink}");
    expect(detail).toContain("href={stickyTicketLink}");
    const musical = getMusicalBySlug("weihnachten-mit-bibi-tina")!;
    expect(musical.ticketUrlsByCity).toEqual({ Berlin, Hamburg });
    expect(musical.tourDates?.map((date) => date.eventimUrl)).toEqual([Berlin, Hamburg]);
  });

  it("zeigt beide Städte samt Theater auch ohne einzelne Hauptstadt im Detailheader", () => {
    const musical = getMusicalBySlug("weihnachten-mit-bibi-tina")!;
    expect(musical.city).toBeUndefined();
    expect(musical.cities).toEqual(["Berlin", "Hamburg"]);
    expect(musical.venuePerCity).toEqual({
      Berlin: "Stage Theater des Westens",
      Hamburg: "Stage Operettenhaus",
    });
    const detail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
    expect(detail).toContain("musical.venuePerCity && musical.cities?.length ? (");
    expect(detail).not.toContain("musical.city && musical.venuePerCity ? (");
    expect(detail).toContain("{c} ({musical.venuePerCity![c]})");
  });
});
