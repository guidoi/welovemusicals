export type HeroNavigationMusical = {
  id: string;
  slug: string;
  title: string;
};

export type HeroNavigationItem = {
  id: string;
  label: string;
  href: string;
  kind: "overview" | "city" | "musical";
};

const HERO_NAVIGATION_LABEL_OVERRIDES: Record<string, string> = {
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
};

export function getHeroNavigationItems(
  musicals: readonly HeroNavigationMusical[],
  activeMusicalIds: readonly string[],
): HeroNavigationItem[] {
  const activeMusicals = musicals
    .filter((musical) => activeMusicalIds.includes(musical.id) || activeMusicalIds.includes(musical.slug))
    .sort((left, right) => left.title.localeCompare(right.title, "de"));
  const undJulia = activeMusicals.find((musical) => musical.slug === "und-julia");
  const orderedActiveMusicals = undJulia
    ? [undJulia, ...activeMusicals.filter((musical) => musical.slug !== "und-julia")]
    : activeMusicals;

  return [
    { id: "all-musicals", label: "Musicals", href: "#musicals", kind: "overview" },
    { id: "musical-cities", label: "Städte", href: "#staedte", kind: "city" },
    ...orderedActiveMusicals.map((musical) => ({
      id: `musical-${musical.slug}`,
      label: HERO_NAVIGATION_LABEL_OVERRIDES[musical.slug] ?? musical.title,
      href: `/musical/${musical.slug}`,
      kind: "musical" as const,
    })),
  ];
}
