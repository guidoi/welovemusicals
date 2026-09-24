import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AffiliateImpressionPixel from "./AffiliateImpressionPixel";

describe("AffiliateImpressionPixel", () => {
  it("renders a neutral one-pixel image without preloading a tracker before client-side visibility", () => {
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
});
