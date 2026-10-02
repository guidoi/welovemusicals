/**
 * SchemaOrg – ergänzt dynamische JSON-LD-Daten für clientseitige Navigation.
 * Die vollständigen, crawlerlesbaren Eventdaten werden beim Build bereits in die
 * kanonischen Detailseiten geschrieben; diese Komponente aktualisiert nur den
 * Preis im geöffneten Browser oder ergänzt Schema bei SPA-Navigation.
 */
import { useEffect } from "react";
import type { Musical } from "@/lib/data";
import { getMusicalCanonicalUrl, getMusicalEventSchemas, SITE_URL } from "@/lib/event-schema";

export { getCountryForCity } from "@/lib/event-schema";

interface SchemaOrgProps {
  musical: Musical;
}

export function getMusicalBreadcrumbItems(musical: Pick<Musical, "title" | "slug" | "id">) {
  const canonicalMusicalUrl = getMusicalCanonicalUrl(musical);

  return [
    {
      "@type": "ListItem",
      position: 1,
      name: "We Love Musicals",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Musicals & Shows",
      item: `${SITE_URL}/#musicals`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: musical.title,
      item: canonicalMusicalUrl,
    },
  ];
}

function isCurrentMusicalSchema(value: unknown, canonicalUrl: string): value is { "@graph": unknown[] } {
  if (!value || typeof value !== "object") return false;
  const graph = (value as { "@graph"?: unknown })["@graph"];
  return Array.isArray(graph) && JSON.stringify(value).includes(canonicalUrl);
}

function hasCurrentMusicalEventId(value: unknown, canonicalUrl: string): boolean {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as { "@id"?: unknown })["@id"] === "string" &&
    (value as { "@id": string })["@id"].startsWith(`${canonicalUrl}#event-`),
  );
}

export default function SchemaOrg({ musical }: SchemaOrgProps) {
  useEffect(() => {
    const canonicalUrl = getMusicalCanonicalUrl(musical);
    const events = getMusicalEventSchemas(musical, { priceFrom: musical.priceFrom });
    const staticSchemaElement = document.getElementById("site-schema") as HTMLScriptElement | null;

    // A directly opened, pre-rendered detail page already owns its graph. Replace
    // only its event objects with the price fetched from the public Sheets source.
    if (staticSchemaElement?.dataset.schemaPage === "musical") {
      try {
        const staticSchema = JSON.parse(staticSchemaElement.textContent || "{}") as unknown;
        if (isCurrentMusicalSchema(staticSchema, canonicalUrl)) {
          staticSchema["@graph"] = staticSchema["@graph"].filter(
            (entry) => !hasCurrentMusicalEventId(entry, canonicalUrl),
          );
          staticSchema["@graph"].push(...events);
          staticSchemaElement.textContent = JSON.stringify(staticSchema);
          return;
        }
      } catch {
        // The canonical static graph remains valid; SPA fallback below supplies fresh data.
      }
    }

    // SPA navigation from the overview has no pre-rendered route document. Add one
    // compact, first-party graph instead of changing any visible affiliate links.
    document.querySelectorAll('script[data-schema-org="musical-events"]').forEach((element) => element.remove());
    const eventScript = document.createElement("script");
    eventScript.type = "application/ld+json";
    eventScript.setAttribute("data-schema-org", "musical-events");
    eventScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        ...events,
        {
          "@type": "BreadcrumbList",
          itemListElement: getMusicalBreadcrumbItems(musical),
        },
      ],
    });
    document.head.appendChild(eventScript);

    return () => eventScript.remove();
  }, [musical]);

  return null;
}
