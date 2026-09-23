import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConsentProvider } from "@/contexts/ConsentContext";
import EventimFackJuGoehteBanner, { FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS } from "./EventimFackJuGoehteBanner";

function renderBanner(format: "wide" | "square") {
  return renderToStaticMarkup(
    <ConsentProvider>
      <EventimFackJuGoehteBanner format={format} />
    </ConsentProvider>,
  );
}

describe("EventimFackJuGoehteBanner", () => {
  it("rendert das schmale Back-to-School-Creative nativ mit AWIN-Campaign 4568827", () => {
    const markup = renderBanner("wide");

    expect(markup).toContain("IYUUlUxAFyeyrOCw.jpg");
    expect(FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS.wide.clickUrl).toContain("s=4568827");
    expect(FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS.wide.impressionUrl).toContain("q=492097");
    expect(markup).toContain('data-campaign-id="4568827"');
    expect(markup).toContain('width="728"');
    expect(markup).toContain('height="90"');
    expect(markup).toContain("Back-to-School-Sale");
    expect(markup).toContain("Anzeige");
    expect(markup).toContain("mt-3 mb-8 w-full md:my-8");
  });

  it("rendert das quadratische Back-to-School-Creative nativ mit AWIN-Campaign 4568823", () => {
    const markup = renderBanner("square");

    expect(markup).toContain("LAhwDrJpzorIeACT.jpg");
    expect(FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS.square.clickUrl).toContain("s=4568823");
    expect(FACK_JU_GOEHTE_BACK_TO_SCHOOL_CAMPAIGNS.square.impressionUrl).toContain("q=492097");
    expect(markup).toContain('data-campaign-id="4568823"');
    expect(markup).toContain('width="300"');
    expect(markup).toContain('height="250"');
    expect(markup).toContain("nach der Bildergalerie");
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain("mx-auto my-8 w-full");
  });
});
