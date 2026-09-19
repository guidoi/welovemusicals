/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalCard: Elegante Karte mit Spotlight-Hover-Effekt
 */
import React from "react";
import { ArrowUpRight, MapPin, Tag, Star } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import type { Musical } from "@/lib/data";
import { createAwinLink } from "@/lib/data";
import { getExperienceCategory } from "@/lib/experience-categories";
import { SALE_BADGE_LAYOUT } from "@/lib/sale-layout";
import { isSaleActive } from "@/lib/sale";
import { getTicketProviderBrand } from "@/lib/ticket-provider-brand";

interface MusicalCardProps {
  musical: Musical;
  index?: number;
  anchorId?: string;
  /** Increments after a filter update to replay one subtle result reveal. */
  filterAnimationKey?: number;
}

export default function MusicalCard({ musical, index = 0, anchorId, filterAnimationKey }: MusicalCardProps) {
  const hasActiveSale = isSaleActive(musical.sale);
  const reduceMotion = useReducedMotion();
  const ticketProviderBrand = getTicketProviderBrand(musical.slug, musical.eventimUrl);
  const experienceCategory = getExperienceCategory(musical.experienceCategory);
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
        <div className="card-spotlight bg-card border border-border/50 rounded-sm overflow-hidden hover:border-gold/30 transition-all duration-400">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={musical.image}
              alt={musical.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Sale badge */}
            {hasActiveSale && musical.sale && (
              <div
                className={`absolute top-2.5 left-2.5 z-10 ${SALE_BADGE_LAYOUT.widthClasses} ${SALE_BADGE_LAYOUT.heightClass} ${SALE_BADGE_LAYOUT.roundedClass} overflow-hidden bg-red px-2 py-0.5 shadow-lg shadow-red-950/40`}
                aria-label={`Sale: ${musical.sale.discount}`}
                data-testid="sale-badge"
                data-sale-layout="compact"
              >
                <div className="flex h-full items-center justify-center gap-1">
                  <span data-testid="sale-icon" className="relative grid h-7 w-7 shrink-0 place-items-center" aria-hidden="true">
                    <Tag className="absolute h-7 w-7 fill-red-dark text-red-dark" strokeWidth={0} />
                    <span className="relative -translate-x-px font-black text-[14px] leading-none text-white">%</span>
                  </span>
                  <span
                    data-testid="sale-label"
                    className="whitespace-nowrap font-heading text-xs font-semibold leading-none text-white md:text-sm"
                  >
                    SALE · {musical.sale.discount}
                  </span>
                </div>
              </div>
            )}

            {/* Featured Badge */}
            {musical.featured && (
              <div data-testid="featured-badge" className="absolute top-2.5 right-2.5 z-10">
                <span className={`inline-flex items-center gap-1.5 ${SALE_BADGE_LAYOUT.roundedClass} border border-gold/60 bg-black/60 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-cream backdrop-blur-sm`}>
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  Top-Musical
                </span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl md:text-2xl font-semibold text-white leading-tight font-heading tracking-wide">
                {musical.title}
              </h3>
              {musical.subtitle && musical.id !== "starlight-express" && musical.id !== "phantom-der-oper" && (
                <p className="text-[13px] md:text-[11px] text-white/70 mt-0.5 uppercase tracking-widest font-medium">{musical.subtitle}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 relative z-10">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
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

            {/* Description */}
            <p className="text-sm text-cream/90 leading-relaxed line-clamp-2 mb-4">
              {musical.description}
            </p>

            {/* Curated experience category */}
            {experienceCategory && (
              <div className="mb-4">
                <span
                  data-testid="teaser-experience-category"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/60 bg-transparent px-3 text-[11px] font-semibold text-gold md:h-10 md:px-4 md:text-xs"
                >
                  <Tag className="h-3 w-3" />
                  {experienceCategory.shortLabel}
                </span>
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
