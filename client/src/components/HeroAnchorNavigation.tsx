import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { HeroNavigationItem } from "@/lib/hero-navigation";

interface HeroAnchorNavigationProps {
  items: readonly HeroNavigationItem[];
  onNavigate?: (item: HeroNavigationItem) => void;
}

export default function HeroAnchorNavigation({ items, onNavigate }: HeroAnchorNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const orientationItems = items.filter((item) => item.id === "all-musicals" || item.id === "musical-cities");
  const musicalItems = items.filter((item) => item.kind === "musical" || item.id === "more-musicals");

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > 1);
    setCanScrollRight(element.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const shiftNavigation = (direction: -1 | 1) => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollBy({
      left: direction * Math.max(element.clientWidth * 0.72, 220),
      behavior: "smooth",
    });
  };

  const renderItem = (item: HeroNavigationItem, className: string) => {
    if (item.kind !== "musical") {
      return (
        <button
          key={item.id}
          type="button"
          data-testid={`hero-anchor-${item.id}`}
          onClick={() => onNavigate?.(item)}
          className={className}
        >
          {item.label}
        </button>
      );
    }

    return (
      <Link key={item.id} href={item.href} className={className}>
        {item.label}
      </Link>
    );
  };

  return (
    <nav aria-label="Direktnavigation zu Musical-Inhalten" className="w-full max-w-6xl mx-auto" data-testid="hero-anchor-navigation">
      <div className="mb-3 flex flex-wrap justify-center gap-2" data-testid="hero-orientation-navigation">
        {orientationItems.map((item) => renderItem(
          item,
          "inline-flex h-10 items-center rounded-full border border-gold bg-transparent px-4 text-xs font-bold tracking-[0.08em] text-gold shadow-lg shadow-black/20 transition-all duration-150 hover:-translate-y-0.5 hover:border-gold-light hover:bg-gold/15 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-12 md:px-5 md:text-sm",
        ))}
      </div>

      <div className="relative">
      <button
        type="button"
        aria-label="Navigation nach links schieben"
        onClick={() => shiftNavigation(-1)}
        disabled={!canScrollLeft}
        className="hidden md:inline-flex absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white shadow-lg transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <div
        ref={scrollRef}
        tabIndex={0}
        className={`mx-0 flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:mx-12 md:pr-0 ${canScrollRight ? "pr-7" : "pr-0"}`}
      >
        {musicalItems.map((item) => renderItem(
          item,
          item.id === "more-musicals"
            ? "inline-flex h-12 shrink-0 snap-start items-center rounded-full border border-gold bg-transparent px-6 text-sm font-bold tracking-[0.08em] text-gold transition-all duration-150 hover:-translate-y-0.5 hover:border-gold-light hover:bg-gold/15 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-14 md:px-7 md:text-base"
            : "inline-flex h-12 shrink-0 snap-start items-center rounded-full border border-white/75 bg-transparent px-6 text-sm font-bold tracking-[0.08em] text-white shadow-lg shadow-black/20 transition-all duration-150 hover:-translate-y-0.5 hover:border-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-14 md:px-7 md:text-base",
        ))}
      </div>

      <button
        type="button"
        aria-label="Navigation nach rechts schieben"
        onClick={() => shiftNavigation(1)}
        disabled={!canScrollRight}
        className="hidden md:inline-flex absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white shadow-lg transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
      </div>
    </nav>
  );
}
