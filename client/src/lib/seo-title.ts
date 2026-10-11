export const SEO_TITLE_HEART = "❤️";
export const SEO_TITLE_BRAND = "We Love Musicals";

/**
 * Keeps public search titles recognisably branded without repeating the emoji
 * when a title is processed more than once (for example after a price update).
 */
export function withSeoTitleHeart(title: string): string {
  const normalized = title.replace(/\s+/g, " ").trim();
  if (normalized.includes(SEO_TITLE_HEART)) return normalized;

  const brandSuffix = `| ${SEO_TITLE_BRAND}`;
  if (normalized.endsWith(brandSuffix)) {
    const content = normalized.slice(0, -brandSuffix.length).trimEnd();
    return `${content} ${SEO_TITLE_HEART} ${SEO_TITLE_BRAND}`;
  }

  const finalPipeIndex = normalized.lastIndexOf(" | ");
  if (finalPipeIndex > 0) {
    return `${normalized.slice(0, finalPipeIndex)} ${SEO_TITLE_HEART} ${normalized.slice(finalPipeIndex + 3)}`;
  }

  const ticketDivider = normalized.lastIndexOf(" – Tickets");
  if (ticketDivider > 0) {
    return `${normalized.slice(0, ticketDivider)} ${SEO_TITLE_HEART}${normalized.slice(ticketDivider + 2)}`;
  }

  return `${normalized} ${SEO_TITLE_HEART}`;
}
