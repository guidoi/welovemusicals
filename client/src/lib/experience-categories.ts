export const EXPERIENCE_CATEGORIES = [
  {
    id: "blockbuster-spektakel",
    label: "Blockbuster & Spektakel",
    shortLabel: "Blockbuster",
    description: "Für den großen Wow-Moment: ikonische Bilder, große Stimmen und Gänsehaut im Saal.",
    discoveryHeadline: "Welcher Blockbuster passt zu dir?",
    recommendationHeadline: "Mehr große Momente für deinen Musicalabend",
    recommendationIntro: "Hier warten opulente Shows, große Emotionen und dein nächster Wow-Moment.",
  },
  {
    id: "kult-klassiker",
    label: "Kult & Klassiker",
    shortLabel: "Kult & Klassiker",
    description: "Zeitlose Lieblingsshows, deren Melodien und Geschichten dich sofort wieder mitnehmen.",
    discoveryHeadline: "Welcher Klassiker passt zu dir?",
    recommendationHeadline: "Lieblingsklassiker, die weiterklingen",
    recommendationIntro: "Entdecke Bühnenlegenden, große Gefühle und Songs, die du nie vergisst.",
  },
  {
    id: "pop-rock-filmhits",
    label: "Pop, Rock & Filmhits",
    shortLabel: "Pop, Rock & Film",
    description: "Welthits, Filmmomente und Beats, die du längst kennst – jetzt live auf der Bühne.",
    discoveryHeadline: "Welche Show passt zu deinem Sound?",
    recommendationHeadline: "Deine Lieblingssongs, ganz groß erzählt",
    recommendationIntro: "Noch mehr Shows voller Hits, Energie und mitreißender Live-Momente.",
  },
  {
    id: "familie-maerchen-magie",
    label: "Familie, Märchen & Magie",
    shortLabel: "Familie & Märchen",
    description: "Zusammen staunen, lachen und in Geschichten eintauchen, die für alle Generationen leuchten.",
    discoveryHeadline: "Welches Familien-Musical passt zu euch?",
    recommendationHeadline: "Gemeinsame Lieblingsmomente für die ganze Familie",
    recommendationIntro: "Entdecke magische Shows, die Kinderaugen leuchten lassen und Erwachsene berühren.",
  },
  {
    id: "besondere-geschichten",
    label: "Besondere Geschichten",
    shortLabel: "Drama & Emotion",
    description: "Starke Figuren, neue Blickwinkel und Geschichten, die dich noch über den Abend hinaus begleiten.",
    discoveryHeadline: "Welche Geschichte passt zu dir?",
    recommendationHeadline: "Geschichten, die etwas in dir auslösen",
    recommendationIntro: "Hier findest du besondere Shows mit Haltung, Herz und überraschenden Perspektiven.",
  },
] as const;

export type ExperienceCategoryId = (typeof EXPERIENCE_CATEGORIES)[number]["id"];
export type ExperienceFilterId = "alle" | ExperienceCategoryId;

export function getExperienceCategory(id: ExperienceCategoryId | undefined) {
  return EXPERIENCE_CATEGORIES.find((category) => category.id === id);
}

export const QUICK_CITY_NAMES = [
  "Hamburg",
  "Stuttgart",
  "Berlin",
  "Köln",
  "Bochum",
  "München",
  "Düsseldorf",
] as const;

export const COUNTRY_FILTERS = [
  { id: "alle", label: "Alle Länder" },
  { id: "de", label: "Deutschland" },
  { id: "at", label: "Österreich" },
  { id: "ch", label: "Schweiz" },
] as const;

export type CountryFilter = (typeof COUNTRY_FILTERS)[number]["id"];

export const EXPERIENCE_CATEGORY_BY_MUSICAL_ID: Record<string, ExperienceCategoryId> = {
  "koenig-der-loewen": "blockbuster-spektakel",
  eiskoenigin: "familie-maerchen-magie",
  moulinrouge: "blockbuster-spektakel",
  "phantom-der-oper": "kult-klassiker",
  "gloeckner-von-notre-dame": "blockbuster-spektakel",
  "starlight-express": "kult-klassiker",
  "tanz-der-vampire": "kult-klassiker",
  dracula: "kult-klassiker",
  "mj-musical": "pop-rock-filmhits",
  ziz: "pop-rock-filmhits",
  "und-julia": "pop-rock-filmhits",
  "we-will-rock-you": "pop-rock-filmhits",
  fackjugoehte: "pop-rock-filmhits",
  tarzan: "blockbuster-spektakel",
  "schoene-und-das-biest": "familie-maerchen-magie",
  dreihaselnuesse: "familie-maerchen-magie",
  rapunzel: "familie-maerchen-magie",
  "teufel-traegt-prada": "besondere-geschichten",
  "wir-sind-am-leben": "besondere-geschichten",
  "salon-rosie": "besondere-geschichten",
};

export function getMusicalExperienceCategory(musicalId: string): ExperienceCategoryId | undefined {
  return EXPERIENCE_CATEGORY_BY_MUSICAL_ID[musicalId];
}
