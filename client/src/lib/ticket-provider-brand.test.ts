import { describe, expect, it } from "vitest";
import { getTicketProviderBrand, isAtgTicketMusical } from "./ticket-provider-brand";

describe("Ticketanbieter-Logos", () => {
  it("ordnet ATG-Shows, Stage-Produktseiten und Eventim-Ziele eindeutig zu", () => {
    expect(isAtgTicketMusical("moulin-rouge")).toBe(true);
    expect(getTicketProviderBrand("moulin-rouge", "https://www.atgtickets.de/moulin-rouge").id).toBe("atg");
    expect(getTicketProviderBrand("koenig-der-loewen", "https://www.stage-entertainment.de/musicals-shows/koenig-der-loewen").id).toBe("stage");
    expect(getTicketProviderBrand("dracula", "https://www.eventim.de/artist/dracula").id).toBe("eventim");
  });

  it("verwendet für Stage Entertainment das bereitgestellte weiße Logo", () => {
    const stageBrand = getTicketProviderBrand("koenig-der-loewen", "https://www.stage-entertainment.de/musicals-shows/koenig-der-loewen");

    expect(stageBrand.name).toBe("Stage Entertainment");
    expect(stageBrand.logoSrc).toBe("/images/branding/stage-entertainment-logo-white.png");
  });

  it("verwendet für Eventim ein transparentes Teaserlogo", () => {
    const eventimBrand = getTicketProviderBrand("dracula", "https://www.eventim.de/artist/dracula");

    expect(eventimBrand.name).toBe("Eventim");
    expect(eventimBrand.logoSrc).toBe("/images/branding/eventim-logo-transparent.png");
  });
});
