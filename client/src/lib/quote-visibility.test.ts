import { describe, expect, it } from "vitest";
import { musicals } from "./data";

describe("Sichtbarkeit von Stimmen zur Show", () => {
  it("zeigt ausschließlich Zitate bekannter redaktioneller Medien", () => {
    const sourcesByMusical = Object.fromEntries(
      musicals
        .filter((musical) => musical.quotes?.length)
        .map((musical) => [musical.id, musical.quotes?.map((quote) => quote.source)])
    );

    expect(sourcesByMusical).toEqual({
      dracula: ["Rhein Neckar Zeitung", "Abendzeitung", "Münchner Merkur"],
      moulinrouge: ["Süddeutsche Zeitung", "Kölner Stadtanzeiger", "ntv"],
      sisteract: ["WAZ", "BUNTE.de", "Münchner Merkur"],
      fackjugoehte: ["Hamburger Morgenpost", "Die Rheinpfalz", "broadwayworld.com"],
      "starlight-express": ["Westdeutsche Allgemeine Zeitung", "Ruhr Nachrichten"],
      tarzan: ["Freundin", "ZDF"],
      ziz: ["Musical1", "Musicalzentrale"],
      "teufel-traegt-prada": ["Vogue"],
      "die-amme": ["Berliner Morgenpost", "BZ Berlin"],
      "we-will-rock-you": ["Musical1", "Musicalzentrale"],
      "und-julia": ["dpa", "t-online.de", "Stern"],
    });
  });
});
