export const AFFILIATE_FALLBACKS_PER_PAGE = 10;

export type AffiliateFallbackPagination = {
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
};

/** Paginates only rows already loaded into the protected admin page. */
export function getAffiliateFallbackPagination(
  totalRows: number,
  requestedPage: number,
  pageSize = AFFILIATE_FALLBACKS_PER_PAGE,
): AffiliateFallbackPagination {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = totalRows === 0 ? 0 : (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);

  return { page, totalPages, startIndex, endIndex };
}

export function paginateAffiliateFallbackRows<T>(
  rows: T[],
  requestedPage: number,
  pageSize = AFFILIATE_FALLBACKS_PER_PAGE,
): { rows: T[]; pagination: AffiliateFallbackPagination } {
  const pagination = getAffiliateFallbackPagination(rows.length, requestedPage, pageSize);
  return {
    rows: rows.slice(pagination.startIndex, pagination.endIndex),
    pagination,
  };
}
