import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import HeroAnchorNavigation from "./HeroAnchorNavigation";
import MusicalFilters from "./MusicalFilters";
import { EXPERIENCE_CATEGORIES } from "../lib/experience-categories";

beforeAll(() => vi.stubGlobal("React", React));
afterAll(() => vi.unstubAllGlobals());

const items = EXPERIENCE_CATEGORIES.map(category => ({ id: `category-${category.id}`, kind: "category" as const, categoryId: category.id, label: category.shortLabel, href: `/?erlebniswelt=${category.id}#more-musicals` }));
const props = { categoryFilter: "alle" as const, countryFilter: "alle" as const, cityFilter: "alle", plzSearch: { active: false, plz: "", radius: 50, originCoords: null }, setCategoryFilter: () => {}, setCountryFilter: () => {}, setCityFilter: () => {}, setPlzSearch: () => {} };
const classes = (markup: string) => Array.from(markup.matchAll(/<button[^>]*class="([^"]+)"/g)).map(match => match[1]);

describe("Erlebniswelt-Buttons: Goldkontur ohne Hover-Füllung oder Bewegung", () => {
  it.each(["hero-mobile", "hero-desktop"] as const)("gibt allen %s-Kategorien nur eine goldene Hover-Kontur", placement => {
    const markup = renderToStaticMarkup(<HeroAnchorNavigation items={items} variant="categories" placement={placement} />);
    expect(classes(markup)).toHaveLength(EXPERIENCE_CATEGORIES.length);
    for (const cls of classes(markup)) {
      expect(cls).toContain("hover:border-gold");
      expect(cls).toContain("bg-transparent");
      expect(cls).toContain("transition-colors");
      expect(cls).toContain("motion-reduce:transition-none");
      expect(cls).toContain("focus-visible:ring-gold");
      expect(cls).not.toMatch(/hover:bg-|hover:shadow-|hover:-?translate|active:scale|transition-all/);
    }
  });

  it("entfernt die Hover-Füllung in allen Kategorie-Filterbuttons einschließlich Alle", () => {
    const markup = renderToStaticMarkup(<MusicalFilters {...props} categoryFilter={EXPERIENCE_CATEGORIES[0].id} />);
    const categoryGroup = markup.slice(markup.indexOf('aria-label="Musical-Kategorie"'), markup.indexOf('aria-label="Land auswählen"'));
    expect(classes(categoryGroup)).toHaveLength(EXPERIENCE_CATEGORIES.length + 1);
    for (const cls of classes(categoryGroup)) {
      expect(cls).toContain("transition-colors");
      expect(cls).toContain("motion-reduce:transition-none");
      expect(cls).not.toMatch(/hover:bg-|hover:shadow-|hover:-?translate|active:scale|transition-all/);
    }
    expect(categoryGroup).toContain("hover:border-gold");
  });

  it("erhält Kategorieauswahl, Beschriftungen und bestehenden Gold-Aktivzustand", () => {
    const category = EXPERIENCE_CATEGORIES[0];
    const hero = renderToStaticMarkup(<HeroAnchorNavigation items={items} variant="categories" activeCategoryId={category.id} />);
    const filters = renderToStaticMarkup(<MusicalFilters {...props} categoryFilter={category.id} />);
    expect(hero).toContain('aria-pressed="true"');
    expect(filters).toContain('aria-pressed="true"');
    expect(hero).toContain("border-2 border-gold bg-transparent text-gold");
    expect(filters).toContain("border-2 border-gold bg-transparent text-gold");
    for (const category of EXPERIENCE_CATEGORIES) expect(hero).toContain(`hero-anchor-category-${category.id}`);
  });

  it("belässt bestehende Größen und Filterhandler unverändert", () => {
    const hero = readFileSync("client/src/components/HeroAnchorNavigation.tsx", "utf8");
    const filters = readFileSync("client/src/components/MusicalFilters.tsx", "utf8");
    expect(hero).toContain("h-11 items-center rounded-full border border-white bg-transparent px-3.5 text-[13px]");
    expect(hero).toContain("md:h-12 md:px-5 md:text-sm");
    expect(hero).toContain("onClick={() => onNavigate?.(item, placement)}");
    expect(filters).toContain("onClick={() => setCategoryFilter(category.id)}");
    expect(filters).toContain("onClick={() => setCategoryFilter(\"alle\")}");
    expect(filters).not.toContain("hover:bg-gold/10");
  });
});
