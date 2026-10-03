import { describe, expect, it } from "vitest";
import { isValidAffiliateOverrideTarget } from "./_affiliate-target-validation";

describe("manuelle Affiliate-Zielvalidierung", () => {
  it("akzeptiert nur direkte, partnergebundene Trackingziele", () => {
    expect(isValidAffiliateOverrideTarget("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149398", "stage")).toBe(true);
    expect(isValidAffiliateOverrideTarget("https://www.awin1.com/cread.php?s=4568827&v=11388&q=492097&r=2865727", "eventim")).toBe(true);
    expect(isValidAffiliateOverrideTarget("https://www.awin1.com/cread.php?s=4882557&v=111888&q=614186&r=2865727", "atg")).toBe(true);
    expect(isValidAffiliateOverrideTarget("https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137318", "tradedoubler")).toBe(true);
  });

  it("lehnt ungetrackte, falsche oder partnerfremde Ziele ab", () => {
    expect(isValidAffiliateOverrideTarget("https://www.eventim.de/artist/example", "eventim")).toBe(false);
    expect(isValidAffiliateOverrideTarget("https://visit.stage-entertainment.de/click?p=394206&a=999&g=1", "stage")).toBe(false);
    expect(isValidAffiliateOverrideTarget("https://www.awin1.com/cread.php?s=4882557&v=111888&q=614186&r=2865727", "eventim")).toBe(false);
    expect(isValidAffiliateOverrideTarget("javascript:alert(1)", "eventim")).toBe(false);
  });
});
