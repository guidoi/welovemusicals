import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const documentHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

describe("Dokument-Zugänglichkeit", () => {
  it("beschränkt den Browser-Zoom nicht", () => {
    const viewport = documentHtml.match(/<meta\s+name="viewport"\s+content="([^"]+)"/i)?.[1] ?? "";

    expect(viewport).toContain("width=device-width");
    expect(viewport).not.toMatch(/maximum-scale\s*=/i);
    expect(viewport).not.toMatch(/user-scalable\s*=\s*no/i);
  });
});
