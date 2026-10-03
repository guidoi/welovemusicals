import { describe, expect, it } from "vitest";
import { getAffiliateLinkOverrideKey } from "./AffiliateLinkOverridesContext";

describe("AffiliateLinkOverridesContext", () => {
  it("trennt Overrides nach Musical, Partner und Platzierung", () => {
    expect(getAffiliateLinkOverrideKey({ musicalId: "tarzan", partner: "stage", placement: "ticket-box" }))
      .toBe("tarzan:stage:ticket-box");
    expect(getAffiliateLinkOverrideKey({ musicalId: "tarzan", partner: "stage", placement: "keyvisual" }))
      .not.toBe("tarzan:stage:ticket-box");
  });
});
