/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalCard: Elegante Karte mit Spotlight-Hover-Effekt
 */
import React from "react";
import { MapPin, ExternalLink, Tag, Star } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Musical } from "@/lib/data";
import { createAwinLink } from "@/lib/data";
import { SALE_BADGE_LAYOUT } from "@/lib/sale-layout";
import { isSaleActive } from "@/lib/sale";
import { getTicketProviderBrand } from "@/lib/ticket-provider-brand";

interface MusicalCardProps {
  musical: Musical;
  index?: number;
  anchorId?: string;
}

const categoryLabels: Record<string, string> = {
  ensuite: "Das Original",
  "fester-standort": "Das Original",
  tournee: "Tournee",
  erwachsene: "Erwachsene",
  familie: "Familie",
  kinder: "Kinder",
};

const categoryColors: Record<string, string> = {
  ensuite: "bg-gold/20 text-gold",
  "fester-standort": "bg-gold/20 text-gold",
  tournee: "bg-burgundy/30 text-burgundy-light",
  erwachsene: "bg-purple-900/30 text-purple-300",
  familie: "bg-emerald-900/30 text-emerald-400",
  kinder: "bg-sky-900/30 text-sky-400",
};

const categoryIcons: Record<string, string> = {
  ensuite: "🏛️",
  "fester-standort": "🏛️",
  tournee: "🚌",
  erwachsene: "🎭",
  familie: "👨‍👩‍👧",
  kinder: "⭐",
};

function getLongSaleLabelLines(label: string): readonly [string, string] {
  const lastSeparatorIndex = label.lastIndexOf(" ");
  if (lastSeparatorIndex <= 0) return [label, ""];

  return [label.slice(0, lastSeparatorIndex), label.slice(lastSeparatorIndex + 1)];
}

export default function MusicalCard({ musical, index = 0, anchorId }: MusicalCardProps) {
  const hasActiveSale = isSaleActive(musical.sale);
  const hasLongSaleLabel = Boolean(musical.sale && musical.sale.label.length > 13);
  const longSaleLabelLines = hasLongSaleLabel && musical.sale
    ? getLongSaleLabelLines(musical.sale.label)
    : null;
  const ticketProviderBrand = getTicketProviderBrand(musical.slug, musical.eventimUrl);
  const providerLogoWidthClass =
    ticketProviderBrand.id === "eventim" ? "max-w-20 md:max-w-[4.5rem]" : "max-w-32 md:max-w-28";

  return (
    <motion.div
      id={anchorId}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
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
                className={`absolute top-2.5 left-2.5 z-10 ${hasLongSaleLabel ? SALE_BADGE_LAYOUT.longLabelWidthClasses : SALE_BADGE_LAYOUT.widthClasses} ${SALE_BADGE_LAYOUT.heightClass} ${SALE_BADGE_LAYOUT.roundedClass} overflow-hidden border border-red-200/90 bg-[#ef4444] px-2.5 py-1.5 shadow-lg shadow-red-950/40`}
                aria-label={`${musical.sale.label}: ${musical.sale.discount}${musical.sale.note ? `. ${musical.sale.note}` : ""}`}
                data-testid="sale-badge"
                data-sale-layout={hasLongSaleLabel ? "long-label" : "compact"}
              >
                <div className="flex h-full items-center gap-2">
                  <span data-testid="sale-icon" className="relative grid h-10 w-10 shrink-0 place-items-center" aria-hidden="true">
                    <Tag className="absolute h-10 w-10 fill-[#991b1b] text-[#991b1b]" strokeWidth={0} />
                    <span className="relative -translate-x-px font-black text-[20px] leading-none text-white">%</span>
                  </span>
                  <span className={`min-w-0 ${SALE_BADGE_LAYOUT.mobileTextInsetClass}`}>
                    <span
                      data-testid="sale-label"
                      className={hasLongSaleLabel
                        ? "block max-w-full font-heading text-[11px] font-bold leading-[0.85] tracking-[0.01em] text-white sm:text-[10px]"
                        : "block whitespace-nowrap font-heading text-lg font-semibold leading-none text-white"}
                    >
                      {longSaleLabelLines ? (
                        <>
                          <span data-testid="sale-label-line" className="block whitespace-nowrap">{longSaleLabelLines[0]}</span>
                          <span
                            data-testid="sale-label-line"
                            className="block whitespace-nowrap font-black text-[18px] leading-[0.9] tracking-tight sm:text-base"
                          >
                            {longSaleLabelLines[1]} <span data-testid="sale-discount-inline">· {musical.sale.discount}</span>
                          </span>
                        </>
                      ) : musical.sale.label}
                    </span>
                    {!longSaleLabelLines && (
                      <span className="mt-0.5 block font-heading text-lg font-semibold leading-none text-white">
                        {musical.sale.discount}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Featured Badge */}
            {musical.featured && (
              <div data-testid="featured-badge" className="absolute top-2.5 right-2.5 z-10">
                <span className={`inline-flex items-center gap-1 ${SALE_BADGE_LAYOUT.roundedClass} border border-gold bg-transparent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold shadow-lg shadow-gold/20`}>
                  <Star className="w-2.5 h-2.5 fill-gold text-gold" />
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
            <p className="text-sm text-white leading-relaxed line-clamp-2 mb-4">
              {musical.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {musical.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between gap-3">
              <img
                data-testid="teaser-provider-logo"
                data-provider-brand={ticketProviderBrand.id}
                src={ticketProviderBrand.logoSrc}
                alt={ticketProviderBrand.name}
                className={`h-8 ${providerLogoWidthClass} w-auto object-contain object-left opacity-90 md:h-7`}
              />
              <span data-testid="teaser-ticket-cta" className="flex items-center gap-1.5 text-sm font-semibold text-gold group-hover:text-gold-light transition-colors">
                Tickets sichern
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
