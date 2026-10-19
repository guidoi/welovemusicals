import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { primaryNavigationItems } from "@/lib/header-navigation";

describe("Header-Hauptnavigation", () => {
  it("verwendet die abgestimmten Beschriftungen in Desktop- und Burger-Menü", () => {
    expect(primaryNavigationItems).toEqual([
      { label: "Musicals & Shows", href: "/#musicals" },
      { label: "Städte", href: "/#staedte" },
    ]);
  });

  it("bezeichnet die Geo-Suche als Musicals und Shows in der Nähe", () => {
    const headerSource = readFileSync(
      "client/src/components/Header.tsx",
      "utf8",
    );

    expect(headerSource).toContain("Musicals &amp; Shows in deiner Nähe");
    expect(headerSource).toContain("PLZ eingeben oder Standort verwenden");
    expect(headerSource).not.toContain("5-stellig DE · 4-stellig AT/CH");
  });

  it("stellt die mobile Umkreissuche mit großen Bedienelementen und separatem Standortbutton dar", () => {
    const headerSource = readFileSync(
      "client/src/components/Header.tsx",
      "utf8",
    );

    expect(headerSource).toContain('text-base font-semibold text-foreground md:text-sm');
    expect(headerSource).toContain('py-3.5 pl-12 pr-11 text-base');
    expect(headerSource).toContain("Meinen Standort verwenden");
    expect(headerSource).toContain('className="mb-5 flex w-full items-center justify-center gap-2');
    expect(headerSource).toContain('min-h-10 rounded-sm border px-3 text-sm');
    expect(headerSource).toContain("Finden");
  });

  it("verwendet für die Kopfbereich-Werkzeuge kompakte runde Icon-Buttons", () => {
    const headerSource = readFileSync(
      "client/src/components/Header.tsx",
      "utf8",
    );

    expect(headerSource).toContain("roundUtilityButtonClass");
    expect(headerSource).toContain("h-9 w-9 items-center justify-center rounded-full");
    expect(headerSource).toContain('data-testid="header-location-control"');
    expect(headerSource).toContain('data-testid="header-search-control"');
    expect(headerSource).toContain('data-testid="header-location-control-mobile"');
    expect(headerSource).toContain('data-testid="header-search-control-mobile"');
    expect(headerSource).toContain('data-testid="header-menu-control-mobile"');
    expect(headerSource).toContain('plzActive || plzOpen ? "border-gold bg-gold text-background hover:bg-gold-light"');
  });

  it("hält Logo und Burger-Menü auch auf der Startseite mobil dauerhaft fixiert", () => {
    const headerSource = readFileSync(
      "client/src/components/Header.tsx",
      "utf8",
    );

    expect(headerSource).not.toContain("staticOnMobile");
    expect(headerSource).toContain('className="fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-background/80 backdrop-blur-xl"');
  });
});
