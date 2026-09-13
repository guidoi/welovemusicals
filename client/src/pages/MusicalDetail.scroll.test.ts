import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const musicalDetailSource = readFileSync(new URL("./MusicalDetail.tsx", import.meta.url), "utf8");

describe("MusicalDetail scroll reset", () => {
  it("uses the shared scheduled reset whenever the musical slug changes", () => {
    expect(musicalDetailSource).toContain('import { scheduleScrollToTop } from "@/lib/route-scroll"');
    expect(musicalDetailSource).toContain("useLayoutEffect(() => {");
    expect(musicalDetailSource).toContain("return scheduleScrollToTop(");
    expect(musicalDetailSource).toContain("}, [slug]);");
  });
});
