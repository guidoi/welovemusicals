import { describe, expect, it } from "vitest";
import { HOME_HERO_ALT, HOME_HERO_IMAGE } from "./home-hero";

describe("Startseiten-Hero", () => {
  it("verwendet das König-der-Löwen-Motiv mit Rafiki rechts vor der Sonne", () => {
    expect(HOME_HERO_IMAGE).toBe("/images/kdl/KDL_HH_Prio1_Rafiki_(c)StageEntertainment-1.jpg");
    expect(HOME_HERO_ALT).toContain("Rafiki");
    expect(HOME_HERO_ALT).toContain("Savannensonne");
  });
});
