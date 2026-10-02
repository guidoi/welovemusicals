export type StaticAssetFetcher = {
  fetch: (input: Request | URL | string) => Promise<Response>;
};

export type SeoStaticRouteContext = {
  request: Request;
  params: { slug?: string };
  env: { ASSETS: StaticAssetFetcher };
};

const PUBLIC_SLUG = /^[a-z0-9-]+$/;

const LEGACY_MUSICAL_REDIRECTS: Record<string, string> = {
  "and-julia": "und-julia",
  "der-teufel-traegt-prada": "der-teufel-traegt-prada-das-musical",
  "drei-haselnuesse": "drei-haselnuesse-fuer-aschenbroedel",
  eiskoenigin: "die-eiskoenigin",
  "mj-michael-jackson": "mj-das-michael-jackson-musical",
  "mj-musical": "mj-das-michael-jackson-musical",
  "phantom-der-oper-trinity": "phantom-der-oper",
  tarzan: "disneys-musical-tarzan",
  "teufel-traegt-prada": "der-teufel-traegt-prada-das-musical",
  ziz: "zurueck-in-die-zukunft-das-musical",
  "zurueck-in-die-zukunft": "zurueck-in-die-zukunft-das-musical",
};

const RETIRED_MUSICAL_SLUGS = new Set([
  "aladin",
  "bibi-tina",
  "cher-show",
  "da-vinci-code",
  "die-amme",
  "dschungelbuch",
  "elisabeth",
  "fitzek-einladung",
  "greatest-show",
  "grease",
  "hans-zimmer",
  "harry-potter",
  "kinky-boots",
  "mrs-doubtfire",
  "pretty-woman",
  "romeo-und-julia",
  "schneekoenigin",
  "sister-act",
  "we-will-rock-you",
  "weihnachtsbaeckerei",
]);

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

  if (routeSegment === "musical") {
    const canonicalSlug = LEGACY_MUSICAL_REDIRECTS[slug];
    if (canonicalSlug) {
      const redirectUrl = new URL(`/musical/${canonicalSlug}`, context.request.url);
      redirectUrl.search = new URL(context.request.url).search;
      return Response.redirect(redirectUrl, 301);
    }

    if (RETIRED_MUSICAL_SLUGS.has(slug)) {
      return new Response("Gone", { status: 410 });
    }
  }

  const targetUrl = new URL(`/${routeSegment}/${slug}/`, context.request.url);
  targetUrl.search = new URL(context.request.url).search;
  return context.env.ASSETS.fetch(targetUrl);
}
