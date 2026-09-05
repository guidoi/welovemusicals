import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ACTIVE_MUSICAL_IDS, AWIN_TEXT_LINKS, getActiveMusicals, getMusicalBySlug, musicals } from "../client/src/lib/data";

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
  it("verwendet für alle direkt eingebundenen Eventim-Awin-Links die korrekte Merchant- und Publisher-ID", () => {
    const eventimAwinUrls = musicals
      .flatMap((musical) => [
        musical.eventimUrl,
        musical.ticketCtaUrl,
        musical.awinHeroUrl,
        musical.awinStickyUrl,
        musical.awinBoxUrl,
        musical.keyvisualLink,
        ...(musical.tourDates ?? []).map((date) => date.eventimUrl),
      ])
      .filter((url): url is string => Boolean(url))
      .filter((url) => new URL(url).hostname === "www.awin1.com")
      .filter((url) => new URL(url).pathname === "/cread.php");

    expect(eventimAwinUrls.length).toBeGreaterThan(0);

    for (const url of eventimAwinUrls) {
      const trackingUrl = new URL(url);
      expect(trackingUrl.pathname).toBe("/cread.php");
      expect(trackingUrl.searchParams.get("awinmid")).toBe("11388");
      expect(trackingUrl.searchParams.get("awinaffid")).toBe("2865727");
      expect(decodeURIComponent(trackingUrl.searchParams.get("ued") ?? "")).toContain("eventim.de");
    }
  });

  it("verwendet die bereitgestellten Awin-Textlink-Werbemittel an den Haupt-CTAs der freigegebenen Shows", () => {
    const expectations = [
      { id: "moulinrouge", creative: AWIN_TEXT_LINKS.moulinRouge, clickRefPrefix: "moulinrouge-" },
      { id: "starlight-express", creative: AWIN_TEXT_LINKS.starlightExpress, clickRefPrefix: "starlight-express-" },
      { id: "fackjugoehte", creative: AWIN_TEXT_LINKS.fackJuGoehte, clickRefPrefix: "fjg-" },
      { id: "schoene-und-das-biest", creative: AWIN_TEXT_LINKS.schoeneUndDasBiest, clickRefPrefix: "dsudb-" },
      { id: "dracula", creative: AWIN_TEXT_LINKS.dracula, clickRefPrefix: "dracula-" },
    ] as const;

    for (const { id, creative, clickRefPrefix } of expectations) {
      const musical = musicals.find((entry) => entry.id === id);
      expect(musical, `Musical ${id} muss vorhanden sein`).toBeDefined();

      const mainCtas = [
        musical?.keyvisualLink,
        musical?.ticketCtaUrl,
        musical?.eventimUrl,
        musical?.awinHeroUrl,
        musical?.awinStickyUrl,
        musical?.awinBoxUrl,
      ];

      for (const url of mainCtas.filter((url): url is string => Boolean(url))) {
        const trackingUrl = new URL(url);
        expect(trackingUrl.hostname).toBe("www.awin1.com");
        expect(trackingUrl.pathname, `${id} muss für Haupt-CTAs den bereitgestellten Awin-Textlink verwenden: ${url}`).toBe("/awclick.php");
        expect(trackingUrl.searchParams.get("gid")).toBe(creative.gid);
        expect(trackingUrl.searchParams.get("mid")).toBe(creative.merchantId);
        expect(trackingUrl.searchParams.get("awinaffid")).toBe("2865727");
        expect(trackingUrl.searchParams.get("linkid")).toBe(creative.linkId);
        expect(trackingUrl.searchParams.get("clickref")?.startsWith(clickRefPrefix)).toBe(true);
      }
    }
  });

  it("hinterlegt ATG-Zielseiten ohne manuelle Doppelparameter und überlässt die Dekoration dem zustimmungsbasierten MasterTag", () => {
    const atgUrls = musicals
      .flatMap((musical) => [
        musical.eventimUrl,
        musical.ticketCtaUrl,
        musical.awinHeroUrl,
        musical.awinStickyUrl,
        musical.awinBoxUrl,
        musical.keyvisualLink,
        ...(musical.tourDates ?? []).map((date) => date.eventimUrl),
      ])
      .filter((url): url is string => Boolean(url))
      .filter((url) => new URL(url).hostname.endsWith("atgtickets.de"));

    expect(atgUrls.length).toBeGreaterThan(0);

    for (const url of atgUrls) {
      const trackingUrl = new URL(url);
      expect(trackingUrl.searchParams.has("utm_source")).toBe(false);
      expect(trackingUrl.searchParams.has("utm_medium")).toBe(false);
      expect(trackingUrl.searchParams.has("utm_campaign")).toBe(false);
      expect(trackingUrl.searchParams.has("sv1")).toBe(false);
      expect(trackingUrl.searchParams.has("sv_campaign_id")).toBe(false);
      expect(trackingUrl.searchParams.has("awc")).toBe(false);
    }

    const moulinRougeHamburg = musicals
      .find((musical) => musical.id === "moulinrouge")
      ?.tourDates?.find((date) => date.city === "Hamburg");
    const target = new URL(moulinRougeHamburg?.eventimUrl ?? "");
    expect(target.searchParams.get("eventsView")).toBe("calendar");
    expect(target.searchParams.get("productionId")).toBe("28");
  });

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

  it("deaktiviert Sister Act in öffentlichen Listen und auf der direkten Detailroute", () => {
    expect(ACTIVE_MUSICAL_IDS).not.toContain("sister-act");
    expect(getActiveMusicals().some((musical) => musical.id === "sisteract")).toBe(false);
    expect(getMusicalBySlug("sister-act")).toBeUndefined();
  });

  it("initialisiert den TradeDoubler Link Converter erst nach Zustimmung und auch nach React-Renderzyklen", () => {
    const consentServices = readFileSync(
      new URL("../client/src/components/OptionalConsentServices.tsx", import.meta.url),
      "utf8"
    );

    expect(consentServices).toContain("if (!consent?.affiliateTracking) return;");
    expect(consentServices).toContain("https://clk.tradedoubler.com/lc?a(3492604)rand(");
    expect(consentServices).toContain("converter?.init");
    expect(consentServices).toContain("new MutationObserver(convertEligibleLinks)");
    expect(consentServices).toContain("https://visit.stage-entertainment.de/click?p=394206");
    expect(consentServices).toContain('destination.hostname.endsWith(".stage-entertainment.de")');
    expect(consentServices).toContain("convertStageLinksWithFallback();");
  });
});
