import { describe, expect, it } from "vitest";
import { ACTIVE_MUSICAL_IDS, getActiveMusicals, musicals } from "./data";

describe("aktiver Musicalkatalog", () => {
  it("zeigt Wir sind am Leben und entfernt We Will Rock You nach Spielzeitende", () => {
    const activeIds = getActiveMusicals(musicals).map((musical) => musical.id);

    expect(ACTIVE_MUSICAL_IDS).toContain("wir-sind-am-leben");
    expect(ACTIVE_MUSICAL_IDS).not.toContain("we-will-rock-you");
    expect(activeIds).toContain("wir-sind-am-leben");
    expect(activeIds).not.toContain("we-will-rock-you");
  });
});
