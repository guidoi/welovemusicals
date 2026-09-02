import { useEffect, useState } from "react";
import { Check, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { Link } from "wouter";
import {
  ALL_CONSENT,
  NECESSARY_ONLY_CONSENT,
  type ConsentPreferences,
} from "@/lib/consent";
import { useConsent } from "@/contexts/ConsentContext";

const categories: Array<{
  key: keyof ConsentPreferences;
  title: string;
  description: string;
}> = [
  {
    key: "analytics",
    title: "Reichweitenmessung",
    description: "Umami-Statistiken helfen uns zu verstehen, welche Inhalte genutzt werden.",
  },
  {
    key: "affiliateTracking",
    title: "Partner- und Affiliate-Messung",
    description: "Awin, TradeDoubler und Kampagnenimpressionen messen Partnerverweise und Anzeigen.",
  },
  {
    key: "externalMedia",
    title: "Externe Medien & Schriftarten",
    description: "YouTube-Videos und externe Google-Schriftarten werden erst nach deiner Zustimmung geladen.",
  },
];

export default function CookieConsent() {
  const {
    consent,
    hasDecision,
    settingsOpen,
    acceptAll,
    acceptNecessary,
    saveConsent,
    openSettings,
    closeSettings,
  } = useConsent();
  const [draft, setDraft] = useState<ConsentPreferences>(consent ?? NECESSARY_ONLY_CONSENT);

  useEffect(() => {
    setDraft(consent ?? NECESSARY_ONLY_CONSENT);
  }, [consent, settingsOpen]);

  const showDialog = settingsOpen;

  return (
    <>
      {!hasDecision && !showDialog && (
        <section
          className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-sm border border-gold/35 bg-[#110b0c]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-md md:bottom-6 md:p-6"
          aria-label="Cookie-Einstellungen"
        >
          <div className="flex gap-4">
            <div className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold sm:flex">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">Deine Privatsphäre ist uns wichtig</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Wir verwenden technisch notwendige Speicherungen. Optionale Technologien für Statistiken,
                Partnermessung, YouTube und externe Schriftarten aktivieren wir nur mit deiner Auswahl. Details findest du in der{" "}
                <Link href="/datenschutz" className="text-gold underline decoration-gold/40 underline-offset-2 hover:text-gold-light">Datenschutzerklärung</Link>.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={acceptAll} className="rounded-sm bg-gold px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light">
                  Alle akzeptieren
                </button>
                <button type="button" onClick={acceptNecessary} className="rounded-sm border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gold/70 hover:text-gold">
                  Nur notwendige
                </button>
                <button type="button" onClick={openSettings} className="rounded-sm px-3 py-2.5 text-sm font-medium text-gold transition-colors hover:text-gold-light">
                  Einstellungen
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:justify-center" role="presentation">
          <section className="w-full max-w-xl rounded-sm border border-gold/35 bg-[#110b0c] p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="consent-settings-title">
            <div className="flex items-start justify-between gap-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
                <div>
                  <h2 id="consent-settings-title" className="font-display text-2xl font-bold text-white">Datenschutz-Einstellungen</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">Du kannst deine Auswahl jederzeit im Footer ändern.</p>
                </div>
              </div>
              {hasDecision && (
                <button type="button" onClick={closeSettings} aria-label="Einstellungen schließen" className="text-white/60 transition-colors hover:text-gold">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-sm border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white"><Check className="h-4 w-4 text-gold" /> Technisch notwendig</div>
                <p className="mt-1 text-sm leading-relaxed text-white/60">Speicherung deiner Auswahl und die sichere Bereitstellung der Website. Immer aktiv.</p>
              </div>
              {categories.map((category) => (
                <label key={category.key} className="flex cursor-pointer items-start gap-3 rounded-sm border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-gold/35">
                  <input
                    type="checkbox"
                    checked={draft[category.key]}
                    onChange={(event) => setDraft((current) => ({ ...current, [category.key]: event.target.checked }))}
                    className="mt-1 h-4 w-4 accent-[#d4af37]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">{category.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/60">{category.description}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <button type="button" onClick={acceptNecessary} className="rounded-sm border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gold/70 hover:text-gold">
                Nur notwendige
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => saveConsent(draft)} className="rounded-sm bg-gold px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light">
                  Auswahl speichern
                </button>
                <button type="button" onClick={acceptAll} className="rounded-sm px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:text-gold-light">
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
