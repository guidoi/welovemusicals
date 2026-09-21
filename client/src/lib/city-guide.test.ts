import { describe, expect, it } from "vitest";
import { getCityGuide } from "./city-guide";

describe("Hamburger Besuchsleitfaden", () => {
  it("liefert nachvollziehbare Planungs- und Primärquellenhinweise", () => {
    const guide = getCityGuide("hamburg");

    expect(guide?.heading).toBe("Musicalabend in Hamburg planen");
    expect(guide?.steps).toHaveLength(3);
    expect(guide?.officialLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ href: expect.stringContaining("hamburg-travel.com") }),
      expect.objectContaining({ href: expect.stringContaining("stage-entertainment.de") }),
    ]));
  });

  it("liefert für Berlin eine eigene Planungshilfe mit offiziellen Quellen", () => {
    const guide = getCityGuide("berlin");

    expect(guide?.heading).toBe("Musicalabend in Berlin planen");
    expect(guide?.steps).toHaveLength(3);
    expect(guide?.officialLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ href: expect.stringContaining("visitberlin.de") }),
      expect.objectContaining({ href: expect.stringContaining("stage-entertainment.de") }),
    ]));
  });

  it("fügt für nicht priorisierte Städte keinen generischen Leitfaden hinzu", () => {
    expect(getCityGuide("bochum")).toBeUndefined();
  });
});
