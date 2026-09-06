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

export const HERO_NAVIGATION_LABEL_OVERRIDES: Record<string, string> = {
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

export function getHeroNavigationLabel(musical: HeroNavigationMusical): string {
  return HERO_NAVIGATION_LABEL_OVERRIDES[musical.slug] ?? musical.title;
}

export function getHeroNavigationItems(
  musicals: readonly HeroNavigationMusical[],
  activeMusicalIds: readonly string[],
  featuredMusicalIds: readonly string[] = activeMusicalIds,
): HeroNavigationItem[] {
  const activeMusicalsById = new Map(
    musicals
      .filter((musical) => activeMusicalIds.includes(musical.id) || activeMusicalIds.includes(musical.slug))
      .map((musical) => [musical.id, musical]),
  );
  const featuredMusicals = featuredMusicalIds
    .map((id) => activeMusicalsById.get(id))
    .filter((musical): musical is HeroNavigationMusical => Boolean(musical));

  return [
    { id: "all-musicals", label: "Alle Musicals", href: "#musicals", kind: "overview" },
    { id: "musical-cities", label: "Städte & Termine", href: "#staedte", kind: "city" },
    ...featuredMusicals.map((musical) => ({
      id: `musical-${musical.slug}`,
      label: getHeroNavigationLabel(musical),
      href: `/musical/${musical.slug}`,
      kind: "musical" as const,
    })),
    { id: "more-musicals", label: "Weitere Musicals A–Z", href: "#musicals", kind: "overview" },
  ];
}
