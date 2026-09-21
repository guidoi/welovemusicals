export type StaticAssetFetcher = {
  fetch: (input: Request | URL | string) => Promise<Response>;
};

export type SeoStaticRouteContext = {
  request: Request;
  params: { slug?: string };
  env: { ASSETS: StaticAssetFetcher };
};

const PUBLIC_SLUG = /^[a-z0-9-]+$/;

/**
 * Serves a pre-rendered SEO document through the Pages ASSETS binding.
 * Pages otherwise redirects directory assets to a trailing slash before the
 * document is reached. A dynamic Function keeps the canonical, slashless URL
 * while returning the exact HTML asset with its native Content-Type header.
 */
export async function serveCanonicalSeoRoute(
  context: SeoStaticRouteContext,
  routeSegment: "stadt" | "musical",
): Promise<Response> {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const slug = context.params.slug;
  if (!slug || !PUBLIC_SLUG.test(slug)) {
    return new Response("Not Found", { status: 404 });
  }

  const targetUrl = new URL(`/${routeSegment}/${slug}/`, context.request.url);
  targetUrl.search = new URL(context.request.url).search;
  return context.env.ASSETS.fetch(targetUrl);
}
