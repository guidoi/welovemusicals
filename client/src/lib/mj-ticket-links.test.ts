import { describe, expect, it } from "vitest";
import {
  createAwinLink,
  EISKOENIGIN_STAGE_SHOW_PAGE_URL,
  EISKOENIGIN_STAGE_TEXT_LINK_URL,
  getMusicalBySlug,
  KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL,
  KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL,
  MJ_STAGE_SHOW_PAGE_URL,
  MJ_STAGE_TEXT_LINK_URL,
  PRADA_STAGE_SHOW_PAGE_URL,
  PRADA_STAGE_TEXT_LINK_URL,
  SALON_ROSIE_STAGE_SHOW_PAGE_URL,
  SALON_ROSIE_STAGE_TEXT_LINK_URL,
  TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL,
  TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL,
  TARZAN_STAGE_SHOW_PAGE_URL,
  TARZAN_STAGE_TEXT_LINK_URL,
  TINA_STAGE_SHOW_PAGE_URL,
  TINA_STAGE_TEXT_LINK_URL,
  UND_JULIA_STAGE_SHOW_PAGE_URL,
  UND_JULIA_STAGE_TEXT_LINK_URL,
  WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL,
  WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL,
  ZIZ_STAGE_SHOW_PAGE_URL,
  ZIZ_STAGE_TEXT_LINK_URL,
} from "./data";

const ticketPaths = (musical: ReturnType<typeof getMusicalBySlug>) => [
  musical?.ticketCtaUrl,
  musical?.eventimUrl,
  musical?.awinHeroUrl,
  musical?.awinStickyUrl,
  musical?.awinBoxUrl,
  musical?.tourDates?.[0]?.eventimUrl,
];

describe("Stage-Showseiten und Ticketshop-Deeplinks", () => {
  it("verwendet bei MJ die Show-Landingpage am Keyvisual und den Shop an allen Ticket-CTAs", () => {
    const mj = getMusicalBySlug("mj-das-michael-jackson-musical");

    expect(mj).toBeDefined();
    expect(MJ_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149402",
    );
    expect(MJ_STAGE_TEXT_LINK_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149404",
    );
    expect(mj?.keyvisualLink).toBe(MJ_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(mj)).toEqual(Array(6).fill(MJ_STAGE_TEXT_LINK_URL));
    expect(createAwinLink(MJ_STAGE_TEXT_LINK_URL)).toBe(MJ_STAGE_TEXT_LINK_URL);
  });

  it("verwendet bei König der Löwen die Show-Landingpage am Keyvisual und den Shop an allen Ticket-CTAs", () => {
    const koenigDerLoewen = getMusicalBySlug("koenig-der-loewen");

    expect(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149398",
    );
    expect(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149400",
    );
    expect(koenigDerLoewen?.keyvisualLink).toBe(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(koenigDerLoewen)).toEqual(Array(6).fill(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL));
  });

  it("trennt bei allen weiteren gelieferten Stage-Shows die Landingpage vom Ticketshop", () => {
    const stageLinkCases = [
      ["zurueck-in-die-zukunft-das-musical", ZIZ_STAGE_SHOW_PAGE_URL, ZIZ_STAGE_TEXT_LINK_URL],
      ["tina-das-tina-turner-musical", TINA_STAGE_SHOW_PAGE_URL, TINA_STAGE_TEXT_LINK_URL],
      ["und-julia", UND_JULIA_STAGE_SHOW_PAGE_URL, UND_JULIA_STAGE_TEXT_LINK_URL],
      ["disneys-musical-tarzan", TARZAN_STAGE_SHOW_PAGE_URL, TARZAN_STAGE_TEXT_LINK_URL],
      ["der-teufel-traegt-prada-das-musical", PRADA_STAGE_SHOW_PAGE_URL, PRADA_STAGE_TEXT_LINK_URL],
      ["die-eiskoenigin", EISKOENIGIN_STAGE_SHOW_PAGE_URL, EISKOENIGIN_STAGE_TEXT_LINK_URL],
      ["tanz-der-vampire", TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL, TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL],
      ["wir-sind-am-leben", WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL, WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL],
      ["salon-rosie", SALON_ROSIE_STAGE_SHOW_PAGE_URL, SALON_ROSIE_STAGE_TEXT_LINK_URL],
    ] as const;

    expect(stageLinkCases.map(([, , shopLink]) => shopLink)).toEqual([
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149412",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204072",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149396",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149416",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149420",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149428",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149436",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149440",
    ]);

    for (const [slug, showPageLink, shopLink] of stageLinkCases) {
      const musical = getMusicalBySlug(slug);

      expect(musical?.keyvisualLink).toBe(showPageLink);
      expect(ticketPaths(musical)).toEqual(Array(6).fill(shopLink));
      expect(createAwinLink(shopLink)).toBe(shopLink);
    }
  });
});
