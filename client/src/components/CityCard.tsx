/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * CityCard: Elegante Stadt-Karte mit Parallax-Bild
 */
import { MapPin, Music, Hotel } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import type { City } from "@/lib/data";

interface CityCardProps {
  city: City;
  index?: number;
}

export default function CityCard({ city, index = 0 }: CityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/stadt/${city.slug}#city-top`} className="block group">
        <div className="relative aspect-[4/5] rounded-sm overflow-hidden card-spotlight border border-border/30 hover:border-gold/30 transition-all duration-400">
          {/* Background Image */}
          <img
            src={city.image}
            alt={city.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-gold" />
              <h3 className="font-display text-xl font-bold text-white">{city.name}</h3>
            </div>

            <p className="text-sm text-white/70 line-clamp-2 mb-3 leading-relaxed">
              {city.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-gold/70" />
                <span className="text-xs text-white/60">
                  {city.musicalCount} {city.musicalCount === 1 ? "Musical" : "Musicals"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-gold/70" />
                <span className="text-xs text-gold group-hover:text-gold-light transition-colors">
                  Hotels
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
