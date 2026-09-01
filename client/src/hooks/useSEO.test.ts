import { describe, expect, it } from "vitest";
import { toAbsoluteUrl } from "./useSEO";
import { RADIUS_OPTIONS } from "@/components/PlzSearch";
import { getCountryForCity } from "@/components/SchemaOrg";

describe("SEO- und PLZ-Konfiguration", () => {
  it("normalisiert lokale OG-Bilder zu absoluten URLs", () => {
    expect(toAbsoluteUrl("/images/musical/keyvisual.webp")).toBe(
      "https://welovemusicals.com/images/musical/keyvisual.webp",
    );
  });

  it("behält bereits absolute Bild-URLs unverändert", () => {
    expect(toAbsoluteUrl("https://cdn.example.com/show.webp")).toBe(
      "https://cdn.example.com/show.webp",
    );
  });

  it("bietet die SEO-konformen Umkreiswerte bis 200 km an", () => {
    expect(RADIUS_OPTIONS).toEqual([25, 50, 100, 150, 200]);
  });

  it("ordnet Spielorte den DACH-Ländern zu", () => {
    expect(getCountryForCity("Wien")).toBe("AT");
    expect(getCountryForCity("Zürich")).toBe("CH");
    expect(getCountryForCity("Hamburg")).toBe("DE");
  });
});
