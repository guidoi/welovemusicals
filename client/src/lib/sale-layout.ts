/**
 * Bewahrt auf Karten mit Top-Musical-Badge rechts stets 9 rem freien Raum.
 * Das entspricht `max-width: calc(100% - 9rem)` und verhindert eine Kollision
 * mit dem rechts positionierten Badge bei Desktop- und Mobilkarten.
 */
export const SALE_BADGE_LAYOUT = {
  preferredWidthRem: 10.75,
  featuredBadgeReserveRem: 9,
  widthClasses: "w-[10.75rem] max-w-[calc(100%-9rem)]",
  roundedClass: "rounded-md",
} as const;

/** Liefert die maximal verfügbare Breite für den Sale-Störer in rem. */
export function getFeaturedSaleBadgeWidthRem(cardWidthRem: number): number {
  return Math.max(
    0,
    Math.min(
      SALE_BADGE_LAYOUT.preferredWidthRem,
      cardWidthRem - SALE_BADGE_LAYOUT.featuredBadgeReserveRem,
    ),
  );
}
