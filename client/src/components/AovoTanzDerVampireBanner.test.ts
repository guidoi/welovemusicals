import { describe, expect, it } from "vitest";
import {
  AOVO_TDV_CLICK_URL,
  AOVO_TDV_BANNER_URL,
  getAovoTdVImpressionUrl,
} from "./AovoTanzDerVampireBanner";
import { readFileSync } from "node:fs";

describe("Aovo Tanz der Vampire banner", () => {
  it("keeps the provided TradeDoubler click destination", () => {
    expect(AOVO_TDV_CLICK_URL).toBe(
      "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137318"
    );
  });

  it("uses the supplied banner as a directly served website asset and builds a cache-busted impression URL", () => {
    expect(AOVO_TDV_BANNER_URL).toBe(
      "/images/show-visuals/tanz-der-vampire-500x500.png"
    );
    expect(getAovoTdVImpressionUrl("123456789")).toBe(
      "https://imp.tradedoubler.com/imp?type(img)g(26137318)a(3492604)123456789"
    );
  });

  it("uses the Anzeige label without a visual separator line", () => {
    const componentSource = readFileSync(new URL("./AovoTanzDerVampireBanner.tsx", import.meta.url), "utf8");

    expect(componentSource).not.toContain("border-t border-gold/15");
    expect(componentSource).toContain(">Anzeige</p>");
  });
});
