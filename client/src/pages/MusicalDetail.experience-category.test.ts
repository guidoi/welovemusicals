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
});
