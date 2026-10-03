import { serveCanonicalStaticPage, type SeoStaticRouteContext } from "./_seo-static";

export function onRequest(context: Omit<SeoStaticRouteContext, "params">): Promise<Response> {
  return serveCanonicalStaticPage(context, "impressum");
}
