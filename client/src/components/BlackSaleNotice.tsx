import React from "react";
import { ArrowDown } from "lucide-react";
import { formatBlackSaleEndDate, type BlackSaleCampaign } from "@/lib/black-sale";

interface BlackSaleNoticeProps {
  campaign: BlackSaleCampaign | null;
  onViewShows: () => void;
}

export default function BlackSaleNotice({ campaign, onViewShows }: BlackSaleNoticeProps) {
  if (!campaign) return null;

  const saving = campaign.maxDiscountPercent === null
    ? "Ticketangebote sichern"
    : `Bis zu ${campaign.maxDiscountPercent.toLocaleString("de-DE")} % sparen`;

  return (
    <aside
      aria-label="BLACK SALE – ausgewählte Ticketangebote"
      data-testid="black-sale-notice"
      className="mb-7 rounded-xl border border-gold/45 bg-black px-4 py-4 text-white sm:px-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-sm bg-red-800 px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-white">
              BLACK SALE
            </span>
            <p className="text-base font-bold text-white sm:text-lg">{saving}</p>
            <p className="text-sm text-white">
              Ende <time dateTime={campaign.endsOn}>{formatBlackSaleEndDate(campaign.endsOn)}</time>
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white">
            Ausgewählte Shows und Vorstellungen; Bedingungen beim Anbieter
          </p>
        </div>
        <button
          type="button"
          onClick={onViewShows}
          data-testid="black-sale-view-shows"
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.97] sm:w-auto"
        >
          Aktionsshows ansehen
          <ArrowDown className="h-4 w-4 text-gold" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
