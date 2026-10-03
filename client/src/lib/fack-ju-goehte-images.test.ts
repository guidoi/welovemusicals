import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";

const FJG_CDN_PREFIX = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/";

describe("Fack Ju Göhte Bilddaten 2026", () => {
  it("verwendet die neuen WebP-Varianten für Karte, Header und alle gelieferten Pressefotos", () => {
    const musical = getMusicalBySlug("fack-ju-goehte");

    expect(musical).toBeDefined();
    expect(musical?.image).toBe(`${FJG_CDN_PREFIX}npwYhQgBWHxgmCOd.webp`);
    expect(musical?.heroImage).toBe(`${FJG_CDN_PREFIX}wtwoslQMjdcFEeLU.webp`);
    expect(musical?.gallery).toHaveLength(21);
    expect(musical?.gallery?.[0]?.url).toBe(`${FJG_CDN_PREFIX}bSpmrVSSDqHqzPmy.webp`);
    expect(musical?.gallery?.at(-1)?.url).toBe(`${FJG_CDN_PREFIX}CFsGVqMqDfGePDmM.webp`);
    expect(musical?.gallery?.every(({ url, alt }) => url.startsWith(FJG_CDN_PREFIX) && url.endsWith(".webp") && alt.includes("© Nico Moser"))).toBe(true);
  });

  it("bewahrt das freigegebene FJG-Keyvisual als eigenes Markenmotiv", () => {
    const musical = getMusicalBySlug("fack-ju-goehte");

    expect(musical?.keyvisual).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/MhQIlnEcdDkGvroZ.webp");
  });
});
