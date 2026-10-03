import { createAwinLink, getActiveMusicals, type Musical } from "./data";
import { getAffiliateOverridePartner, isSafeAffiliateTicketUrl, type AffiliateOverridePartner } from "./affiliate-link-safety";

export type AffiliateTargetSuggestion = {
  url: string;
  sourceField: string;
};

type SuggestiblePlacement = "ticket-base" | "keyvisual" | "mobile-hero" | "sticky" | "ticket-box";
type SuggestibleSourceField = keyof Pick<Musical, "keyvisualLink" | "ticketCtaUrl" | "eventimUrl" | "awinHeroUrl" | "awinStickyUrl" | "awinBoxUrl">;

const SOURCE_FIELDS: Record<SuggestiblePlacement, SuggestibleSourceField[]> = {
  "ticket-base": ["eventimUrl", "ticketCtaUrl", "awinBoxUrl", "awinHeroUrl", "awinStickyUrl", "keyvisualLink"],
  keyvisual: ["keyvisualLink", "ticketCtaUrl", "eventimUrl", "awinBoxUrl", "awinHeroUrl", "awinStickyUrl"],
  "mobile-hero": ["awinHeroUrl", "ticketCtaUrl", "eventimUrl", "awinBoxUrl", "awinStickyUrl", "keyvisualLink"],
  sticky: ["awinStickyUrl", "ticketCtaUrl", "eventimUrl", "awinBoxUrl", "awinHeroUrl", "keyvisualLink"],
  "ticket-box": ["awinBoxUrl", "ticketCtaUrl", "eventimUrl", "awinHeroUrl", "awinStickyUrl", "keyvisualLink"],
};

function isSuggestiblePlacement(placement: string): placement is SuggestiblePlacement {
  return placement in SOURCE_FIELDS;
}

/**
 * Generates a suggestion only from an already active, show-specific catalog
 * target. It does not fetch partner pages, generate campaign IDs, or guess city
 * or creative-specific destinations.
 */
export function getAffiliateTargetSuggestion(
  musicalId: string,
  partner: AffiliateOverridePartner,
  placement: string,
): AffiliateTargetSuggestion | undefined {
  if (!isSuggestiblePlacement(placement) || partner === "other") return undefined;

  const musical = getActiveMusicals().find((candidate) => candidate.id === musicalId);
  if (!musical) return undefined;

  for (const sourceField of SOURCE_FIELDS[placement]) {
    const sourceUrl = musical[sourceField];
    if (!sourceUrl) continue;

    const url = createAwinLink(sourceUrl);
    if (isSafeAffiliateTicketUrl(url) && getAffiliateOverridePartner(url) === partner) {
      return { url, sourceField };
    }
  }

  return undefined;
}
