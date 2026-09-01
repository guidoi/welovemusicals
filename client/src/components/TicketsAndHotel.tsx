import { ExternalLink, Hotel, Ticket } from "lucide-react";
import { Link } from "wouter";
import type { City } from "@/lib/data";
import { HOTEL_EXPERIENCE_PARTNERS } from "@/lib/hotel-experience";

interface TicketsAndHotelProps {
  city: City;
}

export default function TicketsAndHotel({ city }: TicketsAndHotelProps) {
  return (
    <section className="py-12 md:py-16 bg-card/50">
      <div className="container">
        <div className="gold-line mb-10" />
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="text-xs text-gold uppercase tracking-[0.2em] font-medium">Deine Musicalreise</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Tickets &amp; Hotel in {city.name}
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Verbinde deinen Musicalabend in {city.name} mit einer passenden Übernachtung und plane deinen Kurztrip an einem Ort.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
          <Link
            href="#programm"
            className="group rounded-sm border border-gold/60 bg-gold px-5 py-4 text-background transition-colors hover:bg-gold-light"
          >
            <span className="flex items-center gap-2 font-bold">
              <Ticket className="w-4 h-4" />
              Musicals &amp; Tickets
            </span>
            <span className="mt-1 block text-sm text-background/75">Aktuelle Shows in {city.name}</span>
          </Link>
          <a
            href={city.hotelSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-sm border border-gold/40 bg-background/35 px-5 py-4 text-foreground transition-colors hover:border-gold hover:bg-gold/10"
          >
            <span className="flex items-center gap-2 font-bold text-gold">
              <Hotel className="w-4 h-4" />
              Hotel finden
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">Über {HOTEL_EXPERIENCE_PARTNERS.accommodation.name} buchen</span>
          </a>
        </div>
      </div>
    </section>
  );
}
