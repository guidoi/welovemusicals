export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

import { getAdminApiOrigin } from "@/lib/admin-access-domain";

// The server owns OAuth configuration so production does not depend on build-time browser env values.
export const getLoginUrl = () => {
  const returnTo = window.location.pathname.startsWith("/verwaltung/")
    ? window.location.pathname
    : "/";
  return `${getAdminApiOrigin(window.location)}/api/oauth/login?returnTo=${encodeURIComponent(returnTo)}`;
};
