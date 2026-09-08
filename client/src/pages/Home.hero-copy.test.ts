import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Startseiten-Hero-Teaser", () => {
  it("setzt die Schlusszeile nur mobil auf eine eigene Zeile", () => {
    expect(homeSource).toContain('<span className="block md:inline text-gold font-semibold">Licht aus, Magie an!</span>');
  });
});
