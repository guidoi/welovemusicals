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
  "disneys-musical-tarzan": "DISNEYS TARZAN",
  "zurueck-in-die-zukunft-das-musical": "ZURÜCK IN DIE ZUKUNFT",
};

export function getHeroNavigationItems(
  musicals: readonly HeroNavigationMusical[],
  activeMusicalIds: readonly string[],
): HeroNavigationItem[] {
  const activeMusicals = musicals
    .filter((musical) => activeMusicalIds.includes(musical.id) || activeMusicalIds.includes(musical.slug))
    .sort((left, right) => left.title.localeCompare(right.title, "de"));

  return [
    { id: "all-musicals", label: "Musicals", href: "#musicals", kind: "overview" },
    { id: "musical-cities", label: "Städte", href: "#staedte", kind: "city" },
    ...activeMusicals.map((musical) => ({
      id: `musical-${musical.slug}`,
      label: HERO_NAVIGATION_LABEL_OVERRIDES[musical.slug] ?? musical.title,
      href: `/musical/${musical.slug}`,
      kind: "musical" as const,
    })),
  ];
}
