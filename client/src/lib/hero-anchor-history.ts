export const HERO_ANCHOR_HISTORY_KEY = "hero-anchor-navigation";

type HistoryState = Record<string, unknown>;

function isHistoryState(value: unknown): value is HistoryState {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isHeroAnchorHistoryState(state: unknown): boolean {
  return isHistoryState(state) && state[HERO_ANCHOR_HISTORY_KEY] === true;
}

export function createHeroAnchorHistoryState(state: unknown, href: string): HistoryState {
  return {
    ...(isHistoryState(state) ? state : {}),
    [HERO_ANCHOR_HISTORY_KEY]: true,
    heroAnchor: href,
  };
}

export function getHeroAnchorHistoryAction(state: unknown): "push" | "replace" {
  return isHeroAnchorHistoryState(state) ? "replace" : "push";
}

export function shouldRestoreHomeHero(pathname: string, hash: string): boolean {
  return pathname === "/" && hash.length === 0;
}

export function getHomeHeroScrollOptions(): ScrollToOptions {
  return { top: 0, left: 0, behavior: "auto" };
}
