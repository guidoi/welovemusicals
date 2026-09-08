import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const impressumSource = readFileSync(resolve(process.cwd(), "client/src/pages/Impressum.tsx"), "utf8");

describe("Impressum – Affiliate-Transparenz", () => {
  it("nennt TradeDoubler und die Publisher-ID für Stage Entertainment", () => {
    expect(impressumSource).toContain("Stage Entertainment über TradeDoubler");
    expect(impressumSource).toContain("Publisher-ID 2475512");
  });
});
