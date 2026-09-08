/**
 * Bewahrt auf Karten mit Top-Musical-Badge rechts stets 9 rem freien Raum.
 * Die Sale-Badge passt ihre Breite ihrem Inhalt an und darf diesen verfügbaren
 * Raum nie überschreiten.
 */
export const SALE_BADGE_LAYOUT = {
  featuredBadgeReserveRem: 9,
  widthClasses: "inline-flex w-fit max-w-[calc(100%-9rem)]",
  heightClass: "h-10",
  roundedClass: "rounded-md",
} as const;

/** Liefert die verfügbare Maximalbreite vor dem reservierten Top-Musical-Badge. */
export function getFeaturedSaleBadgeMaxWidthRem(cardWidthRem: number): number {
  return Math.max(0, cardWidthRem - SALE_BADGE_LAYOUT.featuredBadgeReserveRem);
}
