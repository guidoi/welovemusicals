export function didRouteChange(previousLocation: string | null, nextLocation: string): boolean {
  return previousLocation !== null && previousLocation !== nextLocation;
}

export function getScrollToTopOptions(): ScrollToOptions {
  return { top: 0, left: 0, behavior: "auto" };
}
