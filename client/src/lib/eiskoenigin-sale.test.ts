import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import { isSaleActive } from "./sale";

describe("Die Eiskönigin sale teaser", () => {
  it("zeigt die zeitlich begrenzte 40%-Stage-Aktion als aktiven Sale-Störer", () => {
    const eiskoenigin = musicals.find((musical) => musical.id === "eiskoenigin");

    expect(eiskoenigin?.sale).toMatchObject({
      label: "SALE",
      discount: "BIS 40 %",
      validFrom: "2026-09-14",
      validUntil: "2026-09-21",
    });
    expect(isSaleActive(eiskoenigin?.sale, new Date("2026-09-13T12:00:00"))).toBe(false);
    expect(isSaleActive(eiskoenigin?.sale, new Date("2026-09-16T12:00:00"))).toBe(true);
    expect(isSaleActive(eiskoenigin?.sale, new Date("2026-09-22T12:00:00"))).toBe(false);
  });
});
