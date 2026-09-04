import { describe, expect, it } from "vitest";
import { FEATURED_MUSICAL_IDS, getFeaturedMusicals, musicals } from "./data";

describe("Top-Musicals auf der Startseite", () => {
  it("liefert die final bestätigten neun Highlights in der gewünschten 3×3-Reihenfolge", () => {
    expect(FEATURED_MUSICAL_IDS).toEqual([
      "koenig-der-loewen",
      "eiskoenigin",
      "tarzan",
      "moulinrouge",
      "gloeckner-von-notre-dame",
      "mj-musical",
      "ziz",
      "tanz-der-vampire",
      "starlight-express",
    ]);
    expect(getFeaturedMusicals().map((musical) => musical.id)).toEqual(FEATURED_MUSICAL_IDS);
  });

  it("führt & Julia, Dracula und Drei Haselnüsse ausschließlich außerhalb der Highlights", () => {
    for (const id of ["und-julia", "dracula", "dreihaselnuesse"]) {
      expect(FEATURED_MUSICAL_IDS).not.toContain(id);
      expect(musicals.find((musical) => musical.id === id)?.featured).toBe(false);
    }
  });
});
