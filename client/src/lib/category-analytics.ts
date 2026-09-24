import type { ExperienceCategoryId } from "./experience-categories";

type UmamiTracker = {
  track: (eventName: string, eventData?: Record<string, string>) => void;
};

type CategoryEntryPlacement = "hero-mobile" | "hero-desktop";

type TrackExperienceCategorySelectionInput = {
  categoryId: ExperienceCategoryId;
  placement: CategoryEntryPlacement;
  analyticsConsent: boolean;
};

export type AffiliateClickPlacement =
  | "mobile-hero"
  | "keyvisual"
  | "ticket-box"
  | "city-date"
  | "sticky"
  | "campaign-banner";

type AffiliatePartner = "eventim" | "atg" | "stage" | "tradedoubler";

type TrackAffiliateTicketClickInput = {
  musicalId: string;
  partner: AffiliatePartner;
  placement: AffiliateClickPlacement;
  analyticsConsent: boolean;
};

function getUmamiTracker(): UmamiTracker | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { umami?: UmamiTracker }).umami;
}

/**
 * Sends one anonymous category-selection event only after optional analytics consent.
 * It deliberately contains no personal, ticket, location, or search data.
 */
export function trackExperienceCategorySelection({
  categoryId,
  placement,
  analyticsConsent,
}: TrackExperienceCategorySelectionInput): boolean {
  if (!analyticsConsent) return false;

  const tracker = getUmamiTracker();
  if (!tracker) return false;

  tracker.track("experience_category_selected", {
    category: categoryId,
    placement,
  });
  return true;
}

/**
 * Records a deliberate ticket click only after optional analytics consent.
 * The allowlisted event intentionally omits the destination URL, city, price,
 * visitor identifiers and any booking data. It is a conversion-quality signal,
 * not a revenue or transaction measurement.
 */
export function trackAffiliateTicketClick({
  musicalId,
  partner,
  placement,
  analyticsConsent,
}: TrackAffiliateTicketClickInput): boolean {
  if (!analyticsConsent) return false;

  const tracker = getUmamiTracker();
  if (!tracker) return false;

  tracker.track("affiliate_ticket_click", {
    musical: musicalId,
    partner,
    placement,
  });
  return true;
}
