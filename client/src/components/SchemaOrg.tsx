/**
 * SchemaOrg – Komponente zum Einbetten von JSON-LD strukturierten Daten
 * Unterstützt: MusicEvent (Tourtermine), Theater (ensuite), BreadcrumbList
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
    const pageUrl = `${BASE_URL}/musical/${musical.slug}`;

    // 1. MusicEvent JSON-LD für Tourtermine
    if (musical.tourDates && musical.tourDates.length > 0) {
      const events = musical.tourDates.map((date) => {
        const ticketUrl = date.eventimUrl || musical.eventimUrl;
        const offerObj: Record<string, unknown> = {
          "@type": "Offer",
          url: ticketUrl,
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString().split("T")[0],
          priceCurrency: "EUR",
        };
        if (musical.priceFrom) {
          offerObj.price = musical.priceFrom.replace(",", ".");
        }
        return {
          "@type": "MusicEvent",
          name: musical.title,
          description: musical.description,
          image: musical.image,
          url: pageUrl,
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
          offers: offerObj,
        };
      });

      const eventListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${musical.title} – Alle Termine`,
        url: pageUrl,
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
    } else if (musical.category === "ensuite" || (musical.categories && musical.categories.includes("fester-standort"))) {
      // Fester Standort ohne Tourtermine → Theater-Schema
      const theaterSchema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "TheaterEvent",
        name: musical.title,
        description: musical.description,
        image: musical.image,
        url: pageUrl,
        location: {
          "@type": "MusicVenue",
          name: musical.venue ?? musical.city,
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
      };
      if (musical.priceFrom) {
        theaterSchema.offers = {
          "@type": "Offer",
          url: musical.eventimUrl,
          priceCurrency: "EUR",
          price: musical.priceFrom.replace(",", "."),
          availability: "https://schema.org/InStock",
        };
      }

      const theaterEl = document.createElement("script");
      theaterEl.type = "application/ld+json";
      theaterEl.setAttribute("data-schema-org", "theater-event");
      theaterEl.textContent = JSON.stringify(theaterSchema);
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
          item: pageUrl,
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
