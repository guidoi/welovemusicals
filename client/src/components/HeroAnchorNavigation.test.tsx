import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import HeroAnchorNavigation from "./HeroAnchorNavigation";

const staticLocationHook = (): [string, (path: string) => void] => ["/", () => undefined];

describe("HeroAnchorNavigation", () => {
  it("rendert transparente, großzügig gepolsterte Anker-Tabs mit Desktop-Pfeilsteuerungen", () => {
    const markup = renderToStaticMarkup(
      <Router hook={staticLocationHook}>
        <HeroAnchorNavigation
          items={[
            { id: "all-musicals", label: "Alle Musicals", href: "#musicals", kind: "overview" },
            { id: "musical-cities", label: "Städte & Termine", href: "#staedte", kind: "city" },
            { id: "musical-alpha", label: "ALPHA", href: "/musical/alpha", kind: "musical" },
            { id: "more-musicals", label: "Weitere Musicals A–Z", href: "#musicals", kind: "overview" },
          ]}
        />
      </Router>,
    );

    expect(markup).toContain('aria-label="Direktnavigation zu Musical-Inhalten"');
    expect(markup).toContain('data-testid="hero-orientation-navigation"');
    expect(markup).toContain('aria-label="Navigation nach links schieben"');
    expect(markup).toContain('aria-label="Navigation nach rechts schieben"');
    expect(markup).toContain('hidden md:inline-flex');
    expect(markup).toContain('disabled');
    expect(markup).toContain('border-white/75');
    expect(markup).toContain('bg-transparent');
    expect(markup).toContain('text-white');
    expect(markup).toContain('h-12');
    expect(markup).toContain('px-6');
    expect(markup).toContain('text-sm');
    expect(markup).toContain('md:h-14');
    expect(markup).toContain('md:px-7');
    expect(markup).toContain('md:text-base');
    expect(markup).toContain('data-testid="hero-anchor-all-musicals"');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('>Alle Musicals<');
    expect(markup).toContain('data-testid="hero-anchor-musical-cities"');
    expect(markup).toContain('href="/musical/alpha"');
    expect(markup).toContain('>Weitere Musicals A–Z<');
  });

  it("rendert Musical-Ziele als relative In-App-Routen", () => {
    const markup = renderToStaticMarkup(
      <Router hook={staticLocationHook}>
        <HeroAnchorNavigation
          items={[{ id: "musical-und-julia", label: "& Julia", href: "/musical/und-julia", kind: "musical" }]}
        />
      </Router>,
    );

    expect(markup).toContain('href="/musical/und-julia"');
    expect(markup).toContain('&amp; Julia');
  });
});
