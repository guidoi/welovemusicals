import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const kdlImage = "https://welovemusicals.com/images/kdl/KDL_HH_Prio1_Rafiki_(c)StageEntertainment-1.jpg";
const homeDescription = "We Love Musicals: Musicals &amp; Shows in Deutschland, Österreich und der Schweiz – mit Terminen, Spielorten, Tourdaten, Preisen und Ticketangeboten.";
const structuredDescription = "We Love Musicals: Musicals & Shows in Deutschland, Österreich und der Schweiz – mit Terminen, Spielorten, Tourdaten, Preisen und Ticketangeboten.";
const homeTitle = "Musicals &amp; Shows 2026/2027 ❤️ Termine &amp; Tickets";

describe("Startseiten-Metadaten", () => {
  it("setzt ein repräsentatives Musicalmotiv statt eines einzelnen Tournee-Keyvisuals", () => {
    expect(homeHtml).toContain(`property="og:image" content="${kdlImage}"`);
    expect(homeHtml).toContain(`property="twitter:image" content="${kdlImage}"`);
    expect(homeHtml).not.toContain("rapunzel-keyvisual");
  });

  it("verknüpft die Startseite per JSON-LD mit ihrem primären Bild", () => {
    expect(homeHtml).toContain('"@type": "WebSite"');
    expect(homeHtml).toContain('"@type": "WebPage"');
    expect(homeHtml).toContain('"primaryImageOfPage"');
    expect(homeHtml).toContain(`"contentUrl": "${kdlImage}"`);
    expect(homeHtml).toContain('name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"');
  });

  it("setzt den gleichen klaren Nutzenhinweis für Google und Social-Media-Snippets", () => {
    expect(homeHtml).toContain(`<title>${homeTitle}</title>`);
    expect(homeHtml).toContain(`property="og:title" content="${homeTitle}"`);
    expect(homeHtml).toContain(`property="twitter:title" content="${homeTitle}"`);
    expect(homeHtml).toContain(`name="description" content="${homeDescription}"`);
    expect(homeHtml).toContain(`property="og:description" content="${homeDescription}"`);
    expect(homeHtml).toContain(`property="twitter:description" content="${homeDescription}"`);
    expect(homeHtml.match(new RegExp(`"description": "${structuredDescription}"`, "g"))).toHaveLength(2);
  });

  it("hält den Startseitentitel prägnant und mit dem vereinbarten Herztrenner", () => {
    expect(homeTitle).toContain("❤️");
    expect(homeTitle.length).toBeLessThanOrEqual(55);
  });
});
