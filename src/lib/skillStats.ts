/**
 * Read the canonical star count from a skill document.
 *
 * For migrated documents, `statsStars` (top-level) is the source of truth.
 * Falls back to `stats.stars` for pre-migration documents or `PublicSkill`
 * rows where the canonical value has already been normalized into `stats`.
 */
export function readCanonicalStars(skill: {
  stats?: { stars?: number | null } | null;
  statsStars?: number | null;
}): number {
  return typeof skill.statsStars === "number" ? skill.statsStars : (skill.stats?.stars ?? 0);
}
