/*
 * News-Rubrik von We Love Musicals.
 *
 * Pflege: Die Redaktion (Nutzer) schickt Texte, sie werden hier eingetragen.
 * Es gibt bewusst keinen Admin-Editor. Neue Meldungen einfach oben im Array
 * ergänzen; Sortierung erfolgt automatisch nach publishedAt (neueste zuerst).
 *
 * Regeln:
 * - slug: sprechend, nur a-z, 0-9 und Bindestriche, dauerhaft stabil (URL /news/<slug>)
 * - publishedAt/updatedAt: ISO-Datum YYYY-MM-DD
 * - musicalIds: IDs aus client/src/lib/data.ts (z. B. "ziz", "dracula")
 * - cities: Stadtnamen wie in data.ts (z. B. "Hamburg", "Stuttgart")
 * - body: Absätze als einzelne Strings, keine HTML-Tags
 * - sourceName: nur als Text, Quellen werden bewusst NICHT verlinkt (Nutzervorgabe)
 */
import { getActiveMusicals, musicals, type Musical } from "./data";

export interface NewsArticle {
  slug: string;
  title: string;
  teaser: string;
  body: string[];
  publishedAt: string;
  updatedAt?: string;
  musicalIds: string[];
  cities: string[];
  image: string;
  imageAlt: string;
  sourceName?: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "zurueck-in-die-zukunft-musical-stuttgart-2027",
    title: "ZURÜCK IN DIE ZUKUNFT kommt 2027 nach Stuttgart",
    teaser: "Das Musical zieht ins Stage Palladium Theater Stuttgart: Previews ab 5. Oktober 2027, Premiere am 12. Oktober 2027. Der Vorverkauf läuft bereits.",
    body: [
      "ZURÜCK IN DIE ZUKUNFT – Das Musical bekommt eine zweite Spielstätte: Ab Oktober 2027 ist die Show im Stage Palladium Theater in Stuttgart zu sehen.",
      "Die Previews beginnen am 5. Oktober 2027, die Premiere ist für den 12. Oktober 2027 angesetzt. Tickets für Stuttgart sind ab sofort im Vorverkauf erhältlich. Ein Ende der Spielzeit ist noch nicht angekündigt.",
      "In Hamburg läuft die Produktion weiterhin im Stage Operettenhaus.",
    ],
    publishedAt: "2026-11-28",
    musicalIds: ["ziz"],
    cities: ["Stuttgart", "Hamburg"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/MSKoPeryKNSFRcuH.webp",
    imageAlt: "ZURÜCK IN DIE ZUKUNFT – Das Musical",
    sourceName: "Stage Entertainment",
  },
  {
    slug: "der-kleine-lord-musical-tournee-2027-2028",
    title: "DER KLEINE LORD geht 2027/2028 auf Tournee",
    teaser: "Nach der Berliner Spielzeit im BlueMax Theater tourt das Weihnachtsmusical von November 2027 bis Januar 2028 durch 20 weitere Städte, darunter Rostock, Koblenz, Leipzig und Linz.",
    body: [
      "DER KLEINE LORD – Das Musical spielt bis 30. Dezember 2026 im BlueMax Theater am Potsdamer Platz in Berlin. Für die folgende Wintersaison ist eine Tournee angekündigt.",
      "Die Tour startet am 23. November 2027 in Rostock und führt bis Mitte Januar 2028 unter anderem nach Schwerin, Koblenz, Landau, Siegen, Bremerhaven, Bremen, Kiel, Husum, Braunschweig, Wolfsburg, Halle (Saale), Linz, Leipzig, Magdeburg, Cottbus, Dresden, Ravensburg und Nürnberg. Letzte Station ist Bochum am 14. und 15. Januar 2028.",
      "Alle Termine und Spielstätten findest du auf der Detailseite zum Musical.",
    ],
    publishedAt: "2026-11-28",
    musicalIds: ["der-kleine-lord"],
    cities: ["Berlin", "Rostock", "Koblenz", "Leipzig", "Bremen", "Kiel", "Dresden", "Nürnberg", "Bochum", "Linz"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/aHgwIjUJAAOyfhgG.webp",
    imageAlt: "DER KLEINE LORD – Das Musical",
    sourceName: "ShowSlot",
  },
  {
    slug: "dracula-musical-tour-2027-2028-termine",
    title: "DRACULA: Tourtermine 2027/2028 von Berlin bis Hamburg",
    teaser: "Das Dracula-Musical ist 2027/2028 in 18 Städten zu sehen – mit langen Spielzeiten in Berlin und München und Stationen bis Februar 2028 in Hamburg.",
    body: [
      "DRACULA – Das Musical tourt 2027 und 2028 durch Deutschland und Österreich. Längere Spielzeiten gibt es im BlueMax Theater Berlin (10. September bis 3. Oktober 2027) und im Deutschen Theater München (5. bis 24. Oktober 2027).",
      "Danach geht es unter anderem nach Köln, Bremen, Duisburg, Wien, Frankfurt, Stuttgart, Leipzig, Kiel, Braunschweig, Freiburg, Bochum und Graz. In Hamburg macht die Tour am 8. und 9. Februar 2028 in der Sporthalle Hamburg Station.",
      "Alle Termine und Spielstätten findest du auf der Detailseite zum Musical.",
    ],
    publishedAt: "2026-11-28",
    musicalIds: ["dracula"],
    cities: ["Berlin", "München", "Hamburg", "Köln", "Wien", "Stuttgart", "Leipzig", "Frankfurt", "Graz"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/msCnlWzpUxHutzXd.webp",
    imageAlt: "DRACULA – Das Musical",
    sourceName: "ShowSlot",
  },
];

function compareNews(a: NewsArticle, b: NewsArticle): number {
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return NEWS_ARTICLES.indexOf(a) - NEWS_ARTICLES.indexOf(b);
}

/** Alle Meldungen, neueste zuerst. */
export function getNewsArticles(catalog: NewsArticle[] = NEWS_ARTICLES): NewsArticle[] {
  return [...catalog].sort(compareNews);
}

export function getNewsBySlug(slug: string, catalog: NewsArticle[] = NEWS_ARTICLES): NewsArticle | undefined {
  return catalog.find((article) => article.slug === slug);
}

export function getLatestNews(limit = 3, catalog: NewsArticle[] = NEWS_ARTICLES): NewsArticle[] {
  return getNewsArticles(catalog).slice(0, limit);
}

/**
 * Nur Meldungen, die der Show zugeordnet sind (Nutzerwunsch 28.11.2026).
 * Gibt es keine, ist die Liste leer und der Bereich entfällt auf der Detailseite.
 */
export function getNewsForMusical(
  musicalId: string,
  limit = 3,
  catalog: NewsArticle[] = NEWS_ARTICLES,
): NewsArticle[] {
  return getNewsArticles(catalog)
    .filter((article) => article.musicalIds.includes(musicalId))
    .slice(0, limit);
}

/** Nur aktive Shows werden verlinkt (TARZAN o. Ä. bleiben deaktiviert). */
export function getNewsMusicals(article: NewsArticle, catalog: Musical[] = musicals): Musical[] {
  const active = getActiveMusicals(catalog);
  return article.musicalIds
    .map((id) => active.find((musical) => musical.id === id))
    .filter((musical): musical is Musical => Boolean(musical));
}

export function getNewsFilterOptions(catalog: NewsArticle[] = NEWS_ARTICLES) {
  const musicalsInNews = new Map<string, Musical>();
  const citiesInNews = new Set<string>();
  for (const article of catalog) {
    for (const musical of getNewsMusicals(article)) musicalsInNews.set(musical.id, musical);
    for (const city of article.cities) citiesInNews.add(city);
  }
  return {
    musicals: Array.from(musicalsInNews.values()).sort((a, b) => a.title.localeCompare(b.title, "de")),
    cities: Array.from(citiesInNews).sort((a, b) => a.localeCompare(b, "de")),
  };
}

export function filterNews(
  articles: NewsArticle[],
  filters: { musicalId?: string; city?: string },
): NewsArticle[] {
  return articles.filter((article) => (
    (!filters.musicalId || article.musicalIds.includes(filters.musicalId))
    && (!filters.city || article.cities.includes(filters.city))
  ));
}

export function formatNewsDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

export function getNewsUrl(article: Pick<NewsArticle, "slug">): string {
  return `/news/${article.slug}`;
}

export const NEWS_BASE_URL = "https://welovemusicals.com";
export const NEWS_LIST_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/hero-stage-LExvJcmcPP3dpbDQunFpAD.webp";

export const NEWS_LIST_SEO = {
  heading: "Musical-News",
  title: "Musical-News: Premieren, Tourneen & Spielpläne | We Love Musicals",
  description: "Aktuelle Musical-News aus Deutschland, Österreich und der Schweiz: neue Produktionen, Premieren, Tourdaten und Spielplanänderungen – mit Links zu Terminen und Tickets.",
  canonicalUrl: `${NEWS_BASE_URL}/news`,
};

export function getNewsArticleSeo(article: NewsArticle) {
  return {
    title: `${article.title} | We Love Musicals`,
    description: article.teaser.length > 160 ? `${article.teaser.slice(0, 157).replace(/\s+\S*$/, "")} …` : article.teaser,
    canonicalUrl: `${NEWS_BASE_URL}${getNewsUrl(article)}`,
  };
}

/** schema.org NewsArticle für eine Meldung. */
export function getNewsArticleSchema(article: NewsArticle) {
  const seo = getNewsArticleSeo(article);
  const shows = getNewsMusicals(article);
  return {
    "@type": "NewsArticle",
    "@id": `${seo.canonicalUrl}#article`,
    headline: article.title,
    description: article.teaser,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: "de-DE",
    mainEntityOfPage: seo.canonicalUrl,
    author: { "@type": "Organization", name: "We Love Musicals", url: NEWS_BASE_URL },
    publisher: { "@type": "Organization", name: "We Love Musicals", url: NEWS_BASE_URL },
    ...(shows.length > 0 ? {
      about: shows.map((show) => ({
        "@type": "CreativeWork",
        name: show.title,
        url: `${NEWS_BASE_URL}/musical/${show.slug}`,
      })),
    } : {}),
    ...(article.cities.length > 0 ? {
      contentLocation: article.cities.map((city) => ({ "@type": "Place", name: city })),
    } : {}),
  };
}
