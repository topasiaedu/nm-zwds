/**
 * Client helper: call the Render `server/` PDF microservice and save the PDF blob.
 * Requires `REACT_APP_PDF_SERVICE_URL` and a valid `Authorization` header (Supabase JWT recommended).
 */

/**
 * Origin for the print page URL that Puppeteer opens server-side.
 *
 * On Render, `http://localhost:3000` is the container itself, not your CRA dev server — you get
 * `ERR_CONNECTION_REFUSED`. When testing local UI against a remote PDF service, set
 * `REACT_APP_PDF_PRINT_ORIGIN` to your publicly reachable app URL (e.g. production).
 */
export function resolvePrintPageOrigin(): string {
  const fromEnv = process.env.REACT_APP_PDF_PRINT_ORIGIN?.trim() ?? "";
  if (fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin.length > 0) {
    return window.location.origin;
  }
  return "";
}

/**
 * Build the print URL the PDF service will open (allowlisted in `ALLOWED_PDF_ORIGIN`).
 */
export function buildPrintResultTargetUrl(
  appOrigin: string,
  profileId: string,
  pdfToken: string
): string {
  const trimmedOrigin = appOrigin.replace(/\/$/, "");
  const path = `/print/result/${encodeURIComponent(profileId)}`;
  const url = new URL(path, `${trimmedOrigin}/`);
  url.searchParams.set("pdfToken", pdfToken);
  return url.toString();
}

/**
 * POST `{ targetUrl }` to the pdf-server and trigger a file download in the browser.
 *
 * @param targetUrl - Full HTTPS (or dev http) URL the server will pass to Puppeteer.
 * @param getAuthHeader - Returns `Authorization` value (e.g. `Bearer <jwt>`) or null if unavailable.
 */
export async function exportPdfViaServer(
  targetUrl: string,
  getAuthHeader: () => Promise<string | null>,
  filename = "report.pdf"
): Promise<void> {
  const SERVER_REQUEST_TIMEOUT_MS = 120_000;
  const baseRaw = process.env.REACT_APP_PDF_SERVICE_URL;
  if (baseRaw === undefined || baseRaw === "") {
    throw new Error("REACT_APP_PDF_SERVICE_URL is not configured.");
  }

  const headerValue = await getAuthHeader();
  if (headerValue === null || headerValue === "") {
    throw new Error("Please sign in first so we can prepare your chart.");
  }

  const base = baseRaw.replace(/\/$/, "");
  const endpoint = `${base}/api/export-pdf`;

  const authorization = headerValue.startsWith("Bearer ")
    ? headerValue
    : `Bearer ${headerValue}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, SERVER_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({ targetUrl }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("PDF export timed out. Please try again in a moment.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const asJson: unknown = await response.json();
      if (
        typeof asJson === "object" &&
        asJson !== null &&
        "error" in asJson &&
        typeof (asJson as { error: unknown }).error === "string"
      ) {
        detail = (asJson as { error: string }).error;
      }
    } catch {
      detail = await response.text();
    }
    throw new Error(`We could not generate your chart download (${response.status}): ${detail}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
