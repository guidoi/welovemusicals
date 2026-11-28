import { describe, expect, it } from "vitest";
import { getActiveMusicals, musicals } from "./data";

describe("Startseiten-Artwork-Standard", () => {
  it("erhält alle gelieferten Artworks samt archiviertem Tarzan und zeigt nur das aktive Subset", () => {
    const artworkEntries = musicals
      .filter((musical) => musical.homepageArtworkImage)
      .map((musical) => ({ id: musical.id, url: musical.homepageArtworkImage, objectPosition: musical.homepageArtworkObjectPosition }));

    const expectedArtworkEntries = [
      {
        id: "weihnachten-mit-bibi-tina",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/YqlpbjvubQJLnLqO.webp",
        objectPosition: "center center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:16
        id: "dracula",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/HCsqYSJSQxfUCgbR.webp",
        objectPosition: "right center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:07: Moulin-Rouge-Logo statt Foto
        id: "moulinrouge",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/QmjrNGYBmOnuvRUG.webp",
        objectPosition: "center center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:04
        id: "phantom-der-oper",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/aTKqAeutTXsmNBmb.webp",
        objectPosition: "center center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:16
        id: "der-kleine-lord",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/GKKSrpaPZUQdonvz.webp",
        objectPosition: "70% center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:19
        id: "fackjugoehte",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/uqLRbxFaDHkOSvqV.webp",
        objectPosition: "right center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:19
        id: "dreihaselnuesse",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/QJUhzIabHKwxzxBR.webp",
        objectPosition: "right center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:19
        id: "rapunzel",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/ejGPbNZXmoGZAlGS.webp",
        objectPosition: "right center",
      },
      {
        // Nutzerfreigabe 28.11.2026 02:08: Starlight-Express-Artwork statt Foto
        id: "starlight-express",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/zVqhIulNxEZYRBuA.webp",
        objectPosition: "center center",
      },
      {
        id: "koenig-der-loewen",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/JibeHjKrGppDdBZn.webp",
        objectPosition: "center center",
      },
      {
        id: "mj-musical",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/MMfJusoYpnBekmtJ.webp",
        objectPosition: "center center",
      },
      {
        id: "eiskoenigin",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/rhFeKqfcblXqdBMT.webp",
        objectPosition: "center center",
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
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/aHolZcexRRLBwXpv.webp",
        objectPosition: "center center",
      },
      {
        id: "wir-sind-am-leben",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/SsYEZdPQKcNoqhpk.webp",
        objectPosition: "center center",
      },
      {
        id: "tanz-der-vampire",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VrADmpTWFpwJvGZe.webp",
        objectPosition: "center center",
      },
      {
        id: "salon-rosie",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WSXgvIyplbYVoXzA.webp",
        objectPosition: "center center",
      },
      {
        id: "und-julia",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/RReTvaQxygwhnHmi.webp",
        objectPosition: "center center",
      },
      {
        id: "tina-das-musical",
        url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/UWpTHsymdzTwPhRy.webp",
        objectPosition: "center center",
      },
    ];
    expect(artworkEntries).toEqual(expectedArtworkEntries);
    const activeArtworkEntries = getActiveMusicals()
      .filter((musical) => musical.homepageArtworkImage)
      .map((musical) => ({ id: musical.id, url: musical.homepageArtworkImage, objectPosition: musical.homepageArtworkObjectPosition }));
    expect(activeArtworkEntries).toEqual(expectedArtworkEntries.filter((entry) => entry.id !== "tarzan"));
  });
});
