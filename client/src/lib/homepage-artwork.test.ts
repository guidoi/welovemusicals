import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "./data";

describe("Startseiten-Artwork-Standard", () => {
  it("führt nur die drei ausdrücklich gelieferten Artwork-Tests", () => {
    const artworkEntries = getActiveMusicals()
      .filter((musical) => musical.homepageArtworkImage)
      .map((musical) => ({ id: musical.id, url: musical.homepageArtworkImage }));

    expect(artworkEntries).toEqual([
      {
        id: "koenig-der-loewen",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/OkUfEwdfPOHqDHSW.webp",
      },
      {
        id: "eiskoenigin",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/RpLtNCLnXldKJXtE.webp",
      },
      {
        id: "tarzan",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/oFgcKHmyWnZiwaCN.webp",
      },
    ]);
  });
});
