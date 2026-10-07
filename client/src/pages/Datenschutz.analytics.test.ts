import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const privacySource = readFileSync(new URL("./Datenschutz.tsx", import.meta.url), "utf8");

describe("Datenschutz zur Kategorie-Analyse", () => {
  it("erklärt die freiwillige und datensparsame Kategorie-Messung", () => {
    expect(privacySource).toContain("Erlebnis-Kategorie");
    expect(privacySource).toContain("mobil oder Desktop");
    expect(privacySource).toContain("Ticket-, Standort-, URL- und sonstige personenbezogene Daten");
    expect(privacySource).toContain("native Kampagnenbilder und zugehörige Impressionpixel");
    expect(privacySource).toContain("TradeDoubler Link Converter erst nach Ihrer Affiliate-Einwilligung");
    expect(privacySource).toContain("document.write</code> führen wir nicht aus");
    expect(privacySource).toContain("Bei bewussten Ticketklicks");
    expect(privacySource).toContain("Musicalkennung, Partner und CTA-Platzierung");
    expect(privacySource).toContain("Microsoft Clarity");
    expect(privacySource).toContain("erst nach Ihrer Statistik-Einwilligung geladen");
    expect(privacySource).toContain("deaktiviertem Werbespeicher");
    expect(privacySource).toContain("Clarity-Cookies gelöscht");
    expect(privacySource).toContain("Google Analytics 4");
    expect(privacySource).toContain("ausschließlich auf welovemusicals.com geladen");
    expect(privacySource).toContain("Werbespeicher, personalisierte Werbung und die Nutzung von Daten für Werbung bleiben deaktiviert");
    expect(privacySource).toContain("Datenschutzhinweise von Google");
    expect(privacySource).toContain("Technische Affiliate-Link-Sicherheit");
    expect(privacySource).toContain("Fehlergrund, Musicalkennung, Linkplatzierung und Partnerkategorie");
    expect(privacySource).toContain("keine ursprüngliche oder ersetzte URL");
  });
});
