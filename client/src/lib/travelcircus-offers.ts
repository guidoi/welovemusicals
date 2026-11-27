// Autorisierter KDL-Pilot vom 27.11.2026. Kein fremder Stage-Link,
// keine automatische Linkkonvertierung und keine Partner-Impressionen.
export const KDL_TRAVELCIRCUS_OFFER = {
  musicalId: "koenig-der-loewen",
  title: "Disneys DER KÖNIG DER LÖWEN",
  city: "Hamburg",
  provider: "Travelcircus",
  destinationUrl: "https://www.travelcircus.de/koenig-der-loewen-hamburg",
  affiliateUrl: "https://www.awin1.com/cread.php?awinmid=9151&awinaffid=2865727&ued=https%3A%2F%2Fwww.travelcircus.de%2Fkoenig-der-loewen-hamburg",
  imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/zXPIhsWSwCWCUqyi.webp",
  imageWidth: 1080,
  imageHeight: 1080,
  priceFrom: "119,00", // Travelcircus und Nutzer, geprüft 27.11.2026.
  originalPrice: "145,00", // Nutzerangabe; Quellenextraktion bestätigt den Vergleichspreis nicht.
} as const;

export type TravelcircusOffer = typeof KDL_TRAVELCIRCUS_OFFER;

export function getTravelcircusOffer(musicalId: string): TravelcircusOffer | undefined {
  return musicalId === KDL_TRAVELCIRCUS_OFFER.musicalId ? KDL_TRAVELCIRCUS_OFFER : undefined;
}
