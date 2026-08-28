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

interface MusicalCardProps {
  musical: Musical;
  index?: number;
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

export default function MusicalCard({ musical, index = 0 }: MusicalCardProps) {
  const hasActiveSale = isSaleActive(musical.sale);
  const ticketProviderLabel = musical.eventimUrl.includes("stage-entertainment.de")
    ? "via Stage Entertainment"
    : (musical.slug === "moulin-rouge" || musical.slug === "phantom-der-oper" || musical.slug === "gloeckner-von-notre-dame" || musical.slug === "starlight-express")
      ? "via ATG Tickets"
      : "via Eventim";

  return (
    <motion.div
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
                className={`absolute top-2.5 left-2.5 z-10 ${SALE_BADGE_LAYOUT.widthClasses} ${SALE_BADGE_LAYOUT.roundedClass} border border-red-400/80 bg-[#5b0d1d]/90 px-2.5 py-1.5 shadow-lg shadow-black/40 backdrop-blur-sm`}
                aria-label={`${musical.sale.label}: ${musical.sale.discount}${musical.sale.note ? `. ${musical.sale.note}` : ""}`}
                data-testid="sale-badge"
              >
                <div className="flex items-center gap-2">
                  <span className="relative grid h-6 w-6 shrink-0 place-items-center" aria-hidden="true">
                    <Tag className="absolute h-6 w-6 fill-red-950/40 text-red-200 stroke-[2.5]" />
                    <span className="relative -translate-x-px text-[10px] font-black leading-none text-white">%</span>
                  </span>
                  <span className="min-w-0">
                    <span data-testid="sale-label" className="block whitespace-nowrap text-[8px] font-bold uppercase leading-none tracking-[0.1em] text-red-100">
                      {musical.sale.label}
                    </span>
                    <span className="mt-1 block font-heading text-lg font-semibold leading-none text-white">
                      {musical.sale.discount}
                    </span>
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
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                {ticketProviderLabel}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-gold group-hover:text-gold-light transition-colors">
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
