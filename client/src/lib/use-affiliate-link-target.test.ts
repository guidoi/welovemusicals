import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/lib/use-affiliate-link-target.ts"), "utf8");

describe("sicherer Affiliate-Zieloverride-Hook", () => {
  it("validiert jeden geladenen Override erneut durch das bestehende Sicherheitsnetz", () => {
    expect(source).toContain("getSafeAffiliateTicketLink(override ?? candidate");
    expect(source).toContain("useAffiliateLinkOverrides");
    expect(source).not.toContain("window.open");
  });
});
