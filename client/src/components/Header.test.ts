import { describe, expect, it } from "vitest";
import { primaryNavigationItems } from "@/lib/header-navigation";

describe("Header-Hauptnavigation", () => {
  it("verwendet die abgestimmten Beschriftungen in Desktop- und Burger-Menü", () => {
    expect(primaryNavigationItems).toEqual([
      { label: "Musicals & Shows", href: "/#musicals" },
      { label: "Städte", href: "/#staedte" },
    ]);
  });
});
