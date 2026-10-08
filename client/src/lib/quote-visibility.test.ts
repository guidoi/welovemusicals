import { describe, expect, it } from "vitest";
import { musicals } from "./data";

describe("Sichtbarkeit von Stimmen zur Show", () => {
  it("zeigt ohne nachprüfbare Fundstellen katalogweit keine Stimmen zur Show", () => {
    expect(musicals.filter((musical) => musical.quotes?.length)).toEqual([]);
  });
});
