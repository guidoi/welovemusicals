export const EXPERIENCE_CATEGORIES = [
  {
    id: "blockbuster-spektakel",
    label: "Blockbuster & Spektakel",
    shortLabel: "Blockbuster",
    description: "Große Bilder, große Stimmen und unvergessliche Bühnenmomente.",
    recommendationHeadline: "Große Bühnenmomente, die weitergehen",
    recommendationIntro: "Noch mehr Shows für deinen nächsten großen Musicalabend.",
  },
  {
    id: "kult-klassiker",
    label: "Kult & Klassiker",
    shortLabel: "Kult & Klassiker",
    description: "Legendäre Musicals, die Generationen verbinden.",
    recommendationHeadline: "Klassiker, die im Herzen bleiben",
    recommendationIntro: "Legendäre Geschichten und unvergessliche Melodien für echte Musicalfans.",
  },
  {
    id: "pop-rock-filmhits",
    label: "Pop, Rock & Filmhits",
    shortLabel: "Pop, Rock & Film",
    description: "Die Songs und Geschichten, die man sofort wiedererkennt.",
    recommendationHeadline: "Songs, die du kennst. Shows, die du liebst.",
    recommendationIntro: "Entdecke noch mehr Bühnenenergie mit Lieblingshits und großen Gefühlen.",
  },
  {
    id: "familie-maerchen-magie",
    label: "Familie, Märchen & Magie",
    shortLabel: "Familie, Märchen & Magie",
    description: "Gemeinsame Lieblingsmomente für große und kleine Musicalfans.",
    recommendationHeadline: "Gemeinsam staunen, lachen und träumen",
    recommendationIntro: "Weitere magische Musicalmomente für die ganze Familie.",
  },
  {
    id: "besondere-geschichten",
    label: "Besondere Geschichten",
    shortLabel: "Besondere Geschichten",
    description: "Neue Perspektiven, starke Figuren und überraschende Erzählungen.",
    recommendationHeadline: "Geschichten, die nachklingen",
    recommendationIntro: "Entdecke weitere Shows mit starken Figuren und überraschenden Blickwinkeln.",
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
