export function didRouteChange(previousLocation: string | null, nextLocation: string): boolean {
  return previousLocation !== null && previousLocation !== nextLocation;
}

export function getScrollToTopOptions(): ScrollToOptions {
  return { top: 0, left: 0, behavior: "auto" };
}

export function resetScrollToTop(scrollTo: (options: ScrollToOptions) => void): void {
  scrollTo(getScrollToTopOptions());
}

export interface ScrollResetScheduler {
  requestFrame: (callback: () => void) => number;
  cancelFrame: (frameId: number) => void;
  setDelay: (callback: () => void, delay: number) => number;
  clearDelay: (timeoutId: number) => void;
}

export function scheduleScrollToTop(
  scrollTo: (options: ScrollToOptions) => void,
  scheduler: ScrollResetScheduler,
): () => void {
  resetScrollToTop(scrollTo);
  const frameId = scheduler.requestFrame(() => resetScrollToTop(scrollTo));
  const timeoutId = scheduler.setDelay(() => resetScrollToTop(scrollTo), 120);

  return () => {
    scheduler.cancelFrame(frameId);
    scheduler.clearDelay(timeoutId);
  };
}
