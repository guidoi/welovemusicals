/**
 * WBT ist nach Freigabe der Textproduktseiten im zentralen data.ts-Katalog aktiv.
 * Dieses Modul bewahrt die originalen nativen Bannerkonstanten und Freigabemetadaten.
 * Redaktionelle Texte, Bilder und Spielzeiten werden ausschließlich in data.ts gepflegt.
 */

/** Bannerziele vom Projektinhaber, 22.11.2026. Bilder NICHT erraten. */
export const WBT_PENDING_BANNERS = [
  { city: "Hamburg", groupId: "26185746", width: 728, height: 90, placement: "within-detail-description", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185746", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/wqFPKzdDqhtLuloh.jpg" },
  { city: "Hamburg", groupId: "26185744", width: 300, height: 250, placement: "after-gallery", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185744", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/WtdGzhcRNTMHaPvn.jpg" },
  { city: "Berlin", groupId: "26185738", width: 728, height: 90, placement: "within-detail-description", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185738", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/TBfvDdCQTqmaXBEA.jpg" },
  { city: "Berlin", groupId: "26185736", width: 300, height: 250, placement: "after-gallery", clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26185736", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/EgOezITKRLrTBGfa.jpg" },
] as const;

export const WBT_PUBLICATION_REQUIREMENTS = {
  status: "active",
  priceSheetId: "weihnachten-mit-bibi-tina",
  priceSheetAlias: "WBT",
  approvedPrice: "12,50",
  approvedTextLinks: {
    showPage: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442",
    Berlin: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26149442",
    Hamburg: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26175768",
  },
  bannerDisplay: "Je ein stadtbezogenes Banner pro Format; Keine Stadtfilter auf der Detailseite. Berlin und Hamburg dauerhaft gemeinsam sichtbar; beide Städte behalten eigene Termin-CTAs. Allgemeine CTAs nennen die Zielstadt.",
  bannerVisibility: "BLACK-FRIDAY-Motive nur innerhalb des bestätigten Aktionszeitraums anzeigen; nach Ablauf ausblenden, solange kein neutrales Originalcreative vorliegt.",
  impressionPolicy: "Bestehenden Stage-Impressionpfad nur nach affiliateTracking-Einwilligung verwenden; Converter und Awin unverändert.",
  photoCredit: "© Jörn Hartmann",
  artworkCredit: "Vom Projektinhaber bereitgestelltes Produktionsartwork; kein Fotografencredit ungeprüft zugeordnet.",
  rollbackCheckpoint: "3c21c548",
} as const;
