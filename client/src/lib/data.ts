/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * Zentrale Datendatei für alle Musical-Produktionen, Anbieter und Tourneestädte
 * AWIN Merchant 11388 = Eventim (Deeplink-Format)
 */

export interface Musical {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  provider: string;
  category: "standort" | "tournee" | "familie";
  city?: string;
  cities?: string[];
  venue?: string;
  description: string;
  image: string;
  eventimUrl: string;
  featured?: boolean;
  tags: string[];
  startDate: string; // ISO 8601 format: YYYY-MM-DD
  endDate: string;   // ISO 8601 format: YYYY-MM-DD
}

export interface City {
  slug: string;
  name: string;
  image: string;
  description: string;
  musicalCount: number;
  hotelSearchUrl: string;
}

export interface Provider {
  name: string;
  slug: string;
  description: string;
  website: string;
}

// AWIN Deeplink-Funktion: Merchant ID 11388 (Eventim)
// Format: https://www.awin1.com/cread.php?awinmid=11388&awinaffid=YOUR_ID&ued=ENCODED_URL
// Hinweis: Publisher-ID muss nach AWIN-Registrierung eingesetzt werden
export const AWIN_MERCHANT_ID = "11388";
export const AWIN_PUBLISHER_ID = "000000"; // Platzhalter – nach Registrierung ersetzen

export function createAwinLink(destinationUrl: string): string {
  const encodedUrl = encodeURIComponent(destinationUrl);
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MERCHANT_ID}&awinaffid=${AWIN_PUBLISHER_ID}&ued=${encodedUrl}`;
}

export const providers: Provider[] = [
  {
    name: "Stage Entertainment",
    slug: "stage-entertainment",
    description: "Europas führender Musical-Produzent mit festen Spielstätten in Hamburg, Stuttgart und Berlin.",
    website: "https://www.stage-entertainment.de",
  },
  {
    name: "ShowSlot",
    slug: "showslot",
    description: "Produzent und Veranstalter von Tournee-Musicals und Shows in Deutschland, Österreich und der Schweiz.",
    website: "https://showslot.com",
  },
  {
    name: "Limelight Live Entertainment",
    slug: "limelight",
    description: "Produzent und Veranstalter von Musical- und Showformaten auf großer Tournee.",
    website: "https://limelight-live.de",
  },
  {
    name: "ATG Entertainment",
    slug: "atg",
    description: "Internationaler Live-Entertainment-Konzern mit Theatern in Europa und den USA.",
    website: "https://atgentertainment.de",
  },
  {
    name: "Semmel Concerts",
    slug: "semmel-concerts",
    description: "Einer der größten deutschen Konzert- und Showveranstalter mit Musical-Events.",
    website: "https://semmel.de",
  },
  {
    name: "Theater Liberi",
    slug: "theater-liberi",
    description: "Spezialist für hochwertige Familienmusicals auf Deutschlandtournee.",
    website: "https://theater-liberi.de",
  },
];

export const musicals: Musical[] = [
  // === STAGE ENTERTAINMENT – Standort-Musicals ===
  {
    id: "kdl",
    slug: "koenig-der-loewen",
    title: "Disneys DER KÖNIG DER LÖWEN",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Hamburg",
    venue: "Stage Theater im Hafen",
    description: "Erleben Sie eine unvergessliche Reise durch die Serengeti Afrikas. Seit über 20 Jahren begeistert das meistbesuchte Musical der Welt in Hamburg mit atemberaubenden Kostümen, Masken und der Musik von Elton John und Tim Rice.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/disneys-der-koenig-der-loewen/",
    featured: true,
    tags: ["Disney", "Klassiker", "Familie"],
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: "mj",
    slug: "mj-michael-jackson",
    title: "MJ – Das Michael Jackson Musical",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Hamburg",
    venue: "Stage Theater an der Elbe",
    description: "Der Broadway-Erfolg jetzt live in Hamburg! Erleben Sie die weltbekannten Hits und ikonischen Choreographien des King of Pop in einer mitreißenden Inszenierung.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/mj-das-michael-jackson-musical/",
    featured: true,
    tags: ["Pop", "Broadway", "Tanz"],
    startDate: "2026-02-01",
    endDate: "2026-12-31",
  },
  {
    id: "julia",
    slug: "and-julia",
    title: "& JULIA – Das Pop-Musical",
    subtitle: "Es gibt ein Leben nach Romeo!",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Hamburg",
    venue: "Stage Operettenhaus",
    description: "Was würde passieren, wenn Julia nach Romeos Tod eine zweite Chance auf das Leben und die Liebe bekäme? Ein modernes Pop-Musical mit den größten Hits von Max Martin.",
    image: "https://images.unsplash.com/photo-1514533212735-5df27d970db0?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/julia-das-pop-musical/",
    tags: ["Pop", "Komödie", "Modern"],
    startDate: "2026-03-15",
    endDate: "2026-11-30",
  },
  {
    id: "tarzan",
    slug: "tarzan",
    title: "Disney Musical TARZAN",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Hamburg",
    venue: "Stage Theater Neue Flora",
    description: "Das Musicalcomeback in Hamburg: Die Geschichte von Tarzan als das spektakulärste Musical unserer Zeit mit der Musik von Weltstar Phil Collins.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/disneys-tarzan/",
    tags: ["Disney", "Abenteuer", "Familie"],
    startDate: "2026-01-15",
    endDate: "2026-10-31",
  },
  {
    id: "zukunft",
    slug: "zurueck-in-die-zukunft",
    title: "ZURÜCK IN DIE ZUKUNFT – Das Musical",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Hamburg",
    venue: "Stage Operettenhaus",
    description: "Der Kult-Film der 80er Jahre als mehrfach ausgezeichnetes Musical. Nah am Original inszeniert – mit seinem Witz und den Hits des Blockbusters.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/zurueck-in-die-zukunft-das-musical/",
    tags: ["Kult", "Sci-Fi", "Komödie"],
    startDate: "2026-04-01",
    endDate: "2026-12-31",
  },
  {
    id: "eiskoenigin",
    slug: "eiskoenigin",
    title: "Disneys DIE EISKÖNIGIN",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Stuttgart",
    venue: "Stage Apollo Theater",
    description: "Machen Sie sich auf zu einem magischen Abenteuer im eisigen Königreich Arendelle und treffen Sie die beliebten Figuren aus dem weltbekannten Disney-Film!",
    image: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/disneys-die-eiskoenigin/",
    featured: true,
    tags: ["Disney", "Familie", "Magie"],
    startDate: "2026-11-01",
    endDate: "2027-01-31",
  },
  {
    id: "wwry",
    slug: "we-will-rock-you",
    title: "WE WILL ROCK YOU",
    subtitle: "Das Queen-Musical",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Stuttgart",
    venue: "Stage Palladium Theater",
    description: "Der Welterfolg mit den 24 größten Queen-Songs im englischen Original. Ein frischer und individueller Ansatz mit neuer Choreographie und modernisiertem Drehbuch.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/we-will-rock-you/",
    tags: ["Rock", "Queen", "Kult"],
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: "wsal",
    slug: "wir-sind-am-leben",
    title: "WIR SIND AM LEBEN – Das Berlin Musical",
    provider: "Stage Entertainment",
    category: "standort",
    city: "Berlin",
    venue: "Stage Theater des Westens",
    description: "Das erste vollständig selbst entwickelte Musical von Peter Plate und Ulf Leo Sommer – eine Geschichte über Familie, Freiheit und das Lebensgefühl im Berlin der frühen 90er-Jahre.",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/wir-sind-am-leben/",
    tags: ["Berlin", "Drama", "Deutsch"],
    startDate: "2026-02-15",
    endDate: "2026-11-30",
  },

  // === SHOWSLOT – Tournee-Musicals ===
  {
    id: "cher",
    slug: "cher-show",
    title: "Die CHER Show – Das Musical",
    subtitle: "über die Göttin des Pop",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart", "Frankfurt", "Düsseldorf"],
    description: "Die mitreißende Geschichte der Pop-Ikone Cher – von ihrem Aufstieg in den 60ern bis zur Weltkarriere. Mit allen großen Hits wie 'Believe', 'If I Could Turn Back Time' und vielen mehr.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/die-cher-show/",
    featured: true,
    tags: ["Pop", "Biografie", "Tournee"],
    startDate: "2026-01-10",
    endDate: "2026-12-15",
  },
  {
    id: "dracula",
    slug: "dracula",
    title: "DRACULA – DAS MUSICAL",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart", "Leipzig", "Dresden"],
    description: "Der Mythos Dracula zum ersten Mal auf großer Deutschland-Tour als Musical. Eine düstere, romantische Inszenierung des unsterblichen Klassikers.",
    image: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/dracula-das-musical/",
    tags: ["Horror", "Romantik", "Tournee"],
    startDate: "2026-02-01",
    endDate: "2026-10-31",
  },
  {
    id: "davinci",
    slug: "da-vinci-code",
    title: "Dan Browns DER DA VINCI CODE – SAKRILEG",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["Berlin", "München", "Hamburg", "Köln", "Frankfurt"],
    description: "Der Bestseller von Dan Brown als packendes Musical-Erlebnis. Folgen Sie Robert Langdon auf seiner Jagd nach dem heiligen Gral.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/der-da-vinci-code/",
    tags: ["Thriller", "Abenteuer", "Tournee"],
    startDate: "2026-03-15",
    endDate: "2026-11-30",
  },
  {
    id: "sisteract",
    slug: "sister-act",
    title: "SISTER ACT – Das himmlische Musical",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["Hamburg", "Berlin", "München", "Stuttgart", "Köln", "Frankfurt", "Düsseldorf", "Oberhausen"],
    description: "Die himmlische Komödie als Musical! Erleben Sie die Geschichte der Nachtclubsängerin Deloris, die sich in einem Kloster verstecken muss – mit Soul, Motown und jeder Menge Humor.",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/sister-act-das-musical/",
    tags: ["Komödie", "Soul", "Tournee"],
    startDate: "2026-04-01",
    endDate: "2026-12-31",
  },
  {
    id: "fackju",
    slug: "fack-ju-goehte",
    title: "FACK JU GÖHTE – Das Musical",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["München", "Hamburg", "Berlin", "Köln", "Stuttgart", "Frankfurt"],
    description: "Der Kultfilm endlich als Musical auf der Bühne! Zeki Müller sorgt als unkonventioneller Aushilfslehrer für Chaos und Lacher.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/fack-ju-goehte-das-musical/",
    tags: ["Komödie", "Kult", "Tournee"],
    startDate: "2026-05-01",
    endDate: "2026-12-31",
  },
  {
    id: "aschenbroedel",
    slug: "drei-haselnuesse",
    title: "DREI HASELNÜSSE FÜR ASCHENBRÖDEL",
    subtitle: "Das Musical",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["Berlin", "Hamburg", "München", "Dresden", "Leipzig", "Köln"],
    description: "Der beliebte Weihnachtsklassiker als zauberhaftes Musical. Die märchenhafte Geschichte von Aschenbrödel verzaubert Groß und Klein.",
    image: "https://images.unsplash.com/photo-1520962922320-2038eebab146?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/drei-haselnuesse-fuer-aschenbroedel/",
    tags: ["Märchen", "Familie", "Tournee"],
    startDate: "2026-11-15",
    endDate: "2027-01-31",
  },
  {
    id: "fitzek",
    slug: "fitzek-einladung",
    title: "Sebastian Fitzek: DIE EINLADUNG",
    provider: "ShowSlot",
    category: "tournee",
    cities: ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart"],
    description: "Der Bestseller-Autor Sebastian Fitzek bringt seinen Thriller als packende Live-Show auf die Bühne. Spannung pur!",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/sebastian-fitzek-die-einladung/",
    tags: ["Thriller", "Show", "Tournee"],
    startDate: "2026-06-01",
    endDate: "2026-12-31",
  },

  // === LIMELIGHT LIVE ENTERTAINMENT ===
  {
    id: "prettywoman",
    slug: "pretty-woman",
    title: "Pretty Woman – Das Musical",
    provider: "Limelight Live Entertainment",
    category: "tournee",
    cities: ["München", "Hamburg", "Berlin", "Köln", "Stuttgart", "Frankfurt", "Düsseldorf", "Leipzig"],
    description: "Die romantischste Komödie der 90er auf ihrer ersten großen Tournee! Erleben Sie die Liebesgeschichte von Vivian und Edward mit mitreißender Musik von Bryan Adams.",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/pretty-woman-das-musical/",
    featured: true,
    tags: ["Romantik", "Komödie", "Tournee"],
    startDate: "2026-03-01",
    endDate: "2026-10-31",
  },
  {
    id: "grease",
    slug: "grease",
    title: "Grease – Das Hitmusical",
    provider: "Limelight Live Entertainment",
    category: "tournee",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart", "Frankfurt"],
    description: "Das legendäre Hitmusical mit den unvergesslichen Songs 'Summer Nights', 'Greased Lightnin'' und 'You're The One That I Want'. Rock'n'Roll pur!",
    image: "https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/grease-das-musical/",
    tags: ["Rock'n'Roll", "Kult", "Tournee"],
    startDate: "2026-04-15",
    endDate: "2026-12-31",
  },
  {
    id: "elisabeth",
    slug: "elisabeth",
    title: "Elisabeth – Das Musical",
    subtitle: "Die gefeierten Schönbrunn-Version",
    provider: "Limelight Live Entertainment",
    category: "tournee",
    cities: ["München", "Berlin", "Hamburg", "Stuttgart", "Wien"],
    description: "Die gefeierten Schönbrunn-Version des Erfolgsmusicals über Kaiserin Elisabeth von Österreich. Eine epische Geschichte über Liebe, Freiheit und den Tod.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/elisabeth-das-musical/",
    tags: ["Drama", "Historie", "Tournee"],
    startDate: "2026-05-01",
    endDate: "2026-11-30",
  },
  {
    id: "kinkyboots",
    slug: "kinky-boots",
    title: "Kinky Boots – The Musical",
    provider: "Limelight Live Entertainment",
    category: "tournee",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart"],
    description: "Das preisgekrönte Broadway-Musical über eine ungewöhnliche Freundschaft und fabelhafte Stiefel. Mit Musik von Cyndi Lauper.",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/kinky-boots-the-musical/",
    tags: ["Broadway", "Freundschaft", "Tournee"],
    startDate: "2026-06-15",
    endDate: "2026-12-31",
  },
  {
    id: "hairspray",
    slug: "hairspray",
    title: "Hairspray – Das Musical",
    provider: "Limelight Live Entertainment",
    category: "tournee",
    cities: ["Berlin", "Hamburg", "München", "Köln", "Stuttgart", "Frankfurt", "Düsseldorf"],
    description: "Das fröhliche und bunte Musical über Liebe, Toleranz und Tanzleidenschaft in den 60ern. Mit den größten Hits von Marc Shaiman.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/hairspray-das-musical/",
    tags: ["Komödie", "Tanz", "Tournee"],
    startDate: "2026-07-01",
    endDate: "2026-12-31",
  },
  {
    id: "phantom",
    slug: "phantom-der-oper",
    title: "Das Phantom der Oper",
    provider: "Limelight Live Entertainment",
    category: "tournee",
    cities: ["München", "Hamburg", "Berlin", "Stuttgart", "Köln"],
    description: "Das erfolgreichste Musical aller Zeiten! Die zeitlose Geschichte von Liebe, Musik und Geheimnis in den Katakomben der Pariser Oper.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/das-phantom-der-oper/",
    tags: ["Klassiker", "Drama", "Tournee"],
    startDate: "2026-08-01",
    endDate: "2026-12-31",
  },

  // === ATG ENTERTAINMENT – Standort-Musicals ===
  {
    id: "harrypotter",
    slug: "harry-potter",
    title: "Harry Potter und das verwunschene Kind",
    provider: "ATG Entertainment",
    category: "standort",
    city: "Hamburg",
    venue: "Theater am Großmarkt",
    description: "Das achte Harry-Potter-Abenteuer als preisgekröntes Theaterstück. 19 Jahre nach der Schlacht von Hogwarts beginnt ein neues Kapitel.",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/harry-potter-und-das-verwunschene-kind/",
    featured: true,
    tags: ["Fantasy", "Magie", "Theaterstück"],
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },

  // === SEMMEL CONCERTS – Tournee-Musicals ===
  {
    id: "cats",
    slug: "cats",
    title: "CATS – Das Musical",
    provider: "Semmel Concerts",
    category: "tournee",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart", "Frankfurt"],
    description: "Das legendäre Musical über die geheime Welt der Katzen. Mit den unvergesslichen Songs von Andrew Lloyd Webber.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/cats-das-musical/",
    tags: ["Klassiker", "Tanz", "Tournee"],
    startDate: "2026-09-01",
    endDate: "2026-12-31",
  },
  {
    id: "evita",
    slug: "evita",
    title: "Evita – Das Musical",
    provider: "Semmel Concerts",
    category: "tournee",
    cities: ["München", "Hamburg", "Berlin", "Stuttgart", "Köln"],
    description: "Die epische Geschichte von Eva Perón, der legendären First Lady von Argentinien. Mit der Musik von Andrew Lloyd Webber.",
    image: "https://images.unsplash.com/photo-1514533212735-5df27d970db0?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/evita-das-musical/",
    tags: ["Drama", "Biografie", "Tournee"],
    startDate: "2026-10-01",
    endDate: "2026-12-31",
  },

  // === THEATER LIBERI – Familienmusicals ===
  {
    id: "schneewittchen",
    slug: "schneewittchen",
    title: "Schneewittchen und die sieben Zwerge",
    provider: "Theater Liberi",
    category: "familie",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart", "Frankfurt", "Düsseldorf"],
    description: "Das klassische Märchen als zauberhaftes Familienmusical. Mit wunderschönen Kostümen, Tänzen und Musik für die ganze Familie.",
    image: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/theater-liberi/",
    tags: ["Familie", "Märchen", "Tournee"],
    startDate: "2026-11-15",
    endDate: "2027-01-31",
  },
  {
    id: "rapunzel",
    slug: "rapunzel",
    title: "Rapunzel – Das Musical",
    provider: "Theater Liberi",
    category: "familie",
    cities: ["Berlin", "Hamburg", "München", "Stuttgart", "Köln", "Leipzig", "Dresden"],
    description: "Die Geschichte der Prinzessin mit den langen Haaren als wunderschönes Familienmusical. Voller Magie, Abenteuer und Liebe.",
    image: "https://images.unsplash.com/photo-1520962922320-2038eebab146?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/theater-liberi/",
    tags: ["Familie", "Märchen", "Tournee"],
    startDate: "2026-05-01",
    endDate: "2026-12-31",
  },
  {
    id: "eiskoenigin_liberi",
    slug: "eiskoenigin-liberi",
    title: "Die Eiskönigin – Das Familienmusical",
    provider: "Theater Liberi",
    category: "familie",
    cities: ["Hamburg", "Berlin", "München", "Köln", "Stuttgart", "Frankfurt", "Oberhausen"],
    description: "Die winterliche Geschichte der Schneekönigin als bezauberndes Familienmusical. Eine Reise voller Mut, Freundschaft und Magie.",
    image: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&q=80",
    eventimUrl: "https://www.eventim.de/artist/theater-liberi/",
    tags: ["Familie", "Winter", "Tournee"],
    startDate: "2026-11-01",
    endDate: "2027-01-31",
  },
];

export const cities: City[] = [
  {
    slug: "hamburg",
    name: "Hamburg",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/city-hamburg-hiqvQVm59Z9s8oonK6znyR.webp",
    description: "Die Musical-Hauptstadt Deutschlands. Mit fünf großen Musical-Theatern und Harry Potter bietet Hamburg das vielfältigste Musical-Angebot des Landes.",
    musicalCount: 6,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Hamburg",
  },
  {
    slug: "stuttgart",
    name: "Stuttgart",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/city-stuttgart-jTG7sLRjCNSW9LsE43iiZb.webp",
    description: "Heimat von Disneys Die Eiskönigin und We Will Rock You. Stuttgart ist ein fester Bestandteil der deutschen Musical-Landschaft.",
    musicalCount: 2,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Stuttgart",
  },
  {
    slug: "berlin",
    name: "Berlin",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663510091225/JeioEZoPZ6g8uvSM7g4a8t/city-berlin-isrpM3SJSsQbjuVy58kX5V.webp",
    description: "Die Hauptstadt lockt mit dem Theater des Westens und zahlreichen Tournee-Gastspielen. Kultur und Musical vereint in einer Stadt.",
    musicalCount: 3,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Berlin",
  },
  {
    slug: "muenchen",
    name: "München",
    image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&q=80",
    description: "Das Deutsches Theater München ist eine der wichtigsten Tournee-Spielstätten. Zahlreiche Musical-Highlights gastieren hier regelmäßig.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=M%C3%BCnchen",
  },
  {
    slug: "koeln",
    name: "Köln",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&q=80",
    description: "Am Rhein gelegen bietet Köln mit dem Musical Dome eine erstklassige Spielstätte für große Tournee-Produktionen.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=K%C3%B6ln",
  },
  {
    slug: "duesseldorf",
    name: "Düsseldorf",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    description: "Die Landeshauptstadt NRWs ist ein beliebter Stopp für Musical-Tourneen mit dem Capitol Theater als Hauptspielstätte.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=D%C3%BCsseldorf",
  },
  {
    slug: "frankfurt",
    name: "Frankfurt",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    description: "Die Mainmetropole bietet mit der Alten Oper und dem Jahrhunderthalle-Komplex erstklassige Veranstaltungsorte für Musical-Events.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Frankfurt",
  },
  {
    slug: "oberhausen",
    name: "Oberhausen",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
    description: "Das Metronom Theater in Oberhausen ist eine der modernsten Musical-Spielstätten Deutschlands und Heimat großer Tournee-Produktionen.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Oberhausen",
  },
  {
    slug: "leipzig",
    name: "Leipzig",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=600&q=80",
    description: "Die sächsische Kulturstadt ist ein wachsender Musical-Standort mit der Oper Leipzig und dem Gewandhaus als Spielstätten.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Leipzig",
  },
  {
    slug: "dresden",
    name: "Dresden",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80",
    description: "Die Elbflorenz ist Heimat des Staatsschauspiels und Spielstätte für große Tournee-Produktionen.",
    musicalCount: 0,
    hotelSearchUrl: "https://www.booking.com/searchresults.de.html?ss=Dresden",
  },
];

export function getFeaturedMusicals(): Musical[] {
  return musicals.filter((m) => m.featured).slice(0, 3);
}

export function getMusicalBySlug(slug: string): Musical | undefined {
  return musicals.find((m) => m.slug === slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getMusicalsByCity(cityName: string): Musical[] {
  return musicals.filter((m) => {
    if (m.city === cityName) return true;
    if (m.cities && m.cities.includes(cityName)) return true;
    return false;
  });
}
