import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConsentProvider } from "@/contexts/ConsentContext";
import EventimDraculaBanner, { DRACULA_AWIN_CAMPAIGNS } from "./EventimDraculaBanner";

function renderBanner(format: "wide" | "square") {
  return renderToStaticMarkup(
    <ConsentProvider>
      <EventimDraculaBanner format={format} />
    </ConsentProvider>,
  );
}

describe("EventimDraculaBanner", () => {
  it("rendert das schmale Dracula-Creative nativ mit AWIN-Campaign 3889113", () => {
    const markup = renderBanner("wide");

    expect(markup).toContain("aBHXjxadgwlLEJqV.jpg");
    expect(DRACULA_AWIN_CAMPAIGNS.wide.clickUrl).toContain("s=3889113");
    expect(DRACULA_AWIN_CAMPAIGNS.wide.impressionUrl).toContain("q=492097");
    expect(markup).toContain('data-campaign-id="3889113"');
    expect(markup).toContain('width="728"');
    expect(markup).toContain('height="90"');
    expect(markup).toContain("im Fließtext");
    expect(markup).toContain("Anzeige");
  });

  it("rendert das quadratische Dracula-Creative nativ mit AWIN-Campaign 3889111", () => {
    const markup = renderBanner("square");

    expect(markup).toContain("bwWmNznqUwumQWJP.jpg");
    expect(DRACULA_AWIN_CAMPAIGNS.square.clickUrl).toContain("s=3889111");
    expect(DRACULA_AWIN_CAMPAIGNS.square.impressionUrl).toContain("q=492097");
    expect(markup).toContain('data-campaign-id="3889111"');
    expect(markup).toContain('width="300"');
    expect(markup).toContain('height="250"');
    expect(markup).toContain("nach der Bildergalerie");
    expect(markup).toContain('loading="lazy"');
  });
});
