import type { Profile } from "../../../context/ProfileContext";

/**
 * Fetch the `is_self` profile for the authenticated user (print/PDF path).
 */
export async function fetchPrintProfile(bearerToken: string): Promise<Profile | null> {
  const base = process.env.REACT_APP_SUPABASE_URL ?? "";
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";
  if (base === "" || key === "") return null;

  const url = `${base}/rest/v1/profiles?is_self=eq.true&select=*&limit=1`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Profile[];
  return rows.length > 0 ? rows[0] : null;
}
