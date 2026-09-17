import {
  getExperienceCategory,
  type ExperienceCategoryId,
} from "./experience-categories";

export const EXPERIENCE_CATEGORY_QUERY_PARAMETER = "erlebnis";
export const MUSICAL_OVERVIEW_HASH = "#more-musicals";

/**
 * Returns a validated category only. Unknown query values never affect the
 * catalogue so shared links remain safe even when hand-edited.
 */
export function getExperienceCategoryFromSearch(search: string): ExperienceCategoryId | undefined {
  const value = new URLSearchParams(search).get(EXPERIENCE_CATEGORY_QUERY_PARAMETER);
  if (!value) return undefined;

  return getExperienceCategory(value as ExperienceCategoryId)?.id;
}

export function createExperienceCategoryHref(categoryId: ExperienceCategoryId): string {
  const search = new URLSearchParams({ [EXPERIENCE_CATEGORY_QUERY_PARAMETER]: categoryId });
  return `/?${search.toString()}${MUSICAL_OVERVIEW_HASH}`;
}

export function createMusicalOverviewHref(): string {
  return `/${MUSICAL_OVERVIEW_HASH}`;
}
