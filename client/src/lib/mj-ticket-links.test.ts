import { describe, expect, it } from "vitest";
import { getMusicalBySlug, MJ_STAGE_TEXT_LINK_URL } from "./data";

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
  });
});
