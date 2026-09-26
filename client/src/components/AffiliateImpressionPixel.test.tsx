import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AffiliateImpressionPixel from "./AffiliateImpressionPixel";

describe("AffiliateImpressionPixel", () => {
  it("renders a neutral one-pixel image without SSR tracking", () => {
    const markup = renderToStaticMarkup(
      <AffiliateImpressionPixel
        enabled={true}
        url="https://example.test/impression"
      />,
    );

    expect(markup).toContain('data-testid="affiliate-impression-pixel"');
    expect(markup).toContain('width="1"');
    expect(markup).toContain('height="1"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain('src="https://example.test/impression"');
  });

  it("loads after consent for the rendered responsive variant without waiting for scroll", () => {
    const source = readFileSync(new URL("./AffiliateImpressionPixel.tsx", import.meta.url), "utf8");

    expect(source).toContain("target.getClientRects().length > 0");
    expect(source).toContain("window.requestAnimationFrame");
    expect(source).not.toContain("IntersectionObserver");
  });
});
