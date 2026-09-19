import { describe, expect, it } from "vitest";
import { getDiscoveryResultHint } from "./discovery-result-hint";

describe("getDiscoveryResultHint", () => {
  it("bezeichnet die ungefilterte Fortsetzung als weitere Shows", () => {
    expect(getDiscoveryResultHint({ count: 11, hasNarrowingFilter: false, showCompleteCatalog: false })).toEqual({
      text: "Weiter unten findest du 11 weitere Musicals & Shows.",
      beforeCount: "Weiter unten findest du",
      afterCount: "weitere Musicals & Shows.",
      count: 11,
      ariaLabel: "Zu 11 weiteren Musicals und Shows springen",
    });
  });

  it("bezeichnet die vollständige Übersicht als alle Shows", () => {
    expect(getDiscoveryResultHint({ count: 20, hasNarrowingFilter: false, showCompleteCatalog: true })).toEqual({
      text: "Weiter unten findest du alle 20 Musicals & Shows.",
      beforeCount: "Weiter unten findest du alle",
      afterCount: "Musicals & Shows.",
      count: 20,
      ariaLabel: "Zu allen 20 Musicals und Shows springen",
    });
  });

  it("verwendet passend nur für eine aktive Auswahl", () => {
    expect(getDiscoveryResultHint({ count: 4, hasNarrowingFilter: true, showCompleteCatalog: true })).toEqual({
      text: "Weiter unten findest du deine 4 passenden Show-Tipps.",
      beforeCount: "Weiter unten findest du deine",
      afterCount: "passenden Show-Tipps.",
      count: 4,
      ariaLabel: "Zu 4 passenden Show-Tipps springen",
    });
  });
});
