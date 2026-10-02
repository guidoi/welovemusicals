/**
 * Legacy analytics endpoint guard.
 * The site no longer serves Umami from its own origin, therefore this path must
 * not fall through to the SPA shell or become a crawlable soft-404 response.
 */
export function onRequest(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
