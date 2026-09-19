import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("MusicalDetail ticket CTA hierarchy", () => {
  it("verwendet für die Ticket-Conversion oberhalb des mobilen Detailinhalts Rot", () => {
    expect(source).toContain("border border-red bg-red py-3 text-sm font-semibold tracking-wide text-white");
    expect(source).toContain("Tickets buchen{musical.priceFrom");
  });

  it("behält Gold für die Erlebniswelt und Orientierung im Hero", () => {
    expect(source).toContain("data-testid=\"detail-experience-category\"");
    expect(source).toContain("border border-gold bg-transparent");
  });
});
