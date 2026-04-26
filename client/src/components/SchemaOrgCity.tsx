/**
 * SchemaOrgCity – JSON-LD strukturierte Daten für Stadtdetailseiten
 * Typen: TouristDestination, ItemList (MusicEvent je Musical), BreadcrumbList
 */
import { useEffect } from "react";
import type { City, Musical } from "@/lib/data";

interface SchemaOrgCityProps {
  city: City;
  musicals: Musical[];
}

export default function SchemaOrgCity({ city, musicals }: SchemaOrgCityProps) {
  useEffect(() => {
    // Entferne vorherige JSON-LD Skripte dieser Seite
    document.querySelectorAll('script[data-schema-org-city]').forEach((el) => el.remove());

    const scripts: HTMLScriptElement[] = [];
    const origin = window.location.origin;
    const pageUrl = window.location.href;

    // 1. TouristDestination für die Stadt
    const touristSchema = {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: city.name,
      description: city.description,
      image: city.image,
      url: pageUrl,
      touristType: [
        { "@type": "Audience", audienceType: "Musical-Fans" },
        { "@type": "Audience", audienceType: "Theaterbesucher" },
      ],
      includesAttraction: musicals.map((musical) => ({
        "@type": "EntertainmentBusiness",
        name: musical.title,
        description: musical.description,
        image: musical.image,
        url: `${origin}/musical/${musical.slug}`,
      })),
    };

    const touristEl = document.createElement("script");
    touristEl.type = "application/ld+json";
    touristEl.setAttribute("data-schema-org-city", "tourist-destination");
    touristEl.textContent = JSON.stringify(touristSchema);
    document.head.appendChild(touristEl);
    scripts.push(touristEl);

    // 2. MusicEvent-Liste für alle Tourtermine in dieser Stadt
    const cityTourDates = musicals.flatMap((musical) =>
      (musical.tourDates || [])
        .filter((d) => d.city === city.name)
        .map((date, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
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
                addressLocality: city.name,
                addressCountry: "DE",
              },
            },
            performer: {
              "@type": "PerformingGroup",
              name: musical.title,
            },
            offers: {
              "@type": "Offer",
              url: date.eventimUrl,
              availability: "https://schema.org/InStock",
              validFrom: new Date().toISOString().split("T")[0],
            },
          },
        }))
    );

    if (cityTourDates.length > 0) {
      const eventListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Musicals in ${city.name} – Alle Termine`,
        itemListElement: cityTourDates,
      };

      const eventEl = document.createElement("script");
      eventEl.type = "application/ld+json";
      eventEl.setAttribute("data-schema-org-city", "music-events");
      eventEl.textContent = JSON.stringify(eventListSchema);
      document.head.appendChild(eventEl);
      scripts.push(eventEl);
    }

    // 3. BreadcrumbList
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "We Love Musicals",
          item: origin,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Musical-Städte",
          item: `${origin}/#staedte`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: city.name,
          item: pageUrl,
        },
      ],
    };

    const breadcrumbEl = document.createElement("script");
    breadcrumbEl.type = "application/ld+json";
    breadcrumbEl.setAttribute("data-schema-org-city", "breadcrumb");
    breadcrumbEl.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbEl);
    scripts.push(breadcrumbEl);

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [city, musicals]);

  return null;
}
