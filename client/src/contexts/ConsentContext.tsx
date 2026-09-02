import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ALL_CONSENT,
  CONSENT_STORAGE_KEY,
  hasRevokedOptionalService,
  NECESSARY_ONLY_CONSENT,
  normalizeConsent,
  type ConsentPreferences,
} from "@/lib/consent";

type ConsentContextValue = {
  consent: ConsentPreferences | null;
  hasDecision: boolean;
  settingsOpen: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  saveConsent: (next: ConsentPreferences) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStoredConsent() {
  if (typeof window === "undefined") return null;

  try {
    return normalizeConsent(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null"));
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences | null>(readStoredConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const saveConsent = useCallback((next: ConsentPreferences) => {
    const shouldReload = hasRevokedOptionalService(consent, next);

    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    setConsent(next);
    setSettingsOpen(false);

    // Bereits geladene Drittanbieter-Skripte lassen sich nicht zuverlässig zurücknehmen.
    // Ein Reload stellt sicher, dass ein Widerruf sofort mit einer sauberen Seite wirkt.
    if (shouldReload) {
      window.setTimeout(() => window.location.reload(), 0);
    }
  }, [consent]);

  const value = useMemo<ConsentContextValue>(() => ({
    consent,
    hasDecision: consent !== null,
    settingsOpen,
    acceptAll: () => saveConsent(ALL_CONSENT),
    acceptNecessary: () => saveConsent(NECESSARY_ONLY_CONSENT),
    saveConsent,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
  }), [consent, saveConsent, settingsOpen]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used within ConsentProvider");
  return context;
}
