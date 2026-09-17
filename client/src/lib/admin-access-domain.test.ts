import { describe, expect, it } from "vitest";
import { getAdminAccessRedirect, getAdminApiOrigin } from "./admin-access-domain";

describe("getAdminAccessRedirect", () => {
  it("leitet die Verwaltung der Custom-Domain auf die serverfähige Projekt-Domain um", () => {
    expect(
      getAdminAccessRedirect({
        hostname: "welovemusicals.com",
        origin: "https://welovemusicals.com",
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
        origin: "https://welovemusicals.manus.space",
        pathname: "/verwaltung/preise",
        search: "",
        hash: "",
      }),
    ).toBeNull();
  });

  it("nutzt für die Anmeldung der Custom-Domain die serverfähige Projekt-Domain", () => {
    expect(
      getAdminApiOrigin({
        hostname: "welovemusicals.com",
        origin: "https://welovemusicals.com",
        pathname: "/verwaltung/preise",
        search: "",
        hash: "",
      }),
    ).toBe("https://welovemusicals.manus.space");
  });
});
