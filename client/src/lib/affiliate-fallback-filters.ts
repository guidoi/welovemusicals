export type AffiliateFallbackFilterRow = {
  musicalId: string;
  partner: string;
  placement: string;
  reason: string;
  latestAt: string;
};

export type AffiliateFallbackFilters = {
  query: string;
  partner: string;
  from: string;
  to: string;
};

const normalize = (value: string) => value
  .trim()
  .toLocaleLowerCase("de-DE")
  .replaceAll("ä", "ae")
  .replaceAll("ö", "oe")
  .replaceAll("ü", "ue")
  .replaceAll("ß", "ss");

/** Filters only the already loaded, aggregated technical groups; it never adds data to the browser. */
export function filterAffiliateFallbackRows<T extends AffiliateFallbackFilterRow>(
  rows: T[],
  filters: AffiliateFallbackFilters,
): T[] {
  const query = normalize(filters.query);

  return rows.filter((row) => {
    if (filters.partner !== "alle" && row.partner !== filters.partner) return false;

    const latestDate = row.latestAt.slice(0, 10);
    if (filters.from && latestDate < filters.from) return false;
    if (filters.to && latestDate > filters.to) return false;

    if (!query) return true;
    return [row.musicalId, row.partner, row.placement, row.reason]
      .some((value) => normalize(value).includes(query));
  });
}

export function hasActiveAffiliateFallbackFilters(filters: AffiliateFallbackFilters): boolean {
  return Boolean(filters.query || filters.partner !== "alle" || filters.from || filters.to);
}
