/**
 * SchemaOrg – Komponente zum Einbetten von JSON-LD strukturierten Daten
 * Unterstützt: MusicEvent / TheaterEvent (Tourtermine + ensuite), BreadcrumbList
 */
import { useEffect } from "react";
import type { Musical } from "@/lib/data";

const BASE_URL = "https://welovemusicals.manus.space";

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
          startDate: date.startDate,
          endDate: date.endDate,
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

    // 1b. TheaterEvent für ensuite-Musicals mit festem Standort
    if (
      (musical.category === "ensuite" || musical.categories?.includes("fester-standort")) &&
      musical.city &&
      musical.venue
    ) {
      const theaterEvent = {
        "@context": "https://schema.org",
        "@type": "TheaterEvent",
        name: musical.title,
        description: musical.description,
        image: musical.image,
        url: canonicalMusicalUrl,
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
