import { describe, expect, it } from "vitest";
import { primaryNavigationItems } from "@/lib/header-navigation";

describe("Header-Hauptnavigation", () => {
  it("verwendet die abgestimmten Beschriftungen in Desktop- und Burger-Menü", () => {
    expect(primaryNavigationItems).toEqual([
      { label: "Alle Musicals", href: "/#musicals" },
      { label: "Städte & Termine", href: "/#staedte" },
    ]);
  });
});
