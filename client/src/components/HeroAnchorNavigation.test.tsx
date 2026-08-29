import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HeroAnchorNavigation from "./HeroAnchorNavigation";

describe("HeroAnchorNavigation", () => {
  it("rendert anklickbare Tabs sowie Bedienfelder zum horizontalen Verschieben", () => {
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
    expect(markup).toContain('aria-label="Navigation nach links schieben"');
    expect(markup).toContain('aria-label="Navigation nach rechts schieben"');
    expect(markup).toContain('href="#musicals"');
    expect(markup).toContain('href="#staedte"');
    expect(markup).toContain('href="#musical-alpha"');
  });
});
