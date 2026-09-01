import { describe, expect, it } from "vitest";
import {
  AOVO_TDV_CLICK_URL,
  AOVO_TDV_FALLBACK_BANNER_URL,
  getAovoTdVImpressionUrl,
} from "./AovoTanzDerVampireBanner";

describe("Aovo Tanz der Vampire banner", () => {
  it("keeps the provided TradeDoubler click destination", () => {
    expect(AOVO_TDV_CLICK_URL).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137318"
    );
  });

  it("uses the supplied banner as a local fallback and builds a cache-busted impression URL", () => {
    expect(AOVO_TDV_FALLBACK_BANNER_URL).toBe(
      "/manus-storage/tanz-der-vampire-ticket-hotel-banner_93366e33.png"
    );
    expect(getAovoTdVImpressionUrl("123456789")).toBe(
      "https://imp.tradedoubler.com/imp?type(img)g(26137318)a(3492604)123456789"
    );
  });
});
