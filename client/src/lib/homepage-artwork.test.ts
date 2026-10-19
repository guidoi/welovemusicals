import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "./data";

describe("Startseiten-Artwork-Standard", () => {
  it("führt nur die drei ausdrücklich gelieferten Artwork-Tests", () => {
    const artworkEntries = getActiveMusicals()
      .filter((musical) => musical.homepageArtworkImage)
      .map((musical) => ({ id: musical.id, url: musical.homepageArtworkImage, objectPosition: musical.homepageArtworkObjectPosition }));

    expect(artworkEntries).toEqual([
      {
        id: "koenig-der-loewen",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/hohlDhyGutIEJMAj.webp",
        objectPosition: "70% center",
      },
      {
        id: "eiskoenigin",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/RpLtNCLnXldKJXtE.webp",
        objectPosition: "center 80%",
      },
      {
        id: "tarzan",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/oFgcKHmyWnZiwaCN.webp",
        objectPosition: "center 70%",
      },
    ]);
  });
});
