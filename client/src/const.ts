export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// The server owns OAuth configuration so production does not depend on build-time browser env values.
export const getLoginUrl = () => {
  const returnTo = window.location.pathname.startsWith("/verwaltung/")
    ? window.location.pathname
    : "/";
  return `${window.location.origin}/api/oauth/login?returnTo=${encodeURIComponent(returnTo)}`;
};
