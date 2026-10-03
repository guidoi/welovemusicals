import {
  getAffiliateFallbackReport,
  type AffiliateFallbackEnvironment,
} from "../../_affiliate-fallback-events";
import { getAffiliateLinkTargetOverrides } from "../../_affiliate-link-target-overrides";

type Context = {
  request: Request;
  env: AffiliateFallbackEnvironment;
};

function noStoreHeaders() {
  return {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    vary: "Cookie",
  };
}

function getRequestedDays(request: Request): number {
  const raw = new URL(request.url).searchParams.get("days");
  if (!raw || !/^\d{1,3}$/.test(raw)) return 30;
  return Number(raw);
}

function shouldExportCsv(request: Request): boolean {
  return new URL(request.url).searchParams.get("format") === "csv";
}

function toCsvCell(value: string | number): string {
  const text = String(value);
  // Avoid formula interpretation when the download is opened in spreadsheet applications.
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

function toFallbackCsv(report: NonNullable<Awaited<ReturnType<typeof getAffiliateFallbackReport>>>): string {
  const header = [
    "Auswertungszeitraum (Tage)",
    "Musical-ID",
    "Partner",
    "Platzierung",
    "Fehlergrund",
    "Anzahl",
    "Zuletzt erfasst (UTC)",
  ];
  const rows = report.rows.map((row) => [
    report.periodDays,
    row.musicalId,
    row.partner,
    row.placement,
    row.reason,
    row.eventCount,
    row.latestAt,
  ].map(toCsvCell).join(";"));

  // UTF-8 BOM keeps German column names legible when opening the file in Excel.
  return `\uFEFF${header.map(toCsvCell).join(";")}\r\n${rows.join("\r\n")}${rows.length ? "\r\n" : ""}`;
}

/**
 * This endpoint must remain behind the Cloudflare Access applications documented
 * in docs/affiliate-link-admin-access.md. Access performs owner authentication
 * at the edge; this function intentionally returns aggregate, non-personal data only.
 */
export async function onRequestGet(context: Context): Promise<Response> {
  const report = await getAffiliateFallbackReport(context.env.AFFILIATE_FALLBACK_LOGS, getRequestedDays(context.request));
  if (!report) {
    return Response.json(
      { error: "Die Auswertung ist momentan nicht verfügbar." },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  if (shouldExportCsv(context.request)) {
    return new Response(toFallbackCsv(report), {
      headers: {
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="affiliate-link-fallbacks-${report.periodDays}-tage.csv"`,
        "content-type": "text/csv; charset=utf-8",
        vary: "Cookie",
      },
    });
  }

  const overrides = await getAffiliateLinkTargetOverrides(context.env.AFFILIATE_FALLBACK_LOGS);
  return Response.json({ ...report, overrides: overrides ?? [] }, { headers: noStoreHeaders() });
}

export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: { ...noStoreHeaders(), Allow: "GET" } });
  }

  return onRequestGet(context);
}
