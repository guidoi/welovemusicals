import React, { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { getLoginUrl } from "./const";

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

function redirectToLoginIfUnauthorized(error: unknown) {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;
  if (error.message !== UNAUTHED_ERR_MSG) return;

  window.location.href = getLoginUrl();
}

/**
 * Public Pages API calls must not pick up a stale cookie-specific cache variant.
 * Same-origin retains the local Express authentication flow while leaving public
 * price and sale requests independent from cross-origin session cookies.
 */
export function trpcFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return globalThis.fetch(input, {
    ...(init ?? {}),
    credentials: "same-origin",
  });
}

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.query.state.error);
    console.error("[API Query Error]", event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    redirectToLoginIfUnauthorized(event.mutation.state.error);
    console.error("[API Mutation Error]", event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch: trpcFetch,
    }),
  ],
});

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
