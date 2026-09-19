import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./CookieConsent.tsx", import.meta.url), "utf8");

describe("CookieConsent wording", () => {
  it("kommuniziert die Einwilligung kurz und verständlich", () => {
    expect(source).toContain("Notwendige Speicherungen halten die Website funktionsfähig.");
    expect(source).toContain("Partner-Tracking, Videos und externe Schriftarten starten nur mit deiner Zustimmung.");
    expect(source).toContain("Wähle, was du erlauben möchtest.");
  });

  it("behält die drei klaren Wahlmöglichkeiten bei", () => {
    expect(source).toContain("Alle akzeptieren");
    expect(source).toContain("Nur notwendige");
    expect(source).toContain("Auswahl speichern");
  });
});
