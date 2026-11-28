import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AOVO_CAMPAIGNS, getAovoCampaigns } from "./AovoCampaignBanner";

const projectRoot = new URL("../../../", import.meta.url);

function sourceSha256(relativePath: string) {
  return createHash("sha256")
    .update(readFileSync(new URL(relativePath, projectRoot)))
    .digest("hex");
}

// Offline-Baseline: git show f5507fe8:<Pfad>, als unveränderte Bytes gehasht.
// Für AovoCampaignBanner.tsx wurde ausschließlich der exakt zwölfzeilige
// KDL-Eintrag mit groupId "26068528" (750 × 200, after-faq) entfernt.
// Der Hash schützt auch alle übrigen Konfigurationen, Click-/Impression-Handler,
// Consent-Gates und die Darstellung; keine Normalisierung oder Git-Abhängigkeit.
const expectedAovoSha256 =
  "f73fc1a4412c017120970ff1b77497776e19eb337e88dbd295053f0ec3fa32fc";

const protectedSources = [
  {
    path: "client/src/lib/data.ts",
    sha256: "067ac17b6f198196ce5b55d90f8020ca265209376817f32232d2e90c2c4046b5", // Nutzerfreigabe 28.11.2026: Top-Reihenfolge Phantom/Glöckner; 02:04-02:08 Startseiten-Artworks Phantom, Moulin Rouge, Starlight Express
  },
  {
    path: "client/src/contexts/ConsentContext.tsx",
    sha256: "825476a15916064943b62becb4c26e9550ae346787a3a2f4eedca8618c516a92",
  },
  {
    path: "client/src/components/OptionalConsentServices.tsx",
    sha256: "7e07f368b39ccdf2337d7c7f6a69ac350150205b742ca8a95b65e5988b2cb08e",
  },
  {
    path: "client/src/lib/affiliate-link-safety.ts",
    sha256: "14183a624768185cde4037f1aef00c7c00512b0e6c915a543a23dbc5444ebe45",
  },
  {
    path: "client/src/lib/category-analytics.ts",
    sha256: "d2217479359071f16aa2d207f15dcb37f54aefc4561d1214f3b6cdfcdad5ec2d",
  },
  {
    // Nutzerfreigabe 28.11.2026 01:23: News-Teaser unter den Top-Musicals.
    path: "client/src/pages/Home.tsx",
    sha256: "20482e25dee966055f2fbe19653b379a5742599759559791e3df2ae38cad77df",
  },
  {
    // Nutzerfreigabe 28.11.2026 01:23: Menüpunkt News (Links ohne Anker navigieren normal).
    path: "client/src/components/Header.tsx",
    sha256: "3d0e3e22410b236924b821a0caed32adf138e18c01ea15d516a3a8d7cc7b785e",
  },
  {
    path: "client/index.html",
    sha256: "3328ee8c27bdbf55d3c17f51f3397e02a73fbd4a4934882d87ee651e9668e059",
  },
] as const;

describe("KDL-Travelcircus: unveränderte Bestandskampagnen und Schutzpfade", () => {
  it("ändert an Aovo gegenüber f5507fe8 ausschließlich den genehmigten KDL-Reisebanner-Eintrag", () => {
    expect(sourceSha256("client/src/components/AovoCampaignBanner.tsx")).toBe(
      expectedAovoSha256,
    );
  });

  it("behält für König der Löwen exakt die beiden Stage-Kampagnen 26180470 und 26180460", () => {
    const campaigns = getAovoCampaigns("koenig-der-loewen");

    expect(campaigns.map(({ groupId }) => groupId)).toEqual([
      "26180470",
      "26180460",
    ]);
    expect(campaigns).toEqual([
      {
        musicalId: "koenig-der-loewen",
        musicalTitle: "König der Löwen",
        groupId: "26180470",
        width: 728,
        height: 90,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/TdEwZrFcppFjxYLL.jpg",
        clickUrl: "https://clk.tradedoubler.com/click?p=394206&a=3492604&g=26180470",
        promotion: {
          imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XJUIQKKUaULjNyHO.jpg",
          validUntil: "2026-11-30",
        },
        trackingNetwork: "stage",
        placement: "within-detail-description",
        detailParagraphIndex: 4,
        adLabel: "König der Löwen Ticketangebot",
        clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
      },
      {
        musicalId: "koenig-der-loewen",
        musicalTitle: "König der Löwen",
        groupId: "26180460",
        width: 300,
        height: 250,
        imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/XsclnrVkSHkqekmf.jpg",
        trackingNetwork: "stage",
        placement: "after-gallery",
        adLabel: "König der Löwen Ticketangebot",
        clickAriaLabel: "König-der-Löwen-Ticketangebot in neuem Tab öffnen",
      },
    ]);
    expect(AOVO_CAMPAIGNS.some(({ groupId }) => groupId === "26068528")).toBe(false);
    expect(AOVO_CAMPAIGNS).toHaveLength(27);
  });

  it("hat das alte MJ-Aovo-Ticket-und-Hotel-Banner 26068482 auf Nutzerwunsch entfernt, beide Stage-Banner bleiben", () => {
    const campaigns = getAovoCampaigns("mj-musical");
    expect(campaigns.map(({ groupId }) => groupId).sort()).toEqual(["26180462", "26180466"]);
  });
  it.each(protectedSources)("behält $path bytegleich zur Baseline f5507fe8", ({ path, sha256 }) => {
    expect(sourceSha256(path)).toBe(sha256);
  });
});
