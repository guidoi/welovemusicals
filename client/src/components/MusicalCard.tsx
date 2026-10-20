/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalCard: Elegante Karte mit Spotlight-Hover-Effekt
 */
import React from "react";
import { ArrowUpRight, MapPin, Tag } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import type { Musical } from "@/lib/data";
import { createAwinLink } from "@/lib/data";
import { getExperienceCategory, getMusicalExperienceCategories } from "@/lib/experience-categories";
import { SALE_BADGE_LAYOUT } from "@/lib/sale-layout";
import { isSaleActive } from "@/lib/sale";
import { getTicketProviderBrand } from "@/lib/ticket-provider-brand";

interface MusicalCardProps {
  musical: Musical;
  index?: number;
  anchorId?: string;
  showLocation?: boolean;
  /** Increments after a filter update to replay one subtle result reveal. */
  filterAnimationKey?: number;
}

export default function MusicalCard({ musical, index = 0, anchorId, showLocation = true, filterAnimationKey }: MusicalCardProps) {
  const hasActiveSale = isSaleActive(musical.sale);
  const reduceMotion = useReducedMotion();
  const isHomepageArtwork = Boolean(musical.homepageArtworkImage);
  const ticketProviderBrand = getTicketProviderBrand(musical.slug, musical.eventimUrl);
  const experienceCategory = getExperienceCategory(musical.experienceCategory);
  const additionalExperienceCategories = getMusicalExperienceCategories(musical)
    .slice(1)
    .map(getExperienceCategory)
    .filter((category) => category !== undefined);
  const experienceCategories = experienceCategory
    ? [experienceCategory, ...additionalExperienceCategories]
    : additionalExperienceCategories;
  const providerLogoWidthClass =
    ticketProviderBrand.id === "eventim" ? "max-w-20 md:max-w-[4.5rem]" : "max-w-32 md:max-w-28";

  return (
    <motion.div
      key={filterAnimationKey === undefined ? undefined : `${filterAnimationKey}-${musical.id}`}
      id={anchorId}
      className="scroll-mt-24"
      initial={reduceMotion ? false : { opacity: 0, y: filterAnimationKey === undefined ? 30 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: reduceMotion ? 0 : filterAnimationKey === undefined ? 0.5 : 0.22,
        delay: reduceMotion ? 0 : filterAnimationKey === undefined ? index * 0.08 : Math.min(index, 6) * 0.045,
        ease: "easeOut",
      }}
    >
      <Link href={`/musical/${musical.slug}`} className="block group">
        <div className="card-spotlight overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-400 hover:border-gold/30">
          {/* Image */}
          <div
            data-testid="teaser-image"
            data-homepage-artwork={isHomepageArtwork || undefined}
            className="relative aspect-[16/10] overflow-hidden bg-black"
          >
            <img
              src={musical.homepageArtworkImage ?? musical.image}
              alt={musical.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={isHomepageArtwork && musical.homepageArtworkObjectPosition ? { objectPosition: musical.homepageArtworkObjectPosition } : undefined}
              data-homepage-artwork-position={isHomepageArtwork ? musical.homepageArtworkObjectPosition : undefined}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            />
          </div>

          {/* Content */}
          <div className="p-4 relative z-10">
            <h3
              data-testid="teaser-card-title"
              data-title-placement="below-image"
              className="mb-2 font-heading text-xl font-semibold leading-tight tracking-wide text-foreground md:text-2xl"
            >
              {musical.title}
            </h3>

            {/* Location */}
            {showLocation && (
              <div data-testid="teaser-location" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3.5 h-3.5 text-gold/70" />
                {musical.city && musical.venuePerCity ? (
                  <span>
                    {musical.cities?.map((c, i) => (
                      <span key={c}>{i > 0 && " & "}{c} ({musical.venuePerCity![c]})</span>
                    ))}
                  </span>
                ) : musical.city && musical.venue && !musical.venuePerCity && (!musical.cities || musical.cities.length === 1) ? (
                  <span>{musical.city} ({musical.venue})</span>
                ) : (
                  <span>{musical.cities?.slice(0, 3).join(", ")}{musical.cities && musical.cities.length > 3 ? ` +${musical.cities.length - 3}` : ""}</span>
                )}
              </div>
            )}

            {/* Erlebniswelt und zeitlich begrenzte Aktion bleiben unter dem Motiv. */}
            {(experienceCategories.length > 0 || (hasActiveSale && musical.sale)) && (
              <div data-testid="teaser-meta-pills" className="mb-4 flex flex-wrap items-center gap-2">
                {experienceCategories.map((category) => (
                  <span
                    key={category.id}
                    data-testid="teaser-experience-category"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/60 bg-transparent px-3 text-[11px] font-semibold text-gold md:h-10 md:px-4 md:text-xs"
                    data-experience-category={category.id}
                  >
                    <Tag className="h-3 w-3" />
                    {category.shortLabel}
                  </span>
                ))}
                {hasActiveSale && musical.sale && (
                  <span
                    aria-label={`Sale: ${musical.sale.discount}`}
                    className={`${SALE_BADGE_LAYOUT.pillClasses} text-xs font-semibold text-white md:text-sm`}
                    data-sale-layout="inline"
                    data-sale-placement="content"
                    data-testid="sale-badge"
                  >
                    <Tag data-testid="sale-icon" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span data-testid="sale-label" className="whitespace-nowrap">
                      SALE · {musical.sale.discount}
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between gap-3">
              <img
                data-testid="teaser-provider-logo"
                data-provider-brand={ticketProviderBrand.id}
                src={ticketProviderBrand.logoSrc}
                alt={ticketProviderBrand.name}
                className={`h-8 ${providerLogoWidthClass} w-auto object-contain object-left opacity-90 md:h-7`}
              />
              <span data-testid="teaser-ticket-cta" className="flex items-center gap-2 text-sm font-semibold text-cream transition-colors group-hover:text-white">
                Infos &amp; Tickets
                <span
                  data-testid="teaser-ticket-cta-icon"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/55 bg-transparent text-gold transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-gold-light group-hover:text-gold-light"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
