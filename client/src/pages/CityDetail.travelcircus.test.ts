import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cityDetailSource = readFileSync(new URL("./CityDetail.tsx", import.meta.url), "utf8");
const prerenderSource = readFileSync(
  new URL("../../../scripts/prerender-seo-routes.ts", import.meta.url),
  "utf8",
);

const removedCityGuideTokens = ["getCityGuide", "city-guide-heading", "guideContent", "cityGuide"];

describe("CityDetail Travelcircus-Stadtseitenintegration", () => {
  it("entfernt die bisherige cityGuide-Sequenz aus beiden Stadtseiten-Renderern", () => {
    for (const source of [cityDetailSource, prerenderSource]) {
      for (const token of removedCityGuideTokens) {
        expect(source, `unerwartetes Legacy-Token: ${token}`).not.toContain(token);
      }
    }
  });

  it("zeigt die identische KDL-TravelcircusBox ausschließlich auf der Hamburg-Stadtseite", () => {
    expect(cityDetailSource).toContain(
      'import TravelcircusOfferBox from "@/components/TravelcircusOfferBox";',
    );
    expect(cityDetailSource).toContain(
      'import { KDL_TRAVELCIRCUS_OFFER } from "@/lib/travelcircus-offers";',
    );
    expect(cityDetailSource).toContain('{city.slug === "hamburg" && (');
    expect(cityDetailSource).toContain('data-testid="city-travelcircus-section"');
    expect(cityDetailSource).toContain(
      "<TravelcircusOfferBox offer={KDL_TRAVELCIRCUS_OFFER} />",
    );

    expect(prerenderSource).toContain(
      'import TravelcircusOfferBox from "../client/src/components/TravelcircusOfferBox";',
    );
    expect(prerenderSource).toContain('const travelOfferContent = city.slug === "hamburg"');
    expect(prerenderSource).toContain(
      "renderToStaticMarkup(createElement(TravelcircusOfferBox, { offer: KDL_TRAVELCIRCUS_OFFER }))",
    );
  });

  it("behält die wesentlichen CityDetail-Bereiche und Freigabeflags bei", () => {
    expect(cityDetailSource).toContain("getActiveMusicalsByCity");
    expect(cityDetailSource).toContain('id="programm"');
    expect(cityDetailSource).toContain("Termine & Spielstätten");
    expect(cityDetailSource).toContain("Weitere Musical-Städte");
    expect(cityDetailSource).toContain("useSEO({");
    expect(cityDetailSource).toContain("getCitySeo");
    expect(cityDetailSource).toContain("SHOW_CITY_HOTEL_SECTIONS");
    expect(cityDetailSource).toContain("TicketsAndHotel city={city}");
  });
});
