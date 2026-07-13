import type { Profile } from "../../../context/ProfileContext";

/**
 * Select the account-owner profile (`is_self`) used by Alignment Advantage.
 * One per account is expected; if duplicates exist, prefer the newest
 * `created_at`, then higher `id` for a stable tie-break.
 */
export function selectAccountOwnerProfile(
  profiles: ReadonlyArray<Profile>
): Profile | null {
  const selfProfiles = profiles.filter((profile) => profile.is_self === true);
  if (selfProfiles.length === 0) {
    return null;
  }
  if (selfProfiles.length === 1) {
    return selfProfiles[0];
  }

  const sorted = [...selfProfiles].sort((a, b) => {
    const timeA = Date.parse(a.created_at ?? "");
    const timeB = Date.parse(b.created_at ?? "");
    const safeA = Number.isFinite(timeA) ? timeA : 0;
    const safeB = Number.isFinite(timeB) ? timeB : 0;
    if (safeB !== safeA) {
      return safeB - safeA;
    }
    return b.id.localeCompare(a.id);
  });

  return sorted[0] ?? null;
}
