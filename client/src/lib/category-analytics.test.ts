import { afterEach, describe, expect, it, vi } from "vitest";
import { trackAffiliateTicketClick, trackExperienceCategorySelection, trackPartnerScriptStatus } from "./category-analytics";

describe("Kategorie-Analyse", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sendet die anonyme Kategorieauswahl nur mit Analytics-Einwilligung", () => {
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track } });

    expect(trackExperienceCategorySelection({
      categoryId: "kult-klassiker",
      placement: "hero-desktop",
      analyticsConsent: false,
    })).toBe(false);
    expect(track).not.toHaveBeenCalled();

    expect(trackExperienceCategorySelection({
      categoryId: "kult-klassiker",
      placement: "hero-desktop",
      analyticsConsent: true,
    })).toBe(true);
    expect(track).toHaveBeenCalledWith("experience_category_selected", {
      category: "kult-klassiker",
      placement: "hero-desktop",
    });
  });

  it("bleibt ohne geladenen Umami-Tracker folgenlos", () => {
    vi.stubGlobal("window", {});

    expect(trackExperienceCategorySelection({
      categoryId: "familie-maerchen-magie",
      placement: "hero-mobile",
      analyticsConsent: true,
    })).toBe(false);
  });

  it("erfasst Partner-Skriptstatus ausschließlich nach Reichweitenmessungs-Einwilligung", () => {
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track } });

    expect(trackPartnerScriptStatus({
      partner: "awin",
      status: "failed",
      analyticsConsent: false,
    })).toBe(false);
    expect(track).not.toHaveBeenCalled();

    expect(trackPartnerScriptStatus({
      partner: "tradedoubler",
      status: "loaded",
      analyticsConsent: true,
    })).toBe(true);
    expect(track).toHaveBeenCalledWith("affiliate_partner_script", {
      partner: "tradedoubler",
      status: "loaded",
    });
  });

  it("erfasst Ticketklicks nur nach Einwilligung und ohne Ziel- oder Personendaten", () => {
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track } });

    expect(trackAffiliateTicketClick({
      musicalId: "mj-musical",
      partner: "stage",
      placement: "ticket-box",
      analyticsConsent: false,
    })).toBe(false);
    expect(track).not.toHaveBeenCalled();

    expect(trackAffiliateTicketClick({
      musicalId: "mj-musical",
      partner: "stage",
      placement: "ticket-box",
      analyticsConsent: true,
    })).toBe(true);
    expect(track).toHaveBeenCalledWith("affiliate_ticket_click", {
      musical: "mj-musical",
      partner: "stage",
      placement: "ticket-box",
    });
  });
});
