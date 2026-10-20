import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const musicalDetailSource = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("Erlebnis-Kategorie auf Musical-Detailseiten", () => {
  it("respektiert bei Bildern mit wichtigen oberen Motiven den mobilen Fix-Header", () => {
    expect(musicalDetailSource).toContain("const mobileHeroBelowHeader = musical.mobileHeroBelowHeader === true;");
    expect(musicalDetailSource).toContain('mobileHeroBelowHeader ? "mt-20 lg:mt-0" : ""');
  });

  it("ermittelt und zeigt die zentrale Erlebniswelt im Hero an", () => {
    expect(musicalDetailSource).toContain('import { getExperienceCategory, getMusicalExperienceCategories } from "@/lib/experience-categories";');
    expect(musicalDetailSource).toContain("const experienceCategories = getMusicalExperienceCategories(musical)");
    expect(musicalDetailSource).toContain("const experienceCategory = experienceCategories[0];");
    expect(musicalDetailSource).toContain('data-testid="detail-experience-categories"');
    expect(musicalDetailSource).toContain('data-testid="detail-experience-category"');
    expect(musicalDetailSource).toContain('data-experience-category={category.id}');
    expect(musicalDetailSource).toContain('rounded-full border border-gold bg-transparent px-3 py-1.5 text-sm font-medium text-gold');
    expect(musicalDetailSource).toContain("{category.shortLabel}");
  });

  it("zeigt keine früheren Detailseiten-Zusatz-Tags neben der Erlebniswelt", () => {
    expect(musicalDetailSource).not.toContain("musical.tags.map");
    expect(musicalDetailSource).not.toContain("{/* Tags */}");
  });

  it("zeigt auf jeder aktiven Detailseite passende Shows, die nach Erlebniswelt priorisiert sind", () => {
    expect(musicalDetailSource).toContain('import { getRelatedMusicals } from "@/lib/related-musicals";');
    expect(musicalDetailSource).toContain("const related = getRelatedMusicals(");
    expect(musicalDetailSource).toContain("ACTIVE_MUSICAL_IDS.includes(candidate.id)");
    expect(musicalDetailSource).not.toContain("{false && related.length > 0");
    expect(musicalDetailSource).toContain("{related.length > 0 && (");
    expect(musicalDetailSource).toContain("experienceCategory?.recommendationHeadline");
    expect(musicalDetailSource).toContain("experienceCategory.recommendationIntro");
    expect(musicalDetailSource).toContain('className="-mt-5 mb-6 text-sm text-cream/90"');
  });
});
