import { describe, expect, it, vi } from "vitest";
import { getAffiliateFallbackReport, recordAffiliateFallbackEvent, type D1DatabaseLike } from "./_affiliate-fallback-events";

function createDatabaseMock(results: unknown[][] = [[], []]) {
  const run = vi.fn().mockResolvedValue({ success: true });
  const all = vi.fn()
    .mockResolvedValueOnce({ results: results[0] })
    .mockResolvedValueOnce({ results: results[1] });
  const bind = vi.fn().mockReturnValue({ run, all });
  const prepare = vi.fn().mockReturnValue({ bind });
  return { database: { prepare } as unknown as D1DatabaseLike, prepare, bind, run, all };
}

describe("Affiliate-Fallback-Ereignisablage", () => {
  it("schreibt ausschließlich die vier freigegebenen technischen Dimensionen", async () => {
    const mock = createDatabaseMock();
    await expect(recordAffiliateFallbackEvent(mock.database, {
      musicalId: "koenig-der-loewen",
      partner: "stage",
      placement: "ticket-base",
      reason: "invalid-affiliate-parameters",
    })).resolves.toBe(true);

    expect(mock.prepare).toHaveBeenCalledWith(expect.stringContaining("musical_id, partner, placement, reason"));
    expect(mock.bind).toHaveBeenCalledWith("koenig-der-loewen", "stage", "ticket-base", "invalid-affiliate-parameters");
    expect(mock.run).toHaveBeenCalledOnce();
  });

  it("liefert nur aggregierte Gruppen für einen begrenzten Zeitraum", async () => {
    const mock = createDatabaseMock([[{ total: 3, last24Hours: 1, latestAt: "2026-10-03 12:00:00" }], [{ musicalId: "tarzan", partner: "stage", placement: "ticket-box", reason: "invalid-url", eventCount: 3, latestAt: "2026-10-03 12:00:00" }]]);
    const report = await getAffiliateFallbackReport(mock.database, 1000);

    expect(report).toEqual(expect.objectContaining({ periodDays: 365, summary: expect.objectContaining({ total: 3 }) }));
    expect(report?.rows).toHaveLength(1);
    expect(mock.bind).toHaveBeenCalledWith("-365 days");
  });

  it("bleibt ohne Datenbank fehlertolerant", async () => {
    await expect(recordAffiliateFallbackEvent(undefined, {
      musicalId: "tarzan", partner: "stage", placement: "keyvisual", reason: "invalid-url",
    })).resolves.toBe(false);
    await expect(getAffiliateFallbackReport(undefined, 30)).resolves.toBeUndefined();
  });
});
