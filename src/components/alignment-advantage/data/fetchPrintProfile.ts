import type { Profile } from "../../../context/ProfileContext";
import { selectAccountOwnerProfile } from "./selectAccountOwnerProfile";

/**
 * Decode the JWT `sub` claim (user id) without verifying the signature.
 * Used only to scope the PostgREST query the same way ProfileContext does.
 */
function getUserIdFromAccessToken(accessToken: string): string | null {
  const parts = accessToken.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (normalized.length % 4)) % 4;
    const padded = `${normalized}${"=".repeat(padLen)}`;
    const json = atob(padded);
    const payload = JSON.parse(json) as { sub?: unknown };
    return typeof payload.sub === "string" && payload.sub !== ""
      ? payload.sub
      : null;
  } catch {
    return null;
  }
}

/**
 * Fetch the account-owner (`is_self`) profile for the authenticated user (print/PDF).
 * Must filter by `user_id` — RLS may still expose other rows for `is_self=eq.true`
 * alone, which previously returned a different account's chart.
 */
export async function fetchPrintProfile(bearerToken: string): Promise<Profile | null> {
  const base = process.env.REACT_APP_SUPABASE_URL ?? "";
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";
  if (base === "" || key === "") {
    return null;
  }

  const userId = getUserIdFromAccessToken(bearerToken);
  if (userId === null) {
    return null;
  }

  const params = new URLSearchParams({
    user_id: `eq.${userId}`,
    is_self: "eq.true",
    select: "*",
    order: "created_at.desc,id.desc",
  });
  const url = `${base}/rest/v1/profiles?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const rows = (await response.json()) as Profile[];
  return selectAccountOwnerProfile(rows);
}
