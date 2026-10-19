import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { musicals } from "./data";
import { isSaleActive } from "./sale";

describe("Die Eiskönigin sale teaser", () => {
  it("hält das Elsa-und-Anna-Hero auf Mobilgeräten unterhalb des Fix-Headers sichtbar", () => {
    const eiskoenigin = musicals.find((musical) => musical.id === "eiskoenigin");

    expect(eiskoenigin?.heroImage).toContain("ElsaUndAnna_Finale_HoldingHands");
    expect(eiskoenigin?.mobileHeroBelowHeader).toBe(true);
    const detailSource = readFileSync("client/src/pages/MusicalDetail.tsx", "utf8");
    expect(detailSource).toContain('mobileHeroBelowHeader ? "mt-20 lg:mt-0" : ""');
  });

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
