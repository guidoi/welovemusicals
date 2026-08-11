import { describe, expect, it } from "vitest";
import { musicals } from "../client/src/lib/data";

const KDL_STAGE_PRODUCT_URL = "https://www.stage-entertainment.de/musicals-shows/b/disneys-der-koenig-der-loewen-hamburg";

describe("Affiliate-Link-Zuordnung", () => {
  it("verwendet für König der Löwen die direkte Stage-Entertainment-Produktseite an allen Ticket-CTAs", () => {
    const kdl = musicals.find((musical) => musical.id === "koenig-der-loewen");

    expect(kdl).toBeDefined();
    expect(kdl?.keyvisualLink).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.ticketCtaUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.eventimUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.awinHeroUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.awinStickyUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.awinBoxUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.tourDates?.[0]?.eventimUrl).toBe(KDL_STAGE_PRODUCT_URL);
  });
});
