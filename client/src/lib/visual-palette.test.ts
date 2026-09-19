import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const home = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
const musicalCard = readFileSync(new URL("../components/MusicalCard.tsx", import.meta.url), "utf8");
const cityCard = readFileSync(new URL("../components/CityCard.tsx", import.meta.url), "utf8");
const musicalDetail = readFileSync(new URL("../pages/MusicalDetail.tsx", import.meta.url), "utf8");
const tourDates = readFileSync(new URL("../components/TourDates.tsx", import.meta.url), "utf8");
const cookieConsent = readFileSync(new URL("../components/CookieConsent.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../components/Header.tsx", import.meta.url), "utf8");
const notFound = readFileSync(new URL("../pages/NotFound.tsx", import.meta.url), "utf8");

describe("Öffentliche Farbpalette", () => {
  it("definiert Creme, Gold und Rot als getrennte Rollenfarben", () => {
    expect(styles).toContain("--color-cream:");
    expect(styles).toContain("--color-gold:");
    expect(styles).toContain("--color-red:");
  });

  it("verwendet den gemeinsamen Rotton für Sale und lässt das Sale-Badge ohne weißen Rahmen", () => {
    expect(musicalCard).toContain("bg-red");
    expect(musicalCard).not.toContain("border-red-200/90");
  });

  it("verwendet Creme für redaktionelle Inhalte und Gold für Orientierung", () => {
    expect(musicalCard).toContain("text-cream/90");
    expect(musicalCard).toContain("text-cream transition-colors");
    expect(home).toContain("text-cream/90");
    expect(cityCard).toContain("text-cream/90");
    expect(musicalCard).toContain("border-gold/60");
  });

  it("reserviert Rot für Sale und unmittelbare Ticket-Conversion", () => {
    expect(musicalDetail).toContain("border border-red p-8");
    expect(musicalDetail).toContain("bg-red px-8 py-4");
    expect(musicalDetail).toContain("bg-red py-3");
    expect(tourDates).toContain("bg-red px-5 py-2");
  });

  it("verwendet keine abweichenden hartcodierten Goldtöne in öffentlichen Flächen", () => {
    expect(musicalDetail).not.toContain("#b8944a");
    expect(tourDates).not.toContain("#b8944a");
    expect(cookieConsent).not.toContain("#d4af37");
    expect(header).not.toContain("#d4a85a");
    expect(notFound).not.toContain("bg-blue-600");
  });
});
