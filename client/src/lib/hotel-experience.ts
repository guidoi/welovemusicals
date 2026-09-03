export const CURATED_HOTEL_CITY_SLUGS = ["berlin", "hamburg", "stuttgart"] as const;

/**
 * HRS bleibt als vorbereiteter Partner konfiguriert, seine Karten werden bis zur
 * Entscheidung für eine neue Reise- oder Hotelpartnerschaft aber nicht gezeigt.
 */
export const SHOW_MUSICAL_HOTEL_SECTIONS = false;

export const HOTEL_EXPERIENCE_PARTNERS = {
  accommodation: {
    name: "HRS",
    status: "active",
    bookingLabel: "Hotel finden",
  },
  package: {
    name: "Travelcircus",
    status: "pending",
    bookingLabel: "Musicalreise mit Hotel",
  },
} as const;
