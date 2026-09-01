import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, musicals } from "./data";
import { getHeroNavigationItems, getHeroNavigationLabel } from "./hero-navigation";

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
      { id: "all-musicals", label: "Musicals", href: "#musicals", kind: "overview" },
      { id: "musical-cities", label: "Städte", href: "#staedte", kind: "city" },
      { id: "musical-alpha", label: "ALPHA", href: "/musical/alpha", kind: "musical" },
      { id: "musical-zeta", label: "ZETA", href: "/musical/zeta", kind: "musical" },
    ]);
  });

  it("verlinkt jedes aktive Musical direkt auf seine Landingpage", () => {
    const items = getHeroNavigationItems(musicals, ACTIVE_MUSICAL_IDS);
    const activeMusicals = musicals
      .filter((musical) => ACTIVE_MUSICAL_IDS.includes(musical.id) || ACTIVE_MUSICAL_IDS.includes(musical.slug))
      .sort((left, right) => getHeroNavigationLabel(left).localeCompare(getHeroNavigationLabel(right), "de"));
    const musicalItems = items.filter((item) => item.kind === "musical");
    const orderedActiveMusicals = [
      ...activeMusicals.filter((musical) => musical.slug === "und-julia"),
      ...activeMusicals.filter((musical) => musical.slug !== "und-julia"),
    ];
    const expectedLabels = orderedActiveMusicals.map((musical) => ({
      "phantom-der-oper": "Phantom der Oper",
      "der-teufel-traegt-prada-das-musical": "Teufel trägt Prada",
      "schoene-und-das-biest": "Schöne und das Biest",
      "gloeckner-von-notre-dame": "Glöckner von Notre-Dame",
      "koenig-der-loewen": "König der Löwen",
      "die-eiskoenigin": "Die Eiskönigin",
      "disneys-musical-tarzan": "Tarzan",
      "dracula": "Dracula",
      "drei-haselnuesse-fuer-aschenbroedel": "Drei Haselnüsse",
      "fack-ju-goehte": "Fack ju Göhte",
      "mj-das-michael-jackson-musical": "MJ",
      "moulin-rouge": "Moulin Rouge!",
      "rapunzel": "Rapunzel",
      "salon-rosie": "Salon Rosie",
      "sister-act": "Sister Act",
      "starlight-express": "Starlight Express",
      "tanz-der-vampire": "Tanz der Vampire",
      "we-will-rock-you": "We Will Rock You",
      "wir-sind-am-leben": "Wir sind am Leben",
      "zurueck-in-die-zukunft-das-musical": "Zurück in die Zukunft",
      "und-julia": "& Julia",
    } as Record<string, string>)[musical.slug] ?? musical.title);

    expect(musicalItems).toHaveLength(activeMusicals.length);
    expect(musicalItems.map((item) => item.label)).toEqual(expectedLabels);
    expect(musicalItems.map((item) => item.href)).toEqual(
      orderedActiveMusicals.map((musical) => `/musical/${musical.slug}`),
    );
    expect(new Set(musicalItems.map((item) => item.id)).size).toBe(activeMusicals.length);
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

  it("setzt & Julia als dritten Button direkt hinter Musicals und Städte", () => {
    const items = getHeroNavigationItems(
      [
        { id: "tarzan", slug: "disneys-musical-tarzan", title: "DISNEYS MUSICAL TARZAN" },
        { id: "und-julia", slug: "und-julia", title: "& JULIA" },
        { id: "zukunft", slug: "zurueck-in-die-zukunft-das-musical", title: "ZURÜCK IN DIE ZUKUNFT – DAS MUSICAL" },
      ],
      ["tarzan", "und-julia", "zukunft"],
    );

    expect(items.slice(0, 3)).toEqual([
      { id: "all-musicals", label: "Musicals", href: "#musicals", kind: "overview" },
      { id: "musical-cities", label: "Städte", href: "#staedte", kind: "city" },
      { id: "musical-und-julia", label: "& Julia", href: "/musical/und-julia", kind: "musical" },
    ]);
  });
});
