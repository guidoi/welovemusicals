import type { MusicalSale } from "./data";

/** Prüft, ob ein optionales Teaser-Angebot am angegebenen Tag im angegebenen Zeitraum gültig ist. */
export function isSaleActive(sale?: MusicalSale, now = new Date()): boolean {
  if (!sale) return false;

  if (sale.validFrom) {
    const startsAt = new Date(`${sale.validFrom}T00:00:00`).getTime();
    if (Number.isNaN(startsAt) || startsAt > now.getTime()) return false;
  }

  if (!sale.validUntil) return true;

  const expiresAt = new Date(`${sale.validUntil}T23:59:59`).getTime();
  return !Number.isNaN(expiresAt) && expiresAt >= now.getTime();
}
