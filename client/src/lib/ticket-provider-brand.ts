export type TicketProviderBrandId = "stage" | "atg" | "eventim";

export interface TicketProviderBrand {
  id: TicketProviderBrandId;
  name: string;
  logoSrc: string;
}

const ATG_MUSICAL_SLUGS = new Set([
  "moulin-rouge",
  "phantom-der-oper",
  "gloeckner-von-notre-dame",
  "starlight-express",
]);

const BRANDS: Record<TicketProviderBrandId, TicketProviderBrand> = {
  stage: {
    id: "stage",
    name: "Stage Entertainment",
    logoSrc: "/images/branding/stage-entertainment-logo-on-dark.png",
  },
  atg: {
    id: "atg",
    name: "ATG Tickets",
    logoSrc:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/atg-tickets-logo_e0513ab0.png",
  },
  eventim: {
    id: "eventim",
    name: "Eventim",
    logoSrc:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/eventim-logo-white_a4f44345.png",
  },
};

export function isAtgTicketMusical(slug: string): boolean {
  return ATG_MUSICAL_SLUGS.has(slug);
}

export function getTicketProviderBrand(slug: string, ticketUrl: string): TicketProviderBrand {
  if (isAtgTicketMusical(slug)) return BRANDS.atg;
  if (ticketUrl.includes("stage-entertainment.de")) return BRANDS.stage;
  return BRANDS.eventim;
}
