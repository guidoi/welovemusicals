import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getActiveMusicals, musicals } from "./data";
import {
  filterNews,
  getLatestNews,
  getNewsArticles,
  getNewsArticleSchema,
  getNewsBySlug,
  getNewsFilterOptions,
  getNewsForMusical,
  NEWS_ARTICLES,
  type NewsArticle,
} from "./news";
import { createSitemapXml } from "../../../scripts/generate-sitemap";
import { buildSitemap } from "../../../server/sitemap";

const sample = (slug: string, publishedAt: string, musicalIds: string[], cities: string[] = []): NewsArticle => ({
  slug, title: slug, teaser: "t", body: ["b"], publishedAt, musicalIds, cities, image: "x.webp", imageAlt: "x",
});

describe("News-Datenbestand", () => {
  it("hat eindeutige, sprechende Slugs, ISO-Daten und gültige Show-IDs", () => {
    const slugs = NEWS_ARTICLES.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const activeIds = new Set(getActiveMusicals().map((musical) => musical.id));
    for (const article of NEWS_ARTICLES) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.title.length).toBeGreaterThan(5);
      expect(article.body.length).toBeGreaterThan(0);
      expect(article.image).toMatch(/^https:\/\//);
      for (const id of article.musicalIds) expect(activeIds.has(id), `${article.slug}: ${id}`).toBe(true);
      expect(article.musicalIds).not.toContain("tarzan");
    }
  });

  it("sortiert nach Datum absteigend und liefert die drei neuesten", () => {
    const catalog = [sample("a", "2026-01-01", []), sample("b", "2026-03-01", []), sample("c", "2026-02-01", []), sample("d", "2025-12-01", [])];
    expect(getNewsArticles(catalog).map((item) => item.slug)).toEqual(["b", "c", "a", "d"]);
    expect(getLatestNews(3, catalog).map((item) => item.slug)).toEqual(["b", "c", "a"]);
    expect(getNewsBySlug("c", catalog)?.slug).toBe("c");
    expect(getNewsBySlug("nope", catalog)).toBeUndefined();
  });

  it("zeigt Show-News und fällt sonst auf die neuesten allgemeinen News zurück", () => {
    const catalog = [sample("x", "2026-01-01", ["dracula"]), sample("y", "2026-02-01", ["ziz"])];
    expect(getNewsForMusical("dracula", 3, catalog)).toEqual({ articles: [catalog[0]], isFallback: false });
    const fallback = getNewsForMusical("mj", 3, catalog);
    expect(fallback.isFallback).toBe(true);
    expect(fallback.articles.map((item) => item.slug)).toEqual(["y", "x"]);
    expect(getNewsForMusical("mj", 3, [])).toEqual({ articles: [], isFallback: true });
  });

  it("filtert nach Show und Stadt", () => {
    const catalog = [sample("x", "2026-01-01", ["dracula"], ["Hamburg"]), sample("y", "2026-02-01", ["ziz"], ["Stuttgart", "Hamburg"])];
    expect(filterNews(catalog, { city: "Hamburg" }).length).toBe(2);
    expect(filterNews(catalog, { musicalId: "ziz", city: "Hamburg" }).map((item) => item.slug)).toEqual(["y"]);
    expect(filterNews(catalog, { musicalId: "dracula", city: "Stuttgart" })).toEqual([]);
    const options = getNewsFilterOptions();
    expect(options.cities).toEqual([...options.cities].sort((a, b) => a.localeCompare(b, "de")));
  });

  it("erzeugt NewsArticle-Schema mit Datum, Show und Herausgeber", () => {
    const article = NEWS_ARTICLES[0];
    const schema = getNewsArticleSchema(article) as Record<string, any>;
    expect(schema["@type"]).toBe("NewsArticle");
    expect(schema.datePublished).toBe(article.publishedAt);
    expect(schema.mainEntityOfPage).toBe(`https://welovemusicals.com/news/${article.slug}`);
    expect(schema.publisher.name).toBe("We Love Musicals");
    const show = musicals.find((musical) => musical.id === article.musicalIds[0])!;
    expect(schema.about[0].url).toBe(`https://welovemusicals.com/musical/${show.slug}`);
  });

  it("nimmt /news und alle Meldungen in beide Sitemaps auf", () => {
    for (const xml of [createSitemapXml(), buildSitemap("https://welovemusicals.com")]) {
      expect(xml).toContain("<loc>https://welovemusicals.com/news</loc>");
      for (const article of NEWS_ARTICLES) expect(xml).toContain(`<loc>https://welovemusicals.com/news/${article.slug}</loc>`);
    }
  });
});

describe("News-Einbindung", () => {
  const read = (path: string) => readFileSync(path, "utf8");
  it("registriert /news und /news/:slug als Routen", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('<Route path={"/news"} component={NewsList} />');
    expect(app).toContain('<Route path={"/news/:slug"} component={NewsArticlePage} />');
  });
  it("zeigt News auf allen Detailseiten nach den Tickets und vor Quotes/Galerie", () => {
    const detail = read("client/src/pages/MusicalDetail.tsx");
    const tickets = detail.indexOf('data-visual-surface="tickets"');
    const news = detail.indexOf('testId="musical-news-section"');
    const quotes = detail.indexOf("<MusicalQuotes");
    const gallery = detail.indexOf("<MusicalGallery");
    expect(tickets).toBeGreaterThan(0);
    expect(news).toBeGreaterThan(tickets);
    expect(news).toBeLessThan(quotes);
    expect(news).toBeLessThan(gallery);
    expect(detail).toContain("Neuigkeiten zu ${musical.title}");
  });
  it("zeigt die drei neuesten News auf der Startseite direkt unter den Top-Musicals", () => {
    const home = read("client/src/pages/Home.tsx");
    const tops = home.indexOf('id="musicals"');
    const news = home.indexOf('testId="home-news-section"');
    const overview = home.indexOf('id="portal-overview"');
    expect(home).toContain("getLatestNews(3)");
    expect(news).toBeGreaterThan(tops);
    expect(news).toBeLessThan(overview);
  });
  it("lässt Links ohne Anker im Header normal navigieren", () => {
    const header = read("client/src/components/Header.tsx");
    expect(header).toContain('if (!href.includes("#")) return;');
  });
});
