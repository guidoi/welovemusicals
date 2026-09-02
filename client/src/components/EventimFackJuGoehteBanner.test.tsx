import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConsentProvider } from "@/contexts/ConsentContext";
import EventimFackJuGoehteBanner from "./EventimFackJuGoehteBanner";

describe("EventimFackJuGoehteBanner", () => {
  it("rendert das sichtbare Kampagnenmotiv und die Eventim-Awin-Klickkonfiguration", () => {
    const markup = renderToStaticMarkup(
      <ConsentProvider>
        <EventimFackJuGoehteBanner />
      </ConsentProvider>,
    );

    expect(markup).toContain("fjg-eventim-awin-banner-4568823.jpg");
    expect(markup).toContain("Fack Ju Göhte – Tickets bei Eventim");
    expect(markup).toContain("Anzeige");
  });
});
