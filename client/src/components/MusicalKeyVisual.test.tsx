import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MusicalKeyVisual from "./MusicalKeyVisual";

describe("MusicalKeyVisual", () => {
  it("rendert das Keyvisual als sicheren Deeplink, wenn ein Ticketlink vorliegt", () => {
    const markup = renderToStaticMarkup(
      <MusicalKeyVisual
        image="https://images.example.com/keyvisual.webp"
        title="Test-Musical"
        ticketLink="https://tickets.example.com/deeplink"
        ticketProvider="Test Partner"
      />,
    );

    expect(markup).toContain('href="https://tickets.example.com/deeplink"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('title="Tickets für Test-Musical über Test Partner kaufen"');
  });

  it("kennzeichnet ein verlinktes Keyvisual als offizielle Showseite", () => {
    const markup = renderToStaticMarkup(
      <MusicalKeyVisual
        image="https://images.example.com/keyvisual.webp"
        title="Test-Musical"
        ticketLink="https://stage.example.com/show-page"
        ticketProvider="Stage Entertainment"
        linkPurpose="show-page"
      />,
    );

    expect(markup).toContain('href="https://stage.example.com/show-page"');
    expect(markup).toContain('title="Offizielle Showseite von Test-Musical bei Stage Entertainment öffnen"');
  });

  it("behält das Keyvisual ohne Ticketlink als reines Bild bei", () => {
    const markup = renderToStaticMarkup(
      <MusicalKeyVisual image="/images/keyvisual.webp" title="Test-Musical" />,
    );

    expect(markup).not.toContain("<a");
    expect(markup).toContain('alt="Test-Musical"');
  });
});
