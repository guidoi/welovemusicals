import { describe, expect, it } from "vitest";
import { onRequest } from "./umami";

describe("legacy Umami route", () => {
  it("liefert einen nicht indexierbaren 404-Status statt der SPA-Startseite", async () => {
    const response = onRequest();

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    await expect(response.text()).resolves.toBe("Not Found");
  });
});
