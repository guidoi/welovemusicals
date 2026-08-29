import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, musicals } from "./data";
import { getHeroNavigationItems } from "./hero-navigation";

describe("getHeroNavigationItems", () => {
  it("stellt zuerst die Überblicksanker und danach alle aktiven Musicals alphabetisch bereit", () => {
    const items = getHeroNavigationItems(
      [
        { id: "zeta", slug: "zeta", title: "ZETA" },
        { id: "alpha", slug: "alpha", title: "ALPHA" },
        { id: "inaktiv", slug: "inaktiv", title: "INAKTIV" },
      ],
      ["alpha", "zeta"],
    );

    expect(items).toEqual([
      { id: "all-musicals", label: "Alle Musicals", href: "#musicals", kind: "overview" },
      { id: "musical-cities", label: "Städte", href: "#staedte", kind: "city" },
      { id: "musical-alpha", label: "ALPHA", href: "#musical-alpha", kind: "musical" },
      { id: "musical-zeta", label: "ZETA", href: "#musical-zeta", kind: "musical" },
    ]);
  });

  it("vergibt für jedes aktive Musical einen eindeutigen Button mit passendem Kartenanker", () => {
    const items = getHeroNavigationItems(musicals, ACTIVE_MUSICAL_IDS);
    const activeMusicals = musicals
      .filter((musical) => ACTIVE_MUSICAL_IDS.includes(musical.id) || ACTIVE_MUSICAL_IDS.includes(musical.slug))
      .sort((left, right) => left.title.localeCompare(right.title, "de"));
    const musicalItems = items.filter((item) => item.kind === "musical");
    const expectedLabels = activeMusicals.map((musical) => {
      if (musical.slug === "disneys-musical-tarzan") return "DISNEYS TARZAN";
      if (musical.slug === "zurueck-in-die-zukunft-das-musical") return "ZURÜCK IN DIE ZUKUNFT";
      return musical.title;
    });

    expect(musicalItems).toHaveLength(activeMusicals.length);
    expect(musicalItems.map((item) => item.label)).toEqual(expectedLabels);
    expect(musicalItems.map((item) => item.href)).toEqual(
      activeMusicals.map((musical) => `#musical-${musical.slug}`),
    );
    expect(new Set(musicalItems.map((item) => item.id)).size).toBe(activeMusicals.length);
  });

  it("kürzt die beiden langen Buttontexte ohne ihre Zielanker zu verändern", () => {
    const items = getHeroNavigationItems(
      [
        { id: "tarzan", slug: "disneys-musical-tarzan", title: "DISNEYS MUSICAL TARZAN" },
        {
          id: "zukunft",
          slug: "zurueck-in-die-zukunft-das-musical",
          title: "ZURÜCK IN DIE ZUKUNFT – DAS MUSICAL",
        },
      ],
      ["tarzan", "zukunft"],
    );

    expect(items).toContainEqual({
      id: "musical-disneys-musical-tarzan",
      label: "DISNEYS TARZAN",
      href: "#musical-disneys-musical-tarzan",
      kind: "musical",
    });
    expect(items).toContainEqual({
      id: "musical-zurueck-in-die-zukunft-das-musical",
      label: "ZURÜCK IN DIE ZUKUNFT",
      href: "#musical-zurueck-in-die-zukunft-das-musical",
      kind: "musical",
    });
  });
});
