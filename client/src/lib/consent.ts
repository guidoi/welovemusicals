export type ConsentPreferences = {
  analytics: boolean;
  affiliateTracking: boolean;
  externalMedia: boolean;
};

export const CONSENT_STORAGE_KEY = "welovemusicals-consent-v1";

export const NECESSARY_ONLY_CONSENT: ConsentPreferences = {
  analytics: false,
  affiliateTracking: false,
  externalMedia: false,
};

export const ALL_CONSENT: ConsentPreferences = {
  analytics: true,
  affiliateTracking: true,
  externalMedia: true,
};

export function normalizeConsent(value: unknown): ConsentPreferences | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<ConsentPreferences>;
  if (
    typeof candidate.analytics !== "boolean" ||
    typeof candidate.affiliateTracking !== "boolean" ||
    typeof candidate.externalMedia !== "boolean"
  ) {
    return null;
  }

  return {
    analytics: candidate.analytics,
    affiliateTracking: candidate.affiliateTracking,
    externalMedia: candidate.externalMedia,
  };
}

export function hasRevokedOptionalService(
  previous: ConsentPreferences | null,
  next: ConsentPreferences
) {
  return Boolean(
    previous &&
      ((previous.analytics && !next.analytics) ||
        (previous.affiliateTracking && !next.affiliateTracking) ||
        (previous.externalMedia && !next.externalMedia))
  );
}
