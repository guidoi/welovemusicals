import { describe, expect, it } from "vitest";
import {
  EISKOENIGIN_STAGE_SHOW_PAGE_URL,
  getActiveMusicals,
  KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL,
  MJ_STAGE_SHOW_PAGE_URL,
  PRADA_STAGE_SHOW_PAGE_URL,
  SALON_ROSIE_STAGE_SHOW_PAGE_URL,
  TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL,
  TARZAN_STAGE_SHOW_PAGE_URL,
  TINA_STAGE_SHOW_PAGE_URL,
  UND_JULIA_STAGE_SHOW_PAGE_URL,
  WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL,
  ZIZ_STAGE_SHOW_PAGE_URL,
} from "./data";

describe("Keyvisual-Affiliate-Links", () => {
  it("verbindet jedes aktive Keyvisual mit einem sicheren HTTPS-Partnerlink", () => {
    const activeMusicals = getActiveMusicals();

    expect(activeMusicals).toHaveLength(20);

    for (const musical of activeMusicals) {
      expect(musical.keyvisual, `${musical.title} benötigt ein Keyvisual`).toBeTruthy();
      expect(musical.keyvisualLink, `${musical.title} benötigt einen Keyvisual-Deeplink`).toBeTruthy();

      const keyvisualUrl = new URL(musical.keyvisualLink!);
      expect(keyvisualUrl.protocol, `${musical.title} muss HTTPS verwenden`).toBe("https:");
      expect([
        "visit.stage-entertainment.de",
        "www.awin1.com",
        "www.eventim.de",
        "www.atgtickets.de",
      ]).toContain(keyvisualUrl.hostname);
    }
  });

  it("führt die Stage-Keyvisuals bewusst auf die jeweilige offizielle Show-Landingpage statt direkt in den Shop", () => {
    const stageShowPages = {
      "koenig-der-loewen": KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL,
      "mj-musical": MJ_STAGE_SHOW_PAGE_URL,
      eiskoenigin: EISKOENIGIN_STAGE_SHOW_PAGE_URL,
      tarzan: TARZAN_STAGE_SHOW_PAGE_URL,
      ziz: ZIZ_STAGE_SHOW_PAGE_URL,
      "teufel-traegt-prada": PRADA_STAGE_SHOW_PAGE_URL,
      "wir-sind-am-leben": WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL,
      "tanz-der-vampire": TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL,
      "salon-rosie": SALON_ROSIE_STAGE_SHOW_PAGE_URL,
      "und-julia": UND_JULIA_STAGE_SHOW_PAGE_URL,
      "tina-das-musical": TINA_STAGE_SHOW_PAGE_URL,
    } as const;

    for (const [id, showPageLink] of Object.entries(stageShowPages)) {
      const musical = getActiveMusicals().find((entry) => entry.id === id);

      expect(musical?.keyvisualLink).toBe(showPageLink);
      expect(musical?.keyvisualLink).not.toBe(musical?.eventimUrl);
    }
  });
});
