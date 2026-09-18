import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./index.css", import.meta.url), "utf8");

describe("theater light shine", () => {
  it("lässt den Lichtreflex nur einmal laufen und respektiert reduzierte Bewegung", () => {
    expect(styles).toContain(".theater-light-shine::after");
    expect(styles).toContain("@keyframes theater-light-shine");
    expect(styles).toContain("640ms cubic-bezier(0.23, 1, 0.32, 1) 1 both");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain(".theater-light-shine {\n  position: relative;");
    expect(styles).toContain("overflow-x: clip;");
  });
});
