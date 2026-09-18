import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Hero-Kategorie-Einstiege", () => {
  it("übernimmt eine gewählte Erlebniswelt und zeigt alle passenden Shows an", () => {
    expect(homeSource).toContain('if (kind === "category" && item.categoryId)');
    expect(homeSource).toContain('if (kind === "overview" && item.id === "all-musicals")');
    expect(homeSource).toContain('setShowCompleteCatalog(true);');
    expect(homeSource).toContain("setCategoryFilter(item.categoryId);");
    expect(homeSource).toContain('setCountryFilter("alle");');
    expect(homeSource).toContain('setCityFilter("alle");');
    expect(homeSource).toContain("setShowAllMusicals(true);");
    expect(homeSource).toContain("trackExperienceCategorySelection({");
    expect(homeSource).toContain("analyticsConsent: consent?.analytics === true");
    expect(homeSource).toContain("const guideHeroCategoryToFirstResult = useCallback(() => {");
    expect(homeSource).toContain("window.setTimeout(() => {");
    expect(homeSource).toContain("}, 850);");
    expect(homeSource).toContain("guideHeroCategoryToFirstResult();");
    expect(homeSource).toContain('placement="hero-mobile"');
    expect(homeSource).toContain('placement="hero-desktop"');
    expect(homeSource).toContain('variant="categories"');
  });
});
