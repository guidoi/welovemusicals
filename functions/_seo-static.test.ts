import { describe, expect, it, vi } from "vitest";
import { serveCanonicalSeoRoute } from "./_seo-static";

describe("serveCanonicalSeoRoute", () => {
  it("liefert das Stadtseiten-HTML unter der kanonischen URL über die Assets-Bindung", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("<html>Hamburg</html>", {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    }));

    const response = await serveCanonicalSeoRoute({
      request: new Request("https://welovemusicals.com/stadt/hamburg?utm_source=test"),
      params: { slug: "hamburg" },
      env: { ASSETS: { fetch } },
    }, "stadt");

    expect(fetch).toHaveBeenCalledWith(expect.objectContaining({
      href: "https://welovemusicals.com/stadt/hamburg/?utm_source=test",
    }));
    expect(response.headers.get("Content-Type")).toContain("text/html");
    expect(await response.text()).toBe("<html>Hamburg</html>");
  });

  it("verhindert ungültige Slugs und andere HTTP-Methoden", async () => {
    const fetch = vi.fn();
    const invalidSlug = await serveCanonicalSeoRoute({
      request: new Request("https://welovemusicals.com/musical/not valid"),
      params: { slug: "not valid" },
      env: { ASSETS: { fetch } },
    }, "musical");
    const post = await serveCanonicalSeoRoute({
      request: new Request("https://welovemusicals.com/musical/mj-musical", { method: "POST" }),
      params: { slug: "mj-musical" },
      env: { ASSETS: { fetch } },
    }, "musical");

    expect(invalidSlug.status).toBe(404);
    expect(post.status).toBe(405);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("leitet frühere Musical-Aliasse dauerhaft auf die kanonische Route um", async () => {
    const fetch = vi.fn();
    const response = await serveCanonicalSeoRoute({
      request: new Request("https://welovemusicals.com/musical/eiskoenigin?utm_source=legacy"),
      params: { slug: "eiskoenigin" },
      env: { ASSETS: { fetch } },
    }, "musical");

    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(
      "https://welovemusicals.com/musical/die-eiskoenigin?utm_source=legacy",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("liefert für endgültig entfernte Musicalseiten den Status 410", async () => {
    const fetch = vi.fn();
    const response = await serveCanonicalSeoRoute({
      request: new Request("https://welovemusicals.com/musical/sister-act"),
      params: { slug: "sister-act" },
      env: { ASSETS: { fetch } },
    }, "musical");

    expect(response.status).toBe(410);
    expect(fetch).not.toHaveBeenCalled();
  });
});
