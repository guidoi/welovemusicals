import { describe, expect, it } from "vitest";
import { getAffiliateFallbackPagination, paginateAffiliateFallbackRows } from "./affiliate-fallback-pagination";

const rows = Array.from({ length: 23 }, (_, index) => `gruppe-${index + 1}`);

describe("Affiliate-Fallback-Paginierung", () => {
  it("teilt die bereits gefilterten Gruppen stabil in Zehnerseiten auf", () => {
    const result = paginateAffiliateFallbackRows(rows, 2);

    expect(result.pagination).toEqual({ page: 2, totalPages: 3, startIndex: 10, endIndex: 20 });
    expect(result.rows).toEqual(rows.slice(10, 20));
  });

  it("begrenzt ungültige Seiten und behandelt leere Tabellen barrierearm", () => {
    expect(getAffiliateFallbackPagination(23, 9)).toEqual({ page: 3, totalPages: 3, startIndex: 20, endIndex: 23 });
    expect(getAffiliateFallbackPagination(0, 1)).toEqual({ page: 1, totalPages: 1, startIndex: 0, endIndex: 0 });
  });
});
