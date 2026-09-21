import type { Musical } from "./data";

const BASE_URL = "https://welovemusicals.com";
const MAX_DESCRIPTION_LENGTH = 155;

function trimAtWordBoundary(value: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength - 1);
  const wordBoundary = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, wordBoundary > 0 ? wordBoundary : truncated.length).trimEnd()}…`;
}

export function getMusicalSeo(musical: Musical) {
  const title = musical.seoTitle ?? `${musical.title} – Tickets & Termine | We Love Musicals`;
  const description = musical.seoDescription ?? trimAtWordBoundary(musical.description);
  const canonicalUrl = `${BASE_URL}/musical/${musical.slug || musical.id}`;

  return {
    title,
    description,
    canonicalUrl,
    image: musical.image,
  };
}
