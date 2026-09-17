export const EXPERIENCE_CATEGORIES = [
  {
    id: "blockbuster-spektakel",
    label: "Blockbuster & Spektakel",
    shortLabel: "Blockbuster",
    description: "Große Bilder, große Stimmen und unvergessliche Bühnenmomente.",
  },
  {
    id: "kult-klassiker",
    label: "Kult & Klassiker",
    shortLabel: "Kult & Klassiker",
    description: "Legendäre Musicals, die Generationen verbinden.",
  },
  {
    id: "pop-rock-filmhits",
    label: "Pop, Rock & Filmhits",
    shortLabel: "Pop, Rock & Film",
    description: "Die Songs und Geschichten, die man sofort wiedererkennt.",
  },
  {
    id: "familie-maerchen-magie",
    label: "Familie, Märchen & Magie",
    shortLabel: "Familie & Magie",
    description: "Gemeinsame Lieblingsmomente für große und kleine Musicalfans.",
  },
  {
    id: "besondere-geschichten",
    label: "Besondere Geschichten",
    shortLabel: "Besondere Geschichten",
    description: "Neue Perspektiven, starke Figuren und überraschende Erzählungen.",
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
  eiskoenigin: "blockbuster-spektakel",
  moulinrouge: "blockbuster-spektakel",
  "phantom-der-oper": "blockbuster-spektakel",
  "gloeckner-von-notre-dame": "blockbuster-spektakel",
  "starlight-express": "kult-klassiker",
  "tanz-der-vampire": "kult-klassiker",
  dracula: "kult-klassiker",
  "mj-musical": "pop-rock-filmhits",
  ziz: "pop-rock-filmhits",
  "und-julia": "pop-rock-filmhits",
  "we-will-rock-you": "pop-rock-filmhits",
  fackjugoehte: "pop-rock-filmhits",
  tarzan: "familie-maerchen-magie",
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
