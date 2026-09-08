import { describe, expect, it } from "vitest";
import {
  getFeaturedSaleBadgeMaxWidthRem,
  SALE_BADGE_LAYOUT,
} from "./sale-layout";

describe("Sale-Störer-Layout", () => {
  it("nutzt eine inhaltsbasierte Breite und reserviert für das Top-Musical-Badge 9 rem rechts", () => {
    expect(SALE_BADGE_LAYOUT.featuredBadgeReserveRem).toBe(9);
    expect(SALE_BADGE_LAYOUT.widthClasses).toContain("inline-flex");
    expect(SALE_BADGE_LAYOUT.widthClasses).toContain("w-fit");
    expect(SALE_BADGE_LAYOUT.widthClasses).toContain("max-w-[calc(100%-9rem)]");
    expect(SALE_BADGE_LAYOUT.heightClass).toBe("h-10");

    const desktopCardWidthRem = 17;
    const desktopSaleMaxWidthRem = getFeaturedSaleBadgeMaxWidthRem(desktopCardWidthRem);
    expect(desktopCardWidthRem - desktopSaleMaxWidthRem).toBe(
      SALE_BADGE_LAYOUT.featuredBadgeReserveRem,
    );

    const mobileCardWidthRem = 343 / 16;
    const mobileSaleMaxWidthRem = getFeaturedSaleBadgeMaxWidthRem(mobileCardWidthRem);
    expect(mobileSaleMaxWidthRem).toBeGreaterThan(0);
    expect(mobileCardWidthRem - mobileSaleMaxWidthRem).toBe(SALE_BADGE_LAYOUT.featuredBadgeReserveRem);
  });
});
