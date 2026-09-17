import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const musicalDetailSource = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("Erlebnis-Kategorie auf Musical-Detailseiten", () => {
  it("ermittelt und zeigt die zentrale Erlebniswelt im Hero an", () => {
    expect(musicalDetailSource).toContain('import { getExperienceCategory } from "@/lib/experience-categories";');
    expect(musicalDetailSource).toContain("const experienceCategory = getExperienceCategory(musical.experienceCategory);");
    expect(musicalDetailSource).toContain('data-testid="detail-experience-category"');
    expect(musicalDetailSource).toContain('rounded-full border border-gold bg-transparent px-3 py-1.5 text-sm font-medium text-gold');
    expect(musicalDetailSource).toContain("{experienceCategory.label}");
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
  });
});
