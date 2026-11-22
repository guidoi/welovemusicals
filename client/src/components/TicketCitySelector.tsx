interface TicketCitySelectorProps {
  cities: string[];
  value: string;
  onChange: (city: string) => void;
}

/** Wiederholte Auswahlfelder teilen einen Zustand auf der Detailseite. */
export default function TicketCitySelector({ cities, value, onChange }: TicketCitySelectorProps) {
  return (
    <label className="mb-4 flex flex-col gap-2 text-sm font-medium text-gold" data-testid="ticket-city-selector">
      Produktseite & Tickets: Spielort
      <select
        aria-label="Spielort für Produktseite und Tickets"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-sm border border-gold/50 bg-background px-3 py-2.5 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {cities.map((city) => <option key={city} value={city}>{city}</option>)}
      </select>
    </label>
  );
}
