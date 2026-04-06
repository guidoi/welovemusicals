/**
 * MusicalGallery-Komponente
 * Zeigt bis zu 6 Fotos in einer kompakten Bildergalerie mit horizontalem Scrolling
 */

import { MusicalGalleryImage } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface MusicalGalleryProps {
  images: MusicalGalleryImage[];
}

export default function MusicalGallery({ images }: MusicalGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Bildergalerie</h2>

        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {images.slice(0, 6).map((image, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-80 h-56 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full p-2 transition-colors duration-200 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full p-2 transition-colors duration-200 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
