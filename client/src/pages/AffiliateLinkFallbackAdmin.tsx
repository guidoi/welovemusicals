import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Filter,
  Pencil,
  RefreshCcw,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { downloadAffiliateFallbackCsv } from "@/lib/affiliate-link-csv-download";
import {
  filterAffiliateFallbackRows,
  hasActiveAffiliateFallbackFilters,
  type AffiliateFallbackFilters,
} from "@/lib/affiliate-fallback-filters";
import { AFFILIATE_FALLBACKS_PER_PAGE, paginateAffiliateFallbackRows } from "@/lib/affiliate-fallback-pagination";

type PeriodDays = 7 | 30 | 90;
type OverridePartner = "stage" | "tradedoubler" | "awin" | "atg" | "eventim" | "other";

type FallbackRow = {
  musicalId: string;
  partner: OverridePartner;
  placement: string;
  reason: string;
  eventCount: number;
  latestAt: string;
};

type LinkOverride = {
  musicalId: string;
  partner: OverridePartner;
  placement: string;
  targetUrl: string;
  updatedAt: string;
};

type FallbackReport = {
  periodDays: number;
  summary: {
    total: number;
    last24Hours: number;
    latestAt: string | null;
  };
  rows: FallbackRow[];
  overrides: LinkOverride[];
};

type EditingTarget = Pick<FallbackRow, "musicalId" | "partner" | "placement"> & {
  targetUrl: string;
};

const PERIOD_OPTIONS: Array<{ value: PeriodDays; label: string }> = [
  { value: 7, label: "7 Tage" },
  { value: 30, label: "30 Tage" },
  { value: 90, label: "90 Tage" },
];

const EMPTY_FILTERS: AffiliateFallbackFilters = { query: "", partner: "alle", from: "", to: "" };
const ADMIN_TARGET_ENDPOINT = "/api/admin/affiliate-link-target-overrides";

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

const partnerHints: Record<OverridePartner, string> = {
  stage: "Erlaubt sind ausschließlich Stage-Click-URLs mit p=394206, a=3492604 und g=…",
  tradedoubler: "Erlaubt sind ausschließlich TradeDoubler-Click-URLs mit p=377032, a=3492604 und g=…",
  awin: "Erlaubt sind ausschließlich direkte Awin-Tracking-URLs mit awinaffid/r=2865727.",
  atg: "Erlaubt sind ausschließlich ATG/Awin-Ziele mit Publisherkennung 2865727.",
  eventim: "Erlaubt sind ausschließlich Eventim/Awin-Ziele mit Publisherkennung 2865727.",
  other: "Für diese Partnerkategorie ist keine Schnelleditierung verfügbar.",
};

function overrideKey(row: Pick<FallbackRow, "musicalId" | "partner" | "placement">): string {
  return `${row.musicalId}:${row.partner}:${row.placement}`;
}

function formatDate(value: string | null) {
  if (!value) return "Noch keine Erfassung";
  const normalized = value.endsWith("Z") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime())
    ? "Unbekannt"
    : new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

async function responseError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { error?: string };
    return payload.error ?? "Die Ziel-URL konnte nicht verarbeitet werden.";
  } catch {
    return "Die Ziel-URL konnte nicht verarbeitet werden.";
  }
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
  const [savingTarget, setSavingTarget] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AffiliateFallbackFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredRows = useMemo(() => filterAffiliateFallbackRows(report?.rows ?? [], filters), [filters, report?.rows]);
  const { rows: paginatedRows, pagination } = useMemo(
    () => paginateAffiliateFallbackRows(filteredRows, currentPage),
    [currentPage, filteredRows],
  );
  const partnerOptions = useMemo(() => Array.from(new Set(report?.rows.map((row) => row.partner) ?? [])).sort(), [report?.rows]);
  const partnerBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    filteredRows.forEach((row) => totals.set(row.partner, (totals.get(row.partner) ?? 0) + Number(row.eventCount)));
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [filteredRows]);
  const overrideMap = useMemo(
    () => new Map((report?.overrides ?? []).map((override) => [overrideKey(override), override])),
    [report?.overrides],
  );

  const csvExportUrl = `/api/admin/affiliate-link-fallback-events?days=${period}&format=csv`;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, period]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pagination.totalPages));
  }, [pagination.totalPages]);

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

  const beginTargetEdit = (row: FallbackRow) => {
    const currentOverride = overrideMap.get(overrideKey(row));
    setEditingTarget({
      musicalId: row.musicalId,
      partner: row.partner,
      placement: row.placement,
      targetUrl: currentOverride?.targetUrl ?? "",
    });
  };

  const saveTarget = async () => {
    if (!editingTarget) return;
    setSavingTarget(true);
    try {
      const response = await fetch(ADMIN_TARGET_ENDPOINT, {
        method: "PUT",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editingTarget),
      });
      if (!response.ok) throw new Error(await responseError(response));

      const saved = await response.json() as { override: EditingTarget };
      const updatedOverride: LinkOverride = { ...saved.override, updatedAt: new Date().toISOString() };
      setReport((current) => current ? {
        ...current,
        overrides: [...current.overrides.filter((item) => overrideKey(item) !== overrideKey(updatedOverride)), updatedOverride],
      } : current);
      setEditingTarget(null);
      toast.success("Ziel-URL gespeichert", { description: "Der Override wird auf der öffentlichen Seite nach dem nächsten Laden sicher übernommen." });
    } catch (saveError) {
      toast.error("Ziel-URL nicht gespeichert", { description: saveError instanceof Error ? saveError.message : "Bitte erneut versuchen." });
    } finally {
      setSavingTarget(false);
    }
  };

  const resetTarget = async (row: FallbackRow) => {
    setSavingTarget(true);
    try {
      const response = await fetch(ADMIN_TARGET_ENDPOINT, {
        method: "DELETE",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ musicalId: row.musicalId, partner: row.partner, placement: row.placement }),
      });
      if (!response.ok) throw new Error(await responseError(response));

      setReport((current) => current ? {
        ...current,
        overrides: current.overrides.filter((item) => overrideKey(item) !== overrideKey(row)),
      } : current);
      if (editingTarget && overrideKey(editingTarget) === overrideKey(row)) setEditingTarget(null);
      toast.success("Katalogziel wiederhergestellt", { description: "Für diese Fehlergruppe gilt wieder die geprüfte URL aus dem Katalog." });
    } catch (resetError) {
      toast.error("Katalogziel nicht wiederhergestellt", { description: resetError instanceof Error ? resetError.message : "Bitte erneut versuchen." });
    } finally {
      setSavingTarget(false);
    }
  };

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
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/80"><Filter className="h-4 w-4 text-gold" /> Fehlergruppen gezielt durchsuchen</div>
                {hasActiveAffiliateFallbackFilters(filters) ? <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-gold transition hover:text-white"><X className="h-3.5 w-3.5" /> Filter zurücksetzen</button> : null}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="relative block"><span className="sr-only">Fehlergruppen durchsuchen</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" /><input value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Musical oder Fehlergrund" className="h-10 w-full rounded-lg border border-white/15 bg-black/25 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-gold" /></label>
                <label className="block"><span className="sr-only">Netzwerk filtern</span><select value={filters.partner} onChange={(event) => setFilters((current) => ({ ...current, partner: event.target.value }))} className="h-10 w-full rounded-lg border border-white/15 bg-[#1a1822] px-3 text-sm text-white outline-none transition focus:border-gold"><option value="alle">Alle Netzwerke</option>{partnerOptions.map((partner) => <option key={partner} value={partner}>{partner.toUpperCase()}</option>)}</select></label>
                <label className="block text-xs text-white/55"><span className="mb-1 block">Zuletzt erfasst ab (UTC)</span><input type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} className="h-10 w-full rounded-lg border border-white/15 bg-[#1a1822] px-3 text-sm text-white outline-none transition focus:border-gold" /></label>
                <label className="block text-xs text-white/55"><span className="mb-1 block">Zuletzt erfasst bis (UTC)</span><input type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} className="h-10 w-full rounded-lg border border-white/15 bg-[#1a1822] px-3 text-sm text-white outline-none transition focus:border-gold" /></label>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <article className="rounded-2xl border border-white/10 bg-black/30 p-5"><h2 className="font-display text-xl font-bold">Nach Partner</h2><div className="mt-5 space-y-3">{partnerBreakdown.map(([partner, count]) => <div key={partner} className="flex items-center justify-between gap-3"><span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/75">{partner}</span><span className="text-lg font-bold text-gold">{count}</span></div>)}</div></article>
              <article className="rounded-2xl border border-white/10 bg-black/30 p-5"><h2 className="font-display text-xl font-bold">Schnelleditierung</h2><p className="mt-3 text-sm leading-6 text-white/65">Bearbeiten Sie eine Gruppe nur mit der direkt vom Partner gelieferten Tracking-URL. Die API prüft HTTPS, Netzwerk und Kennungen. Ohne eine gültige Prüfung wird nichts gespeichert; „Katalogziel wiederherstellen“ entfernt den Override.</p></article>
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="border-b border-white/10 px-5 py-4"><h2 className="font-display text-xl font-bold">Fehlerübersicht</h2><p className="mt-1 text-xs text-white/50">{filteredRows.length} von {report.rows.length} Fehlergruppen. Aggregiert, maximal 100 Gruppen. URLs und personenbezogene Daten werden nicht gespeichert.</p></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-white/[0.035] text-xs uppercase tracking-[0.12em] text-white/50"><tr><th className="px-5 py-3">Musical</th><th className="px-4 py-3">Partner</th><th className="px-4 py-3">Platzierung</th><th className="px-4 py-3">Fehlergrund</th><th className="px-4 py-3 text-right">Anzahl</th><th className="px-4 py-3">Zuletzt</th><th className="px-5 py-3 text-right">Aktion</th></tr></thead>
                  <tbody>
                    {paginatedRows.map((row) => {
                      const activeOverride = overrideMap.get(overrideKey(row));
                      const isEditing = editingTarget && overrideKey(editingTarget) === overrideKey(row);
                      const editable = row.partner !== "other";
                      return <Fragment key={overrideKey(row)}>
                        <tr className="border-t border-white/[0.07] text-white/75">
                          <td className="px-5 py-3 font-semibold text-white">{row.musicalId}</td>
                          <td className="px-4 py-3 uppercase text-gold">{row.partner}</td>
                          <td className="px-4 py-3">{placementLabels[row.placement] ?? row.placement}</td>
                          <td className="px-4 py-3">{reasonLabels[row.reason] ?? row.reason}</td>
                          <td className="px-4 py-3 text-right font-bold text-white">{row.eventCount}</td>
                          <td className="px-4 py-3 text-xs text-white/55">{formatDate(row.latestAt)}</td>
                          <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2">{activeOverride ? <button type="button" onClick={() => void resetTarget(row)} disabled={savingTarget} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/15 px-2 text-xs font-semibold text-white/75 transition hover:border-red-300/70 hover:text-red-200 disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" /> Katalogziel</button> : null}{editable ? <button type="button" onClick={() => beginTargetEdit(row)} disabled={savingTarget} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/40 px-2 text-xs font-semibold text-gold transition hover:bg-gold/10 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> {activeOverride ? "Ändern" : "Ziel bearbeiten"}</button> : null}</div>{activeOverride ? <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-emerald-300">Override aktiv</span> : null}</td>
                        </tr>
                        {isEditing ? <tr className="border-t border-gold/20 bg-gold/[0.055]"><td colSpan={7} className="px-5 py-4"><div className="grid gap-3 lg:grid-cols-[1fr_auto]"><div><label htmlFor={`target-${overrideKey(row)}`} className="text-sm font-semibold text-white">Neue direkte {row.partner.toUpperCase()}-Ziel-URL</label><input id={`target-${overrideKey(row)}`} value={editingTarget.targetUrl} onChange={(event) => setEditingTarget((current) => current ? { ...current, targetUrl: event.target.value } : current)} placeholder="Partner-Tracking-URL einfügen" autoComplete="off" spellCheck="false" className="mt-2 h-10 w-full rounded-lg border border-white/20 bg-black/35 px-3 font-mono text-xs text-white outline-none transition placeholder:font-sans placeholder:text-white/35 focus:border-gold" /><p className="mt-2 text-xs leading-5 text-white/55">{partnerHints[row.partner]}</p></div><div className="flex items-end gap-2"><button type="button" onClick={() => void saveTarget()} disabled={savingTarget || !editingTarget.targetUrl.trim()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-gold px-3 text-sm font-bold text-black transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" /> {savingTarget ? "Speichert …" : "Sicher speichern"}</button><button type="button" onClick={() => setEditingTarget(null)} disabled={savingTarget} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white/75 transition hover:border-white/40 disabled:opacity-50"><X className="h-4 w-4" /> Abbrechen</button></div></div></td></tr> : null}
                      </Fragment>;
                    })}
                    {filteredRows.length === 0 ? <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-white/55">Keine Fehlergruppen entsprechen den aktuellen Filtern.</td></tr> : null}
                  </tbody>
                </table>
              </div>
              {filteredRows.length > AFFILIATE_FALLBACKS_PER_PAGE ? <nav aria-label="Seitennavigation der Fehlergruppen" className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-white/55">Zeige {pagination.startIndex + 1}–{pagination.endIndex} von {filteredRows.length} gefilterten Fehlergruppen</p><div className="flex flex-wrap items-center gap-1.5"><button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={pagination.page === 1} className="inline-flex h-8 items-center gap-1 rounded-md border border-white/15 px-2 text-xs font-semibold text-white/75 transition hover:border-gold/50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /> Zurück</button>{Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={pagination.page === page ? "page" : undefined} className={`h-8 min-w-8 rounded-md border px-2 text-xs font-bold transition ${pagination.page === page ? "border-gold bg-gold text-black" : "border-white/15 text-white/75 hover:border-gold/50"}`}>{page}</button>)}<button type="button" onClick={() => setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))} disabled={pagination.page === pagination.totalPages} className="inline-flex h-8 items-center gap-1 rounded-md border border-white/15 px-2 text-xs font-semibold text-white/75 transition hover:border-gold/50 disabled:cursor-not-allowed disabled:opacity-40">Weiter <ChevronRight className="h-3.5 w-3.5" /></button></div></nav> : null}
            </section>
          </>}
        </> : loading && !error ? <p className="py-12 text-center text-sm text-white/60">Technische Ereignisse werden geladen …</p> : null}
      </div>
    </main>
  );
}
