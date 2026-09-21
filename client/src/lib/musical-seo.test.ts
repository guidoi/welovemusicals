import { describe, expect, it } from "vitest";
import { getMusicalSeo } from "./musical-seo";

const musical = {
  id: "test-musical",
  slug: "test-musical",
  title: "TEST MUSICAL",
  provider: "Testanbieter",
  category: "ensuite" as const,
  description: "Eine ausführliche Beschreibung für ein Musical, die deutlich länger als die empfohlene Snippetlänge ausfällt und deshalb sauber an einer Wortgrenze gekürzt werden muss, ohne ein unfertiges Wort im Google-Snippet zu hinterlassen.",
  image: "https://example.com/test.jpg",
  eventimUrl: "https://example.com/tickets",
  tags: ["Show", "Musik", "Berlin"],
};

describe("Musicalseiten-SEO", () => {
  it("erzeugt kanonische, markenkonsistente Standardmetadaten", () => {
    const seo = getMusicalSeo(musical);

    expect(seo.title).toBe("TEST MUSICAL – Tickets & Termine | We Love Musicals");
    expect(seo.canonicalUrl).toBe("https://welovemusicals.com/musical/test-musical");
    expect(seo.description.length).toBeLessThanOrEqual(155);
    expect(seo.description).toMatch(/…$/);
  });

  it("respektiert redaktionell hinterlegte Titel und Beschreibungen", () => {
    const seo = getMusicalSeo({
      ...musical,
      seoTitle: "Individueller Titel | We Love Musicals",
      seoDescription: "Individuelle, präzise Beschreibung.",
    });

    expect(seo.title).toBe("Individueller Titel | We Love Musicals");
    expect(seo.description).toBe("Individuelle, präzise Beschreibung.");
  });
});
