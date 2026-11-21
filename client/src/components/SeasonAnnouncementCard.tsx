import React from "react";
import type { MusicalSeasonAnnouncement } from "@/lib/data";
import AovoCampaignBanner, { getAovoCampaigns } from "@/components/AovoCampaignBanner";

export default function SeasonAnnouncementCard({
  announcement,
  musicalId,
}: {
  announcement: MusicalSeasonAnnouncement;
  musicalId: string;
}) {
  const campaign = getAovoCampaigns(musicalId).find(
    (item) => item.groupId === announcement.campaignGroupId && item.placement === "within-season-announcement",
  );

  return (
    <article className="rounded-lg border border-gold/40 bg-card p-5 text-card-foreground" data-season-city={announcement.city}>
      <div className="grid items-start gap-5 sm:grid-cols-[1fr_300px]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">Neue Spielzeit · Vorverkauf gestartet</p>
          <h3 className="mb-1 font-heading text-lg font-bold uppercase tracking-widest">{announcement.city}</h3>
          <p className="mb-3 text-sm font-medium text-white">{announcement.venue}</p>
          <p className="mb-3 text-base font-semibold text-gold">{announcement.displayLabel}</p>
          <p className="text-sm leading-relaxed text-white">{announcement.note}</p>
        </div>
        {/* Kein musical.sale: Das Hamburger Rabattangebot darf nicht auf die neue Spielzeit übertragen werden. */}
        {campaign && <AovoCampaignBanner campaign={campaign} />}
      </div>
    </article>
  );
}
