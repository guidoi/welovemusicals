import { useEffect } from "react";
import type { AffiliateFallbackReason, SafeAffiliateLink } from "./affiliate-link-safety";

export type AffiliateFallbackPartner = "stage" | "tradedoubler" | "awin" | "atg" | "eventim" | "other";
export type AffiliateFallbackPlacement =
  | "ticket-base"
  | "keyvisual"
  | "mobile-hero"
  | "sticky"
  | "ticket-box"
  | "city-date"
  | "campaign-banner";

export type AffiliateFallbackLogEntry = {
  link: SafeAffiliateLink;
  musicalId: string;
  placement: AffiliateFallbackPlacement;
  partner: AffiliateFallbackPartner;
};

const PRODUCTION_HOSTNAMES = new Set(["welovemusicals.com", "www.welovemusicals.com"]);
const reportedFallbacks = new Set<string>();

export function getAffiliateFallbackLogPayload(entry: AffiliateFallbackLogEntry) {
  if (!entry.link.usedFallback || !entry.link.reason) return undefined;

  return {
    reason: entry.link.reason as AffiliateFallbackReason,
    partner: entry.partner,
    placement: entry.placement,
    musicalId: entry.musicalId,
  };
}

function canReportFallbacks(): boolean {
  return typeof window !== "undefined"
    && PRODUCTION_HOSTNAMES.has(window.location.hostname.toLocaleLowerCase("en-US"));
}

/**
 * Reports a fallback only once per page session. The payload intentionally
 * excludes original/fallback URLs, query parameters, visitor IDs, consent
 * values and all booking or device data. It is a first-party technical error
 * report, never an affiliate click, impression or behavioural tracker.
 */
export function reportAffiliateLinkFallback(entry: AffiliateFallbackLogEntry): boolean {
  const payload = getAffiliateFallbackLogPayload(entry);
  if (!payload || !canReportFallbacks()) return false;

  const key = `${payload.musicalId}:${payload.placement}:${payload.partner}:${payload.reason}`;
  if (reportedFallbacks.has(key)) return false;
  reportedFallbacks.add(key);

  void fetch("/api/affiliate-link-fallback", {
    method: "POST",
    credentials: "omit",
    keepalive: true,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Reporting must never interrupt a ticket path or trigger a retry loop.
  });

  return true;
}

export function useAffiliateLinkFallbackLogging(entries: readonly AffiliateFallbackLogEntry[]) {
  const fingerprint = entries
    .map((entry) => `${entry.musicalId}:${entry.placement}:${entry.partner}:${entry.link.usedFallback}:${entry.link.reason ?? ""}`)
    .join("|");

  useEffect(() => {
    entries.forEach(reportAffiliateLinkFallback);
  }, [fingerprint]);
}

export function __resetAffiliateFallbackReportsForTest() {
  reportedFallbacks.clear();
}
