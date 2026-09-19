export type DiscoveryResultHint = {
  text: string;
  ariaLabel: string;
};

type DiscoveryResultHintInput = {
  count: number;
  hasNarrowingFilter: boolean;
  showCompleteCatalog: boolean;
};

/**
 * Keeps the result copy honest about the visitor's current discovery state.
 * “Passend” is reserved for a deliberately narrowed selection; the default
 * continuation is simply a collection of further shows.
 */
export function getDiscoveryResultHint({
  count,
  hasNarrowingFilter,
  showCompleteCatalog,
}: DiscoveryResultHintInput): DiscoveryResultHint {
  if (hasNarrowingFilter) {
    return count === 1
      ? {
          text: "Weiter unten findest du deinen passenden Show-Tipp.",
          ariaLabel: "Zum passenden Show-Tipp springen",
        }
      : {
          text: `Weiter unten findest du deine ${count} passenden Show-Tipps.`,
          ariaLabel: `Zu ${count} passenden Show-Tipps springen`,
        };
  }

  if (showCompleteCatalog) {
    return {
      text: `Weiter unten findest du alle ${count} Musicals & Shows.`,
      ariaLabel: `Zu allen ${count} Musicals und Shows springen`,
    };
  }

  return count === 1
    ? {
        text: "Weiter unten findest du eine weitere Show.",
        ariaLabel: "Zur weiteren Show springen",
      }
    : {
        text: `Weiter unten findest du ${count} weitere Musicals & Shows.`,
        ariaLabel: `Zu ${count} weiteren Musicals und Shows springen`,
      };
}
