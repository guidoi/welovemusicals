import { describe, expect, it } from "vitest";
import {
  ACTIVE_MUSICAL_IDS,
  FEATURED_MUSICAL_IDS,
  HOME_HIDDEN_MUSICAL_IDS,
  getActiveMusicals,
  getAdditionalMusicals,
  getEditorialOverviewMusicals,
  getFeaturedMusicals,
  getHomepageMusicals,
  getMusicalBySlug,
  musicals,
} from "./data";

describe("Top-Musicals auf der Startseite", () => {
  it("führt MJ auf Platz 2, Prada auf Platz 3, WBT unter den Top-Empfehlungen und & JULIA zuletzt", () => {
    expect(FEATURED_MUSICAL_IDS).toEqual([
      "koenig-der-loewen",
      "mj-musical",
      "teufel-traegt-prada",
      "starlight-express",
      "moulinrouge",
      "gloeckner-von-notre-dame",
      "eiskoenigin",
      "ziz",
      "tanz-der-vampire",
      "weihnachten-mit-bibi-tina",
      "und-julia",
    ]);
    expect(getFeaturedMusicals().map((musical) => musical.id)).toEqual(FEATURED_MUSICAL_IDS);
    expect(getFeaturedMusicals()).toHaveLength(11);
  });

  it("führt Tarzan, Dracula und Drei Haselnüsse nicht als Highlights", () => {
    for (const id of ["tarzan", "dracula", "dreihaselnuesse"]) {
      expect(FEATURED_MUSICAL_IDS).not.toContain(id);
      expect(musicals.find((musical) => musical.id === id)?.featured).toBe(false);
    }
  });

  it("hebt & JULIA und WBT ohne Duplikat hervor und erhält Tarzans Katalogdaten und Affiliatepfade", () => {
    const julia = musicals.find((musical) => musical.id === "und-julia");
    const wbt = musicals.find((musical) => musical.id === "weihnachten-mit-bibi-tina");
    const tarzan = musicals.find((musical) => musical.id === "tarzan");
    expect(julia?.featured).toBe(true);
    expect(wbt?.featured).toBe(true);
    expect(getFeaturedMusicals().at(-1)).toBe(julia);
    expect(getFeaturedMusicals()[9]).toBe(wbt);
    for (const id of ["und-julia", "weihnachten-mit-bibi-tina", "teufel-traegt-prada"]) {
      expect(getAdditionalMusicals().filter((musical) => musical.id === id)).toHaveLength(0);
      expect(getEditorialOverviewMusicals(false).filter((musical) => musical.id === id)).toHaveLength(0);
    }
    expect(ACTIVE_MUSICAL_IDS).not.toContain("tarzan");
    expect(getMusicalBySlug("disneys-musical-tarzan")).toBeUndefined();
    expect(tarzan).toBeDefined();
    expect(tarzan?.eventimUrl).toBe("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408");
    expect(tarzan?.tourDates?.[0].endDate).toBe("2026-10-31");
  });

  it("blendet Tarzan in beiden Startseitenübersichten und aus dem aktiven Katalog aus", () => {
    expect(HOME_HIDDEN_MUSICAL_IDS).toEqual(["tarzan"]);
    expect(getActiveMusicals().map((musical) => musical.id)).not.toContain("tarzan");
    expect(getAdditionalMusicals().map((musical) => musical.id)).not.toContain("tarzan");
    expect(getHomepageMusicals().map((musical) => musical.id)).not.toContain("tarzan");
    expect(getHomepageMusicals()).toHaveLength(getActiveMusicals().length);
    for (const includeHighlights of [false, true]) {
      expect(getEditorialOverviewMusicals(includeHighlights).map((musical) => musical.id)).not.toContain("tarzan");
    }
    const tarzan = musicals.find((musical) => musical.id === "tarzan")!;
    // Auch aktivierbare Alias-Datensätze dürfen die Startseiten-Ausblendung nicht umgehen.
    expect(getHomepageMusicals([{ ...tarzan, id: "alias", slug: "tarzan" }])).toEqual([]);
  });

  it("erhält die drei gelieferten Artwork-Motive unverändert im allgemeinen Katalog", () => {
    const expectedArtworkUrls = {
      "koenig-der-loewen": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/JibeHjKrGppDdBZn.webp",
      eiskoenigin: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/rhFeKqfcblXqdBMT.webp",
      tarzan: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/oFgcKHmyWnZiwaCN.webp",
    };
    for (const [id, artworkUrl] of Object.entries(expectedArtworkUrls)) {
      const musical = musicals.find((item) => item.id === id);
      expect(musical?.homepageArtworkImage).toBe(artworkUrl);
      expect(musical?.homepageArtworkImage).toMatch(/\.webp$/);
      expect(musical?.image).not.toBe(artworkUrl);
    }
  });

  it("liefert in der allgemeinen weiteren Musical-Liste alle aktiven Produktionen ohne die elf Highlights", () => {
    const additionalMusicals = getAdditionalMusicals();
    expect(additionalMusicals).toHaveLength(ACTIVE_MUSICAL_IDS.length - FEATURED_MUSICAL_IDS.length);
    expect(additionalMusicals.map((musical) => musical.id)).not.toEqual(expect.arrayContaining([...FEATURED_MUSICAL_IDS]));
    expect(additionalMusicals.every(
      (musical) => ACTIVE_MUSICAL_IDS.includes(musical.id) || ACTIVE_MUSICAL_IDS.includes(musical.slug),
    )).toBe(true);
  });

  it("bezieht bei aktiver Filterauswahl die Highlights in der bestätigten Reihenfolge ohne Duplikate ein", () => {
    const filteredOverviewMusicals = getEditorialOverviewMusicals(true);
    expect(filteredOverviewMusicals.slice(0, FEATURED_MUSICAL_IDS.length).map((musical) => musical.id)).toEqual(FEATURED_MUSICAL_IDS);
    expect(getEditorialOverviewMusicals(false)).toEqual(getAdditionalMusicals(getHomepageMusicals()));
    expect(filteredOverviewMusicals).toHaveLength(getHomepageMusicals().length);
    expect(new Set(filteredOverviewMusicals.map((musical) => musical.id)).size).toBe(filteredOverviewMusicals.length);
  });

  it("führt Zurück in die Zukunft mit einer separaten Versalien-Subline", () => {
    const backToTheFuture = musicals.find((musical) => musical.id === "ziz");
    expect(backToTheFuture?.title).toBe("ZURÜCK IN DIE ZUKUNFT");
    expect(backToTheFuture?.subtitle).toBe("DAS MUSICAL");
  });
});
