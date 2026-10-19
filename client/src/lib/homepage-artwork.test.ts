import { describe, expect, it } from "vitest";
import { getActiveMusicals } from "./data";

describe("Startseiten-Artwork-Standard", () => {
  it("führt alle ausdrücklich gelieferten Startseiten-Artworks mit sicheren Bildpositionen", () => {
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
        id: "mj-musical",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/OzWqxELdjqwLCaXy.webp",
        objectPosition: "center center",
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
      {
        id: "ziz",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/EnQJZmmBzIEcgfiD.webp",
        objectPosition: "center center",
      },
      {
        id: "teufel-traegt-prada",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/UzggemljKGFByiAb.webp",
        objectPosition: "40% center",
      },
      {
        id: "wir-sind-am-leben",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/ZJZpnKTdVzrLtwfr.webp",
        objectPosition: "center 65%",
      },
      {
        id: "tanz-der-vampire",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WkdDUNhgzVXIsqWN.webp",
        objectPosition: "center center",
      },
      {
        id: "und-julia",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/aoodJxaqlGTtztUk.webp",
        objectPosition: "center center",
      },
      {
        id: "tina-das-musical",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/vNQxTpMsVWJzJISG.webp",
        objectPosition: "center 70%",
      },
    ]);
  });
});
