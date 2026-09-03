import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConsentProvider } from "@/contexts/ConsentContext";
import EventimFackJuGoehteBanner from "./EventimFackJuGoehteBanner";

describe("EventimFackJuGoehteBanner", () => {
  it("rendert das bewährte Eventim-Awin-Motiv in nativer 300×250-Größe ohne Desktop-Hochskalierung", () => {
    const markup = renderToStaticMarkup(
      <ConsentProvider>
        <EventimFackJuGoehteBanner />
      </ConsentProvider>,
    );

    expect(markup).toContain("fjg-eventim-awin-banner-4568823.jpg");
    expect(markup).toContain("Fack Ju Göhte Tickets bei Eventim ansehen");
    expect(markup).toContain("Fack Ju Göhte – Tickets bei Eventim");
    expect(markup).toContain("Anzeige");
    expect(markup).toContain('data-campaign-id="4568823"');
    expect(markup).toContain("max-w-[300px]");
    expect(markup).toContain('width="300"');
    expect(markup).toContain('height="250"');
    expect(markup).toContain('loading="lazy"');
  });
});
