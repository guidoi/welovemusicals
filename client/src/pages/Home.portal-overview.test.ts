import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("sichtbare Portalübersicht auf der Startseite", () => {
  it("steht nach den Top-Musical-Empfehlungen vor der vollständigen Übersicht", () => {
    const featuredSection = homeSource.indexOf('/* ===== FEATURED MUSICALS ===== */');
    const overviewSection = homeSource.indexOf('/* ===== PORTAL OVERVIEW ===== */');
    const fullCatalogSection = homeSource.indexOf('/* ===== ALL MUSICALS ===== */');

    expect(featuredSection).toBeGreaterThanOrEqual(0);
    expect(overviewSection).toBeGreaterThan(featuredSection);
    expect(fullCatalogSection).toBeGreaterThan(overviewSection);
  });

  it("zeigt die kompakte, vom Projektinhaber vorgegebene Nutzenübersicht", () => {
    expect(homeSource).toContain("Was dich bei We Love Musicals erwartet:");
    expect(homeSource).toContain("Aktuelle Musical- und Showtermine");
    expect(homeSource).toContain("Spielorte, Städte und Tourneeübersichten");
    expect(homeSource).toContain("Preise und zeitlich begrenzte Ticketaktionen");
    expect(homeSource).toContain("Empfehlungen nach Erlebniswelten wie Blockbuster, Familie oder Kult &amp; Klassiker");
    expect(homeSource).toContain('className="mt-5 grid gap-x-8 gap-y-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2 md:text-base"');
    expect(homeSource).not.toContain("We Love Musicals bündelt aktuelle Musicals und Shows");
    expect(homeSource).not.toContain('>We Love Musicals<');
    expect(homeSource).not.toContain("Direkt zum passenden Ticketangebot");
    expect(homeSource).not.toContain("größten deutschsprachigen Online-Blogs");
  });
});
