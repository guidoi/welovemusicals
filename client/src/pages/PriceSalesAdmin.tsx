import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useManagedMusicals } from "@/contexts/PricingContext";
import { ACTIVE_MUSICAL_IDS, type Musical } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ExternalLink, KeyRound, RefreshCcw, Save, Tag, Ticket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type StoredOverride = {
  musicalId: string;
  priceFrom: string;
  saleEnabled: boolean;
  saleLabel: string | null;
  saleDiscount: string | null;
  saleNote: string | null;
  saleEndsAt: Date | string | null;
};

function toDateInput(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function PriceSalesRow({ musical, stored }: { musical: Musical; stored?: StoredOverride }) {
  const utils = trpc.useUtils();
  const save = trpc.priceSales.save.useMutation();
  const reset = trpc.priceSales.reset.useMutation();
  const [priceFrom, setPriceFrom] = useState(stored?.priceFrom ?? musical.priceFrom ?? "");
  const [saleEnabled, setSaleEnabled] = useState(stored?.saleEnabled ?? Boolean(musical.sale));
  const [saleLabel, setSaleLabel] = useState(stored?.saleLabel ?? musical.sale?.label ?? "SALE");
  const [saleDiscount, setSaleDiscount] = useState(stored?.saleDiscount ?? musical.sale?.discount ?? "");
  const [saleNote, setSaleNote] = useState(stored?.saleNote ?? musical.sale?.note ?? "");
  const [saleEndsAt, setSaleEndsAt] = useState(toDateInput(stored?.saleEndsAt ?? musical.sale?.validUntil));

  useEffect(() => {
    setPriceFrom(stored?.priceFrom ?? musical.priceFrom ?? "");
    setSaleEnabled(stored?.saleEnabled ?? Boolean(musical.sale));
    setSaleLabel(stored?.saleLabel ?? musical.sale?.label ?? "SALE");
    setSaleDiscount(stored?.saleDiscount ?? musical.sale?.discount ?? "");
    setSaleNote(stored?.saleNote ?? musical.sale?.note ?? "");
    setSaleEndsAt(toDateInput(stored?.saleEndsAt ?? musical.sale?.validUntil));
  }, [musical, stored]);

  const invalidate = async () => {
    await Promise.all([
      utils.priceSales.listForAdmin.invalidate(),
      utils.priceSales.listPublic.invalidate(),
    ]);
  };

  const handleSave = async () => {
    const normalizedPrice = priceFrom.trim().replace("€", "").trim();
    if (!normalizedPrice) {
      toast.error("Bitte einen Einstiegspreis eintragen.");
      return;
    }
    if (saleEnabled && !saleDiscount.trim()) {
      toast.error("Bitte den konkreten Sale-Vorteil eintragen, zum Beispiel „BIS 15 %“.");
      return;
    }

    try {
      await save.mutateAsync({
        musicalId: musical.id,
        priceFrom: normalizedPrice,
        saleEnabled,
        saleLabel: saleEnabled ? saleLabel.trim() || "SALE" : null,
        saleDiscount: saleEnabled ? saleDiscount.trim() : null,
        saleNote: saleEnabled ? saleNote.trim() || null : null,
        saleEndsAt: saleEnabled && saleEndsAt ? Date.parse(`${saleEndsAt}T00:00:00.000Z`) : null,
      });
      await invalidate();
      toast.success(`${musical.title}: Preis und Aktion gespeichert.`);
    } catch {
      toast.error("Die Änderung konnte nicht gespeichert werden. Bitte erneut versuchen.");
    }
  };

  const handleReset = async () => {
    try {
      await reset.mutateAsync({ musicalId: musical.id });
      await invalidate();
      toast.success(`${musical.title}: wieder auf redaktionellen Ausgangswert gesetzt.`);
    } catch {
      toast.error("Der Ausgangswert konnte nicht wiederhergestellt werden.");
    }
  };

  const isSaving = save.isPending || reset.isPending;

  return (
    <article className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wide text-white">{musical.title}</h2>
          <p className="mt-1 text-sm text-white/55">{musical.city ?? "Tournee"} · {musical.provider}</p>
        </div>
        {stored ? (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Eigener Wert aktiv
          </span>
        ) : (
          <span className="inline-flex self-start rounded-full bg-white/8 px-2.5 py-1 text-xs font-semibold text-white/55">Ausgangswert</span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
        <label className="grid gap-1.5 text-sm font-semibold text-white/85">
          Preis ab
          <span className="relative">
            <input
              value={priceFrom}
              onChange={(event) => setPriceFrom(event.target.value)}
              inputMode="decimal"
              className="h-10 w-full rounded-lg border border-white/15 bg-black/35 px-3 pr-9 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
              aria-label={`Einstiegspreis für ${musical.title}`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/55">€</span>
          </span>
        </label>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-white"><Tag className="h-4 w-4 text-gold" /> Sale-Störer anzeigen</span>
              <span className="mt-1 block text-xs text-white/55">Der Hinweis erscheint nur auf den Musical-Teasern.</span>
            </span>
            <input
              type="checkbox"
              checked={saleEnabled}
              onChange={(event) => setSaleEnabled(event.target.checked)}
              className="h-4 w-4 accent-[#d6ab4c]"
              aria-label={`Sale-Störer für ${musical.title} aktivieren`}
            />
          </label>
        </div>
      </div>

      {saleEnabled ? (
        <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-white/85">
            Kennzeichnung
            <input value={saleLabel} onChange={(event) => setSaleLabel(event.target.value)} className="h-10 rounded-lg border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-white/85">
            Vorteil
            <input value={saleDiscount} onChange={(event) => setSaleDiscount(event.target.value)} placeholder="z. B. BIS 15 % oder 2 FÜR 1" className="h-10 rounded-lg border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-white/85">
            Hinweis (optional)
            <input value={saleNote} onChange={(event) => setSaleNote(event.target.value)} placeholder="z. B. Familien-Tickets bis 16 Jahre" className="h-10 rounded-lg border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-white/85">
            Gültig bis (optional)
            <input type="date" value={saleEndsAt} onChange={(event) => setSaleEndsAt(event.target.value)} className="h-10 rounded-lg border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30" />
          </label>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <a href={`/musical/${musical.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition hover:text-gold-light">
          Öffentliche Seite <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <div className="flex flex-wrap gap-2">
          {stored ? (
            <button type="button" onClick={handleReset} disabled={isSaving} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white/80 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50">
              <RefreshCcw className="h-4 w-4" /> Ausgangswert
            </button>
          ) : null}
          <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-gold px-4 text-sm font-bold text-black transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50">
            <Save className="h-4 w-4" /> {isSaving ? "Speichert …" : "Speichern"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function PriceSalesAdmin() {
  const { user, loading } = useAuth();
  const { musicals } = useManagedMusicals();
  const isAdmin = user?.role === "admin";
  const { data: storedOverrides = [], isLoading } = trpc.priceSales.listForAdmin.useQuery(undefined, {
    enabled: isAdmin,
  });
  const overridesById = useMemo(
    () => new Map(storedOverrides.map((override) => [override.musicalId, override as StoredOverride])),
    [storedOverrides],
  );
  const activeMusicals = useMemo(
    () => musicals.filter((musical) => ACTIVE_MUSICAL_IDS.includes(musical.id) || ACTIVE_MUSICAL_IDS.includes(musical.slug)),
    [musicals],
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-12">
        <header className="rounded-2xl border border-gold/25 bg-[radial-gradient(circle_at_top_right,rgba(214,171,76,0.16),transparent_42%),rgba(17,11,12,0.96)] p-5 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold"><Ticket className="h-4 w-4" /> Redaktion</p>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Preise & Aktionen</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Ändern Sie Preise und Sale-Störer einmal zentral. Öffentliche Teaser, Detailseiten, Ticketboxen, Fakten, FAQs und SEO-Texte übernehmen den gespeicherten Preis automatisch.</p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold"><KeyRound className="h-3.5 w-3.5" /> Nur für Projektinhaber</span>
          </div>
        </header>

        {loading || isLoading ? <p className="text-sm text-white/65">Verwaltung wird geladen …</p> : null}
        {!loading && !isAdmin ? (
          <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-6 text-white">
            <h2 className="font-display text-2xl font-bold">Kein Zugriff</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">Diese Redaktion ist ausschließlich für den Projektinhaber freigegeben.</p>
          </div>
        ) : null}
        {isAdmin ? <section className="space-y-4">{activeMusicals.map((musical) => <PriceSalesRow key={musical.id} musical={musical} stored={overridesById.get(musical.id)} />)}</section> : null}
      </div>
    </DashboardLayout>
  );
}
