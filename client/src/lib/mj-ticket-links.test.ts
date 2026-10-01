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
  it("verwendet bei MJ die gelieferte Show-Landingpage auch an allen Text-CTAs", () => {
    const mj = getMusicalBySlug("mj-das-michael-jackson-musical");

    expect(mj).toBeDefined();
    expect(MJ_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149402",
    );
    expect(MJ_STAGE_TEXT_LINK_URL).toBe(MJ_STAGE_SHOW_PAGE_URL);
    expect(mj?.keyvisualLink).toBe(MJ_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(mj)).toEqual(Array(6).fill(MJ_STAGE_SHOW_PAGE_URL));
    expect(createAwinLink(MJ_STAGE_TEXT_LINK_URL)).toBe(MJ_STAGE_SHOW_PAGE_URL);
  });

  it("verwendet bei König der Löwen die gelieferte Show-Landingpage auch an allen Text-CTAs", () => {
    const koenigDerLoewen = getMusicalBySlug("koenig-der-loewen");

    expect(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149398",
    );
    expect(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL).toBe(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL);
    expect(koenigDerLoewen?.keyvisualLink).toBe(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(koenigDerLoewen)).toEqual(Array(6).fill(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL));
  });

  it("trennt bei den weiteren gelieferten Stage-Shows die Landingpage vom Ticketshop", () => {
    const stageLinkCases = [
      ["der-teufel-traegt-prada-das-musical", PRADA_STAGE_SHOW_PAGE_URL, PRADA_STAGE_TEXT_LINK_URL],
      ["wir-sind-am-leben", WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL, WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL],
    ] as const;

    expect(stageLinkCases.map(([, , shopLink]) => shopLink)).toEqual([
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149416",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149436",
    ]);

    for (const [slug, showPageLink, shopLink] of stageLinkCases) {
      const musical = getMusicalBySlug(slug);

      expect(musical?.keyvisualLink).toBe(showPageLink);
      expect(ticketPaths(musical)).toEqual(Array(6).fill(shopLink));
      expect(createAwinLink(shopLink)).toBe(shopLink);
    }
  });

  it("verwendet bei ZIZ die gelieferte Stage-Produktseite auch an den Text-CTAs", () => {
    const ziz = getMusicalBySlug("zurueck-in-die-zukunft-das-musical");

    expect(ZIZ_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149410",
    );
    expect(ZIZ_STAGE_TEXT_LINK_URL).toBe(ZIZ_STAGE_SHOW_PAGE_URL);
    expect(ziz?.keyvisualLink).toBe(ZIZ_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(ziz)).toEqual(Array(6).fill(ZIZ_STAGE_SHOW_PAGE_URL));
    expect(createAwinLink(ZIZ_STAGE_TEXT_LINK_URL)).toBe(ZIZ_STAGE_SHOW_PAGE_URL);
  });

  it("verwendet bei Tanz der Vampire die gelieferte Stage-Produktseite auch an den Text-CTAs", () => {
    const tanzDerVampire = getMusicalBySlug("tanz-der-vampire");

    expect(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149426",
    );
    expect(TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL).toBe(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL);
    expect(tanzDerVampire?.keyvisualLink).toBe(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(tanzDerVampire)).toEqual(Array(6).fill(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL));
    expect(createAwinLink(TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL)).toBe(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL);
  });

  it("verwendet bei & JULIA, Salon Rosie und Eiskönigin die gelieferten Stage-Produktseiten auch an den Text-CTAs", () => {
    const productPageCases = [
      ["und-julia", UND_JULIA_STAGE_SHOW_PAGE_URL, UND_JULIA_STAGE_TEXT_LINK_URL],
      ["salon-rosie", SALON_ROSIE_STAGE_SHOW_PAGE_URL, SALON_ROSIE_STAGE_TEXT_LINK_URL],
      ["die-eiskoenigin", EISKOENIGIN_STAGE_SHOW_PAGE_URL, EISKOENIGIN_STAGE_TEXT_LINK_URL],
    ] as const;

    for (const [slug, showPageLink, textLink] of productPageCases) {
      const musical = getMusicalBySlug(slug);

      expect(textLink).toBe(showPageLink);
      expect(musical?.keyvisualLink).toBe(showPageLink);
      expect(ticketPaths(musical)).toEqual(Array(6).fill(showPageLink));
      expect(createAwinLink(textLink)).toBe(showPageLink);
    }
  });

  it("verwendet bei TINA die gelieferte Stage-Produktseite auch an den Text-CTAs", () => {
    const tina = getMusicalBySlug("tina-das-tina-turner-musical");

    expect(TINA_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204074",
    );
    expect(TINA_STAGE_TEXT_LINK_URL).toBe(TINA_STAGE_SHOW_PAGE_URL);
    expect(tina?.keyvisualLink).toBe(TINA_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(tina)).toEqual(Array(6).fill(TINA_STAGE_SHOW_PAGE_URL));
    expect(createAwinLink(TINA_STAGE_TEXT_LINK_URL)).toBe(TINA_STAGE_SHOW_PAGE_URL);
  });

  it("verwendet bei Tarzan die gelieferte Stage-Produktseite auch an den Text-CTAs", () => {
    const tarzan = getMusicalBySlug("disneys-musical-tarzan");

    expect(TARZAN_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149406",
    );
    expect(TARZAN_STAGE_TEXT_LINK_URL).toBe(TARZAN_STAGE_SHOW_PAGE_URL);
    expect(tarzan?.keyvisualLink).toBe(TARZAN_STAGE_SHOW_PAGE_URL);
    expect(ticketPaths(tarzan)).toEqual(Array(6).fill(TARZAN_STAGE_SHOW_PAGE_URL));
    expect(createAwinLink(TARZAN_STAGE_TEXT_LINK_URL)).toBe(TARZAN_STAGE_SHOW_PAGE_URL);
  });
});
