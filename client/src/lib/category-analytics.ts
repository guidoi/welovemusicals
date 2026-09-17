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

type PartnerScriptName = "awin" | "tradedoubler";
type PartnerScriptStatus = "loaded" | "failed";

type TrackPartnerScriptStatusInput = {
  partner: PartnerScriptName;
  status: PartnerScriptStatus;
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
 * Measures the technical availability of an optional affiliate script only
 * after analytics consent. No URL, ticket selection, location, IP or user ID
 * is sent with the anonymous event.
 */
export function trackPartnerScriptStatus({
  partner,
  status,
  analyticsConsent,
}: TrackPartnerScriptStatusInput): boolean {
  if (!analyticsConsent) return false;

  const tracker = getUmamiTracker();
  if (!tracker) return false;

  tracker.track("affiliate_partner_script", { partner, status });
  return true;
}
