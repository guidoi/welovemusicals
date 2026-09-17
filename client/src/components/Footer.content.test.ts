import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(new URL("./Footer.tsx", import.meta.url), "utf8");

describe("Footer-Kontrast", () => {
  it("gibt Informationslinks und Copyright-Zeile in weißer, gut lesbarer Schrift aus", () => {
    expect(footerSource).toContain('className="text-sm text-white/90 hover:text-gold transition-colors"');
    expect(footerSource).toContain('className="text-left text-sm text-white/90 transition-colors hover:text-gold"');
    expect(footerSource).toContain('className="text-xs text-white/90"');
    expect(footerSource).toContain('className="text-xs text-white/90 flex items-center gap-1"');
  });
});
