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

  it("nennt ausschließlich die tatsächlich angebotenen Informationen", () => {
    expect(homeSource).toContain("Was dich bei We Love Musicals erwartet");
    expect(homeSource).toContain("Terminen, Spielorten, Tourdaten, Preisen, Aktionen und passenden Ticketangeboten");
    expect(homeSource).toContain("Termine & Spielorte");
    expect(homeSource).toContain("Musical-Städte");
    expect(homeSource).toContain("Preise & Aktionen");
    expect(homeSource).toContain("Passende Tickets");
    expect(homeSource).not.toContain("größten deutschsprachigen Online-Blogs");
  });
});
