import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import { getTrailerThumbnail, trailerThumbnailByVideoId } from "./youtube-thumbnails";

describe("lokale Trailer-Thumbnails", () => {
  it("ordnet allen hinterlegten Trailer-IDs eine lokale 16:9-Vorschau ohne YouTube-Abruf zu", () => {
    expect(Object.keys(trailerThumbnailByVideoId)).toHaveLength(19);
    expect(getTrailerThumbnail("B0vHUyLx2Ac")).toBe("/images/show-visuals/trailer-thumbnails/B0vHUyLx2Ac.jpg");
    expect(getTrailerThumbnail("nicht-vorhanden")).toBeUndefined();

    Object.values(trailerThumbnailByVideoId).forEach((thumbnailUrl) => {
      expect(thumbnailUrl).toMatch(/^\/images\/show-visuals\/trailer-thumbnails\/.+\.jpg$/);
      expect(thumbnailUrl).not.toContain("youtube.com");
      expect(thumbnailUrl).not.toContain("ytimg.com");
    });

    musicals
      .filter((musical) => musical.youtubeTrailerId)
      .forEach((musical) => {
        expect(getTrailerThumbnail(musical.youtubeTrailerId!)).toBeDefined();
      });
  });
});
