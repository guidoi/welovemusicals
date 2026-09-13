import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import { isSaleActive } from "./sale";

describe("Die Eiskönigin sale teaser", () => {
  it("zeigt den Familienvorteil analog zu König der Löwen als aktiven Sale-Störer", () => {
    const eiskoenigin = musicals.find((musical) => musical.id === "eiskoenigin");

    expect(eiskoenigin?.sale).toMatchObject({
      label: "FAMILIEN:",
      discount: "BIS 15 %",
    });
    expect(isSaleActive(eiskoenigin?.sale, new Date("2026-09-11T12:00:00"))).toBe(true);
  });
});
