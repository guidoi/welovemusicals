import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { musicals, ZIZ_STAGE_TEXT_LINK_URL } from "@/lib/data";
import TourDates from "./TourDates";
import type { AovoCampaign } from "./AovoCampaignBanner";

vi.mock("@/components/AovoCampaignBanner", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./AovoCampaignBanner")>();
  return {
    ...actual,
    default: ({ campaign, sale }: { campaign: AovoCampaign; sale?: { discount: string } }) => (
      <aside data-campaign-id={campaign.groupId} data-discount={sale?.discount ?? ""}>Stuttgart-Anzeige</aside>
    ),
  };
});

const ziz = musicals.find((musical) => musical.id === "ziz")!;

describe("ZIZ-Spielzeitankündigung Stuttgart", () => {
  it("hinterlegt Preview und Premiere ohne erfundenes Spielzeitende oder Textlink", () => {
    expect(ziz.seasonAnnouncements).toEqual([{
      city: "Stuttgart",
      venue: "Stage Palladium Theater",
      startDate: "2027-10-05",
      premiereDate: "2027-10-12",
      displayLabel: "Ab Oktober 2027",
      note: expect.stringContaining("Der Vorverkauf läuft bereits"),
      campaignGroupId: "26229530",
    }]);
    expect(ziz.seasonAnnouncements?.[0]).not.toHaveProperty("endDate");
    expect(ziz.seasonAnnouncements?.[0]).not.toHaveProperty("eventimUrl");
    expect(ziz.tourDates?.[0]?.eventimUrl).toBe(ZIZ_STAGE_TEXT_LINK_URL);
  });

  it("zeigt die neue Spielzeit innerhalb von Spielorte & Termine und ohne Hamburg-Rabatt", () => {
    const markup = renderToStaticMarkup(<TourDates musicalId={ziz.id} tourDates={ziz.tourDates!} seasonAnnouncements={ziz.seasonAnnouncements} />);
    expect(markup).toContain("Spielorte &amp; Termine");
    expect(markup).toContain("Stage Operettenhaus");
    expect(markup).toContain("Stage Palladium Theater");
    expect(markup).toContain("Ab Oktober 2027");
    expect(markup).toContain("05.10.2027");
    expect(markup).toContain("12.10.2027");
    expect(markup).toContain('data-campaign-id="26229530" data-discount=""');
    expect(markup).toContain("Alle Städte (2)");
    expect(markup).not.toContain("BIS 40");
  });

  it("kann eine reine Spielzeitankündigung ohne falsche leere Terminmeldung darstellen", () => {
    const markup = renderToStaticMarkup(<TourDates musicalId={ziz.id} tourDates={[]} seasonAnnouncements={ziz.seasonAnnouncements} />);
    expect(markup).toContain("Stage Palladium Theater");
    expect(markup).not.toContain("Keine Termine für diese Stadt verfügbar");
  });
});
