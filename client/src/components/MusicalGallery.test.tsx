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
});
