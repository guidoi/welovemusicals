import type { Musical, MusicalSale } from "./data";
import { isSaleActive } from "./sale";

/** Nur diese Shows gehören zur BLACK SALE-Kampagne im November 2026. */
export const BLACK_SALE_MUSICAL_IDS = [
  "teufel-traegt-prada",
  "und-julia",
  "koenig-der-loewen",
  "mj-musical",
  "salon-rosie",
  "eiskoenigin",
  "wir-sind-am-leben",
  "ziz",
  "weihnachten-mit-bibi-tina",
] as const;

const campaignIds = new Set<string>(BLACK_SALE_MUSICAL_IDS);
const campaignStartsOn = "2026-11-01";
const campaignEndsOn = "2026-11-30";

export interface BlackSaleCampaign {
  musicalIds: string[];
  maxDiscountPercent: number | null;
  endsOn: string;
}

function isCampaignDate(value: string | undefined): value is string {
  if (!value || !/^2026-11-\d{2}$/.test(value)) return false;
  return value >= campaignStartsOn && value <= campaignEndsOn;
}

function isCampaignSale(sale: MusicalSale | undefined, now: Date): sale is MusicalSale & { validUntil: string } {
  // Ein datiertes Ende ist nötig: bestehende Daueraktionen dürfen keinen BLACK SALE auslösen.
  return Boolean(
    sale &&
    isCampaignDate(sale.validUntil) &&
    (!sale.validFrom || isCampaignDate(sale.validFrom)) &&
    isSaleActive(sale, now),
  );
}

function getDiscountPercent(discount: string): number | null {
  // Keine Umrechnung von „2 für 1“, Ticketpreisen oder Notizen in behauptete Prozente.
  const percentages = Array.from(discount.matchAll(/(?:^|[^\d.,+-])(\d+(?:[.,]\d+)?)\s*%/g))
    .map((match) => Number(match[1].replace(",", ".")))
    .filter((value) => Number.isFinite(value) && value > 0 && value <= 100);
  return percentages.length ? Math.max(...percentages) : null;
}

/** Das Zeitfenster ist fest an 2026 gebunden; spätere Sheet-Aktionen reaktivieren es nicht. */
export function getBlackSaleCampaign(
  musicals: readonly Musical[],
  now = new Date(),
): BlackSaleCampaign | null {
  if (now.getFullYear() !== 2026 || now.getMonth() !== 10 || Number.isNaN(now.getTime())) {
    return null;
  }

  const offers = musicals.filter((musical) => (
    campaignIds.has(musical.id) && isCampaignSale(musical.sale, now)
  ));
  if (!offers.length) return null;

  const percentages = offers
    .map((musical) => getDiscountPercent(musical.sale!.discount))
    .filter((value): value is number => value !== null);
  const endsOn = offers.reduce((latest, musical) => (
    musical.sale!.validUntil! > latest ? musical.sale!.validUntil! : latest
  ), campaignStartsOn);

  return {
    musicalIds: Array.from(new Set(offers.map((musical) => musical.id))),
    maxDiscountPercent: percentages.length ? Math.max(...percentages) : null,
    endsOn,
  };
}

export function formatBlackSaleEndDate(endsOn: string): string {
  const [year, month, day] = endsOn.split("-");
  return `${day}.${month}.${year}`;
}
