import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the ENV module before importing storage
vi.mock("./_core/env", () => ({
  ENV: {
    forgeApiUrl: "https://mock-forge.example.com",
    forgeApiKey: "mock-api-key-123",
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { storagePut, storageGet } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("storagePut", () => {
    it("uploads a file and returns key and url", async () => {
      const mockUrl = "https://cdn.example.com/test-file.png";
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockUrl }),
      });

      const result = await storagePut(
        "user-123/test-file.png",
        Buffer.from("fake-image-data"),
        "image/png"
      );

      expect(result.key).toBe("user-123/test-file.png");
      expect(result.url).toBe(mockUrl);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url.toString()).toContain("v1/storage/upload");
      expect(url.toString()).toContain("path=user-123%2Ftest-file.png");
      expect(options.method).toBe("POST");
      expect(options.headers.Authorization).toBe("Bearer mock-api-key-123");
    });

    it("throws on upload failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Server error",
      });

      await expect(
        storagePut("test.txt", "content", "text/plain")
      ).rejects.toThrow("Storage upload failed");
    });

    it("normalizes leading slashes in key", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://cdn.example.com/file.txt" }),
      });

      const result = await storagePut("///leading-slashes/file.txt", "data", "text/plain");
      expect(result.key).toBe("leading-slashes/file.txt");
    });
  });

  describe("storageGet", () => {
    it("returns a download URL for a given key", async () => {
      const mockDownloadUrl = "https://cdn.example.com/signed/test-file.png";
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockDownloadUrl }),
      });

      const result = await storageGet("user-123/test-file.png");

      expect(result.key).toBe("user-123/test-file.png");
      expect(result.url).toBe(mockDownloadUrl);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url.toString()).toContain("v1/storage/downloadUrl");
      expect(options.method).toBe("GET");
      expect(options.headers.Authorization).toBe("Bearer mock-api-key-123");
    });
  });
});
