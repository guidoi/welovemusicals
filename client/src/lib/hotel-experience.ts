export const CURATED_HOTEL_CITY_SLUGS = ["berlin", "hamburg", "stuttgart"] as const;

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
