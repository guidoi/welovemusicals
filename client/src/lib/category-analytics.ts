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
