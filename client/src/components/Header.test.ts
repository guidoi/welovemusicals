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
  });
});
