import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Startseiten-LCP-Bild", () => {
  it("priorisiert das Hero-Bild und reserviert dessen Bildfläche", () => {
    expect(homeSource).toContain('fetchPriority="high"');
    expect(homeSource).toContain('decoding="sync"');
    expect(homeSource).toContain("width={676}");
    expect(homeSource).toContain("height={496}");
    expect(homeSource).not.toContain("loading=\"lazy\"");
  });
});
