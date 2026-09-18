export const CURATED_HOTEL_CITY_SLUGS = ["berlin", "hamburg", "stuttgart"] as const;

/**
 * HRS-Links bleiben vorläufig nur als nicht öffentliche Datenreserve erhalten.
 * Bis ein passendes Travelcircus-Werbemittel ausgewählt wurde, werden keinerlei
 * Hotel- oder Reisepartner auf Musical- und Stadtseiten gezeigt.
 */
export const SHOW_MUSICAL_HOTEL_SECTIONS = false;
export const SHOW_CITY_HOTEL_SECTIONS = false;

export const HOTEL_EXPERIENCE_PARTNERS = {
  accommodation: {
    name: "HRS",
    status: "inactive",
    bookingLabel: "Hotel finden",
  },
  package: {
    name: "Travelcircus",
    status: "confirmed",
    awinMerchantId: "9151",
    integrationStatus: "awaiting-creative",
    bookingLabel: "Musicalreise mit Hotel",
  },
} as const;
