export type SheetPriceSaleOverride = {
  musicalId: string;
  priceFrom: string;
  saleEnabled: boolean;
  saleLabel: string | null;
  saleDiscount: string | null;
  saleNote: string | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
};

type FetchResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
};

type Fetcher = (url: string, init?: RequestInit) => Promise<FetchResponse>;

type SourceOptions = {
  url?: string;
  fetcher?: Fetcher;
  now?: () => number;
  cacheTtlMs?: number;
  timeoutMs?: number;
};

type SourceCache = {
  expiresAt: number;
  lastKnownGood: SheetPriceSaleOverride[];
};

const DEFAULT_CACHE_TTL_MS = 10 * 60_000;
const DEFAULT_TIMEOUT_MS = 4_500;

/** Known canonical IDs. Unknown spreadsheet rows are ignored rather than exposed publicly. */
const KNOWN_MUSICAL_IDS = new Set([
  "dracula",
  "moulinrouge",
  "phantom-der-oper",
  "sisteract",
  "fackjugoehte",
  "dreihaselnuesse",
  "rapunzel",
  "schoene-und-das-biest",
  "gloeckner-von-notre-dame",
  "starlight-express",
  "koenig-der-loewen",
  "mj-musical",
  "eiskoenigin",
  "tarzan",
  "ziz",
  "teufel-traegt-prada",
  "die-amme",
  "wir-sind-am-leben",
  "tanz-der-vampire",
  "we-will-rock-you",
  "salon-rosie",
  "und-julia",
]);

type ParsedCsv = {
  records: SheetPriceSaleOverride[];
  dataRowCount: number;
};

type HeaderKey = "musicalId" | "priceFrom" | "saleEnabled" | "saleDiscount" | "saleNote" | "saleStartsAt" | "saleEndsAt";

const HEADER_ALIASES: Record<HeaderKey, string[]> = {
  musicalId: ["musical id", "musicalid", "id"],
  priceFrom: ["preis ab", "preis", "price from", "pricefrom"],
  saleEnabled: ["sale aktiv", "saleaktiv", "sale active", "saleactive"],
  saleDiscount: ["sale text", "saletext", "sale rabatt", "salerabatt", "sale discount", "salediscount"],
  saleNote: ["sale hinweis", "salehinweis", "sale note", "salenote"],
  saleStartsAt: ["gultig ab", "gueltig ab", "valid from", "validfrom"],
  saleEndsAt: ["gultig bis", "gueltig bis", "valid until", "validuntil"],
};

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLocaleLowerCase("de")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\-/]+/g, " ")
    .replace(/\s+/g, " ");
}

/** RFC 4180-style parser for a published Google CSV, including quoted commas and newlines. */
export function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];

    if (char === '"') {
      if (quoted && csv[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((field) => field.trim() !== "")) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  if (row.some((field) => field.trim() !== "")) rows.push(row);
  return rows;
}

function indexHeaders(headers: string[]): Partial<Record<HeaderKey, number>> {
  const normalizedHeaders = headers.map(normalizeHeader);
  const indexes: Partial<Record<HeaderKey, number>> = {};

  (Object.keys(HEADER_ALIASES) as HeaderKey[]).forEach((key) => {
    const index = normalizedHeaders.findIndex((header) => HEADER_ALIASES[key].includes(header));
    if (index >= 0) indexes[key] = index;
  });

  return indexes;
}

function getCell(row: string[], index: number | undefined): string {
  return index === undefined ? "" : (row[index] ?? "").trim();
}

function parseGermanPrice(value: string): string | null {
  const stripped = value
    .trim()
    .replace(/(?:€|eur)/gi, "")
    .replace(/\s/g, "");
  if (!stripped) return null;

  let normalized = stripped;
  if (/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(normalized)) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+(?:,\d{1,2})?$/.test(normalized)) {
    normalized = normalized.replace(",", ".");
  } else if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const number = Number(normalized);
  if (!Number.isFinite(number) || number <= 0 || number > 10_000) return null;

  const [whole, decimals] = number.toFixed(2).split(".");
  return decimals === "00" ? whole : `${whole},${decimals}`;
}

function parseBoolean(value: string): boolean | null {
  const normalized = value.trim().toLocaleLowerCase("de");
  if (["ja", "yes", "true", "1", "aktiv", "active"].includes(normalized)) return true;
  if (["nein", "no", "false", "0", "", "inaktiv", "inactive"].includes(normalized)) return false;
  return null;
}

/** Parses ISO or German spreadsheet dates without applying a locale or timezone conversion. */
function parseSpreadsheetDate(value: string): string | null {
  const input = value.trim();
  if (!input) return null;

  const match = input.match(/^(?:(\d{4})-(\d{1,2})-(\d{1,2})|(\d{1,2})\.(\d{1,2})\.(\d{4}))$/);
  if (!match) return null;

  const year = Number(match[1] ?? match[6]);
  const month = Number(match[2] ?? match[5]);
  const day = Number(match[3] ?? match[4]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseSheetCsvDetailed(csv: string): ParsedCsv {
  const rows = parseCsv(csv);
  if (rows.length === 0) throw new Error("Google-Sheets-Export enthält keine Kopfzeile.");

  const indexes = indexHeaders(rows[0]);
  if (indexes.musicalId === undefined || indexes.priceFrom === undefined || indexes.saleEnabled === undefined) {
    throw new Error("Google-Sheets-Export enthält nicht die erforderlichen Website-Spalten.");
  }

  const records = new Map<string, SheetPriceSaleOverride>();
  const dataRows = rows.slice(1);

  dataRows.forEach((row) => {
    const musicalId = getCell(row, indexes.musicalId).toLocaleLowerCase("de");
    const priceFrom = parseGermanPrice(getCell(row, indexes.priceFrom));
    const saleEnabled = parseBoolean(getCell(row, indexes.saleEnabled));

    if (!KNOWN_MUSICAL_IDS.has(musicalId) || !priceFrom || saleEnabled === null) return;

    const saleDiscount = getCell(row, indexes.saleDiscount) || null;
    const saleNote = getCell(row, indexes.saleNote) || null;
    const saleStartsAt = parseSpreadsheetDate(getCell(row, indexes.saleStartsAt));
    const saleEndsAt = parseSpreadsheetDate(getCell(row, indexes.saleEndsAt));

    // A sale row is only valid if it can actually be shown safely.
    if (saleEnabled && !saleDiscount) return;
    if (getCell(row, indexes.saleStartsAt) && !saleStartsAt) return;
    if (getCell(row, indexes.saleEndsAt) && !saleEndsAt) return;
    if (saleStartsAt && saleEndsAt && saleStartsAt > saleEndsAt) return;

    records.set(musicalId, {
      musicalId,
      priceFrom,
      saleEnabled,
      saleLabel: saleEnabled ? "SALE" : null,
      saleDiscount: saleEnabled ? saleDiscount : null,
      saleNote: saleEnabled ? saleNote : null,
      saleStartsAt: saleEnabled ? saleStartsAt : null,
      saleEndsAt: saleEnabled ? saleEndsAt : null,
    });
  });

  return { records: Array.from(records.values()), dataRowCount: dataRows.length };
}

/**
 * Parses only the explicitly whitelisted Website-Export columns. In particular,
 * editorial notes and ticket links are intentionally ignored.
 */
export function parseGoogleSheetPriceCsv(csv: string): SheetPriceSaleOverride[] {
  return parseSheetCsvDetailed(csv).records;
}

export function createGoogleSheetPriceSource(options: SourceOptions = {}) {
  const fetcher = options.fetcher ?? (globalThis.fetch as Fetcher);
  const now = options.now ?? Date.now;
  const cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let cache: SourceCache = { expiresAt: 0, lastKnownGood: [] };

  return {
    async listOverrides(): Promise<SheetPriceSaleOverride[]> {
      const currentTime = now();
      if (cache.expiresAt > currentTime) return cache.lastKnownGood;

      const url = options.url ?? process.env.GOOGLE_SHEETS_PRICE_CSV_URL;
      if (!url) return cache.lastKnownGood;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetcher(url, {
          headers: { Accept: "text/csv" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Google-Sheets-Abruf lieferte HTTP ${response.status}.`);

        const parsed = parseSheetCsvDetailed(await response.text());
        if (parsed.dataRowCount > 0 && parsed.records.length === 0) {
          throw new Error("Google-Sheets-Export enthält keine gültigen Website-Datensätze.");
        }

        cache = {
          lastKnownGood: parsed.records,
          expiresAt: now() + cacheTtlMs,
        };
        return cache.lastKnownGood;
      } catch (error) {
        // Keep response details private; the public website receives only cached values.
        console.warn("[Pricing] Google-Sheets-Quelle vorübergehend nicht verfügbar; verwende Fallback.");
        return cache.lastKnownGood;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

const defaultSource = createGoogleSheetPriceSource();

export function listGoogleSheetPriceOverrides(): Promise<SheetPriceSaleOverride[]> {
  return defaultSource.listOverrides();
}
