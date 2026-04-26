/**
 * SchemaOrg – Komponente zum Einbetten von JSON-LD strukturierten Daten
 * Unterstützt: MusicEvent (Tourtermine), BreadcrumbList
 */
import { useEffect } from "react";
import type { Musical } from "@/lib/data";

interface SchemaOrgProps {
  musical: Musical;
}

export default function SchemaOrg({ musical }: SchemaOrgProps) {
  useEffect(() => {
    // Entferne vorherige JSON-LD Skripte dieser Seite
    document.querySelectorAll('script[data-schema-org]').forEach((el) => el.remove());

    const scripts: HTMLScriptElement[] = [];

    // 1. MusicEvent JSON-LD für jeden Tourtermin
    if (musical.tourDates && musical.tourDates.length > 0) {
      const events = musical.tourDates.map((date) => ({
        "@type": "MusicEvent",
        name: musical.title,
        description: musical.description,
        image: musical.image,
        url: date.eventimUrl,
        startDate: date.startDate,
        endDate: date.endDate,
        location: {
          "@type": "MusicVenue",
          name: date.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: date.city,
          },
        },
        performer: {
          "@type": "PerformingGroup",
          name: musical.title,
        },
        organizer: {
          "@type": "Organization",
          name: musical.provider,
        },
        offers: {
          "@type": "Offer",
          url: date.eventimUrl,
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString().split("T")[0],
        },
      }));

      const eventListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${musical.title} – Alle Tourtermine`,
        itemListElement: events.map((event, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: event,
        })),
      };

      const scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-schema-org", "music-events");
      scriptEl.textContent = JSON.stringify(eventListSchema);
      document.head.appendChild(scriptEl);
      scripts.push(scriptEl);
    }

    // 2. BreadcrumbList JSON-LD
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "We Love Musicals",
          item: window.location.origin,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Musicals",
          item: `${window.location.origin}/#musicals`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: musical.title,
          item: window.location.href,
        },
      ],
    };

    const breadcrumbEl = document.createElement("script");
    breadcrumbEl.type = "application/ld+json";
    breadcrumbEl.setAttribute("data-schema-org", "breadcrumb");
    breadcrumbEl.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbEl);
    scripts.push(breadcrumbEl);

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [musical]);

  return null;
}
