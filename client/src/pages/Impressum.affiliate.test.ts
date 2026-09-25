import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS } from "@/lib/data";

const impressumSource = readFileSync(resolve(process.cwd(), "client/src/pages/Impressum.tsx"), "utf8");

const IMAGE_CREDIT_HEADING_BY_MUSICAL_ID: Record<string, string> = {
  dracula: "DRACULA – DAS MUSICAL",
  moulinrouge: "MOULIN ROUGE! DAS MUSICAL",
  "phantom-der-oper": "DAS PHANTOM DER OPER",
  "fack-ju-goehte": "FACK JU GÖHTE – DAS MUSICAL",
  dreihaselnuesse: "DREI HASELNÜSSE FÜR ASCHENBRÖDEL – DAS MUSICAL",
  rapunzel: "RAPUNZEL – DAS MÄRCHENHAFTE MUSICAL",
  "schoene-und-das-biest": "DIE SCHÖNE UND DAS BIEST – DAS NEUE MUSICAL",
  "gloeckner-von-notre-dame": "DISNEY DER GLÖCKNER VON NOTRE-DAME",
  "starlight-express": "STARLIGHT EXPRESS",
  eiskoenigin: "DISNEYS DIE EISKÖNIGIN",
  "koenig-der-loewen": "DISNEYS DER KÖNIG DER LÖWEN",
  "mj-musical": "MJ – DAS MICHAEL JACKSON MUSICAL",
  tarzan: "DISNEYS MUSICAL TARZAN",
  ziz: "ZURÜCK IN DIE ZUKUNFT – DAS MUSICAL",
  "teufel-traegt-prada": "DER TEUFEL TRÄGT PRADA – DAS MUSICAL",
  "wir-sind-am-leben": "WIR SIND AM LEBEN – DAS BERLIN MUSICAL",
  "tanz-der-vampire": "TANZ DER VAMPIRE – DAS MUSICAL",
  "salon-rosie": "SALON ROSIE",
  "und-julia": "& JULIA – DAS POP-MUSICAL",
  "tina-das-musical": "TINA – DAS TINA TURNER MUSICAL",
};

describe("Impressum – Affiliate-Transparenz", () => {
  it("nennt TradeDoubler und die Publisher-ID für Stage Entertainment", () => {
    expect(impressumSource).toContain("Stage Entertainment über TradeDoubler");
    expect(impressumSource).toContain("Publisher-ID 2475512");
  });

  it("nennt für jedes aktive Musical einen Bildnachweis und sichert TINA sowie die neuen Rapunzel-Artworks", () => {
    expect(Object.keys(IMAGE_CREDIT_HEADING_BY_MUSICAL_ID).sort()).toEqual([...ACTIVE_MUSICAL_IDS].sort());

    Object.values(IMAGE_CREDIT_HEADING_BY_MUSICAL_ID).forEach((heading) => {
      expect(impressumSource).toContain(heading);
    });

    expect(impressumSource).toContain("© Manuel Harlan / Stage Entertainment");
    expect(impressumSource).toContain("Headerbild, Keyvisual &amp; Logo:</strong> © ShowSlot Touring GmbH");
  });
});
