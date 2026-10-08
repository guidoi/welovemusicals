import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";

describe("Sichtbarkeit von Stimmen zur Show", () => {
  it("blendet nicht verifizierte Stimmen bei den dafür vorgemerkten Produktionen aus", () => {
    const slugs = [
      "tanz-der-vampire",
      "der-kleine-lord",
      "die-eiskoenigin",
      "mj-das-michael-jackson-musical",
      "salon-rosie",
      "wir-sind-am-leben",
    ];

    for (const slug of slugs) {
      expect(getMusicalBySlug(slug)?.quotes).toBeUndefined();
    }
  });

  it("entfernt bei Tarzan ausschließlich die Stage-Stimme und bewahrt die redaktionellen Zitate", () => {
    const tarzan = getMusicalBySlug("disneys-musical-tarzan");

    expect(tarzan?.quotes).toEqual([
      { text: "Diese Luftakrobatik ist einzigartig!", source: "Freundin" },
      { text: "Disney eröffnet mit Tarzan eine neue Theaterdimension.", source: "ZDF" },
    ]);
    expect(tarzan?.quotes?.some((quote) => quote.source === "Stage Entertainment")).toBe(false);
  });
});
