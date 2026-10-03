import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AffiliateLinkOverridePartner = "stage" | "tradedoubler" | "awin" | "atg" | "eventim" | "other";
export type AffiliateLinkOverrideKey = {
  musicalId: string;
  partner: AffiliateLinkOverridePartner;
  placement: string;
};

type AffiliateLinkOverride = AffiliateLinkOverrideKey & {
  targetUrl: string;
  updatedAt: string;
};

type OverrideContextValue = {
  ready: boolean;
  getOverride: (key: AffiliateLinkOverrideKey) => string | undefined;
};

const EMPTY_CONTEXT: OverrideContextValue = { ready: true, getOverride: () => undefined };
const AffiliateLinkOverridesContext = createContext<OverrideContextValue>(EMPTY_CONTEXT);
const PRODUCTION_HOSTNAMES = new Set(["welovemusicals.com", "www.welovemusicals.com"]);

export function getAffiliateLinkOverrideKey(key: AffiliateLinkOverrideKey): string {
  return `${key.musicalId}:${key.partner}:${key.placement}`;
}

function isOverride(value: unknown): value is AffiliateLinkOverride {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.musicalId === "string"
    && typeof candidate.partner === "string"
    && typeof candidate.placement === "string"
    && typeof candidate.targetUrl === "string"
    && typeof candidate.updatedAt === "string";
}

/** Loads only current owner-approved targets on the live public domain. */
export function AffiliateLinkOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<AffiliateLinkOverride[]>([]);
  const [ready, setReady] = useState(typeof window === "undefined" || !PRODUCTION_HOSTNAMES.has(window.location.hostname.toLowerCase()));

  useEffect(() => {
    if (!PRODUCTION_HOSTNAMES.has(window.location.hostname.toLowerCase())) return;
    let cancelled = false;

    void fetch("/api/affiliate-link-overrides", { credentials: "omit", cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ overrides?: unknown }> : { overrides: [] })
      .then((payload) => {
        if (!cancelled) setOverrides(Array.isArray(payload.overrides) ? payload.overrides.filter(isOverride) : []);
      })
      .catch(() => {
        if (!cancelled) setOverrides([]);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => { cancelled = true; };
  }, []);

  const value = useMemo<OverrideContextValue>(() => {
    const targets = new Map(overrides.map((override) => [getAffiliateLinkOverrideKey(override), override.targetUrl]));
    return { ready, getOverride: (key) => targets.get(getAffiliateLinkOverrideKey(key)) };
  }, [overrides, ready]);

  return <AffiliateLinkOverridesContext.Provider value={value}>{children}</AffiliateLinkOverridesContext.Provider>;
}

export function useAffiliateLinkOverrides(): OverrideContextValue {
  return useContext(AffiliateLinkOverridesContext);
}
