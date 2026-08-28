import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ACTIVE_MUSICAL_IDS, musicals } from "../client/src/lib/data";

const KDL_STAGE_PRODUCT_URL = "https://www.stage-entertainment.de/musicals-shows/b/disneys-der-koenig-der-loewen-hamburg";
const STAGE_PRODUCT_URLS = {
  "mj-musical": "https://www.stage-entertainment.de/musicals-shows/b/mj-das-michael-jackson-musical-hamburg",
  eiskoenigin: "https://www.stage-entertainment.de/musicals-shows/die-eiskoenigin-stuttgart",
  tarzan: "https://www.stage-entertainment.de/musicals-shows/disneys-tarzan-hamburg",
  ziz: "https://www.stage-entertainment.de/musicals-shows/zurueck-in-die-zukunft-hamburg/ticketshop",
  "teufel-traegt-prada": "https://www.stage-entertainment.de/musicals-shows/der-teufel-traegt-prada-hamburg",
  "wir-sind-am-leben": "https://www.stage-entertainment.de/musicals-shows/wir-sind-am-leben-berlin",
  "tanz-der-vampire": "https://www.stage-entertainment.de/musicals-shows/tanz-der-vampire-stuttgart",
  "we-will-rock-you": "https://www.stage-entertainment.de/musicals-shows/we-will-rock-you-stuttgart",
  "und-julia": "https://www.stage-entertainment.de/musicals-shows/und-julia-stuttgart",
  "salon-rosie": "https://www.stage-entertainment.de/musicals-shows/salon-rosie-berlin",
} as const;

describe("Affiliate-Link-Zuordnung", () => {
  it("verwendet für König der Löwen die direkte Stage-Entertainment-Produktseite an allen Ticket-CTAs", () => {
    const kdl = musicals.find((musical) => musical.id === "koenig-der-loewen");

    expect(kdl).toBeDefined();
    expect(kdl?.keyvisualLink).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.ticketCtaUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.eventimUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.awinHeroUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.awinStickyUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.awinBoxUrl).toBe(KDL_STAGE_PRODUCT_URL);
    expect(kdl?.tourDates?.[0]?.eventimUrl).toBe(KDL_STAGE_PRODUCT_URL);
  });

  it("verwendet die bereitgestellten Stage-Produktseiten an allen Ticket-CTAs und Tourterminen", () => {
    for (const [id, productUrl] of Object.entries(STAGE_PRODUCT_URLS)) {
      const musical = musicals.find((entry) => entry.id === id);

      expect(musical, `Musical ${id} muss vorhanden sein`).toBeDefined();
      expect(musical?.keyvisualLink).toBe(productUrl);
      expect(musical?.ticketCtaUrl).toBe(productUrl);
      expect(musical?.eventimUrl).toBe(productUrl);
      expect(musical?.awinHeroUrl).toBe(productUrl);
      expect(musical?.awinStickyUrl).toBe(productUrl);
      expect(musical?.awinBoxUrl).toBe(productUrl);
      expect((musical?.tourDates ?? []).every((date) => date.eventimUrl === productUrl)).toBe(true);
    }
  });

  it("deaktiviert DIE AMME in der öffentlichen Musical-Liste", () => {
    expect(ACTIVE_MUSICAL_IDS).not.toContain("die-amme");
  });

  it("initialisiert den Trade-Doubler Link Converter auch nach React-Renderzyklen erneut", () => {
    const indexHtml = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain("https://clk.tradedoubler.com/lc?a(3492604)rand(");
    expect(indexHtml).toContain("window.TDLinkConverter.init({});");
    expect(indexHtml).toContain("new MutationObserver(convertEligibleLinks)");
    expect(indexHtml).toContain("js.onload = window.tdlcAsyncInit;");
    expect(indexHtml).toContain("https://visit.stage-entertainment.de/click?p=");
    expect(indexHtml).toContain("destination.hostname !== \"www.stage-entertainment.de\"");
    expect(indexHtml).toContain('d.addEventListener("DOMContentLoaded", window.tdlcAsyncInit');
  });
});
