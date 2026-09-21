import { serveCanonicalSeoRoute, type SeoStaticRouteContext } from "../_seo-static";

export function onRequest(context: SeoStaticRouteContext): Promise<Response> {
  return serveCanonicalSeoRoute(context, "stadt");
}
