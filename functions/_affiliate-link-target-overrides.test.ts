import { describe, expect, it, vi } from "vitest";
import {
  deleteAffiliateLinkTargetOverride,
  getAffiliateLinkTargetOverrides,
  saveAffiliateLinkTargetOverride,
  type AffiliateLinkTargetOverrideInput,
} from "./_affiliate-link-target-overrides";

function databaseMock() {
  const run = vi.fn().mockResolvedValue({ success: true });
  const all = vi.fn().mockResolvedValue({ results: [{ musicalId: "tarzan", partner: "stage", placement: "ticket-box", targetUrl: "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408", updatedAt: "2026-10-03 15:00:00" }] });
  const bind = vi.fn().mockReturnValue({ run, all });
  const prepare = vi.fn().mockReturnValue({ bind });
  return { database: { prepare }, prepare, bind, run, all };
}

const input: AffiliateLinkTargetOverrideInput = {
  musicalId: "tarzan", partner: "stage", placement: "ticket-box",
  targetUrl: "https://visit.stage-entertainment.de/click?p=394206&a=3492604&g=26149408",
};

describe("Affiliate-Link-Zieloverride-Ablage", () => {
  it("speichert und entfernt nur eine exakte Fehlergruppenzuordnung", async () => {
    const mock = databaseMock();
    await expect(saveAffiliateLinkTargetOverride(mock.database as never, input)).resolves.toBe(true);
    await expect(deleteAffiliateLinkTargetOverride(mock.database as never, input)).resolves.toBe(true);
    expect(mock.bind).toHaveBeenNthCalledWith(1, input.musicalId, input.partner, input.placement, input.targetUrl);
    expect(mock.bind).toHaveBeenNthCalledWith(2, input.musicalId, input.partner, input.placement);
  });

  it("liefert nur genehmigte aktuelle Ziele ohne Ereignis- oder Besucherdaten", async () => {
    const mock = databaseMock();
    await expect(getAffiliateLinkTargetOverrides(mock.database as never)).resolves.toEqual([expect.objectContaining({ musicalId: "tarzan", partner: "stage", placement: "ticket-box" })]);
    expect(mock.prepare).toHaveBeenCalledWith(expect.stringContaining("target_url AS targetUrl"));
  });
});
