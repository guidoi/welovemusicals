import { useMemo } from "react";
import { useAffiliateLinkOverrides, type AffiliateLinkOverrideKey } from "@/contexts/AffiliateLinkOverridesContext";
import { getSafeAffiliateTicketLink, type SafeAffiliateLink } from "./affiliate-link-safety";

/**
 * Resolves an owner-approved target for one technical group, then applies the
 * existing local safety validation. Invalid or unavailable overrides never
 * replace the original catalog target.
 */
export function useSafeAffiliateTicketLink(
  candidate: string | undefined,
  key: AffiliateLinkOverrideKey,
  primaryFallback?: string,
): SafeAffiliateLink {
  const { getOverride } = useAffiliateLinkOverrides();
  const override = getOverride(key);

  return useMemo(
    () => getSafeAffiliateTicketLink(override ?? candidate, primaryFallback ?? candidate),
    [candidate, key.musicalId, key.partner, key.placement, override, primaryFallback],
  );
}
