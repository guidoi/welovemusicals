import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./index.css", import.meta.url), "utf8");

describe("theater light shine", () => {
  it("lässt einen sichtbaren Lichtpunkt einmal am Buttonrand umlaufen und respektiert reduzierte Bewegung", () => {
    expect(styles).toContain(".theater-light-shine::after");
    expect(styles).toContain("@keyframes theater-light-shine");
    expect(styles).toContain("960ms cubic-bezier(0.23, 1, 0.32, 1) 1 both");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain(".theater-light-shine {\n  position: relative;");
    expect(styles).toContain("overflow-x: clip;");
    expect(styles).toContain("border-left-color: rgba(255, 255, 238, 0.98);");
    expect(styles).toContain("transform: rotate(360deg);");
  });
});
