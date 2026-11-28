import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { Link } from "wouter";
import {
  formatNewsDate,
  getNewsMusicals,
  getNewsUrl,
  type NewsArticle,
} from "@/lib/news";

export function NewsCard({ article, headingLevel = "h3" }: { article: NewsArticle; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const shows = getNewsMusicals(article);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gold/15 bg-card/60 transition-colors duration-200 hover:border-gold/50" data-testid="news-card">
      <Link href={getNewsUrl(article)} className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-gold">
        <div className="relative aspect-[16/9] overflow-hidden bg-black/40">
          <img
            src={article.image}
            alt={article.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-gold">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            </span>
            {shows.map((show) => (
              <span key={show.id} className="rounded-sm border border-gold/30 px-2 py-0.5 font-semibold uppercase tracking-wide text-foreground/90">
                {show.title}
              </span>
            ))}
          </div>
          <Heading className="font-display text-lg font-bold leading-snug text-foreground group-hover:text-gold md:text-xl">
            {article.title}
          </Heading>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">{article.teaser}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
            Weiterlesen <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

interface NewsTeaserSectionProps {
  articles: NewsArticle[];
  heading: string;
  eyebrow?: string;
  className?: string;
  testId?: string;
}

/** Kompakter News-Bereich (Startseite und Detailseiten). Ohne Meldungen wird nichts gerendert. */
export default function NewsTeaserSection({
  articles,
  heading,
  eyebrow = "News",
  className = "py-10 md:py-14 bg-background",
  testId = "news-teaser-section",
}: NewsTeaserSectionProps) {
  if (articles.length === 0) return null;
  return (
    <section className={className} data-testid={testId} aria-labelledby={`${testId}-heading`}>
      <div className="container">
        <div className="mb-3 flex items-center gap-4">
          <div className="h-px w-8 bg-gold" />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            {eyebrow}
          </span>
        </div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id={`${testId}-heading`} className="font-display text-2xl font-bold text-foreground md:text-4xl">
            {heading}
          </h2>
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-light">
            Alle News <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
