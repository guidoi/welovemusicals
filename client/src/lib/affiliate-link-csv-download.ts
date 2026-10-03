export type CsvDownloadEnvironment = {
  fetch: typeof fetch;
  createObjectUrl: (blob: Blob) => string;
  revokeObjectUrl: (url: string) => void;
  createAnchor: () => HTMLAnchorElement;
  appendAnchor: (anchor: HTMLAnchorElement) => void;
  removeAnchor: (anchor: HTMLAnchorElement) => void;
};

export function getCsvDownloadFilename(response: Response): string {
  const header = response.headers.get("content-disposition") ?? "";
  const match = header.match(/filename="?([^";]+)"?/i);
  const filename = match?.[1]?.trim() || "affiliate-link-fallbacks.csv";

  // Only preserve a simple server-provided filename; never let a header construct a path.
  return filename.endsWith(".csv") && !/[\\/]/.test(filename)
    ? filename
    : "affiliate-link-fallbacks.csv";
}

function getDefaultEnvironment(): CsvDownloadEnvironment {
  return {
    fetch: window.fetch.bind(window),
    createObjectUrl: URL.createObjectURL.bind(URL),
    revokeObjectUrl: URL.revokeObjectURL.bind(URL),
    createAnchor: () => document.createElement("a"),
    appendAnchor: (anchor) => document.body.appendChild(anchor),
    removeAnchor: (anchor) => anchor.remove(),
  };
}

/**
 * Fetches the protected report before triggering a download. A calling UI can
 * therefore show success only after a valid CSV response and Blob were received.
 */
export async function downloadAffiliateFallbackCsv(
  url: string,
  environment: CsvDownloadEnvironment = getDefaultEnvironment(),
): Promise<string> {
  const response = await environment.fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) throw new Error("Der CSV-Export konnte nicht erstellt werden.");
  if (!response.headers.get("content-type")?.toLowerCase().includes("text/csv")) {
    throw new Error("Die Exportantwort ist keine CSV-Datei.");
  }

  const blob = await response.blob();
  if (blob.size === 0) throw new Error("Die Exportdatei ist leer.");

  const filename = getCsvDownloadFilename(response);
  const objectUrl = environment.createObjectUrl(blob);
  const anchor = environment.createAnchor();
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.hidden = true;
  environment.appendAnchor(anchor);
  anchor.click();
  environment.removeAnchor(anchor);
  environment.revokeObjectUrl(objectUrl);

  return filename;
}
