import { describe, expect, it } from "vitest";
import {
  AOVO_TDV_BANNER_URL,
  AOVO_TDV_CLICK_URL,
  getAovoTdVImpressionUrl,
} from "./AovoTanzDerVampireBanner";

describe("Aovo Tanz der Vampire banner", () => {
  it("keeps the provided TradeDoubler click destination", () => {
    expect(AOVO_TDV_CLICK_URL).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137304"
    );
  });

  it("builds the provided cache-busted square-banner impression URL", () => {
    expect(AOVO_TDV_BANNER_URL).toBe(
      "/manus-storage/tanz-der-vampire-ticket-hotel-square_6987ea6b.png"
    );
    expect(getAovoTdVImpressionUrl("123456789")).toBe(
      "https://imp.tradedoubler.com/imp?type(img)g(26137304)a(3492604)123456789"
    );
  });
});
