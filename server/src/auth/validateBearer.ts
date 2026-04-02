import * as jose from "jose";

const MIN_TOKEN_LENGTH = 32;

/**
 * Validates `Authorization: Bearer <token>` per Prompt 2, extended with Supabase HS256 JWT
 * when `SUPABASE_JWT_SECRET` is set (no shared secret in the CRA build).
 */
export async function validateBearerToken(rawToken: string): Promise<boolean> {
  if (rawToken.length < MIN_TOKEN_LENGTH) {
    return false;
  }

  const pdfSecret = process.env.PDF_API_SECRET;
  if (pdfSecret !== undefined && pdfSecret !== "" && rawToken === pdfSecret) {
    return true;
  }

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (jwtSecret !== undefined && jwtSecret !== "") {
    try {
      const key = new TextEncoder().encode(jwtSecret);
      await jose.jwtVerify(rawToken, key, { algorithms: ["HS256"] });
      return true;
    } catch {
      return false;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  console.warn(
    "pdf-server: development mode without PDF_API_SECRET or SUPABASE_JWT_SECRET; accepting bearer token by length only."
  );
  return true;
}
