import type { Musical } from "./data";
import { isSaleActive } from "./sale";

export type TicketCta = {
  label: string;
  kind: "offer" | "standard";
};

/**
 * Keeps every ticket CTA aligned with the current offer window.
 * An active offer takes precedence over a minimum-price message.
 */
export function getTicketCta(
  musical: Pick<Musical, "priceFrom" | "sale">,
  now = new Date(),
): TicketCta {
  const discount = musical.sale?.discount?.trim().replace(/\s+/g, " ");

  if (discount && isSaleActive(musical.sale, now)) {
    return { label: `SALE · ${discount}`, kind: "offer" };
  }

  return {
    label: musical.priceFrom ? `Tickets buchen – ab ${musical.priceFrom} €` : "Tickets buchen",
    kind: "standard",
  };
}
