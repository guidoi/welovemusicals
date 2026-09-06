import { describe, expect, it } from "vitest";
import { getMusicalBreadcrumbItems } from "./SchemaOrg";
import { getCityBreadcrumbItems } from "./SchemaOrgCity";

describe("Schema.org Breadcrumb-Bezeichnungen", () => {
  it("nennt die zentrale Musicalübersicht einheitlich Alle Musicals", () => {
    const breadcrumbs = getMusicalBreadcrumbItems({
      id: "tarzan",
      slug: "tarzan",
      title: "DISNEYS TARZAN",
    });

    expect(breadcrumbs[1]).toMatchObject({
      name: "Alle Musicals",
      item: "https://welovemusicals.com/#musicals",
    });
  });

  it("nennt die zentrale Stadtübersicht einheitlich Städte & Termine", () => {
    const breadcrumbs = getCityBreadcrumbItems({ name: "Hamburg", slug: "hamburg" });

    expect(breadcrumbs[1]).toMatchObject({
      name: "Städte & Termine",
      item: "https://welovemusicals.com/#staedte",
    });
  });
});
