import { describe, expect, it } from "vitest";
import {
  getFeaturedSaleBadgeWidthRem,
  SALE_BADGE_LAYOUT,
} from "./sale-layout";

describe("Sale-Störer-Layout", () => {
  it("reserviert für das Top-Musical-Badge in jeder Kartenbreite 9 rem rechts", () => {
    expect(SALE_BADGE_LAYOUT.featuredBadgeReserveRem).toBe(9);
    expect(SALE_BADGE_LAYOUT.widthClasses).toContain("max-w-[calc(100%-9rem)]");

    const desktopCardWidthRem = 17;
    const desktopSaleWidthRem = getFeaturedSaleBadgeWidthRem(desktopCardWidthRem);
    expect(desktopCardWidthRem - desktopSaleWidthRem).toBe(
      SALE_BADGE_LAYOUT.featuredBadgeReserveRem,
    );

    const mobileCardWidthRem = 343 / 16;
    const mobileSaleWidthRem = getFeaturedSaleBadgeWidthRem(mobileCardWidthRem);
    expect(mobileSaleWidthRem).toBe(SALE_BADGE_LAYOUT.preferredWidthRem);
    expect(mobileCardWidthRem - mobileSaleWidthRem).toBeGreaterThanOrEqual(
      SALE_BADGE_LAYOUT.featuredBadgeReserveRem,
    );
  });
});
