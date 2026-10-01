import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  ACTIVE_MUSICAL_IDS,
  ATG_PENDING_TOUR_TEXT_LINK_IDS,
  AWIN_TEXT_LINKS,
  EISKOENIGIN_STAGE_SHOW_PAGE_URL,
  EISKOENIGIN_STAGE_TEXT_LINK_URL,
  getActiveMusicals,
  getMusicalBySlug,
  KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL,
  KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL,
  MJ_STAGE_SHOW_PAGE_URL,
  MJ_STAGE_TEXT_LINK_URL,
  PRADA_STAGE_SHOW_PAGE_URL,
  PRADA_STAGE_TEXT_LINK_URL,
  SALON_ROSIE_STAGE_SHOW_PAGE_URL,
  SALON_ROSIE_STAGE_TEXT_LINK_URL,
  TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL,
  TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL,
  TARZAN_STAGE_SHOW_PAGE_URL,
  TARZAN_STAGE_TEXT_LINK_URL,
  TINA_STAGE_SHOW_PAGE_URL,
  TINA_STAGE_TEXT_LINK_URL,
  UND_JULIA_STAGE_SHOW_PAGE_URL,
  UND_JULIA_STAGE_TEXT_LINK_URL,
  WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL,
  WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL,
  ZIZ_STAGE_SHOW_PAGE_URL,
  ZIZ_STAGE_TEXT_LINK_URL,
  musicals,
} from "../client/src/lib/data";

const STAGE_PRODUCT_URLS = {
  "we-will-rock-you": "https://www.stage-entertainment.de/musicals-shows/we-will-rock-you-stuttgart",
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
      { id: "phantom-der-oper", creative: AWIN_TEXT_LINKS.phantomDerOper, clickRefPrefix: "phantom-der-oper-" },
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

  it("verwendet die bereitgestellten ATG-Textlinks für alle verfügbaren Glöckner-Tourtermine", () => {
    const gloeckner = musicals.find((musical) => musical.id === "gloeckner-von-notre-dame");
    const expectedClickRefs = {
      "München": "gloeckner-muenchen-dates",
      "Düsseldorf": "gloeckner-duesseldorf-dates",
      "Frankfurt": "gloeckner-frankfurt-dates",
      "Leipzig": "gloeckner-leipzig-dates",
      "Bremen": "gloeckner-bremen-dates",
      "Duisburg": "gloeckner-duisburg-dates",
      "Berlin": "gloeckner-berlin-dates",
    } as const;

    for (const [city, clickRef] of Object.entries(expectedClickRefs)) {
      const tourDate = gloeckner?.tourDates?.find((date) => date.city === city);
      const creative = AWIN_TEXT_LINKS.gloecknerTourDates[city as keyof typeof AWIN_TEXT_LINKS.gloecknerTourDates];
      const trackingUrl = new URL(tourDate?.eventimUrl ?? "");

      expect(trackingUrl.hostname).toBe("www.awin1.com");
      expect(trackingUrl.pathname).toBe("/awclick.php");
      expect(trackingUrl.searchParams.get("gid")).toBe(creative.gid);
      expect(trackingUrl.searchParams.get("mid")).toBe(creative.merchantId);
      expect(trackingUrl.searchParams.get("awinaffid")).toBe("2865727");
      expect(trackingUrl.searchParams.get("linkid")).toBe(creative.linkId);
      expect(trackingUrl.searchParams.get("clickref")).toBe(clickRef);
    }
  });

  it("merkt die bereitgestellten Romeo-&-Julia-Tour-Textlinks bis zur Anlage der Veranstaltung vor", () => {
    expect(ATG_PENDING_TOUR_TEXT_LINK_IDS["romeo-und-julia"]).toEqual({
      "München": "4890800",
      "Düsseldorf": "4890801",
      "Frankfurt": "4890802",
    });
  });

  it("verwendet den bereitgestellten Hamburger Moulin-Rouge-Textlink mit eigenem Termin-Clickref", () => {
    const moulinRougeHamburg = musicals
      .find((musical) => musical.id === "moulinrouge")
      ?.tourDates?.find((date) => date.city === "Hamburg");
    const trackingUrl = new URL(moulinRougeHamburg?.eventimUrl ?? "");

    expect(trackingUrl.hostname).toBe("www.awin1.com");
    expect(trackingUrl.pathname).toBe("/awclick.php");
    expect(trackingUrl.searchParams.get("gid")).toBe(AWIN_TEXT_LINKS.moulinRouge.gid);
    expect(trackingUrl.searchParams.get("mid")).toBe(AWIN_TEXT_LINKS.moulinRouge.merchantId);
    expect(trackingUrl.searchParams.get("linkid")).toBe(AWIN_TEXT_LINKS.moulinRouge.linkId);
    expect(trackingUrl.searchParams.get("clickref")).toBe("moulinrouge-hamburg-dates");
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

  });

  it("verwendet bei König der Löwen die gelieferte Stage-Showseite auch an allen Text-CTAs", () => {
    const kdl = musicals.find((musical) => musical.id === "koenig-der-loewen");

    expect(kdl).toBeDefined();
    expect(kdl?.keyvisualLink).toBe(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL);
    expect(KOENIG_DER_LOEWEN_STAGE_TEXT_LINK_URL).toBe(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL);
    expect([
      kdl?.ticketCtaUrl,
      kdl?.eventimUrl,
      kdl?.awinHeroUrl,
      kdl?.awinStickyUrl,
      kdl?.awinBoxUrl,
      kdl?.tourDates?.[0]?.eventimUrl,
    ]).toEqual(Array(6).fill(KOENIG_DER_LOEWEN_STAGE_SHOW_PAGE_URL));
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

  it("verwendet bei MJ die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const mj = musicals.find((musical) => musical.id === "mj-musical");

    expect(mj).toBeDefined();
    expect(MJ_STAGE_TEXT_LINK_URL).toBe(MJ_STAGE_SHOW_PAGE_URL);
    expect([
      mj?.keyvisualLink,
      mj?.ticketCtaUrl,
      mj?.eventimUrl,
      mj?.awinHeroUrl,
      mj?.awinStickyUrl,
      mj?.awinBoxUrl,
      ...(mj?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(MJ_STAGE_SHOW_PAGE_URL));
  });

  it("verwendet bei Eiskönigin die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const eiskoenigin = musicals.find((musical) => musical.id === "eiskoenigin");

    expect(eiskoenigin).toBeDefined();
    expect(EISKOENIGIN_STAGE_TEXT_LINK_URL).toBe(EISKOENIGIN_STAGE_SHOW_PAGE_URL);
    expect([
      eiskoenigin?.keyvisualLink,
      eiskoenigin?.ticketCtaUrl,
      eiskoenigin?.eventimUrl,
      eiskoenigin?.awinHeroUrl,
      eiskoenigin?.awinStickyUrl,
      eiskoenigin?.awinBoxUrl,
      ...(eiskoenigin?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(EISKOENIGIN_STAGE_SHOW_PAGE_URL));
  });

  it("trennt bei den weiteren Stage-Shows die Keyvisual-Landingpage von Ticket-CTA und Termin", () => {
    const expectations = {
      "teufel-traegt-prada": { showPageLink: PRADA_STAGE_SHOW_PAGE_URL, shopLink: PRADA_STAGE_TEXT_LINK_URL },
    } as const;

    for (const [id, { showPageLink, shopLink }] of Object.entries(expectations)) {
      const musical = musicals.find((entry) => entry.id === id);

      expect(musical, `Musical ${id} muss vorhanden sein`).toBeDefined();
      expect(musical?.keyvisualLink).toBe(showPageLink);
      expect([
        musical?.ticketCtaUrl,
        musical?.eventimUrl,
        musical?.awinHeroUrl,
        musical?.awinStickyUrl,
        musical?.awinBoxUrl,
        ...(musical?.tourDates ?? []).map((date) => date.eventimUrl),
      ]).toEqual(Array(6).fill(shopLink));
    }
  });

  it("verwendet bei Tarzan die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const tarzan = musicals.find((musical) => musical.id === "tarzan");

    expect(tarzan).toBeDefined();
    expect(TARZAN_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149406"
    );
    expect(TARZAN_STAGE_TEXT_LINK_URL).toBe(TARZAN_STAGE_SHOW_PAGE_URL);
    expect([
      tarzan?.keyvisualLink,
      tarzan?.ticketCtaUrl,
      tarzan?.eventimUrl,
      tarzan?.awinHeroUrl,
      tarzan?.awinStickyUrl,
      tarzan?.awinBoxUrl,
      ...(tarzan?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(TARZAN_STAGE_SHOW_PAGE_URL));
  });

  it("verwendet bei TINA die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const tina = musicals.find((musical) => musical.id === "tina-das-musical");

    expect(tina).toBeDefined();
    expect(TINA_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26204074"
    );
    expect(TINA_STAGE_TEXT_LINK_URL).toBe(TINA_STAGE_SHOW_PAGE_URL);
    expect([
      tina?.keyvisualLink,
      tina?.ticketCtaUrl,
      tina?.eventimUrl,
      tina?.awinHeroUrl,
      tina?.awinStickyUrl,
      tina?.awinBoxUrl,
      ...(tina?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(TINA_STAGE_SHOW_PAGE_URL));
  });

  it("verwendet bei ZIZ die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const ziz = musicals.find((musical) => musical.id === "ziz");

    expect(ziz).toBeDefined();
    expect(ZIZ_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149410"
    );
    expect(ZIZ_STAGE_TEXT_LINK_URL).toBe(ZIZ_STAGE_SHOW_PAGE_URL);
    expect([
      ziz?.keyvisualLink,
      ziz?.ticketCtaUrl,
      ziz?.eventimUrl,
      ziz?.awinHeroUrl,
      ziz?.awinStickyUrl,
      ziz?.awinBoxUrl,
      ...(ziz?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(ZIZ_STAGE_SHOW_PAGE_URL));
  });

  it("verwendet bei Tanz der Vampire die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const tanzDerVampire = musicals.find((musical) => musical.id === "tanz-der-vampire");

    expect(tanzDerVampire).toBeDefined();
    expect(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149426"
    );
    expect(TANZ_DER_VAMPIRE_STAGE_TEXT_LINK_URL).toBe(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL);
    expect([
      tanzDerVampire?.keyvisualLink,
      tanzDerVampire?.ticketCtaUrl,
      tanzDerVampire?.eventimUrl,
      tanzDerVampire?.awinHeroUrl,
      tanzDerVampire?.awinStickyUrl,
      tanzDerVampire?.awinBoxUrl,
      ...(tanzDerVampire?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(TANZ_DER_VAMPIRE_STAGE_SHOW_PAGE_URL));
  });

  it("verwendet bei Wir sind am Leben die freigegebene Stage-Produktseite auch für alle Text-CTAs und Termine", () => {
    const wirSindAmLeben = musicals.find((musical) => musical.id === "wir-sind-am-leben");

    expect(wirSindAmLeben).toBeDefined();
    expect(WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL).toBe(
      "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149434"
    );
    expect(WIR_SIND_AM_LEBEN_STAGE_TEXT_LINK_URL).toBe(WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL);
    expect([
      wirSindAmLeben?.keyvisualLink,
      wirSindAmLeben?.ticketCtaUrl,
      wirSindAmLeben?.eventimUrl,
      wirSindAmLeben?.awinHeroUrl,
      wirSindAmLeben?.awinStickyUrl,
      wirSindAmLeben?.awinBoxUrl,
      ...(wirSindAmLeben?.tourDates ?? []).map((date) => date.eventimUrl),
    ]).toEqual(Array(7).fill(WIR_SIND_AM_LEBEN_STAGE_SHOW_PAGE_URL));
  });

  it("verwendet bei & JULIA, Salon Rosie und Eiskönigin die freigegebenen Stage-Produktseiten auch für Text-CTAs und Termine", () => {
    const productPageCases = {
      "und-julia": UND_JULIA_STAGE_SHOW_PAGE_URL,
      "salon-rosie": SALON_ROSIE_STAGE_SHOW_PAGE_URL,
      eiskoenigin: EISKOENIGIN_STAGE_SHOW_PAGE_URL,
    } as const;

    for (const [id, showPageLink] of Object.entries(productPageCases)) {
      const musical = musicals.find((entry) => entry.id === id);
      const textLink = id === "und-julia"
        ? UND_JULIA_STAGE_TEXT_LINK_URL
        : id === "salon-rosie"
          ? SALON_ROSIE_STAGE_TEXT_LINK_URL
          : EISKOENIGIN_STAGE_TEXT_LINK_URL;

      expect(musical, `Musical ${id} muss vorhanden sein`).toBeDefined();
      expect(textLink).toBe(showPageLink);
      expect([
        musical?.keyvisualLink,
        musical?.ticketCtaUrl,
        musical?.eventimUrl,
        musical?.awinHeroUrl,
        musical?.awinStickyUrl,
        musical?.awinBoxUrl,
        ...(musical?.tourDates ?? []).map((date) => date.eventimUrl),
      ]).toEqual(Array(7).fill(showPageLink));
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

  it("ergänzt direkte Trackingziele durch den zustimmungsbasierten TradeDoubler-Link-Converter", () => {
    const consentServices = readFileSync(
      new URL("../client/src/components/OptionalConsentServices.tsx", import.meta.url),
      "utf8"
    );

    expect(consentServices).not.toContain("dwin2.com");
    expect(consentServices).toContain("clk.tradedoubler.com/lc");
    expect(consentServices).toContain("TDLinkConverter");
    expect(consentServices).toContain("tdlcAsyncInit");
    expect(consentServices).toContain('"tdlc-jssdk"');
    expect(consentServices).toContain("MutationObserver");
    expect(consentServices).toContain("if (!consent?.affiliateTracking");
    expect(consentServices).toContain("UNTRACKED_STAGE_DESTINATION_HOSTS");
    expect(consentServices).toContain("visit.stage-entertainment.de/click");
  });

  it("verwendet für alle aktiven Stage-Ziele und TradeDoubler-Helfer konsistent die verifizierte Webseitenkennung 3492604", () => {
    const tradeDoublerWebsiteId = "3492604";
    const unzutreffendeKontonummer = "2475512";
    const activeStageUrls = getActiveMusicals()
      .flatMap((musical) => [
        musical.keyvisualLink,
        musical.ticketCtaUrl,
        musical.eventimUrl,
        musical.awinHeroUrl,
        musical.awinStickyUrl,
        musical.awinBoxUrl,
        ...(musical.tourDates ?? []).map((date) => date.eventimUrl),
      ])
      .filter((url): url is string => Boolean(url?.includes("stage-entertainment.de/click")));

    expect(activeStageUrls.length).toBeGreaterThan(0);
    for (const url of activeStageUrls) {
      const trackingUrl = new URL(url);
      expect(trackingUrl.searchParams.get("a")).toBe(tradeDoublerWebsiteId);
      expect(url).not.toContain(unzutreffendeKontonummer);
    }

    const tradeDoublerSources = [
      "../client/src/components/OptionalConsentServices.tsx",
      "../client/src/components/AovoCampaignBanner.tsx",
      "../client/src/components/AovoTanzDerVampireBanner.tsx",
    ];

    for (const relativePath of tradeDoublerSources) {
      const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
      expect(source, `${relativePath} muss die verifizierte Webseitenkennung verwenden`).toContain(`a=${tradeDoublerWebsiteId}`);
      expect(source, `${relativePath} darf keine Kontonummer als Webseitenkennung verwenden`).not.toContain(`a=${unzutreffendeKontonummer}`);
    }
  });

  it("erhält bei Affiliate-Klicks den Herkunftsverweis für die Attributionskette", () => {
    const affiliateSourceFiles = [
      "../client/src/components/AovoCampaignBanner.tsx",
      "../client/src/components/AovoTanzDerVampireBanner.tsx",
      "../client/src/components/AwinShowCampaignBanner.tsx",
      "../client/src/components/EventimDraculaBanner.tsx",
      "../client/src/components/EventimFackJuGoehteBanner.tsx",
      "../client/src/components/MusicalKeyVisual.tsx",
      "../client/src/components/TourDates.tsx",
    ];

    for (const relativePath of affiliateSourceFiles) {
      const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
      expect(source, `${relativePath} darf Affiliate-Referrer nicht unterdrücken`).not.toContain("noreferrer");
    }

    const stageBanner = readFileSync(
      new URL("../client/src/components/AovoCampaignBanner.tsx", import.meta.url),
      "utf8"
    );
    expect(stageBanner).toContain('"_blank", "noopener"');

    const ticketDetail = readFileSync(
      new URL("../client/src/pages/MusicalDetail.tsx", import.meta.url),
      "utf8"
    );
    expect(ticketDetail.match(/rel="noopener sponsored"/g)).toHaveLength(3);
  });
});
