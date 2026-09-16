const ADMIN_PROJECT_ORIGIN = "https://welovemusicals.manus.space";
const CUSTOM_ADMIN_HOSTS = new Set(["welovemusicals.com", "www.welovemusicals.com"]);

type BrowserLocation = Pick<Location, "hostname" | "pathname" | "search" | "hash">;

/**
 * The public custom domain is served as a static marketing site and cannot
 * proxy the protected API routes. Keep the management UI on its server-capable
 * project domain so sign-in and data mutations use one stable origin.
 */
export function getAdminAccessRedirect(location: BrowserLocation): string | null {
  if (!CUSTOM_ADMIN_HOSTS.has(location.hostname)) return null;

  return new URL(
    `${location.pathname}${location.search}${location.hash}`,
    ADMIN_PROJECT_ORIGIN,
  ).toString();
}
