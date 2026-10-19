import { describe, expect, it } from "vitest";
import { SALE_BADGE_LAYOUT } from "./sale-layout";

describe("Sale-Pill-Layout", () => {
  it("nutzt eine kompakte rote Pill ohne Reservierung für ein Top-Musical-Badge", () => {
    expect(SALE_BADGE_LAYOUT.pillClasses).toContain("inline-flex");
    expect(SALE_BADGE_LAYOUT.pillClasses).toContain("min-h-8");
    expect(SALE_BADGE_LAYOUT.pillClasses).toContain("rounded-full");
    expect(SALE_BADGE_LAYOUT.pillClasses).toContain("bg-red");
    expect(SALE_BADGE_LAYOUT.pillClasses).toContain("px-3");
    expect(SALE_BADGE_LAYOUT.pillClasses).not.toContain("max-w-[calc");
  });
});
