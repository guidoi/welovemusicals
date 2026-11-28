/*
 * Einzelne News-Meldung unter /news/:slug mit Ticket-CTA zur Show.
 */
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Ticket } from "lucide-react";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTeaserSection from "@/components/NewsTeaserSection";
import NotFound from "@/pages/NotFound";
import { useSEO } from "@/hooks/useSEO";
import { withSeoTitleHeart } from "@/lib/seo-title";
import {
  formatNewsDate,
  getNewsArticles,
  getNewsArticleSeo,
  getNewsBySlug,
  getNewsMusicals,
  type NewsArticle,
} from "@/lib/news";

function NewsArticleView({ article }: { article: NewsArticle }) {
  const seo = getNewsArticleSeo(article);
  useSEO({
    title: withSeoTitleHeart(seo.title),
    description: seo.description,
    image: article.image,
    url: seo.canonicalUrl,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.slug]);

  const shows = getNewsMusicals(article);
  const more = getNewsArticles().filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <article className="container max-w-3xl py-8 md:py-12" data-testid="news-article">
          <nav aria-label="Brotkrumen" className="mb-6 text-sm text-foreground/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-gold">Start</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/news" className="hover:text-gold">News</Link></li>
              <li aria-hidden="true">/</li>
              <li className="line-clamp-1 text-foreground/90" aria-current="page">{article.title}</li>
            </ol>
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-gold">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            </span>
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <span className="text-foreground/70">
                aktualisiert am <time dateTime={article.updatedAt}>{formatNewsDate(article.updatedAt)}</time>
              </span>
            )}
            {shows.map((show) => (
              <Link key={show.id} href={`/musical/${show.slug}`} className="rounded-sm border border-gold/30 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-foreground/90 hover:border-gold">
                {show.title}
              </Link>
            ))}
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground/90">{article.teaser}</p>

          <figure className="my-8 overflow-hidden rounded-xl border border-gold/15 bg-black/40">
            <img src={article.image} alt={article.imageAlt} className="aspect-[16/9] w-full object-cover" />
          </figure>

          <div className="space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.sourceName && (
            <p className="mt-8 text-sm text-foreground/70">
              Quelle: {article.sourceName}
            </p>
          )}

          {shows.map((show) => (
            <aside key={show.id} className="mt-10 rounded-sm border border-red p-6 md:p-8" data-testid="news-ticket-cta">
              <div className="mb-3 flex items-center gap-3">
                <Ticket className="h-6 w-6 text-red" aria-hidden="true" />
                <h2 className="font-display text-2xl font-bold text-foreground">Tickets sichern</h2>
              </div>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Alle Termine, Spielorte und Tickets für {show.title} findest du auf unserer Showseite.
              </p>
              <Link
                href={`/musical/${show.slug}`}
                className="inline-flex items-center gap-2 rounded-sm bg-red px-6 py-3 font-semibold text-white transition-colors hover:bg-red/90"
              >
                Termine & Tickets <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          ))}

          <Link href="/news" className="mt-10 inline-flex items-center gap-2 text-gold transition-colors hover:text-gold-light">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Alle News</span>
          </Link>
        </article>

        <NewsTeaserSection articles={more} heading="Weitere News" testId="news-more-section" className="py-10 md:py-14 bg-card/30" />
      </main>
      <Footer />
    </div>
  );
}

export default function NewsArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = params.slug ? getNewsBySlug(params.slug) : undefined;
  if (!article) return <NotFound />;
  return <NewsArticleView article={article} />;
}

