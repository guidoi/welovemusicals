import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MusicalGallery from "./MusicalGallery";

describe("MusicalGallery", () => {
  it("zeigt jede bereitgestellte Aufnahme statt die Galerie nach sechs Bildern zu begrenzen", () => {
    const images = Array.from({ length: 21 }, (_, index) => ({
      url: `https://images.example.com/fjg-${index + 1}.webp`,
      alt: `Fack Ju Göhte Pressefoto ${index + 1}`,
    }));

    const markup = renderToStaticMarkup(<MusicalGallery images={images} />);

    expect(markup).toContain("fjg-21.webp");
    expect((markup.match(/https:\/\/images\.example\.com\/fjg-\d+\.webp/g) ?? [])).toHaveLength(21);
    expect(markup).not.toContain('aria-label="Bild 1"');
  });

  it("behält die Punktnavigation für kurze Fotoreihen bei", () => {
    const markup = renderToStaticMarkup(
      <MusicalGallery
        images={[
          { url: "https://images.example.com/one.webp", alt: "Bild eins" },
          { url: "https://images.example.com/two.webp", alt: "Bild zwei" },
        ]}
      />,
    );

    expect(markup).toContain('aria-label="Bild 1"');
    expect(markup).toContain('aria-label="Bild 2"');
  });

  it("zeigt mit preserveAspectRatio jedes Bild in automatischer voller Höhe ohne Beschnitt oder Hoverzoom", () => {
    const images = [
      { url: "https://images.example.com/landscape.webp", alt: "Vollständige Szene im Querformat" },
      { url: "https://images.example.com/portrait.webp", alt: "Vollständige Szene im Hochformat" },
    ];
    const markup = renderToStaticMarkup(
      <MusicalGallery images={images} preserveAspectRatio />,
    );
    const imageTags = markup.match(/<img\b[^>]*>/g) ?? [];

    expect(imageTags).toHaveLength(2);
    for (const tag of imageTags) {
      // Sowohl h-auto als auch inline height:auto bewahren das Originalseitenverhältnis.
      expect(tag).toMatch(/\bh-auto\b|\bheight:auto(?:;|")/);
      expect(tag).not.toContain("clamp(");
      expect(tag).not.toContain("scale-105");
      expect(tag).not.toMatch(/\b(?:h|aspect)-\[/);
      expect(tag).toContain('loading="lazy"');
      expect(tag).toContain('decoding="async"');
    }
    expect(markup).not.toContain("hover:scale-105");
    expect(markup).toContain('alt="Vollständige Szene im Querformat"');
    expect(markup).toContain('alt="Vollständige Szene im Hochformat"');
  });

  it("behält ohne Opt-in sowie bei false die bestehende clamp-Höhe und den Hoverzoom bei", () => {
    const images = [
      { url: "https://images.example.com/legacy-one.webp", alt: "Bestehendes Bild eins" },
      { url: "https://images.example.com/legacy-two.webp", alt: "Bestehendes Bild zwei" },
    ];
    const defaultMarkup = renderToStaticMarkup(<MusicalGallery images={images} />);
    const falseMarkup = renderToStaticMarkup(
      <MusicalGallery images={images} preserveAspectRatio={false} />,
    );

    expect(falseMarkup).toBe(defaultMarkup);
    const imageTags = defaultMarkup.match(/<img\b[^>]*>/g) ?? [];
    expect(imageTags).toHaveLength(2);
    for (const tag of imageTags) {
      expect(tag).toContain("height:clamp(220px, 56vw, 480px)");
      expect(tag).toContain("object-cover");
      expect(tag).toContain("hover:scale-105");
      expect(tag).not.toMatch(/\bh-auto\b|\bheight:auto(?:;|")/);
    }
  });
});
