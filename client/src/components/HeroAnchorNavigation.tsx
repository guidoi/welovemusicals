import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Ticket } from "lucide-react";
import type { HeroNavigationItem } from "@/lib/hero-navigation";

interface HeroAnchorNavigationProps {
  items: readonly HeroNavigationItem[];
  onNavigate?: (item: HeroNavigationItem) => void;
}

export default function HeroAnchorNavigation({ items, onNavigate }: HeroAnchorNavigationProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.72, 240),
      behavior: "smooth",
    });
  };

  return (
    <nav aria-label="Direktnavigation zu Musical-Inhalten" className="w-full max-w-6xl mx-auto" data-testid="hero-anchor-navigation">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          aria-label="Navigation nach links schieben"
          onClick={() => scrollRail(-1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/75 bg-white/95 text-background shadow-lg shadow-black/20 transition-transform duration-150 hover:bg-gold-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div
          ref={scrollerRef}
          className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                if (!onNavigate) return;
                event.preventDefault();
                onNavigate(item);
              }}
              className="inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-full bg-white px-4 text-xs font-bold uppercase tracking-[0.08em] text-background shadow-lg shadow-black/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-5 md:text-sm"
            >
              {item.kind === "overview" && <Ticket className="h-4 w-4" aria-hidden="true" />}
              {item.kind === "city" && <MapPin className="h-4 w-4" aria-hidden="true" />}
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Navigation nach rechts schieben"
          onClick={() => scrollRail(1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/75 bg-white/95 text-background shadow-lg shadow-black/20 transition-transform duration-150 hover:bg-gold-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
