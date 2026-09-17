import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const privacySource = readFileSync(new URL("./Datenschutz.tsx", import.meta.url), "utf8");

describe("Datenschutz zur Kategorie-Analyse", () => {
  it("erklärt die freiwillige und datensparsame Kategorie-Messung", () => {
    expect(privacySource).toContain("Erlebnis-Kategorie");
    expect(privacySource).toContain("mobil oder Desktop");
    expect(privacySource).toContain("Ticket-, Standort-, URL- und sonstige personenbezogene Daten");
    expect(privacySource).toContain("Awin- und TradeDoubler-Skripte");
  });
});
