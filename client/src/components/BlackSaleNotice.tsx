import React from "react";
import { ArrowDown } from "lucide-react";
import { formatBlackSaleEndDate, type BlackSaleCampaign } from "@/lib/black-sale";

// Clockwise around the outer frame; CSS keeps every light and its glow inside it.
const FRAME_LIGHT_POSITIONS = [
  [8, 0], [20, 0], [32, 0], [44, 0], [56, 0], [68, 0], [80, 0], [92, 0],
  [100, 20], [100, 40], [100, 60], [100, 80],
  [92, 100], [80, 100], [68, 100], [56, 100], [44, 100], [32, 100], [20, 100], [8, 100],
  [0, 80], [0, 60], [0, 40], [0, 20],
] as const;

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
      className="black-sale-notice relative mb-7 w-full rounded-xl border border-gold/45 bg-black px-4 py-4 text-white sm:px-5 lg:mx-auto lg:w-[40%]"
    >
      <div data-testid="black-sale-frame-lights" className="black-sale-notice-frame pointer-events-none" aria-hidden="true">
        {FRAME_LIGHT_POSITIONS.map(([x, y], order) => (
          <span
            key={order}
            className="black-sale-notice-light"
            style={{
              "--black-sale-light-x": `${x}%`,
              "--black-sale-light-y": `${y}%`,
              "--black-sale-light-order": order,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div data-testid="black-sale-content" className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:gap-5 lg:flex-col lg:gap-3 lg:text-center">
        <div className="min-w-0">
          <div className="flex flex-col items-center gap-3">
            <span data-testid="black-sale-label" className="inline-flex min-h-12 items-center justify-center rounded-sm bg-red px-6 py-3 text-2xl font-bold tracking-[0.1em] text-white sm:text-3xl">
              BLACK SALE
            </span>
            <div data-testid="black-sale-offer-line" className="flex w-full items-center justify-center gap-3">
              <p data-testid="black-sale-saving" className="min-w-0 text-base font-bold text-white sm:text-lg">{saving}</p>
              <p data-testid="black-sale-end" className="shrink-0 whitespace-nowrap text-xs text-white sm:text-sm">
                Ende <time dateTime={campaign.endsOn}>{formatBlackSaleEndDate(campaign.endsOn)}</time>
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white">
            Ausgewählte Shows und Vorstellungen; Bedingungen beim Anbieter
          </p>
        </div>
        <button
          type="button"
          onClick={onViewShows}
          data-testid="black-sale-view-shows"
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.97] md:w-auto"
        >
          Aktionsshows ansehen
          <ArrowDown className="h-4 w-4 text-gold" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
