import { describe, expect, it } from "vitest";
import { getMusicalBreadcrumbItems } from "./SchemaOrg";
import { getCityBreadcrumbItems, getCityCollectionPageSchema } from "./SchemaOrgCity";

describe("Schema.org Breadcrumb-Bezeichnungen", () => {
  it("nennt die zentrale Musicalübersicht einheitlich Musicals & Shows", () => {
    const breadcrumbs = getMusicalBreadcrumbItems({
      id: "tarzan",
      slug: "tarzan",
      title: "DISNEYS TARZAN",
    });

    expect(breadcrumbs[1]).toMatchObject({
      name: "Musicals & Shows",
      item: "https://welovemusicals.com/#musicals",
    });
  });

  it("nennt die zentrale Stadtübersicht einheitlich Städte", () => {
    const breadcrumbs = getCityBreadcrumbItems({ name: "Hamburg", slug: "hamburg" });

    expect(breadcrumbs[1]).toMatchObject({
      name: "Städte",
      item: "https://welovemusicals.com/#staedte",
    });
  });

  it("zeichnet Stadtseiten als aktuelle, eigenständige Musical-Sammlungen aus", () => {
    const schema = getCityCollectionPageSchema(
      {
        slug: "hamburg",
        name: "Hamburg",
        image: "https://example.com/hamburg.jpg",
        description: "Musicalstadt mit großen Theatern.",
        musicalCount: 1,
        hotelSearchUrl: "https://example.com/hotels",
      },
      [
        {
          id: "moulinrouge",
          slug: "moulin-rouge",
          title: "MOULIN ROUGE!",
          provider: "ATG Entertainment",
          category: "ensuite",
          description: "Musical in Hamburg.",
          image: "https://example.com/moulin.jpg",
          eventimUrl: "https://example.com/tickets",
          tags: ["Pop", "Show", "Hamburg"],
        },
      ],
    );

    expect(schema).toMatchObject({
      "@type": "CollectionPage",
      name: "Musicals in Hamburg 2026/2027: Termine & Tickets | We Love Musicals",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 1,
      },
    });
    expect(schema.primaryImageOfPage).toMatchObject({
      contentUrl: "https://example.com/hamburg.jpg",
    });
  });
});
