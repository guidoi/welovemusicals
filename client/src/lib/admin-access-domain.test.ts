import { describe, expect, it } from "vitest";
import { getAdminAccessRedirect } from "./admin-access-domain";

describe("getAdminAccessRedirect", () => {
  it("leitet die Verwaltung der Custom-Domain auf die serverfähige Projekt-Domain um", () => {
    expect(
      getAdminAccessRedirect({
        hostname: "welovemusicals.com",
        pathname: "/verwaltung/preise",
        search: "?source=bookmark",
        hash: "",
      }),
    ).toBe("https://welovemusicals.manus.space/verwaltung/preise?source=bookmark");
  });

  it("belässt die Verwaltung auf der Projekt-Domain", () => {
    expect(
      getAdminAccessRedirect({
        hostname: "welovemusicals.manus.space",
        pathname: "/verwaltung/preise",
        search: "",
        hash: "",
      }),
    ).toBeNull();
  });
});
