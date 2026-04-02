/**
 * Opt-in relaxed mode for small / private deployments (LAN, single-user, local dev).
 * When enabled, rate limiting, strict URL allowlists, and heavy SSRF hostname rules are reduced;
 * CORS is permissive and Bearer auth is optional.
 */
function parseTruthyEnv(value: string | undefined): boolean {
  if (value === undefined || value === "") {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

/**
 * Returns true when `PDF_RELAX_SECURITY` is set to a truthy value.
 */
export function isPdfRelaxedSecurity(): boolean {
  return parseTruthyEnv(process.env.PDF_RELAX_SECURITY);
}
