import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MusicalGallery from "../components/MusicalGallery";
import { getMusicalBySlug } from "./data";

const ORIGINAL_CDN_PREFIX = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/";
// Nur unveränderte Originalassets festhalten: neue Foto-CDN-URLs sind nicht vorhersagbar.
// Die Tests benötigen keine außerhalb des Repos liegenden Recherchedateien oder Manifeste.
const shows = [
  {
    id: "dreihaselnuesse",
    slug: "drei-haselnuesse-fuer-aschenbroedel",
    photographer: /\bNico\s*Moser\b/,
    originalImage: `${ORIGINAL_CDN_PREFIX}YuwJUWWcbmSXZUHi.webp`,
    originalKeyvisual: `${ORIGINAL_CDN_PREFIX}TYeawFkzjEqXLBKk.webp`,
  },
  {
    id: "der-kleine-lord",
    slug: "der-kleine-lord",
    photographer: /\bJens\s*Ochmann\b/,
    originalImage: `${ORIGINAL_CDN_PREFIX}sMrkJMvPtRQdnlMJ.webp`,
    originalKeyvisual: `${ORIGINAL_CDN_PREFIX}UARCYeGDkgcsgNrm.webp`,
  },
] as const;

const expectedGalleryRanks = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const httpsWebp = /^https:\/\/.+\.webp$/;

function topRanks(alt: string): number[] {
  return Array.from(alt.matchAll(/\(Top (\d+)\)/g), (match) => Number(match[1]));
}

describe.each(shows)("$slug – Pressefotos Top 1 bis Top 10", (show) => {
  it("verwendet Top 1 als vollständig dargestelltes Hero-Foto statt des ursprünglichen Artworks", () => {
    const musical = getMusicalBySlug(show.slug)!;

    expect(musical).toBeDefined();
    expect(musical.id).toBe(show.id);
    expect(musical.heroImage).toMatch(httpsWebp);
    expect(musical.heroImage).not.toBe(show.originalImage);
    expect(musical.heroImage).not.toBe(show.originalKeyvisual);
    expect(musical.heroImageFit).toBe("contain");
    expect(musical.heroImageAlt).toEqual(expect.any(String));
    expect(topRanks(musical.heroImageAlt ?? "")).toEqual([1]);
    expect(musical.heroImageAlt).toMatch(show.photographer);
  });

  it("führt genau neun eindeutige WebP-Fotos in der numerischen Reihenfolge Top 2 bis Top 10 mit Credits", () => {
    const musical = getMusicalBySlug(show.slug)!;
    const gallery = musical.gallery ?? [];
    const urls = gallery.map(({ url }) => url);

    expect(gallery).toHaveLength(9);
    expect(new Set(urls).size).toBe(9);
    expect(urls).not.toContain(musical.heroImage);
    expect(musical.galleryPreserveAspectRatio).toBe(true);
    expect(gallery.map(({ alt }) => topRanks(alt))).toEqual(
      expectedGalleryRanks.map((rank) => [rank]),
    );
    for (const { url, alt } of gallery) {
      expect(url).toMatch(httpsWebp);
      expect(url).not.toBe(show.originalImage);
      expect(url).not.toBe(show.originalKeyvisual);
      expect(alt).toMatch(show.photographer);
    }
  });

  it("rendert alle neun Galerieaufnahmen in Datenreihenfolge ohne das Hero-Foto erneut auszugeben", () => {
    const musical = getMusicalBySlug(show.slug)!;
    const markup = renderToStaticMarkup(
      <MusicalGallery
        images={musical.gallery ?? []}
        preserveAspectRatio={musical.galleryPreserveAspectRatio}
      />,
    );
    const imageTags = markup.match(/<img\b[^>]*>/g) ?? [];

    expect(imageTags).toHaveLength(9);
    expect(imageTags.map((tag) => topRanks(tag))).toEqual(
      expectedGalleryRanks.map((rank) => [rank]),
    );
    expect(imageTags.map((tag) => tag.match(/\bsrc="([^"]+)"/)?.[1])).toEqual(
      musical.gallery?.map(({ url }) => url),
    );
    expect(markup).not.toContain(musical.heroImage!);
  });

  it("bewahrt Kartenmotiv und Keyvisual bytegleich und fügt keine Pressestimmen hinzu", () => {
    const musical = getMusicalBySlug(show.slug)!;

    expect(musical.image).toBe(show.originalImage);
    expect(musical.keyvisual).toBe(show.originalKeyvisual);
    expect(musical.homepageArtworkImage).toBeUndefined();
    expect(musical.quotes ?? []).toEqual([]);
  });
});

describe("Der kleine Lord – bestehendes Uwe-Kröger-Foto", () => {
  it("bewahrt URL, Alt-Text und Position des bereits vorhandenen Inlinefotos", () => {
    const musical = getMusicalBySlug("der-kleine-lord")!;

    expect(musical.inlineDetailImage).toEqual({
      url: `${ORIGINAL_CDN_PREFIX}ZWCOQhljNRjcinLB.webp`,
      alt: "Uwe Kröger als Graf von Dorincourt in Der Kleine Lord – Das Musical",
    });
    expect(musical.inlineDetailImageAfterParagraphIndex).toBe(4);
  });
});
