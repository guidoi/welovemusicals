import { trpc } from "@/lib/trpc";
import { type Musical, type MusicalSale, musicals as editorialMusicals } from "@/lib/data";
import { createContext, useContext, useMemo } from "react";

export type PriceSaleOverride = {
  musicalId: string;
  priceFrom: string;
  saleEnabled: boolean;
  saleLabel: string | null;
  saleDiscount: string | null;
  saleNote: string | null;
  saleStartsAt: Date | string | null;
  saleEndsAt: Date | string | null;
};

type PricingContextValue = {
  musicals: Musical[];
  isLoading: boolean;
};

const PricingContext = createContext<PricingContextValue | null>(null);

const currencyPattern = /\d+(?:,\d{1,2})?\s?(?:€|EUR)/g;

function toDateString(value: Date | string | null): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function replacePrice(text: string | undefined, priceFrom: string): string | undefined {
  return text?.replace(currencyPattern, `${priceFrom} €`);
}

function createSale(override: PriceSaleOverride): MusicalSale | undefined {
  if (!override.saleEnabled || !override.saleDiscount?.trim()) return undefined;

  return {
    label: override.saleLabel?.trim() || "SALE",
    discount: override.saleDiscount.trim(),
    note: override.saleNote?.trim() || undefined,
    validFrom: toDateString(override.saleStartsAt),
    validUntil: toDateString(override.saleEndsAt),
  };
}

/** Applies one editorial override everywhere a price is derived from a musical record. */
export function applyPriceSaleOverrides(
  source: Musical[],
  overrides: PriceSaleOverride[],
): Musical[] {
  const overridesById = new Map(overrides.map((override) => [override.musicalId, override]));

  return source.map((musical) => {
    const override = overridesById.get(musical.id);
    if (!override) return musical;

    const priceFrom = override.priceFrom.trim();
    return {
      ...musical,
      priceFrom,
      sale: createSale(override),
      description: replacePrice(musical.description, priceFrom) ?? musical.description,
      seoTitle: replacePrice(musical.seoTitle, priceFrom),
      seoDescription: replacePrice(musical.seoDescription, priceFrom),
      showFacts: musical.showFacts?.map((fact) =>
        fact.label.toLocaleLowerCase("de").includes("tickets ab")
          ? { ...fact, value: replacePrice(fact.value, priceFrom) ?? `ab ${priceFrom} €` }
          : fact,
      ),
      faqItems: musical.faqItems?.map((item) => ({
        ...item,
        answer: replacePrice(item.answer, priceFrom) ?? item.answer,
      })),
    };
  });
}

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const { data: overrides = [], isLoading } = trpc.priceSales.listPublic.useQuery(undefined, {
    staleTime: 60_000,
  });

  const value = useMemo(
    () => ({
      musicals: applyPriceSaleOverrides(editorialMusicals, overrides),
      isLoading,
    }),
    [isLoading, overrides],
  );

  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
}

export function useManagedMusicals(): PricingContextValue {
  const value = useContext(PricingContext);
  if (!value) {
    throw new Error("useManagedMusicals must be used within PricingProvider");
  }
  return value;
}
