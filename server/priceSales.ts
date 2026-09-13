import { asc, eq } from "drizzle-orm";
import { musicalPriceOverrides, type MusicalPriceOverride } from "../drizzle/schema";
import { getDb } from "./db";

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

export async function listPriceSaleOverrides(): Promise<MusicalPriceOverride[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(musicalPriceOverrides).orderBy(asc(musicalPriceOverrides.musicalId));
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
