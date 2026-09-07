import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, FEATURED_MUSICAL_IDS, getAdditionalMusicals, getFeaturedMusicals, musicals } from "./data";

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

  it("liefert in der weiteren Musical-Liste alle aktiven Produktionen ohne die neun Highlights", () => {
    const additionalMusicals = getAdditionalMusicals();

    expect(additionalMusicals).toHaveLength(ACTIVE_MUSICAL_IDS.length - FEATURED_MUSICAL_IDS.length);
    expect(additionalMusicals.map((musical) => musical.id)).not.toEqual(expect.arrayContaining([...FEATURED_MUSICAL_IDS]));
    expect(
      additionalMusicals.every(
        (musical) => ACTIVE_MUSICAL_IDS.includes(musical.id) || ACTIVE_MUSICAL_IDS.includes(musical.slug),
      ),
    ).toBe(true);
  });

  it("führt Zurück in die Zukunft mit einer separaten Versalien-Subline", () => {
    const backToTheFuture = musicals.find((musical) => musical.id === "ziz");

    expect(backToTheFuture?.title).toBe("ZURÜCK IN DIE ZUKUNFT");
    expect(backToTheFuture?.subtitle).toBe("DAS MUSICAL");
  });
});
