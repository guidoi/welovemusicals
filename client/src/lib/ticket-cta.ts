import type { Musical } from "./data";
import { isSaleActive } from "./sale";

export type TicketCta = {
  label: string;
  kind: "offer" | "standard";
};

/** Mobile Sticky-Footer zeigen den freigegebenen Ab-Preis, auch während einer Aktion. */
export function getStickyTicketCta(
  musical: Pick<Musical, "priceFrom" | "sale">,
): TicketCta {
  const price = musical.priceFrom?.trim();
  return {
    label: price ? `ab ${price} €` : "Tickets sichern",
    kind: "standard",
  };
}

/** Aktionsorientierte Haupt-CTAs nennen eine aktive Aktion vor dem Mindestpreis. */
export function getTicketCta(
  musical: Pick<Musical, "priceFrom" | "sale">,
  now = new Date(),
): TicketCta {
  const discount = musical.sale?.discount?.trim().replace(/\s+/g, " ");

  if (discount && isSaleActive(musical.sale, now)) {
    return { label: `SALE · ${discount}`, kind: "offer" };
  }

  return getStickyTicketCta(musical);
}
