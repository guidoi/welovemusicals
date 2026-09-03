import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import YouTubeEmbed from "./YouTubeEmbed";

vi.mock("@/contexts/ConsentContext", () => ({
  useConsent: () => ({ consent: null, openSettings: vi.fn() }),
}));

describe("YouTubeEmbed", () => {
  it("zeigt das lokale Trailer-Thumbnail an, ohne vor der Einwilligung YouTube zu laden", () => {
    const markup = renderToStaticMarkup(
      <YouTubeEmbed videoId="B0vHUyLx2Ac" title="Fack Ju Göhte Trailer" eagerThumbnail />,
    );

    expect(markup).toContain('src="/manus-storage/B0vHUyLx2Ac_adf8d183.jpg"');
    expect(markup).toContain('alt=""');
    expect(markup).toContain('loading="eager"');
    expect(markup).toContain("Mit „Externe Medien &amp; Schriftarten“");
    expect(markup).not.toContain("youtube.com/embed");
  });
});
