import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/components/Header.tsx", "utf8");
const css = readFileSync("client/src/components/Header.navigation.css", "utf8");

describe("Dezente Header-Navigationsinteraktion", () => {
  it("bindet den Effekt nur an die beiden Hauptnavigations-Renderpfade", () => {
    expect(source).toContain('import "./Header.navigation.css";');
    expect(source.match(/className="header-navigation-link /g)).toHaveLength(2);
    expect(source.match(/hover:text-gold focus-visible:text-gold transition-colors duration-200/g)).toHaveLength(2);
    expect(source).toContain("href={item.href}");
    expect(source).toContain("handleAnchorClick(e, item.href)");
  });

  it("verwendet einen absoluten feinen Unterstrich statt Layoutverschiebungen", () => {
    expect(css).toContain(".header-navigation-link::after");
    expect(css).toContain("position: absolute;");
    expect(css).toContain("pointer-events: none;");
    expect(css).toContain("height: 1px;");
    expect(css).toContain("background-color: currentColor;");
    expect(css).toContain("opacity: 0;");
    expect(css).toContain("transform: scaleX(0.65);");
    expect(css).toContain("transform: scaleX(1);");
    expect(css).toContain("180ms");
    expect(css).not.toMatch(/(?:padding|margin|font-size|font-weight|letter-spacing)\s*:/);
  });

  it("beschränkt animiertes Hover auf geeignete Mauszeiger und hält Tastaturfokus unmittelbar sichtbar", () => {
    expect(css).toContain("@media (hover: hover) and (pointer: fine)");
    expect(css).toContain(".header-navigation-link:focus-visible {");
    expect(css).toContain("outline: 2px solid currentColor;");
    expect(css).toContain("outline-offset: 4px;");
    expect(css).toContain(".header-navigation-link:focus-visible::after {");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("transition: none;");
  });

  it("belässt Headerposition, Höhe und nahezu schwarze Deckfläche unverändert", () => {
    expect(source).toContain('className="fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-[#111111]"');
    expect(source).toContain('className="container flex items-center justify-between h-16 md:h-20"');
    expect(css).not.toMatch(/(?:^|\n)\s*(?:header|body|html|a|nav)\s*\{/);
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("width: 3rem;");
  });
});
