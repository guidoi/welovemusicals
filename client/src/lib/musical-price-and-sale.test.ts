import { describe, expect, it } from "vitest";
import { musicals } from "./data";
import { isSaleActive } from "./sale";

const findMusical = (id: string) => musicals.find((musical) => musical.id === id);

describe("aktuelle Musicalpreise und Sale-Störer", () => {
  it("hinterlegt die vorgegebenen Einstiegspreise zentral", () => {
    expect(findMusical("eiskoenigin")?.priceFrom).toBe("39,99");
    expect(findMusical("koenig-der-loewen")?.priceFrom).toBe("63,99");
    expect(findMusical("tarzan")?.priceFrom).toBe("66,99");
    expect(findMusical("mj-musical")?.priceFrom).toBe("56,99");
    expect(findMusical("ziz")?.priceFrom).toBe("44,79");
    expect(findMusical("tanz-der-vampire")?.priceFrom).toBe("49,99");
    expect(findMusical("starlight-express")?.priceFrom).toBe("31");
    expect(findMusical("und-julia")?.priceFrom).toBe("49,99");
    expect(findMusical("teufel-traegt-prada")?.priceFrom).toBe("46,99");
  });

  it("zeigt Tarzan mit bis 15 Prozent und Salon Rosie mit zwei für eins als aktive Sale-Störer", () => {
    const now = new Date("2026-09-13T12:00:00");

    expect(findMusical("tarzan")?.sale).toMatchObject({ discount: "BIS 15 %" });
    expect(findMusical("salon-rosie")?.sale).toMatchObject({ discount: "2 FÜR 1" });
    expect(isSaleActive(findMusical("tarzan")?.sale, now)).toBe(true);
    expect(isSaleActive(findMusical("salon-rosie")?.sale, now)).toBe(true);
  });

  it("liefert MJ bereits vor dem Google-Sheets-Abruf ohne überholten Sale-Fallback aus", () => {
    expect(findMusical("mj-musical")?.sale).toBeUndefined();
  });
});
