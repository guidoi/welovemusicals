import { describe, expect, it } from "vitest";
import {
  createAwinLink,
  EISKOENIGIN_STAGE_TEXT_LINK_URL,
  getMusicalBySlug,
  KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL,
  MJ_STAGE_TEXT_LINK_URL,
  PRADA_STAGE_TEXT_LINK_URL,
  SALON_ROSIE_STAGE_TEXT_LINK_URL,
  TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL,
  TARZAN_STAGE_TEXT_LINK_URL,
  TINA_STAGE_TEXT_LINK_URL,
  UND_JULIA_STAGE_TEXT_LINK_URL,
  WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL,
  ZIZ_STAGE_TEXT_LINK_URL,
} from "./data";

describe("MJ Stage-Entertainment-Textlink", () => {
  it("verwendet die neue TradeDoubler-Kampagne an allen Ticket-CTAs außerhalb von Banneranzeigen", () => {
    const mj = getMusicalBySlug("mj-das-michael-jackson-musical");

    expect(mj).toBeDefined();
    expect(MJ_STAGE_TEXT_LINK_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149402"
    );
    expect([
      mj?.keyvisualLink,
      mj?.ticketCtaUrl,
      mj?.eventimUrl,
      mj?.awinHeroUrl,
      mj?.awinStickyUrl,
      mj?.awinBoxUrl,
      mj?.tourDates?.[0]?.eventimUrl,
    ]).toEqual(Array(7).fill(MJ_STAGE_TEXT_LINK_URL));
    expect(createAwinLink(MJ_STAGE_TEXT_LINK_URL)).toBe(MJ_STAGE_TEXT_LINK_URL);
  });

  it("verwendet den bereitgestellten König-der-Löwen-Stage-Textlink für jeden Ticketpfad", () => {
    const koenigDerLoewen = getMusicalBySlug("koenig-der-loewen");

    expect(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149398",
    );
    expect([
      koenigDerLoewen?.keyvisualLink,
      koenigDerLoewen?.ticketCtaUrl,
      koenigDerLoewen?.eventimUrl,
      koenigDerLoewen?.awinHeroUrl,
      koenigDerLoewen?.awinStickyUrl,
      koenigDerLoewen?.awinBoxUrl,
      koenigDerLoewen?.tourDates?.[0]?.eventimUrl,
    ]).toEqual(Array(7).fill(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL));
    expect(createAwinLink(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL)).toBe(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL);
  });

  it("verwendet jeden weiteren gelieferten Stage-Textlink für CTA, Keyvisual und Terminbutton", () => {
    const stageTextLinkCases = [
      ["zurueck-in-die-zukunft-das-musical", ZIZ_STAGE_TEXT_LINK_URL],
      ["tina-das-tina-turner-musical", TINA_STAGE_TEXT_LINK_URL],
      ["und-julia", UND_JULIA_STAGE_TEXT_LINK_URL],
      ["disneys-musical-tarzan", TARZAN_STAGE_TEXT_LINK_URL],
      ["der-teufel-traegt-prada-das-musical", PRADA_STAGE_TEXT_LINK_URL],
      ["die-eiskoenigin", EISKOENIGIN_STAGE_TEXT_LINK_URL],
      ["tanz-der-vampire", TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL],
      ["wir-sind-am-leben", WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL],
      ["salon-rosie", SALON_ROSIE_STAGE_TEXT_LINK_URL],
    ] as const;

    expect(stageTextLinkCases.map(([, link]) => link)).toEqual([
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149410",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204074",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149394",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149406",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149414",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149418",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149426",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149434",
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149438",
    ]);

    for (const [slug, link] of stageTextLinkCases) {
      const musical = getMusicalBySlug(slug);

      expect([
        musical?.keyvisualLink,
        musical?.ticketCtaUrl,
        musical?.eventimUrl,
        musical?.awinHeroUrl,
        musical?.awinStickyUrl,
        musical?.awinBoxUrl,
        musical?.tourDates?.[0]?.eventimUrl,
      ]).toEqual(Array(7).fill(link));
      expect(createAwinLink(link)).toBe(link);
    }
  });
});
