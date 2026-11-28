/*
 * News-Landingpage: Liste aller Meldungen, filterbar nach Show und Stadt.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NewsCard } from "@/components/NewsTeaserSection";
import { useSEO } from "@/hooks/useSEO";
import { withSeoTitleHeart } from "@/lib/seo-title";
import {
  filterNews,
  getNewsArticles,
  getNewsFilterOptions,
  NEWS_LIST_IMAGE,
  NEWS_LIST_SEO,
} from "@/lib/news";

const selectClass = "h-11 w-full rounded-sm border border-gold/30 bg-card px-3 text-sm text-foreground focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-gold sm:w-64";

export default function NewsList() {
  useSEO({
    title: withSeoTitleHeart(NEWS_LIST_SEO.title),
    description: NEWS_LIST_SEO.description,
    image: NEWS_LIST_IMAGE,
    url: NEWS_LIST_SEO.canonicalUrl,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const articles = useMemo(() => getNewsArticles(), []);
  const options = useMemo(() => getNewsFilterOptions(), []);
  const [musicalId, setMusicalId] = useState("");
  const visible = useMemo(() => filterNews(articles, { musicalId }), [articles, musicalId]);
  const hasFilter = Boolean(musicalId);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="relative h-48 overflow-hidden md:h-64">
          <img src={NEWS_LIST_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              <Newspaper className="h-3.5 w-3.5" aria-hidden="true" /> News
            </span>
            <h1 className="text-3xl font-extrabold tracking-wider text-white md:text-5xl">{NEWS_LIST_SEO.heading}</h1>
          </div>
        </div>

        <div className="container py-10 md:py-14">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gold transition-colors hover:text-gold-light">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Zurück zur Startseite</span>
          </Link>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-foreground/85">
            Neue Produktionen, Premieren, Tourdaten und Spielplanänderungen – kurz zusammengefasst und direkt mit den passenden Shows verknüpft.
          </p>

          {articles.length > 0 && (
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end" data-testid="news-filters">
              <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wide text-gold">
                Show
                <select className={selectClass} value={musicalId} onChange={(event) => setMusicalId(event.target.value)} data-testid="news-filter-show">
                  <option value="">Alle Shows</option>
                  {options.musicals.map((musical) => (
                    <option key={musical.id} value={musical.id}>{musical.title}</option>
                  ))}
                </select>
              </label>
              {hasFilter && (
                <button
                  type="button"
                  onClick={() => setMusicalId("")}
                  className="h-11 rounded-sm border border-gold/40 px-4 text-sm font-semibold text-foreground transition-colors hover:border-gold"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          )}

          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="news-list">
              {visible.map((article) => (
                <NewsCard key={article.slug} article={article} headingLevel="h2" />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-gold/15 bg-card/50 p-6 text-foreground/85" data-testid="news-empty">
              {hasFilter ? "Für diese Auswahl gibt es aktuell keine Meldungen." : "Hier erscheinen in Kürze die ersten Musical-News."}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
