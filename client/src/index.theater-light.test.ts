import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("./index.css", import.meta.url), "utf8");

describe("theater light shine", () => {
  it("lässt einen deutlich sichtbaren Lichtpunkt einmal am Buttonrand umlaufen und respektiert reduzierte Bewegung", () => {
    expect(styles).toContain(".theater-light-shine::before");
    expect(styles).toContain("@keyframes theater-light-shine");
    expect(styles).toContain("2200ms cubic-bezier(0.22, 0.61, 0.36, 1) 1 both");
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain(".theater-light-shine {\n  position: relative;");
    expect(styles).toContain("overflow-x: clip;");
    expect(styles).toContain("background: #fffdf2;");
    expect(styles).toContain("0 0 20px 7px rgba(225, 166, 38, 0.55)");
    expect(styles).toContain("top: calc(100% - 2px); left: 50%; opacity: 1;");
  });
});
