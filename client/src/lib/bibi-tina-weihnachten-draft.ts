import type { Musical, MusicalTourDate } from "./data";

/**
 * Redaktionsfertiger Entwurf aus freigegebenem Bildmaterial und offiziellen
 * Quellen (Stage-Presseinformation 07.07.2026; Recherche 21.11.2026).
 * Noch NICHT in musicals / ACTIVE_MUSICAL_IDS aufnehmen: Die freigegebenen
 * Textlinks fehlen. Native Bannerbilder sind geliefert. Keine Banner-g-ID als
 * angeblichen Textlink übernehmen, keine Stage-Ziele über Eventim umleiten.
 */
type WbtEditorialContent = Omit<Musical, "eventimUrl" | "tourDates"> & {
  tourDates: Omit<MusicalTourDate, "eventimUrl">[];
};

export const WBT_EDITORIAL_DRAFT: WbtEditorialContent = {
  id: "weihnachten-mit-bibi-tina",
  slug: "weihnachten-mit-bibi-tina",
  title: "WEIHNACHTEN MIT BIBI & TINA",
  subtitle: "Das Musical",
  provider: "Stage Entertainment",
  category: "kinder",
  categories: ["fester-standort", "familie", "kinder"],
  experienceCategory: "weihnachten",
  additionalExperienceCategories: ["familie-maerchen-magie"],
  cities: ["Berlin", "Hamburg"],
  headerCities: ["Berlin", "Hamburg"],
  venuePerCity: {
    Berlin: "Stage Theater des Westens",
    Hamburg: "Stage Operettenhaus",
  },
  description: "Bibi Blocksberg und Tina Martin erleben ein winterliches Abenteuer auf dem Martinshof. Das Familienmusical spielt zur Weihnachtszeit 2026 in Berlin und Hamburg – mit bekannten Bibi-&-Tina-Songs und Weihnachtsliedern.",
  detailHeadline: "HEX-HEX! WEIHNACHTSZAUBER AUF DEM MARTINSHOF",
  detailDescription: "Bibi Blocksberg und Tina Martin bringen ihre Freundschaft zur Weihnachtszeit auf die Bühne: Auf dem winterlichen Martinshof geraten die beiden in ein neues Abenteuer. Mut, Zusammenhalt und Bibis Hexenkraft helfen ihnen dabei, die Herausforderungen gemeinsam zu meistern.\n\n**Bekannte Hits und festliche Musik**\n\nDie Show verbindet Songs aus der Welt von Bibi & Tina mit Weihnachtsliedern. Hinter der Musik und der Produktion stehen Peter Plate und Ulf Leo Sommer. Farbenfrohe Kostüme, ein gestaltetes Bühnenbild und eine lebhafte Inszenierung begleiten die erzählte Geschichte – es handelt sich um ein Musical, nicht um ein reines Konzert.\n\n**Ein gemeinsamer Ausflug in der Weihnachtszeit**\n\n2026 kehrt Weihnachten mit Bibi & Tina ins Berliner Stage Theater des Westens zurück und ist erstmals auch im Hamburger Stage Operettenhaus zu sehen. Die Berliner Spielzeit läuft vom 14. November 2026 bis 3. Januar 2027, die Hamburger vom 21. November 2026 bis 3. Januar 2027. An ausgewählten Spieltagen gibt es mehrere Vorstellungen; nicht an jedem Tag wird gespielt.",
  image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/YqlpbjvubQJLnLqO.webp",
  homepageArtworkImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/YqlpbjvubQJLnLqO.webp",
  homepageArtworkObjectPosition: "center center",
  heroImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VnOoWhZMdWLXybYP.webp",
  mobileHeroBelowHeader: true,
  keyvisual: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/YqlpbjvubQJLnLqO.webp",
  keyvisualLandscape: true,
  featured: false,
  tags: ["Weihnachten", "Familie", "Kinder"],
  tourDates: [
    { city: "Berlin", venue: "Stage Theater des Westens", startDate: "2026-11-14", endDate: "2027-01-03" },
    { city: "Hamburg", venue: "Stage Operettenhaus", startDate: "2026-11-21", endDate: "2027-01-03" },
  ],
  gallery: [
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/bBsTfSbBsVAxjgow.webp", alt: "Weihnachten mit Bibi & Tina – Ensemble in der Bühnenküche, © Jörn Hartmann" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/PEYnYBwtFrCpcLJU.webp", alt: "Weihnachten mit Bibi & Tina – Ensemble auf der Bühne, © Jörn Hartmann" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/FGAMZthjKvvvRZoK.webp", alt: "Weihnachten mit Bibi & Tina – gemeinsame Backszene, © Jörn Hartmann" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/VnOoWhZMdWLXybYP.webp", alt: "Weihnachten mit Bibi & Tina – Blick auf die Bühne, © Jörn Hartmann" },
  ],
  showFacts: [
    { label: "Berlin", value: "Stage Theater des Westens · 14.11.2026 – 03.01.2027" },
    { label: "Hamburg", value: "Stage Operettenhaus · 21.11.2026 – 03.01.2027" },
    { label: "Showdauer", value: "Laut Stage ca. 70 Minuten, ohne Pause" },
    { label: "Einlassalter", value: "Ab 3 Jahren; kein Einlass unter 3 Jahren" },
    { label: "Musik", value: "Peter Plate und Ulf Leo Sommer" },
    { label: "Veranstalter", value: "Stage Entertainment Produktionsgesellschaft mbH" },
  ],
  storyHeadline: "FREUNDSCHAFT, MUSIK UND EIN WINTERLICHES ABENTEUER",
  storyText: "Bibi und Tina erleben auf dem Martinshof eine winterliche Geschichte voller Abenteuer und Hexerei. Im Mittelpunkt stehen die Freundschaft der beiden Mädchen und ihr Zusammenhalt. Vertraute Lieder und festliche Songs begleiten die Handlung – für einen gemeinsamen Musicalbesuch mit Kindern, Eltern und Großeltern.",
  faqItems: [
    { question: "Wo und wann wird Weihnachten mit Bibi & Tina gespielt?", answer: "In Berlin läuft das Musical vom 14. November 2026 bis 3. Januar 2027 im Stage Theater des Westens. In Hamburg ist es vom 21. November 2026 bis 3. Januar 2027 im Stage Operettenhaus zu sehen. Es wird an ausgewählten Spieltagen gespielt, nicht täglich." },
    { question: "Ab welchem Alter dürfen Kinder die Show besuchen?", answer: "Stage erlaubt den Einlass ab drei Jahren; Kinder unter drei Jahren werden nicht eingelassen. Laut Produktions-FAQ müssen Kinder unter 14 Jahren von einem Erziehungsberechtigten begleitet werden." },
    { question: "Wie lange dauert die Vorstellung und gibt es eine Pause?", answer: "Stage gibt etwa 70 Minuten ohne Pause an. Die Produktionswebsite nennt etwa 65 Minuten, ebenfalls ohne Pause. Plant für die Show ungefähr 70 Minuten ein; die Angaben zur ungefähren Dauer unterscheiden sich leicht." },
    { question: "Ist Weihnachten mit Bibi & Tina ein Konzert oder ein Musical?", answer: "Es ist ein Musical mit einer erzählten Abenteuerhandlung. Bekannte Bibi-&-Tina-Hits und Weihnachtslieder gehören zur Show." },
    { question: "Sind die Vorstellungen bestuhlt?", answer: "Ja. Laut Produktions-FAQ sind alle Vorstellungen vollständig bestuhlt und die Plätze nummeriert." },
    { question: "Dürfen wir eine Sitzerhöhung mitbringen?", answer: "Ja. Die Produktions-FAQ erlaubt handelsübliche Sitzerhöhungen für Kinder." },
    { question: "Wer veranstaltet Weihnachten mit Bibi & Tina?", answer: "Veranstalter ist die Stage Entertainment Produktionsgesellschaft mbH. Für die Produktion zeichnen Peter Plate und Ulf Leo Sommer verantwortlich." },
  ],
  uspItems: [
    { icon: "Users", title: "Gemeinsam mit der Familie", text: "Ein Weihnachtsmusical für Kinder ab drei Jahren und ihre Begleitung" },
    { icon: "Music", title: "Bibi-&-Tina-Hits", text: "Vertraute Songs treffen auf festliche Weihnachtslieder" },
    { icon: "Sparkles", title: "Winterliches Abenteuer", text: "Freundschaft und Hexenkraft auf dem Martinshof" },
    { icon: "MapPin", title: "Berlin und Hamburg", text: "Zwei Stage-Spielstätten in der Weihnachtszeit 2026" },
  ],
  seoTitle: "Weihnachten mit Bibi & Tina 2026/2027 | Berlin & Hamburg",
  seoDescription: "Weihnachten mit Bibi & Tina: Termine in Berlin und Hamburg bis 3. Januar 2027. Spielstätten, Familieninfos, Bilder und Hinweise zum Besuch ab drei Jahren.",
};

/** Bannerziele vom Projektinhaber, 22.11.2026. Bilder NICHT erraten. */
export const WBT_PENDING_BANNERS = [
  { city: "Hamburg", groupId: "26185746", width: 728, height: 90, placement: "within-detail-description", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185746", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/wqFPKzdDqhtLuloh.jpg" },
  { city: "Hamburg", groupId: "26185744", width: 300, height: 250, placement: "after-gallery", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185744", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WtdGzhcRNTMHaPvn.jpg" },
  { city: "Berlin", groupId: "26185738", width: 728, height: 90, placement: "within-detail-description", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185738", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/TBfvDdCQTqmaXBEA.jpg" },
  { city: "Berlin", groupId: "26185736", width: 300, height: 250, placement: "after-gallery", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185736", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/EgOezITKRLrTBGfa.jpg" },
] as const;

export const WBT_PUBLICATION_REQUIREMENTS = {
  status: "waiting-for-text-links",
  priceSheetId: "weihnachten-mit-bibi-tina",
  priceSheetAlias: "WBT",
  approvedPrice: null,
  approvedTextLinks: { showPage: null, Berlin: null, Hamburg: null },
  bannerDisplay: "Je ein stadtbezogenes Banner pro Format; sichtbare Stadtauswahl an beiden Platzierungen, kein stiller Hamburg-/Berlin-Mix.",
  bannerVisibility: "BLACK-FRIDAY-Motive nur innerhalb des bestätigten Aktionszeitraums anzeigen; nach Ablauf ausblenden, solange kein neutrales Originalcreative vorliegt.",
  impressionPolicy: "Bestehenden Stage-Impressionpfad nur nach affiliateTracking-Einwilligung verwenden; Converter und Awin unverändert.",
  photoCredit: "© Jörn Hartmann",
  artworkCredit: "Vom Projektinhaber bereitgestelltes Produktionsartwork; kein Fotografencredit ungeprüft zugeordnet.",
  rollbackCheckpoint: "33c025e8",
} as const;
