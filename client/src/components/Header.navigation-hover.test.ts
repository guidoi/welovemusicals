import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/components/Header.tsx", "utf8");
const css = readFileSync("client/src/components/Header.navigation.css", "utf8");

describe("Dezenter Header-Farbwechsel ohne Unterstrich", () => {
  it("behält den ursprünglichen Gold-Farbwechsel nur an den Hauptnavigationslinks", () => {
    expect(source).toContain('import "./Header.navigation.css";');
    expect(source.match(/className="header-navigation-link /g)).toHaveLength(2);
    expect(source.match(/hover:text-gold focus-visible:text-gold transition-colors duration-200/g)).toHaveLength(2);
    expect(source).toContain("href={item.href}");
    expect(source).toContain("handleAnchorClick(e, item.href)");
  });

  it("entfernt dekorative Unterstriche und zusätzliche Bewegungen vollständig", () => {
    expect(css).not.toContain("::after");
    expect(css).not.toContain("::before");
    expect(css).not.toContain("transform:");
    expect(css).not.toContain("content:");
    expect(css).not.toContain("background-color:");
    expect(css).not.toContain("text-decoration:");
    expect(css).not.toMatch(/(?:padding|margin|font-size|font-weight|letter-spacing)\s*:/);
  });

  it("erhält unmittelbaren Tastaturfokus und berücksichtigt reduzierte Bewegung", () => {
    expect(css).toContain(".header-navigation-link:focus-visible {");
    expect(css).toContain("outline: 2px solid currentColor;");
    expect(css).toContain("outline-offset: 4px;");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("transition: none;");
  });

  it("belässt Headerposition, Höhe und nahezu schwarze Deckfläche unverändert", () => {
    expect(source).toContain('className="fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-[#111111]"');
    expect(source).toContain('className="container flex items-center justify-between h-16 md:h-20"');
    expect(css).not.toMatch(/(?:^|\n)\s*(?:header|body|html|a|nav)\s*\{/);
    expect(css).not.toContain("width:");
    expect(css).not.toContain("height:");
  });
});
