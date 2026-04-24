/**
 * MusicalGallery-Komponente
 * - Mobile: ein Bild pro Slide, volle Breite, Snap-Scrolling
 * - Desktop: 3 Bilder nebeneinander, größere Höhe
 * - Pfeil-Buttons innerhalb des Containers
 * - Kein schwarzer Leerraum am Ende
 */

import { MusicalGalleryImage } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface MusicalGalleryProps {
  images: MusicalGalleryImage[];
}

export default function MusicalGallery({ images }: MusicalGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!images || images.length === 0) return null;

  const displayed = images.slice(0, 6);

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth;
    el.scrollBy({ left: direction === "left" ? -slideWidth : slideWidth, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-foreground text-center">Live-Momente</h2>

        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollState}
            className="flex overflow-x-auto gap-3 md:gap-4 scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayed.map((image, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
                style={{
                  scrollSnapAlign: "start",
                  // Mobile: volle Breite; Desktop: ~33% minus gap
                  width: "calc(100vw - 2rem)",
                  maxWidth: "100%",
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                  style={{ height: "clamp(220px, 56vw, 480px)" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Pfeil Links */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all duration-200 z-10 backdrop-blur-sm"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Pfeil Rechts */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all duration-200 z-10 backdrop-blur-sm"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Dot-Indikatoren */}
          {displayed.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {displayed.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const el = scrollContainerRef.current;
                    if (!el) return;
                    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
                  }}
                  className="w-2 h-2 rounded-full bg-foreground/30 hover:bg-primary transition-colors duration-200"
                  aria-label={`Bild ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
