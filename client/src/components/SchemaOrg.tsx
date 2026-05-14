/**
 * SchemaOrg – Komponente zum Einbetten von JSON-LD strukturierten Daten
 * Unterstützt: MusicEvent / TheaterEvent (Tourtermine + ensuite), BreadcrumbList
 */
import { useEffect } from "react";
import type { Musical } from "@/lib/data";

const BASE_URL = "https://welovemusicals.com";

interface SchemaOrgProps {
  musical: Musical;
}

export default function SchemaOrg({ musical }: SchemaOrgProps) {
  useEffect(() => {
    // Entferne vorherige JSON-LD Skripte dieser Seite
    document.querySelectorAll('script[data-schema-org]').forEach((el) => el.remove());

    const scripts: HTMLScriptElement[] = [];
    const canonicalMusicalUrl = `${BASE_URL}/musical/${musical.slug || musical.id}`;

    // 1a. MusicEvent JSON-LD für Tourtermine
    if (musical.tourDates && musical.tourDates.length > 0) {
      const events = musical.tourDates.map((date) => {
        const event: Record<string, unknown> = {
          "@type": "MusicEvent",
          name: musical.title,
          description: musical.description,
          image: musical.image,
          url: date.eventimUrl || canonicalMusicalUrl,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          startDate: date.startDate,
          ...(date.endDate ? { endDate: date.endDate } : {}),
          location: {
            "@type": "MusicVenue",
            name: date.venue,
            address: {
              "@type": "PostalAddress",
              addressLocality: date.city,
              addressCountry: "DE",
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
            url: date.eventimUrl || canonicalMusicalUrl,
            priceCurrency: "EUR",
            ...(musical.priceFrom ? { price: musical.priceFrom } : {}),
            availability: "https://schema.org/InStock",
            validFrom: new Date().toISOString().split("T")[0],
          },
        };
        return event;
      });

      // Jedes Tourtermin-Event als eigenständiges JSON-LD ausgeben (besser für Google Rich Results)
      events.forEach((event, idx) => {
        const eventSchema = {
          "@context": "https://schema.org",
          ...event,
        };
        const scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.setAttribute("data-schema-org", `music-event-${idx}`);
        scriptEl.textContent = JSON.stringify(eventSchema);
        document.head.appendChild(scriptEl);
        scripts.push(scriptEl);
      });
    }

    // 1b. TheaterEvent für ensuite-Musicals mit festem Standort
    if (
      (musical.category === "ensuite" || musical.categories?.includes("fester-standort")) &&
      musical.city &&
      musical.venue
    ) {
      // startDate/endDate aus tourDates ableiten (frühestes/spätestes Datum)
      let theaterStartDate: string | undefined;
      let theaterEndDate: string | undefined;
      if (musical.tourDates && musical.tourDates.length > 0) {
        const starts = musical.tourDates.map((d) => d.startDate).filter(Boolean).sort();
        const ends = musical.tourDates.map((d) => d.endDate).filter(Boolean).sort();
        if (starts.length > 0) theaterStartDate = starts[0];
        if (ends.length > 0) theaterEndDate = ends[ends.length - 1];
      }

      const theaterEvent = {
        "@context": "https://schema.org",
        "@type": "TheaterEvent",
        name: musical.title,
        description: musical.description,
        image: musical.image,
        url: canonicalMusicalUrl,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        ...(theaterStartDate ? { startDate: theaterStartDate } : {}),
        ...(theaterEndDate ? { endDate: theaterEndDate } : {}),
        location: {
          "@type": "PerformingArtsTheater",
          name: musical.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: musical.city,
            addressCountry: "DE",
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
          url: musical.ticketCtaUrl || canonicalMusicalUrl,
          priceCurrency: "EUR",
          ...(musical.priceFrom ? { price: musical.priceFrom } : {}),
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString().split("T")[0],
        },
      };

      const theaterEl = document.createElement("script");
      theaterEl.type = "application/ld+json";
      theaterEl.setAttribute("data-schema-org", "theater-event");
      theaterEl.textContent = JSON.stringify(theaterEvent);
      document.head.appendChild(theaterEl);
      scripts.push(theaterEl);
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
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Musicals",
          item: `${BASE_URL}/#musicals`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: musical.title,
          item: canonicalMusicalUrl,
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
