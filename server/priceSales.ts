import { asc, eq } from "drizzle-orm";
import { musicalPriceOverrides, type MusicalPriceOverride } from "../drizzle/schema";
import { getDb } from "./db";
import { listGoogleSheetPriceOverrides, type SheetPriceSaleOverride } from "./googleSheetPriceSource";

export type PriceSaleOverrideInput = {
  musicalId: string;
  priceFrom: string;
  saleEnabled: boolean;
  saleLabel?: string | null;
  saleDiscount?: string | null;
  saleNote?: string | null;
  saleEndsAt?: Date | null;
  updatedByOpenId: string;
};

/** Safe, display-only shape returned to the public website. */
export type PublicPriceSaleOverride = {
  musicalId: string;
  priceFrom: string;
  saleEnabled: boolean;
  saleLabel: string | null;
  saleDiscount: string | null;
  saleNote: string | null;
  saleStartsAt: string | Date | null;
  saleEndsAt: string | Date | null;
};

export async function listPriceSaleOverrides(): Promise<MusicalPriceOverride[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(musicalPriceOverrides).orderBy(asc(musicalPriceOverrides.musicalId));
}

function mapDatabaseOverride(override: MusicalPriceOverride): PublicPriceSaleOverride {
  return {
    musicalId: override.musicalId,
    priceFrom: override.priceFrom,
    saleEnabled: override.saleEnabled,
    saleLabel: override.saleLabel,
    saleDiscount: override.saleDiscount,
    saleNote: override.saleNote,
    saleStartsAt: null,
    saleEndsAt: override.saleEndsAt,
  };
}

/**
 * The published Website-Export is primary. Existing database values stay as a
 * temporary emergency fallback for a missing CSV row, never the other way round.
 */
export function resolvePublicPriceSaleOverrides(
  sheetOverrides: SheetPriceSaleOverride[],
  databaseOverrides: MusicalPriceOverride[],
): PublicPriceSaleOverride[] {
  const resolved = new Map<string, PublicPriceSaleOverride>(
    databaseOverrides.map((override) => [override.musicalId, mapDatabaseOverride(override)]),
  );

  sheetOverrides.forEach((override) => resolved.set(override.musicalId, override));

  return Array.from(resolved.values()).sort((a, b) => a.musicalId.localeCompare(b.musicalId, "de"));
}

export async function listPublicPriceSaleOverrides(): Promise<PublicPriceSaleOverride[]> {
  const [sheetOverrides, databaseOverrides] = await Promise.all([
    listGoogleSheetPriceOverrides(),
    listPriceSaleOverrides(),
  ]);

  return resolvePublicPriceSaleOverrides(sheetOverrides, databaseOverrides);
}

export async function upsertPriceSaleOverride(input: PriceSaleOverrideInput): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Die Preisverwaltung ist derzeit nicht verfügbar.");
  }

  await db
    .insert(musicalPriceOverrides)
    .values(input)
    .onDuplicateKeyUpdate({
      set: {
        priceFrom: input.priceFrom,
        saleEnabled: input.saleEnabled,
        saleLabel: input.saleLabel ?? null,
        saleDiscount: input.saleDiscount ?? null,
        saleNote: input.saleNote ?? null,
        saleEndsAt: input.saleEndsAt ?? null,
        updatedByOpenId: input.updatedByOpenId,
      },
    });
}

export async function deletePriceSaleOverride(musicalId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Die Preisverwaltung ist derzeit nicht verfügbar.");
  }

  await db.delete(musicalPriceOverrides).where(eq(musicalPriceOverrides.musicalId, musicalId));
}
