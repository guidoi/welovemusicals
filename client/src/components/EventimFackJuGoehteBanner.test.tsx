import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConsentProvider } from "@/contexts/ConsentContext";
import EventimFackJuGoehteBanner from "./EventimFackJuGoehteBanner";

describe("EventimFackJuGoehteBanner", () => {
  it("rendert das aktuelle Eventim-Awin-Motiv in nativer 300×50-Größe ohne Hochskalierung", () => {
    const markup = renderToStaticMarkup(
      <ConsentProvider>
        <EventimFackJuGoehteBanner />
      </ConsentProvider>,
    );

    expect(markup).toContain("yyWiipPFyFlomsmA.jpg");
    expect(markup).toContain("Fack Ju Göhte Tickets bei Eventim ansehen");
    expect(markup).toContain("Fack Ju Göhte – Tickets bei Eventim");
    expect(markup).toContain("Anzeige");
    expect(markup).toContain('data-campaign-id="4568822"');
    expect(markup).toContain("max-w-[300px]");
    expect(markup).toContain('width="300"');
    expect(markup).toContain('height="50"');
    expect(markup).toContain('loading="lazy"');
  });
});
