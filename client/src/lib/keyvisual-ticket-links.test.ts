import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "./data";

describe("Keyvisual-Ticketlinks", () => {
  it("verbindet jedes aktive Keyvisual mit einem direkten sicheren Ticketlink", () => {
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
});
