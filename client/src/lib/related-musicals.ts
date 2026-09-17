import type { Musical } from "./data";

function similarityScore(current: Musical, candidate: Musical): number {
  if (current.experienceCategory && candidate.experienceCategory === current.experienceCategory) return 0;
  if (candidate.provider === current.provider) return 1;
  if (candidate.category === current.category) return 2;
  return 3;
}

/**
 * Prioritises editorially comparable shows. The shared Erlebniswelt is always
 * strongest; provider and legacy production type only fill remaining slots.
 */
export function getRelatedMusicals(source: Musical[], current: Musical, limit = 3): Musical[] {
  return source
    .filter((candidate) => candidate.id !== current.id)
    .sort((a, b) => {
      const similarity = similarityScore(current, a) - similarityScore(current, b);
      if (similarity !== 0) return similarity;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.title.localeCompare(b.title, "de");
    })
    .slice(0, limit);
}
