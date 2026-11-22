import { describe, expect, it } from "vitest";
import {
  AWIN_PUBLISHER_ID,
  createAwinLink,
  getMusicalBySlug,
  TARZAN_STAGE_TEXT_LINK_URL,
  TINA_STAGE_TEXT_LINK_URL,
  WBT_STAGE_BERLIN_TEXT_LINK_URL,
  WBT_STAGE_HAMBURG_TEXT_LINK_URL,
} from "./data";
import { getAffiliateOverridePartner, getSafeAffiliateTicketLink } from "./affiliate-link-safety";
import { getTicketProviderBrand } from "./ticket-provider-brand";

const approvedProductPages = [
  ["salon-rosie", "26149438"],
  ["wir-sind-am-leben", "26149434"],
  ["tanz-der-vampire", "26149426"],
  ["die-eiskoenigin", "26149418"],
  ["der-teufel-traegt-prada-das-musical", "26149414"],
  ["zurueck-in-die-zukunft-das-musical", "26149410"],
  ["mj-das-michael-jackson-musical", "26149402"],
  ["koenig-der-loewen", "26149398"],
  ["und-julia", "26149394"],
] as const;

const ticketFields = [
  "keyvisualLink",
  "ticketCtaUrl",
  "eventimUrl",
  "awinHeroUrl",
  "awinStickyUrl",
  "awinBoxUrl",
] as const;

describe("Freigegebene Stage-Produktseiten-Clicklinks vom 22.11.2026", () => {
  it.each(approvedProductPages)("verwendet bei %s exakt die freigegebene g-ID %s an allen Textlink-Einsatzstellen", (slug, groupId) => {
    const musical = getMusicalBySlug(slug);
    const expected = `https://clk.tradedoubler.com/click?p=394206&a=3492604&g=${groupId}`;

    expect(musical).toBeDefined();
    for (const field of ticketFields) {
      expect(musical?.[field], field).toBe(expected);
    }
    expect(musical?.tourDates?.length).toBeGreaterThan(0);
    for (const date of musical?.tourDates ?? []) {
      expect(date.eventimUrl, date.city).toBe(expected);
    }

    expect(createAwinLink(expected)).toBe(expected);
    expect(getSafeAffiliateTicketLink(expected)).toEqual({ url: expected, usedFallback: false });
    expect(getAffiliateOverridePartner(expected)).toBe("stage");
    expect(getTicketProviderBrand(slug, expected)).toMatchObject({ id: "stage", name: "Stage Entertainment" });
    expect([...new URL(expected).searchParams.keys()]).toEqual(["p", "a", "g"]);
  });

  it("lässt nicht neu gelieferte TINA-/Tarzan-Textlinks sowie die freigegebenen WBT-Stadtziele unverändert", () => {
    expect(TINA_STAGE_TEXT_LINK_URL).toBe("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204074");
    expect(TARZAN_STAGE_TEXT_LINK_URL).toBe("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408");
    expect(WBT_STAGE_BERLIN_TEXT_LINK_URL).toBe("https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442");
    expect(WBT_STAGE_HAMBURG_TEXT_LINK_URL).toBe("https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26175768");
    expect(AWIN_PUBLISHER_ID).toBe("2865727");
  });
});
