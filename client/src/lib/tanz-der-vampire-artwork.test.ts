import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";

const TDV_CDN_PREFIX = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/";

describe("Tanz der Vampire Artwork 2027", () => {
  it("verwendet das gelieferte Querformat als Kartenmotiv und Detailheader", () => {
    const musical = getMusicalBySlug("tanz-der-vampire");

    expect(musical).toBeDefined();
    expect(musical?.image).toBe(`${TDV_CDN_PREFIX}HqbiOyEmsKFqxKXu.webp`);
    expect(musical?.heroImage).toBe(`${TDV_CDN_PREFIX}poEanXxyLUwuenex.webp`);
    expect(musical?.image).not.toBe("/images/tanz-der-vampire/tdv-theater.webp");
    expect(musical?.heroImage).not.toBe("/images/tanz-der-vampire/tdv-theater.webp");
  });

  it("bewahrt das bestehende quadratische Keyvisual im Seitenfluss", () => {
    const musical = getMusicalBySlug("tanz-der-vampire");

    expect(musical?.keyvisual).toBe("/images/tanz-der-vampire/tdv-keyvisual.webp");
  });

  it("blendet Live-Momente vorerst aus, bis freigegebene Pressefotos vorliegen", () => {
    const musical = getMusicalBySlug("tanz-der-vampire");

    expect(musical?.gallery).toBeUndefined();
  });

  it("blendet Pressestimmen vorerst aus, bis Rezensionen zur Neuproduktion vorliegen", () => {
    const musical = getMusicalBySlug("tanz-der-vampire");

    expect(musical?.quotes).toBeUndefined();
  });
});
