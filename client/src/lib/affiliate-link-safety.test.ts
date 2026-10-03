import { describe, expect, it } from "vitest";
import { getSafeAffiliateTicketLink, isSafeAffiliateTicketUrl } from "./affiliate-link-safety";

describe("Affiliate-Link-Sicherheitsnetz", () => {
  const directStage = "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149398";
  const tradeDoublerCampaign = "https://clk.tradedoubler.com/click?p=377032&a=3492604&g=26137318";
  const awinTextLink = "https://www.awin1.com/awclick.php?gid=492097&mid=11388&awinaffid=2865727&linkid=4568988&clickref=kdl-cta";
  const awinCreative = "https://www.awin1.com/cread.php?s=4568827&v=11388&q=492097&r=2865727";
  const awinWrappedEventim = "https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&ued=https%3A%2F%2Fwww.eventim.de%2Fartist%2Fexample%2F";

  it("behält gültige direkte Stage- und Awin-Ziele unverändert", () => {
    expect(isSafeAffiliateTicketUrl(directStage)).toBe(true);
    expect(isSafeAffiliateTicketUrl(tradeDoublerCampaign)).toBe(true);
    expect(isSafeAffiliateTicketUrl(awinTextLink)).toBe(true);
    expect(isSafeAffiliateTicketUrl(awinCreative)).toBe(true);
    expect(isSafeAffiliateTicketUrl(awinWrappedEventim)).toBe(true);
    expect(getSafeAffiliateTicketLink(directStage)).toEqual({ url: directStage, usedFallback: false });
  });

  it("sperrt defekte Netzwerkparameter statt einen ungetrackten oder doppelten Link zu öffnen", () => {
    expect(isSafeAffiliateTicketUrl("https://visit.stage-entertainment.de/click?p=394206&a=3492604")).toBe(false);
    expect(isSafeAffiliateTicketUrl("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149398&ttid=18")).toBe(false);
    expect(isSafeAffiliateTicketUrl("https://www.awin1.com/awclick.php?gid=492097&mid=11388&linkid=4568988")).toBe(false);
    expect(isSafeAffiliateTicketUrl("https://www.awin1.com/cread.php?awinmid=11388&awinaffid=2865727&ued=javascript%3Aalert%281%29")).toBe(false);
  });

  it("verwendet bei fehlerhaften Links einen gültigen show-spezifischen Primärpfad und sonst die offizielle Anbieteradresse", () => {
    expect(getSafeAffiliateTicketLink("javascript:alert(1)", directStage)).toEqual({
      url: directStage,
      usedFallback: true,
      reason: "invalid-url",
    });
    expect(getSafeAffiliateTicketLink("https://visit.stage-entertainment.de/click?p=394206&a=wrong&g=26149398")).toEqual({
      url: "https://www.stage-entertainment.de/",
      usedFallback: true,
      reason: "invalid-affiliate-parameters",
    });
    expect(getSafeAffiliateTicketLink("https://www.awin1.com/awclick.php?mid=111888")).toEqual({
      url: "https://www.atgtickets.de/",
      usedFallback: true,
      reason: "invalid-affiliate-parameters",
    });
  });
});
