import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Startseiten-Filteroberfläche", () => {
  it("verbindet den mobilen Filterauslöser und das geöffnete Panel als abgerundete Einheit", () => {
    expect(homeSource).toContain('showFilters ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"');
    expect(homeSource).toContain('showFilters ? "rounded-t-none rounded-b-2xl border-t-0" : "rounded-2xl"');
  });
});
