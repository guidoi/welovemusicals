import { afterEach, describe, expect, it, vi } from "vitest";

describe("Storage-Proxy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("liefert ein gespeichertes Bild über den Projekt-Ursprung statt über eine externe Umleitung aus", async () => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example/");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ url: "https://assets.example/mj.jpg" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "content-type": "image/jpeg" },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const { registerStorageProxy } = await import("./storageProxy");
    let handler: ((req: unknown, res: unknown) => Promise<void>) | undefined;
    registerStorageProxy({ get: vi.fn((_path, registeredHandler) => { handler = registeredHandler; }) } as never);

    const response = {
      set: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      redirect: vi.fn(),
    };

    await handler?.({ params: { 0: "mj-stage-salesweek-26180466-300x250_5c11a628.jpg" } }, response);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(response.set).toHaveBeenCalledWith(expect.objectContaining({
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    }));
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(Buffer.from([1, 2, 3]));
    expect(response.redirect).not.toHaveBeenCalled();
  });
});
