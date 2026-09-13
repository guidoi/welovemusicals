import { describe, expect, it } from "vitest";
import { CITY_PROGRAM_SUBLINE, getCityProgramHeading } from "./city-program-heading";

describe("city programme heading standard", () => {
  it("uses the agreed city-specific heading and shared 2026/2027 subline", () => {
    expect(getCityProgramHeading("Hamburg")).toBe("AKTUELL IN Hamburg");
    expect(getCityProgramHeading("Düsseldorf")).toBe("AKTUELL IN Düsseldorf");
    expect(CITY_PROGRAM_SUBLINE).toBe("Musicals & Shows 2026/2027");
  });
});
