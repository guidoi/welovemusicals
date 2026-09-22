import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import { isSaleActive } from "./sale";

describe("Die Eiskönigin sale teaser", () => {
  it("zeigt die aktuelle 15%-Stage-Aktion als aktiven Sale-Störer", () => {
    const eiskoenigin = musicals.find((musical) => musical.id === "eiskoenigin");

    expect(eiskoenigin?.sale).toMatchObject({
      label: "SALE",
      discount: "BIS 15 %",
      note: "Bis zu 15 % Rabatt auf ausgewählte Vorstellungen sichern.*",
    });
    expect(isSaleActive(eiskoenigin?.sale, new Date("2026-09-22T12:00:00"))).toBe(true);
  });
});
