import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cityDetailSource = readFileSync(new URL("./CityDetail.tsx", import.meta.url), "utf8");

describe("CityDetail travel partner visibility", () => {
  it("zeigt Hotelpartner nur, wenn Stadtseiten-Reiseflächen ausdrücklich freigegeben sind", () => {
    expect(cityDetailSource).toContain('import { SHOW_CITY_HOTEL_SECTIONS } from "@/lib/hotel-experience";');
    expect(cityDetailSource).toContain("{SHOW_CITY_HOTEL_SECTIONS && (");
    expect(cityDetailSource).toContain("{SHOW_CITY_HOTEL_SECTIONS && <TicketsAndHotel city={city} />}");
  });
});
