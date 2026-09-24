import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./OptionalConsentServices.tsx", import.meta.url), "utf8");

describe("Optionale Dienste", () => {
  it("lädt Umami nur nach Analytics-Einwilligung und Schriftarten nur nach separater Einwilligung", () => {
    expect(source).toContain("if (!consent?.analytics) return;");
    expect(source).toContain("loadUmami();");
    expect(source).toContain("if (!consent?.externalMedia) return;");
    expect(source).toContain("loadGoogleFonts();");
  });

  it("verzichtet auf globale Awin- und TradeDoubler-Fremdskripte", () => {
    expect(source).not.toContain("dwin2.com");
    expect(source).not.toContain("tradedoubler.com/lc");
    expect(source).not.toContain("TDLinkConverter");
    expect(source).not.toContain("MutationObserver");
    expect(source).toContain("native, consent-gated creatives");
  });
});
