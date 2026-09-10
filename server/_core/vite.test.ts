import { describe, expect, it } from "vitest";
import { HTML_DOCUMENT_CACHE_CONTROL } from "./vite";

describe("HTML-App-Shell-Cache", () => {
  it("liefert das HTML ohne Langzeit-Cache aus", () => {
    expect(HTML_DOCUMENT_CACHE_CONTROL).toBe("no-store, max-age=0, must-revalidate");
  });
});
