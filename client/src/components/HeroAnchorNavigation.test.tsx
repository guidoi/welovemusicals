import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HeroAnchorNavigation from "./HeroAnchorNavigation";

describe("HeroAnchorNavigation", () => {
  it("rendert transparente, weiß umrandete Anker-Tabs ohne Pfeilsteuerungen", () => {
    const markup = renderToStaticMarkup(
      <HeroAnchorNavigation
        items={[
          { id: "all-musicals", label: "Alle Musicals", href: "#musicals", kind: "overview" },
          { id: "musical-cities", label: "Musical-Städte", href: "#staedte", kind: "city" },
          { id: "musical-alpha", label: "ALPHA", href: "#musical-alpha", kind: "musical" },
        ]}
      />,
    );

    expect(markup).toContain('aria-label="Direktnavigation zu Musical-Inhalten"');
    expect(markup).not.toContain('Navigation nach links schieben');
    expect(markup).not.toContain('Navigation nach rechts schieben');
    expect(markup).toContain('border-white/75');
    expect(markup).toContain('bg-transparent');
    expect(markup).toContain('text-white');
    expect(markup).toContain('href="#musicals"');
    expect(markup).toContain('href="#staedte"');
    expect(markup).toContain('href="#musical-alpha"');
  });
});
