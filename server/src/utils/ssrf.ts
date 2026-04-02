import net from "net";

/**
 * SSRF defense: blocked patterns (see inline comments).
 * - Non-http(s) schemes (file:, javascript:, data:, gopher:, etc.)
 * - Literal private / loopback / link-local IPv4 and IPv6
 * - Hostnames that commonly resolve to cloud metadata or internal ranges
 * - Credentials in userinfo (@) to reduce parser confusion / redirects abuse
 */

const METADATA_HOST_SUBSTRINGS = ["metadata.google.internal", "metadata"];

/**
 * Returns true if hostname should be rejected before fetch (case-insensitive).
 */
function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) {
    return true;
  }
  if (METADATA_HOST_SUBSTRINGS.some((s) => h.includes(s))) {
    return true;
  }
  if (h.endsWith(".local") || h.endsWith(".internal")) {
    return true;
  }
  return false;
}

/**
 * True if IPv4 string is loopback, private, link-local, or unspecified.
 */
function isBlockedIpv4(ip: string): boolean {
  if (!net.isIPv4(ip)) {
    return false;
  }
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    return true;
  }
  const [a, b] = parts;
  if (a === 10) {
    return true;
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }
  if (a === 192 && b === 168) {
    return true;
  }
  if (a === 127) {
    return true;
  }
  if (a === 0) {
    return true;
  }
  if (a === 169 && b === 254) {
    return true;
  }
  return false;
}

/**
 * True if IPv6 is loopback, unique local, link-local, or unspecified.
 */
function isBlockedIpv6(ip: string): boolean {
  if (!net.isIPv6(ip)) {
    return false;
  }
  const lowered = ip.toLowerCase();
  if (lowered === "::" || lowered === "::1") {
    return true;
  }
  if (lowered.startsWith("fe80:") || lowered.startsWith("fc") || lowered.startsWith("fd")) {
    return true;
  }
  if (lowered.startsWith("::ffff:")) {
    const v4 = lowered.replace(/^::ffff:/, "");
    return isBlockedIpv4(v4);
  }
  return false;
}

export type UrlValidationFailure =
  | "invalid_url"
  | "unsupported_scheme"
  | "blocked_host"
  | "userinfo_not_allowed"
  | "fragment_not_allowed";

export type TargetUrlShapeOptions = {
  /** When true, `localhost` hostnames are allowed (dev allowlist is localhost). */
  permitLocalhostHostname: boolean;
  /**
   * When true, only scheme (http/https), non-empty host, no userinfo, and no fragment are enforced.
   * Use only with `PDF_RELAX_SECURITY` on trusted networks.
   */
  relaxed: boolean;
};

/**
 * Parse and reject dangerous target URLs before Puppeteer navigates.
 */
export function validateTargetUrlShape(
  parsed: URL,
  options: TargetUrlShapeOptions
): UrlValidationFailure | null {
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "unsupported_scheme";
  }
  if (parsed.username !== "" || parsed.password !== "") {
    return "userinfo_not_allowed";
  }
  if (parsed.hash !== "") {
    return "fragment_not_allowed";
  }
  const host = parsed.hostname;
  if (host === "") {
    return "invalid_url";
  }
  if (options.relaxed) {
    return null;
  }
  const localhostName =
    host.toLowerCase() === "localhost" || host.toLowerCase().endsWith(".localhost");
  const hostnameBlocked =
    isBlockedHostname(host) && !(localhostName && options.permitLocalhostHostname);
  if (hostnameBlocked) {
    return "blocked_host";
  }
  if (net.isIPv4(host) && isBlockedIpv4(host)) {
    return "blocked_host";
  }
  if (net.isIPv6(host) && isBlockedIpv6(host)) {
    return "blocked_host";
  }
  return null;
}

/**
 * Map internal failure codes to client-safe messages (no stack / internal detail).
 */
export function safeMessageForUrlFailure(code: UrlValidationFailure): string {
  switch (code) {
    case "invalid_url":
      return "Invalid target URL.";
    case "unsupported_scheme":
      return "Only http and https URLs are allowed.";
    case "blocked_host":
      return "Target host is not allowed.";
    case "userinfo_not_allowed":
      return "Target URL must not contain credentials.";
    case "fragment_not_allowed":
      return "Target URL must not contain a fragment.";
    default: {
      const _exhaustive: never = code;
      return _exhaustive;
    }
  }
}
