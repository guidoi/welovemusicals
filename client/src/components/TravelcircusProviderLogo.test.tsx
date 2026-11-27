import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TravelcircusProviderLogo from "./TravelcircusProviderLogo";
import { TRAVELCIRCUS_LOGO as logo } from "@/lib/travelcircus-logo";

const html = () => renderToStaticMarkup(<TravelcircusProviderLogo />);

describe("Vom Nutzer freigegebenes natives Travelcircus-Logo", () => {
  it("behält Click und Impression mit exakt allen vier gelieferten Awin-Kennungen", () => {
    expect(logo.clickUrl).toBe("https://www.awin1.com/cread.php?s=4803309&v=9151&q=319940&r=2865727");
    expect(logo.impressionUrl).toBe("https://www.awin1.com/cshow.php?s=4803309&v=9151&q=319940&r=2865727");
    expect(html()).toContain(logo.clickUrl.replaceAll("&", "&amp;"));
    expect(html()).toContain('target="_blank" rel="sponsored noopener"');
  });
  it("zeigt das unveränderte Original-JPEG mit Originalmaßen, weißem Untergrund und ohne Crop", () => {
    expect(logo.imageUrl).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663510091225/NFyuZHcQZdnHEeat.jpg");
    expect(html()).toContain('width="1818" height="519"');
    expect(html()).toContain('alt="Travelcircus"');
    expect(html()).toContain("object-contain");
    expect(html()).toContain("bg-white");
    expect(html()).not.toMatch(/object-cover|noreferrer|<script|manus-storage/);
  });
  it("gibt im NoJS-HTML keine Impression aus und aktiviert sie clientseitig ausschließlich bei Affiliate-Einwilligung", () => {
    expect(html()).not.toContain("cshow.php");
    const source = readFileSync(new URL("./TravelcircusProviderLogo.tsx", import.meta.url), "utf8");
    expect(source).toContain("enabled={consent?.affiliateTracking === true}");
    expect(source).toContain('typeof window !== "undefined"');
    expect(source).not.toMatch(/useSafeAffiliateTicketLink|document\.write|window\.open|trackAffiliateTicketClick/);
  });
});
