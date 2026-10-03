import type { Musical, MusicalFAQ } from "./data";
import { getMusicalCanonicalUrl } from "./event-schema";

export type MusicalFaqSchema = Record<string, unknown>;

function getUsableFaqItems(items: MusicalFAQ[] | undefined): MusicalFAQ[] {
  return (items ?? []).filter((item) => item.question.trim().length > 0 && item.answer.trim().length > 0);
}

/**
 * Mirrors the visible FAQ accordion on a musical detail page as Schema.org FAQPage.
 * Google currently limits FAQ rich-result presentation to authoritative government
 * and health sites, but the markup remains accurate semantic context for crawlers
 * and other search/AI systems. Never add a question or answer that is not visible
 * in the detail-page FAQ.
 */
export function getMusicalFaqSchema(musical: Musical): MusicalFaqSchema | undefined {
  const faqItems = getUsableFaqItems(musical.faqItems);
  if (faqItems.length === 0) return undefined;

  return {
    "@type": "FAQPage",
    "@id": `${getMusicalCanonicalUrl(musical)}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getVisibleFaqItems(musical: Musical): MusicalFAQ[] {
  return getUsableFaqItems(musical.faqItems);
}
