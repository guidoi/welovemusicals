import type { AffiliateFallbackEnvironment, D1DatabaseLike } from "./_affiliate-fallback-events";
import type { AffiliateOverridePartner } from "./_affiliate-target-validation";

export type AffiliateLinkTargetOverrideKey = {
  musicalId: string;
  partner: AffiliateOverridePartner;
  placement: string;
};

export type AffiliateLinkTargetOverride = AffiliateLinkTargetOverrideKey & {
  targetUrl: string;
  updatedAt: string;
};

export type AffiliateLinkTargetOverrideInput = AffiliateLinkTargetOverrideKey & {
  targetUrl: string;
};

/** Returns only manually approved current targets; no visitor or event data is joined. */
export async function getAffiliateLinkTargetOverrides(
  database: D1DatabaseLike | undefined,
): Promise<AffiliateLinkTargetOverride[] | undefined> {
  if (!database) return undefined;

  const result = await database
    .prepare(
      `SELECT musical_id AS musicalId, partner, placement, target_url AS targetUrl, updated_at AS updatedAt
       FROM affiliate_link_target_overrides
       ORDER BY updated_at DESC
       LIMIT 200`,
    )
    .bind()
    .all<AffiliateLinkTargetOverride>();

  return result.results ?? [];
}

/** Upserts one approved manual target for the exact technical fallback group. */
export async function saveAffiliateLinkTargetOverride(
  database: D1DatabaseLike | undefined,
  input: AffiliateLinkTargetOverrideInput,
): Promise<boolean> {
  if (!database) return false;

  await database
    .prepare(
      `INSERT INTO affiliate_link_target_overrides (musical_id, partner, placement, target_url, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(musical_id, partner, placement)
       DO UPDATE SET target_url = excluded.target_url, updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(input.musicalId, input.partner, input.placement, input.targetUrl)
    .run();

  return true;
}

/** Removing an override immediately restores the catalog target at the affected placement. */
export async function deleteAffiliateLinkTargetOverride(
  database: D1DatabaseLike | undefined,
  key: AffiliateLinkTargetOverrideKey,
): Promise<boolean> {
  if (!database) return false;

  await database
    .prepare(
      `DELETE FROM affiliate_link_target_overrides
       WHERE musical_id = ? AND partner = ? AND placement = ?`,
    )
    .bind(key.musicalId, key.partner, key.placement)
    .run();

  return true;
}

export type AffiliateLinkTargetOverrideEnvironment = AffiliateFallbackEnvironment;
