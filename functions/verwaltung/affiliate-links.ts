type Context = {
  next: () => Promise<Response>;
};

/** The protected operational dashboard must never be indexed, even if Access is temporarily reconfigured. */
export async function onRequest(context: Context): Promise<Response> {
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "private, no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
