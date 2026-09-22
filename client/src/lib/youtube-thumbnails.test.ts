import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import {
  getTrailerThumbnail,
  sceneThumbnailVideoIds,
  trailerThumbnailByVideoId,
} from "./youtube-thumbnails";

describe("statische Trailer-Thumbnails", () => {
  it("ordnet allen hinterlegten Trailer-IDs eine statische Vorschau ohne YouTube-Abruf zu", () => {
    expect(Object.keys(trailerThumbnailByVideoId)).toHaveLength(20);
    expect(getTrailerThumbnail("B0vHUyLx2Ac")).toBe("/images/show-visuals/trailer-thumbnails/fack-ju-goehte-scene.jpg");
    expect(getTrailerThumbnail("nicht-vorhanden")).toBeUndefined();

    Object.values(trailerThumbnailByVideoId).forEach((thumbnailUrl) => {
      expect(thumbnailUrl).toMatch(/^(\/images\/show-visuals\/trailer-thumbnails\/.+\.(jpg|webp)|https:\/\/files\.manuscdn\.com\/.+\.(jpg|webp))$/);
      expect(thumbnailUrl).not.toContain("youtube.com");
      expect(thumbnailUrl).not.toContain("ytimg.com");
    });

    musicals
      .filter((musical) => musical.youtubeTrailerId)
      .forEach((musical) => {
        expect(getTrailerThumbnail(musical.youtubeTrailerId!)).toBeDefined();
      });
  });

  it("bevorzugt bei den benannten Shows lebendige Szenenbilder statt doppelter Key Visuals", () => {
    expect([...sceneThumbnailVideoIds]).toEqual([
      "9LJMaLj8Ino",
      "B0vHUyLx2Ac",
      "IWrg3s9gMsY",
      "-N3CbbBAyMM",
      "9zPIQ43Iwwc",
      "N5BdeG7SVug",
    ]);

    [...sceneThumbnailVideoIds].forEach((videoId) => {
      expect(getTrailerThumbnail(videoId)).toMatch(/(-scene\.(jpg|webp)|files\.manuscdn\.com\/.+\.(jpg|webp))$/);
    });
  });
});
