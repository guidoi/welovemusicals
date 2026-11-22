import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./BlackSaleNotice.tsx", import.meta.url), "utf8");
const indexCss = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("BLACK SALE – kompakte Desktopdarstellung", () => {
  it("zentriert den Störer ab Desktop und begrenzt ihn auf 40 Prozent der bisherigen Containerbreite", () => {
    expect(source).toContain("lg:mx-auto lg:w-[40%]");
    expect(source).toContain("lg:flex-col lg:gap-3 lg:text-center");
    expect(source).toContain("flex w-full items-center justify-center gap-3");
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

  it("nutzt für das Label den Logo-Rot-Token und erhält seine Größe und Breite", () => {
    expect(indexCss).toContain("--color-red: rgb(239, 68, 68);");
    expect(source).toContain("bg-red px-6 py-3 text-2xl font-bold tracking-[0.1em] text-white sm:text-3xl");
    expect(source).toContain("inline-flex min-h-12 items-center justify-center rounded-sm");
    expect(source).not.toContain("bg-red-800");
  });

  it("behält volle Mobilbreite, Desktopbreite, Abstände und Touchziel trotz Rahmenlichtern", () => {
    expect(source).toContain("relative mb-7 w-full rounded-xl border border-gold/45 bg-black px-4 py-4 text-white sm:px-5 lg:mx-auto lg:w-[40%]");
    expect(source).toContain("min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-gold px-5 py-3");
    expect(source).toContain("focus-visible:ring-offset-black active:scale-[0.97] md:w-auto");
    const frameRule = indexCss.match(/\.black-sale-notice-frame\s*\{([^}]+)\}/)?.[1];
    expect(frameRule).toContain("position: absolute;");
    expect(frameRule).toContain("inset: 0;");
    expect(frameRule).toContain("overflow: hidden;");
    expect(frameRule).toContain("border-radius: inherit;");
    const noticeRule = indexCss.match(/\.black-sale-notice\s*\{([^}]+)\}/)?.[1];
    expect(noticeRule).not.toMatch(/width|height|padding|margin|overflow|animation/);
    expect(indexCss).toContain("left: clamp(4px, var(--black-sale-light-x), calc(100% - 4px));");
    expect(indexCss).toContain("top: clamp(4px, var(--black-sale-light-y), calc(100% - 4px));");
  });

  it("zentriert Label, Angebotszeile, Bedingungen und CTA auch mobil bis 767px", () => {
    expect(source).toContain('data-testid="black-sale-content" className="flex flex-col gap-3 text-center md:flex-row');
    expect(source).toContain('className="flex flex-col items-center gap-3"');
    expect(source).toContain('data-testid="black-sale-offer-line" className="flex w-full items-center justify-center gap-3"');
    expect(source).not.toContain("items-start");
    expect(source).not.toContain("sm:flex-row");
    expect(source).not.toContain("sm:w-auto");
    expect(source).toContain("min-h-11 w-full shrink-0 items-center justify-center");
    expect(source).toContain("md:w-auto");
  });
});
