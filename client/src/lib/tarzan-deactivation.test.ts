import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  ACTIVE_MUSICAL_IDS, cities, getActiveMusicals, getActiveMusicalsByCity,
  getAdditionalMusicals, getEditorialOverviewMusicals, getFeaturedMusicals,
  getHomepageMusicals, getMusicalBySlug, musicals,
} from "./data";
import { getRelatedMusicals } from "./related-musicals";

const slug = "disneys-musical-tarzan";
const tarzan = musicals.find(m => m.id === "tarzan")!;

describe("Tarzan global deaktiviert – Nutzerfreigabe22.11.2026", () => {
  it("bewahrt den vollständigen archivierten Datensatz einschließlich Original-Ticketpfad und Spielzeit", () => {
    expect(tarzan).toBeDefined();
    expect(tarzan.slug).toBe(slug);
    expect(tarzan.eventimUrl).toBe("https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408");
    expect(tarzan.tourDates?.[0].endDate).toBe("2026-10-31");
    expect(tarzan.image).toBeTruthy();
    expect(tarzan.gallery?.length).toBeGreaterThan(0);
  });
  it("deaktiviert ID und kanonische Detailseite und behält alle anderen aktiven Shows", () => {
    expect(ACTIVE_MUSICAL_IDS).not.toContain("tarzan");
    expect(ACTIVE_MUSICAL_IDS).not.toContain(slug);
    expect(getMusicalBySlug(slug)).toBeUndefined();
    expect(getActiveMusicals()).toHaveLength(21);
    expect(getMusicalBySlug("koenig-der-loewen")).toBeDefined();
  });
  it("gibt Tarzan in keiner öffentlichen Übersicht, Stadtliste oder Empfehlung aus", () => {
    const active = getActiveMusicals();
    const lists = [active, getHomepageMusicals(), getAdditionalMusicals(),
      getFeaturedMusicals(), getEditorialOverviewMusicals(false), getEditorialOverviewMusicals(true),
      ...cities.map(city => getActiveMusicalsByCity(city.name)),
      ...active.map(show => getRelatedMusicals(active, show)),
    ];
    for (const list of lists) {
      expect(list.some(show => show.id === "tarzan" || show.slug === slug)).toBe(false);
    }
  });
  it("verwendet auch bei verwalteten Katalogdaten die globale Freischaltung", () => {
    expect(getActiveMusicals([tarzan])).toEqual([]);
    expect(getActiveMusicals([{ ...tarzan, id: "tarzan", slug: "temporary-alias" }])).toEqual([]);
    expect(getActiveMusicals([{ ...tarzan, id: "temporary-alias", slug }])).toEqual([]);
    const header = readFileSync("client/src/components/Header.tsx", "utf8");
    const detail = readFileSync("client/src/pages/MusicalDetail.tsx", "utf8");
    expect(header).toContain("const allMusicals = getActiveMusicals();");
    expect(detail).toContain("getActiveMusicals(managedMusicals).find");
  });
});
