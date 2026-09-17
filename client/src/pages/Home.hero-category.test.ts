import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Hero-Kategorie-Einstiege", () => {
  it("übernimmt eine gewählte Erlebniswelt und zeigt alle passenden Shows an", () => {
    expect(homeSource).toContain('if (kind === "category" && item.categoryId)');
    expect(homeSource).toContain("setCategoryFilter(item.categoryId);");
    expect(homeSource).toContain('setCountryFilter("alle");');
    expect(homeSource).toContain('setCityFilter("alle");');
    expect(homeSource).toContain("setShowAllMusicals(true);");
    expect(homeSource).toContain('onNavigate={handleHeroNavigation}');
  });
});
