import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CityCard-Interaktion", () => {
  it("verwendet einen goldenen Desktop-Hoverrahmen und einen sichtbaren Tastaturfokus", () => {
    const source = readFileSync("client/src/components/CityCard.tsx", "utf8");

    expect(source).toContain("md:hover:border-gold");
    expect(source).toContain("focus-visible:[&>div]:border-gold");
    expect(source).toContain("focus-visible:[&>div]:ring-gold/40");
  });
});
