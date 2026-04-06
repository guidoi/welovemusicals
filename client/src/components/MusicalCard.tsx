/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * MusicalCard: Elegante Karte mit Spotlight-Hover-Effekt
 */
import { MapPin, ExternalLink, Tag } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Musical } from "@/lib/data";
import { createAwinLink } from "@/lib/data";

interface MusicalCardProps {
  musical: Musical;
  index?: number;
}

const categoryLabels: Record<string, string> = {
  ensuite: "En-Suite-Musical",
  tournee: "Tournee",
  kinder: "Kinder-Musical",
};

const categoryColors: Record<string, string> = {
  ensuite: "bg-gold/20 text-gold",
  tournee: "bg-burgundy/30 text-burgundy-light",
  kinder: "bg-emerald-900/30 text-emerald-400",
};

const categoryIcons: Record<string, string> = {
  ensuite: "🏛️",
  tournee: "🚌",
  kinder: "👶",
};

export default function MusicalCard({ musical, index = 0 }: MusicalCardProps) {
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

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-sm flex items-center gap-1 ${categoryColors[musical.category]}`}>
                <span>{categoryIcons[musical.category]}</span>
                {categoryLabels[musical.category]}
              </span>
            </div>

            {/* Provider Badge */}
            <div className="absolute top-3 right-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-sm bg-black/50 text-foreground/80 backdrop-blur-sm">
                {musical.provider}
              </span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
                {musical.title}
              </h3>
              {musical.subtitle && (
                <p className="text-sm text-gold-light mt-1 italic">{musical.subtitle}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 relative z-10">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5 text-gold/70" />
              {musical.city ? (
                <span>{musical.city} – {musical.venue}</span>
              ) : (
                <span>{musical.cities?.slice(0, 3).join(", ")}{musical.cities && musical.cities.length > 3 ? ` +${musical.cities.length - 3}` : ""}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {musical.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {musical.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                via Eventim
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
