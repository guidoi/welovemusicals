import { describe, expect, it } from "vitest";
import { getCitySeo } from "./city-seo";

const hamburg = {
  name: "Hamburg",
  description: "Die Musical-Hauptstadt Deutschlands mit großen Theatern und aktuellen Shows.",
};

describe("Stadtseiten-SEO", () => {
  it("erzeugt einen eindeutigen, suchintentionstarken Titel für Stadtseiten", () => {
    const seo = getCitySeo(hamburg, 7);

    expect(seo.title).toBe("Musicals in Hamburg 2026/2027: Termine & Tickets | We Love Musicals");
    expect(seo.heading).toBe("Musicals in Hamburg 2026/2027");
  });

  it("verbindet Programmanzahl, Spielorte und Ticketnutzen in einer lesbaren Beschreibung", () => {
    const seo = getCitySeo(hamburg, 7);

    expect(seo.description).toContain("7 Musicals in Hamburg");
    expect(seo.description).toContain("Shows, Spielorte und Ticketlinks");
    expect(seo.description.length).toBeLessThanOrEqual(160);
  });

  it("beschreibt Städte ohne aktives Programm ehrlich über aktuelle Termine", () => {
    const seo = getCitySeo({ name: "Dresden", description: "Kulturstadt mit Tournee-Gastspielen." }, 0);

    expect(seo.description).toContain("Aktuelle Musical-Termine in Dresden");
    expect(seo.description).not.toContain("0 Musicals");
  });
});
