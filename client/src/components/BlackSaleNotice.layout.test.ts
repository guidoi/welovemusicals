import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./BlackSaleNotice.tsx", import.meta.url), "utf8");

describe("BLACK SALE – kompakte Desktopdarstellung", () => {
  it("zentriert den Störer ab Desktop und begrenzt ihn auf 40 Prozent der bisherigen Containerbreite", () => {
    expect(source).toContain("lg:mx-auto lg:w-[40%]");
    expect(source).toContain("lg:flex-col lg:gap-3 lg:text-center");
    expect(source).toContain("lg:justify-center");
    expect(source).not.toContain(" w-[40%]");
    expect(source).not.toContain("md:w-[40%]");
  });

  it("erhält den Aktionsfilterbutton, lesbare weiße Texte und mindestens 44px Touchhöhe", () => {
    expect(source).toContain('onClick={onViewShows}');
    expect(source).toContain('data-testid="black-sale-view-shows"');
    expect(source).toContain("min-h-11");
    expect(source).toContain("text-white");
    expect(source).toContain("Ausgewählte Shows und Vorstellungen; Bedingungen beim Anbieter");
  });
});
