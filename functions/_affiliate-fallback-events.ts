export type AffiliateFallbackReason = "invalid-url" | "unsupported-destination" | "invalid-affiliate-parameters";
export type AffiliateFallbackPartner = "stage" | "tradedoubler" | "awin" | "atg" | "eventim" | "other";
export type AffiliateFallbackPlacement =
  | "ticket-base"
  | "keyvisual"
  | "mobile-hero"
  | "sticky"
  | "ticket-box"
  | "city-date"
  | "campaign-banner";

export type AffiliateFallbackEvent = {
  reason: AffiliateFallbackReason;
  partner: AffiliateFallbackPartner;
  placement: AffiliateFallbackPlacement;
  musicalId: string;
};

type D1Statement = {
  bind: (...values: string[]) => {
    run: () => Promise<unknown>;
    all: <T>() => Promise<{ results?: T[] }>;
  };
};

export type D1DatabaseLike = {
  prepare: (query: string) => D1Statement;
};

export type AffiliateFallbackEnvironment = {
  AFFILIATE_FALLBACK_LOGS?: D1DatabaseLike;
};

export type AffiliateFallbackSummaryRow = {
  total: number;
  last24Hours: number;
  latestAt: string | null;
};

export type AffiliateFallbackBreakdownRow = {
  musicalId: string;
  partner: AffiliateFallbackPartner;
  placement: AffiliateFallbackPlacement;
  reason: AffiliateFallbackReason;
  eventCount: number;
  latestAt: string;
};

export type AffiliateFallbackReport = {
  periodDays: number;
  summary: AffiliateFallbackSummaryRow;
  rows: AffiliateFallbackBreakdownRow[];
};

const MAX_REPORT_DAYS = 365;
const MAX_REPORT_ROWS = 100;

function normalizeReportDays(value: number): number {
  if (!Number.isInteger(value)) return 30;
  return Math.min(Math.max(value, 1), MAX_REPORT_DAYS);
}

/** Stores only the approved four technical dimensions. No URL, visitor, consent or booking data is accepted. */
export async function recordAffiliateFallbackEvent(
  database: D1DatabaseLike | undefined,
  event: AffiliateFallbackEvent,
): Promise<boolean> {
  if (!database) {
    console.error("affiliate_link_fallback_storage_unavailable");
    return false;
  }

  await database
    .prepare(
      `INSERT INTO affiliate_link_fallback_events (musical_id, partner, placement, reason)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(event.musicalId, event.partner, event.placement, event.reason)
    .run();

  return true;
}

/** Returns aggregated technical diagnostics only; individual browser requests are never exposed. */
export async function getAffiliateFallbackReport(
  database: D1DatabaseLike | undefined,
  requestedDays: number,
): Promise<AffiliateFallbackReport | undefined> {
  if (!database) return undefined;

  const periodDays = normalizeReportDays(requestedDays);
  const fromModifier = `-${periodDays} days`;
  const summaryResult = await database
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN occurred_at >= datetime('now', '-1 day') THEN 1 ELSE 0 END) AS last24Hours,
        MAX(occurred_at) AS latestAt
      FROM affiliate_link_fallback_events
      WHERE occurred_at >= datetime('now', ?)`,
    )
    .bind(fromModifier)
    .all<AffiliateFallbackSummaryRow>();

  const rowsResult = await database
    .prepare(
      `SELECT
        musical_id AS musicalId,
        partner,
        placement,
        reason,
        COUNT(*) AS eventCount,
        MAX(occurred_at) AS latestAt
      FROM affiliate_link_fallback_events
      WHERE occurred_at >= datetime('now', ?)
      GROUP BY musical_id, partner, placement, reason
      ORDER BY eventCount DESC, latestAt DESC
      LIMIT ${MAX_REPORT_ROWS}`,
    )
    .bind(fromModifier)
    .all<AffiliateFallbackBreakdownRow>();

  return {
    periodDays,
    summary: summaryResult.results?.[0] ?? { total: 0, last24Hours: 0, latestAt: null },
    rows: rowsResult.results ?? [],
  };
}
