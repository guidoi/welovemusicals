import type { MusicalSale } from "./data";

/** Prüft, ob ein optionales Teaser-Angebot am angegebenen Tag noch gültig ist. */
export function isSaleActive(sale?: MusicalSale, now = new Date()): boolean {
  if (!sale) return false;
  if (!sale.validUntil) return true;

  const expiresAt = new Date(`${sale.validUntil}T23:59:59`).getTime();
  return !Number.isNaN(expiresAt) && expiresAt >= now.getTime();
}
