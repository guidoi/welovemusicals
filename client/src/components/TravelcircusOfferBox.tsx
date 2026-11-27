import React from "react";
import { ArrowUpRight, Coffee, Gift, Hotel, Ship, Ticket } from "lucide-react";
import type { TravelcircusOffer } from "@/lib/travelcircus-offers";

/** Eigene Angebotsbox, kein natives Partnerbanner und kein Tracking-Snippet.
 * Der explizit gelieferte Awin-Deeplink ist unabhängig vom optionalen Consent.
 * Nicht durch den auf reine Ticketanbieter begrenzten Ticketresolver schicken.
 */
export default function TravelcircusOfferBox({ offer }: { offer: TravelcircusOffer }) {
  const benefits = [
    { Icon: Hotel, text: "Übernachtung in einem Premium Hotel nach Wahl" },
    { Icon: Coffee, text: "Tägliches Frühstück im gewählten Hotel" },
    { Icon: Ticket, text: "Tickets für Disneys DER KÖNIG DER LÖWEN Musical" },
    { Icon: Ship, text: "Schiff-Shuttleservice von den Landungsbrücken zum Theater" },
    { Icon: Gift, text: "Weitere Extras, je nach gewähltem Hotel" },
  ];

  return (
    <aside
      className="relative mx-auto mt-2 w-full max-w-[750px] pt-2 md:mt-3 md:pt-3"
      aria-label={`Anzeige: ${offer.title} – Ticket und Hotel bei ${offer.provider}`}
      data-testid="travelcircus-offer-box"
      data-musical-offer={offer.musicalId}
    >
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Anzeige · Affiliate-Link
      </p>
      <div className="overflow-hidden rounded-sm border border-gold/30 bg-[#111111] text-white">
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex items-center bg-[#F8D229]">
            <img
              src={offer.imageUrl}
              alt="Disneys DER KÖNIG DER LÖWEN – gelbes Löwen-Artwork, © Disney"
              width={offer.imageWidth}
              height={offer.imageHeight}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full object-contain"
            />
          </div>
          <div className="flex flex-col p-6 md:p-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Deine Musicalreise · {offer.city}
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight md:text-[1.65rem]">
              Disneys DER KÖNIG DER LÖWEN
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Inkl. Musical-Ticket, Hotel-Übernachtung mit Frühstück.
            </p>
            <div className="my-5" data-testid="travelcircus-offer-price">
              <p className="mb-2 text-sm font-semibold text-gold">Nur für kurze Zeit:</p>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[2rem] font-bold leading-tight text-white">
                  <span className="mr-1 text-base font-normal">ab</span>{offer.priceFrom} €
                </span>
                <del className="text-sm text-white/60" aria-label={`Vergleichspreis ab ${offer.originalPrice} Euro`}>ab {offer.originalPrice} €</del>
              </div>
              <p className="mt-1 text-sm text-white/75">pro Person</p>
            </div>
            <a
              href={offer.affiliateUrl}
              target="_blank"
              rel="sponsored noopener"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-gold px-4 py-3 text-center text-sm font-bold text-[#111111] transition-colors duration-150 hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
              aria-label="Ticket und Hotel für König der Löwen bei Travelcircus ansehen (öffnet in neuem Tab)"
            >
              Ticket + Hotel ansehen
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="border-t border-gold/20 px-6 py-6 md:px-7">
          <h3 className="font-display text-lg font-bold text-gold">Exklusiv für Travelcircus Kunden</h3>
          <ul className="mt-5 grid gap-x-7 gap-y-4 text-sm leading-relaxed md:grid-cols-2">
            {benefits.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="self-center text-white/90">{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/65">
            Reiseangebot von <span className="font-semibold text-white/85">{offer.provider}</span>.
            {" "}Preis und Verfügbarkeit je nach Termin und Hotel. Es gilt der aktuelle Preis beim Anbieter.
          </p>
        </div>
      </div>
    </aside>
  );
}
