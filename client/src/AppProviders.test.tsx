import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppProviders } from "./AppProviders";

describe("AppProviders", () => {
  it("rendert tRPC innerhalb des React-Query-Kontexts ohne Invalid-Hook-Call", () => {
    expect(() =>
      renderToString(
        <AppProviders>
          <main>Provider bereit</main>
        </AppProviders>,
      ),
    ).not.toThrow();
  });
});
