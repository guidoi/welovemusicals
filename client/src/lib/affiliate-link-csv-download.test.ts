import { describe, expect, it, vi } from "vitest";
import { downloadAffiliateFallbackCsv, getCsvDownloadFilename, type CsvDownloadEnvironment } from "./affiliate-link-csv-download";

function createEnvironment(response: Response) {
  const anchor = {
    href: "",
    download: "",
    hidden: false,
    click: vi.fn(),
  } as unknown as HTMLAnchorElement;
  const environment: CsvDownloadEnvironment = {
    fetch: vi.fn().mockResolvedValue(response) as unknown as typeof fetch,
    createObjectUrl: vi.fn().mockReturnValue("blob:affiliate-export"),
    revokeObjectUrl: vi.fn(),
    createAnchor: vi.fn().mockReturnValue(anchor),
    appendAnchor: vi.fn(),
    removeAnchor: vi.fn(),
  };
  return { environment, anchor };
}

describe("Affiliate-Fallback-CSV-Download", () => {
  it("lädt erst nach einer gültigen CSV-Antwort herunter und liefert den Dateinamen", async () => {
    const response = new Response("Spalte;Wert\r\ntarzan;2\r\n", {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="affiliate-link-fallbacks-30-tage.csv"',
      },
    });
    const { environment, anchor } = createEnvironment(response);

    await expect(downloadAffiliateFallbackCsv("/api/admin/affiliate-link-fallback-events?days=30&format=csv", environment))
      .resolves.toBe("affiliate-link-fallbacks-30-tage.csv");

    expect(environment.fetch).toHaveBeenCalledWith(
      "/api/admin/affiliate-link-fallback-events?days=30&format=csv",
      { cache: "no-store", credentials: "same-origin" },
    );
    expect(anchor.download).toBe("affiliate-link-fallbacks-30-tage.csv");
    expect(anchor.click).toHaveBeenCalledOnce();
    expect(environment.revokeObjectUrl).toHaveBeenCalledWith("blob:affiliate-export");
  });

  it("meldet einen Fehler statt einer Erfolgsmeldung bei ungültiger Antwort", async () => {
    const { environment, anchor } = createEnvironment(new Response("<html>Access</html>", {
      status: 200,
      headers: { "content-type": "text/html" },
    }));

    await expect(downloadAffiliateFallbackCsv("/api/admin/affiliate-link-fallback-events?format=csv", environment))
      .rejects.toThrow("keine CSV-Datei");
    expect(anchor.click).not.toHaveBeenCalled();
  });

  it("akzeptiert ausschließlich sichere CSV-Dateinamen aus dem Response-Header", () => {
    expect(getCsvDownloadFilename(new Response("", { headers: { "content-disposition": 'attachment; filename="report.csv"' } }))).toBe("report.csv");
    expect(getCsvDownloadFilename(new Response("", { headers: { "content-disposition": 'attachment; filename="../report.csv"' } }))).toBe("affiliate-link-fallbacks.csv");
  });
});
