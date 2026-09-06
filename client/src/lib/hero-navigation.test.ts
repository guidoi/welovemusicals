import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, musicals } from "./data";
import { getHeroNavigationItems, getHeroNavigationLabel } from "./hero-navigation";

describe("getHeroNavigationItems", () => {
  it("stellt Orientierungstabs, kuratierte Top-Musicals und einen A–Z-Einstieg bereit", () => {
    const items = getHeroNavigationItems(
      [
        { id: "zeta", slug: "zeta", title: "ZETA" },
        { id: "alpha", slug: "alpha", title: "ALPHA" },
        { id: "inaktiv", slug: "inaktiv", title: "INAKTIV" },
      ],
      ["alpha", "zeta"],
      ["zeta", "alpha"],
    );

    expect(items).toEqual([
      { id: "all-musicals", label: "Alle Musicals", href: "#musicals", kind: "overview" },
      { id: "musical-cities", label: "Städte & Termine", href: "#staedte", kind: "city" },
      { id: "musical-zeta", label: "ZETA", href: "/musical/zeta", kind: "musical" },
      { id: "musical-alpha", label: "ALPHA", href: "/musical/alpha", kind: "musical" },
      { id: "more-musicals", label: "Weitere Musicals A–Z", href: "#musicals", kind: "overview" },
    ]);
  });

  it("verlinkt ausschließlich die kuratierten Top-Musicals direkt auf ihre Landingpages", () => {
    const featuredIds = ["zeta", "alpha"];
    const activeMusicals = [
      { id: "alpha", slug: "alpha", title: "ALPHA" },
      { id: "zeta", slug: "zeta", title: "ZETA" },
      { id: "weitere-show", slug: "weitere-show", title: "WEITERE SHOW" },
    ];
    const items = getHeroNavigationItems(activeMusicals, activeMusicals.map((musical) => musical.id), featuredIds);
    const musicalItems = items.filter((item) => item.kind === "musical");
    const expectedMusicals = featuredIds.map((id) => activeMusicals.find((musical) => musical.id === id)!);

    expect(musicalItems).toHaveLength(featuredIds.length);
    expect(musicalItems.map((item) => item.label)).toEqual(expectedMusicals.map(getHeroNavigationLabel));
    expect(musicalItems.map((item) => item.href)).toEqual(
      expectedMusicals.map((musical) => `/musical/${musical.slug}`),
    );
    expect(items).toContainEqual({ id: "more-musicals", label: "Weitere Musicals A–Z", href: "#musicals", kind: "overview" });
  });

  it("verwendet auch für Tarzan und Zurück in die Zukunft die gekürzten, normal geschriebenen Labels", () => {
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
      ["tarzan", "zukunft"],
    );

    expect(items).toContainEqual({
      id: "musical-disneys-musical-tarzan",
      label: "Tarzan",
      href: "/musical/disneys-musical-tarzan",
      kind: "musical",
    });
    expect(items).toContainEqual({
      id: "musical-zurueck-in-die-zukunft-das-musical",
      label: "Zurück in die Zukunft",
      href: "/musical/zurueck-in-die-zukunft-das-musical",
      kind: "musical",
    });
  });

  it("verwendet keine nicht kuratierten Shows in der Top-Musical-Gruppe", () => {
    const items = getHeroNavigationItems(
      [
        { id: "tarzan", slug: "disneys-musical-tarzan", title: "DISNEYS MUSICAL TARZAN" },
        { id: "und-julia", slug: "und-julia", title: "& JULIA" },
        { id: "zukunft", slug: "zurueck-in-die-zukunft-das-musical", title: "ZURÜCK IN DIE ZUKUNFT – DAS MUSICAL" },
      ],
      ["tarzan", "und-julia", "zukunft"],
      ["tarzan", "zukunft"],
    );

    expect(items).not.toContainEqual({ id: "musical-und-julia", label: "& Julia", href: "/musical/und-julia", kind: "musical" });
    expect(items.filter((item) => item.kind === "musical").map((item) => item.label)).toEqual(["Tarzan", "Zurück in die Zukunft"]);
  });
});
