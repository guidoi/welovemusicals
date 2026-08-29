import React from "react";
import type { HeroNavigationItem } from "@/lib/hero-navigation";

interface HeroAnchorNavigationProps {
  items: readonly HeroNavigationItem[];
  onNavigate?: (item: HeroNavigationItem) => void;
}

export default function HeroAnchorNavigation({ items, onNavigate }: HeroAnchorNavigationProps) {
  return (
    <nav aria-label="Direktnavigation zu Musical-Inhalten" className="w-full max-w-6xl mx-auto" data-testid="hero-anchor-navigation">
      <div
        tabIndex={0}
        className="flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
            className="inline-flex h-12 shrink-0 snap-start items-center rounded-full border border-white/75 bg-transparent px-6 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/20 transition-all duration-150 hover:-translate-y-0.5 hover:border-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-14 md:px-7 md:text-base"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
