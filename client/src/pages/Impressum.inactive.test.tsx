import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";
import { ACTIVE_MUSICAL_IDS } from "@/lib/data";
import Impressum from "./Impressum";

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/hooks/useSEO", () => ({ useSEO: () => undefined }));
vi.mock("wouter", () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("Impressum – temporär inaktive Bildnachweise", () => {
  it("blendet Tarzan öffentlich aus, ohne den archivierten Nachweis zu löschen", () => {
    expect(ACTIVE_MUSICAL_IDS).not.toContain("tarzan");
    const markup = renderToStaticMarkup(<Impressum />);
    expect(markup).not.toContain("DISNEYS MUSICAL TARZAN");
    expect(markup).toContain("MJ – DAS MICHAEL JACKSON MUSICAL");
    expect(markup).toContain("Stage Entertainment über TradeDoubler");
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Impressum.tsx"), "utf8");
    expect(source).toContain("DISNEYS MUSICAL TARZAN");
    expect(source).toContain("© Johan Persson / Stage Entertainment");
  });

  it("zeigt den unveränderten Tarzan-Nachweis bei späterer Reaktivierung wieder an", () => {
    ACTIVE_MUSICAL_IDS.push("tarzan");
    try {
      expect(renderToStaticMarkup(<Impressum />)).toContain("DISNEYS MUSICAL TARZAN");
    } finally {
      ACTIVE_MUSICAL_IDS.splice(ACTIVE_MUSICAL_IDS.lastIndexOf("tarzan"), 1);
    }
  });
});
