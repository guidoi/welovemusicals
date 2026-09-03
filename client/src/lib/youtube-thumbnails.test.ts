import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import {
  getTrailerThumbnail,
  sceneThumbnailVideoIds,
  trailerThumbnailByVideoId,
} from "./youtube-thumbnails";

describe("lokale Trailer-Thumbnails", () => {
  it("ordnet allen hinterlegten Trailer-IDs eine lokale 16:9-Vorschau ohne YouTube-Abruf zu", () => {
    expect(Object.keys(trailerThumbnailByVideoId)).toHaveLength(19);
    expect(getTrailerThumbnail("B0vHUyLx2Ac")).toBe("/images/show-visuals/trailer-thumbnails/fack-ju-goehte-scene.jpg");
    expect(getTrailerThumbnail("nicht-vorhanden")).toBeUndefined();

    Object.values(trailerThumbnailByVideoId).forEach((thumbnailUrl) => {
      expect(thumbnailUrl).toMatch(/^\/images\/show-visuals\/trailer-thumbnails\/.+\.(jpg|webp)$/);
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
    ]);

    [...sceneThumbnailVideoIds].forEach((videoId) => {
      expect(getTrailerThumbnail(videoId)).toMatch(/-scene\.(jpg|webp)$/);
    });
  });
});
