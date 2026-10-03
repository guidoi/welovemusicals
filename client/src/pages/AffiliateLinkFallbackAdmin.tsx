import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Download,
  ExternalLink,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { downloadAffiliateFallbackCsv } from "@/lib/affiliate-link-csv-download";

type PeriodDays = 7 | 30 | 90;

type FallbackRow = {
  musicalId: string;
  partner: string;
  placement: string;
  reason: string;
  eventCount: number;
  latestAt: string;
};

type FallbackReport = {
  periodDays: number;
  summary: {
    total: number;
    last24Hours: number;
    latestAt: string | null;
  };
  rows: FallbackRow[];
};

const PERIOD_OPTIONS: Array<{ value: PeriodDays; label: string }> = [
  { value: 7, label: "7 Tage" },
  { value: 30, label: "30 Tage" },
  { value: 90, label: "90 Tage" },
];

const placementLabels: Record<string, string> = {
  "ticket-base": "Ticket-CTA",
  keyvisual: "Keyvisual",
  "mobile-hero": "Mobile Hero",
  sticky: "Sticky-CTA",
  "ticket-box": "Ticketbox",
  "city-date": "Termin",
  "campaign-banner": "Kampagnenbanner",
};

const reasonLabels: Record<string, string> = {
  "invalid-url": "Ungültige URL",
  "unsupported-destination": "Nicht unterstütztes Ziel",
  "invalid-affiliate-parameters": "Fehlende Partnerparameter",
};

function formatDate(value: string | null) {
  if (!value) return "Noch keine Erfassung";
  const normalized = value.endsWith("Z") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime())
    ? "Unbekannt"
    : new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function MetricCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint: string; icon: typeof BarChart3 }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
          <p className="mt-2 text-xs leading-5 text-white/55">{hint}</p>
        </div>
        <span className="rounded-xl border border-gold/20 bg-gold/10 p-2.5 text-gold"><Icon className="h-5 w-5" /></span>
      </div>
    </article>
  );
}

export default function AffiliateLinkFallbackAdmin() {
  const [period, setPeriod] = useState<PeriodDays>(30);
  const [report, setReport] = useState<FallbackReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/affiliate-link-fallback-events?days=${period}`, { cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 403 ? "Kein Zugriff auf die Auswertung." : "Die Auswertung konnte nicht geladen werden.");
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Die Auswertung ist in dieser lokalen Vorschau nicht verfügbar.");
      }
      setReport(await response.json() as FallbackReport);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Die Auswertung konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const partnerBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    report?.rows.forEach((row) => totals.set(row.partner, (totals.get(row.partner) ?? 0) + Number(row.eventCount)));
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [report]);

  const csvExportUrl = `/api/admin/affiliate-link-fallback-events?days=${period}&format=csv`;

  const exportCsv = useCallback(async () => {
    setExporting(true);
    try {
      const filename = await downloadAffiliateFallbackCsv(csvExportUrl);
      toast.success("CSV-Export heruntergeladen", {
        description: `${filename} ist für die externe Analyse bereit.`,
      });
    } catch (exportError) {
      toast.error("CSV-Export nicht möglich", {
        description: exportError instanceof Error ? exportError.message : "Bitte erneut versuchen.",
      });
    } finally {
      setExporting(false);
    }
  }, [csvExportUrl]);

  return (
    <main className="min-h-screen bg-[#111018] px-4 py-7 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-gold/25 bg-[radial-gradient(circle_at_top_right,rgba(214,171,76,0.16),transparent_42%),rgba(17,11,12,0.96)] p-5 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold"><ShieldCheck className="h-4 w-4" /> Geschützte Verwaltung</p>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Affiliate-Link-Sicherheit</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">Auswertung ausschließlich der technischen Fallbacks. Die Ansicht enthält weder Ticket-URLs noch Besucher-, Cookie-, Consent- oder Buchungsdaten.</p>
            </div>
            <a href="/verwaltung/preise" className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-white/15 px-3 text-sm font-semibold text-white/80 transition hover:border-gold/50 hover:text-gold"><ExternalLink className="h-4 w-4" /> Preise verwalten</a>
          </div>
        </header>

        <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/70"><CalendarClock className="h-4 w-4 text-gold" /> Zeitraum der technischen Ereignisse</div>
          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <button key={option.value} type="button" onClick={() => setPeriod(option.value)} className={`h-9 rounded-lg border px-3 text-sm font-semibold transition ${period === option.value ? "border-gold bg-gold text-black" : "border-white/15 text-white/75 hover:border-white/30"}`}>{option.label}</button>
            ))}
            <button type="button" onClick={() => void exportCsv()} disabled={exporting} className="inline-flex h-9 items-center gap-2 rounded-lg border border-gold/45 px-3 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10 disabled:cursor-wait disabled:opacity-60" aria-label={`CSV-Export für ${period} Tage herunterladen`}><Download className="h-3.5 w-3.5" /> {exporting ? "CSV wird erstellt …" : "CSV-Export"}</button>
            <button type="button" onClick={() => void loadReport()} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white/80 transition hover:border-gold/50 disabled:opacity-50"><RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Aktualisieren</button>
          </div>
        </section>

        {error ? <section className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-white"><div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" /><div><h2 className="font-display text-xl font-bold">Auswertung nicht verfügbar</h2><p className="mt-2 text-sm leading-6 text-white/75">{error}</p></div></div></section> : null}

        {report ? <>
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Fallbacks" value={report.summary.total} hint={`Erfasste technische Fallbacks in den letzten ${report.periodDays} Tagen.`} icon={BarChart3} />
            <MetricCard label="Letzte 24 Stunden" value={report.summary.last24Hours} hint="Nur technisch aktivierte Ersatzlinks, keine Klick- oder Umsatzmessung." icon={AlertTriangle} />
            <MetricCard label="Letzte Erfassung" value={formatDate(report.summary.latestAt)} hint="Zeitpunkt der letzten technischen Meldung." icon={CalendarClock} />
          </section>

          {report.summary.total === 0 ? <section className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.06] p-6 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" /><h2 className="mt-3 font-display text-2xl font-bold">Keine Fallbacks im gewählten Zeitraum</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/65">Die geprüften Ticket- und Bannerlinks wurden ohne sicheren Ersatzpfad verwendet. Die automatische Absicherung bleibt aktiv.</p></section> : <>
            <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <article className="rounded-2xl border border-white/10 bg-black/30 p-5"><h2 className="font-display text-xl font-bold">Nach Partner</h2><div className="mt-5 space-y-3">{partnerBreakdown.map(([partner, count]) => <div key={partner} className="flex items-center justify-between gap-3"><span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/75">{partner}</span><span className="text-lg font-bold text-gold">{count}</span></div>)}</div></article>
              <article className="rounded-2xl border border-white/10 bg-black/30 p-5"><h2 className="font-display text-xl font-bold">So wird die Zahl gelesen</h2><p className="mt-3 text-sm leading-6 text-white/65">Jede Zeile fasst gleiche technische Fälle zusammen. Prüfen Sie zuerst häufige Fehlergründe und anschließend die zugehörige Show beziehungsweise Platzierung. Ein Ereignis bedeutet nicht automatisch einen defekten Partner oder entgangenen Umsatz.</p></article>
            </section>
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/30"><div className="border-b border-white/10 px-5 py-4"><h2 className="font-display text-xl font-bold">Fehlerübersicht</h2><p className="mt-1 text-xs text-white/50">Aggregiert, maximal 100 Gruppen. URLs und personenbezogene Daten werden nicht gespeichert.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[0.035] text-xs uppercase tracking-[0.12em] text-white/50"><tr><th className="px-5 py-3">Musical</th><th className="px-4 py-3">Partner</th><th className="px-4 py-3">Platzierung</th><th className="px-4 py-3">Fehlergrund</th><th className="px-4 py-3 text-right">Anzahl</th><th className="px-5 py-3">Zuletzt</th></tr></thead><tbody>{report.rows.map((row) => <tr key={`${row.musicalId}-${row.partner}-${row.placement}-${row.reason}`} className="border-t border-white/[0.07] text-white/75"><td className="px-5 py-3 font-semibold text-white">{row.musicalId}</td><td className="px-4 py-3 uppercase text-gold">{row.partner}</td><td className="px-4 py-3">{placementLabels[row.placement] ?? row.placement}</td><td className="px-4 py-3">{reasonLabels[row.reason] ?? row.reason}</td><td className="px-4 py-3 text-right font-bold text-white">{row.eventCount}</td><td className="px-5 py-3 text-xs text-white/55">{formatDate(row.latestAt)}</td></tr>)}</tbody></table></div></section>
          </>}
        </> : loading && !error ? <p className="py-12 text-center text-sm text-white/60">Technische Ereignisse werden geladen …</p> : null}
      </div>
    </main>
  );
}
