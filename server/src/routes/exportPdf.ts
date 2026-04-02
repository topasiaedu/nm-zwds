import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { isPdfRelaxedSecurity } from "../config/pdfSecurity.js";
import { pdfExportRateLimiter } from "../middleware/pdfRateLimit.js";
import {
  safeMessageForUrlFailure,
  validateTargetUrlShape,
} from "../utils/ssrf.js";
import { PdfTimeoutError, renderPdfFromUrl } from "../pdf/renderPdf.js";

const DEV_FALLBACK_ORIGIN = "http://localhost:3000";

export const exportPdfRouter = Router();

type ExportBody = {
  targetUrl?: unknown;
};

/**
 * Extract Bearer token from Authorization header.
 */
function readBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header === undefined || typeof header !== "string") {
    return null;
  }
  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) {
    return null;
  }
  const token = header.slice(prefix.length).trim();
  return token === "" ? null : token;
}

/**
 * Resolve allowed URL prefix for targetUrl (allowlist).
 * Relaxed mode: no prefix check.
 * Production: ALLOWED_PDF_ORIGIN required → 503 if missing.
 * Non-production: if missing, log warning and allow only DEV_FALLBACK_ORIGIN.
 */
function resolveAllowedOriginPrefix(
  relaxed: boolean
): { ok: true; prefix: string } | { ok: false; status: 503 } | { ok: true; prefix: null } {
  if (relaxed) {
    return { ok: true, prefix: null };
  }

  const configured = process.env.ALLOWED_PDF_ORIGIN;
  const isProd = process.env.NODE_ENV === "production";

  if (configured !== undefined && configured !== "") {
    return { ok: true, prefix: configured };
  }

  if (isProd) {
    console.error("pdf-server: ALLOWED_PDF_ORIGIN is required in production.");
    return { ok: false, status: 503 };
  }

  console.warn(
    `pdf-server: ALLOWED_PDF_ORIGIN unset; allowing only URLs starting with ${DEV_FALLBACK_ORIGIN} (development).`
  );
  return { ok: true, prefix: DEV_FALLBACK_ORIGIN };
}

const noopRateLimit = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};

/**
 * POST /api/export-pdf — validates request, then renders PDF via Puppeteer.
 */
exportPdfRouter.post(
  "/export-pdf",
  isPdfRelaxedSecurity() ? noopRateLimit : pdfExportRateLimiter,
  async (req: Request, res: Response) => {
  const relaxed = isPdfRelaxedSecurity();
  void readBearerToken(req); // Keep header parsing for future observability; auth is intentionally disabled.

  const body = req.body as ExportBody;
  if (body === null || typeof body !== "object") {
    res.status(400).json({ error: "Expected JSON body." });
    return;
  }

  const targetUrlRaw = body.targetUrl;
  if (typeof targetUrlRaw !== "string" || targetUrlRaw.trim() === "") {
    res.status(400).json({ error: "Field targetUrl must be a non-empty string." });
    return;
  }

  const targetWithoutHash = targetUrlRaw.trim().split("#")[0];

  let parsed: URL;
  try {
    parsed = new URL(targetWithoutHash);
  } catch {
    res.status(400).json({ error: "Invalid target URL." });
    return;
  }

  const allow = resolveAllowedOriginPrefix(relaxed);
  if (!allow.ok) {
    res.status(allow.status).json({ error: "PDF service is not configured." });
    return;
  }

  const shapeError = validateTargetUrlShape(parsed, {
    permitLocalhostHostname: allow.prefix === DEV_FALLBACK_ORIGIN,
    relaxed,
  });
  if (shapeError !== null) {
    res.status(400).json({ error: safeMessageForUrlFailure(shapeError) });
    return;
  }

  const normalizedTarget = targetWithoutHash;
  if (allow.prefix !== null && !normalizedTarget.startsWith(allow.prefix)) {
    res.status(400).json({ error: "Target URL origin is not allowlisted." });
    return;
  }

  try {
    const buf = await renderPdfFromUrl(normalizedTarget);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    res.status(200).send(buf);
  } catch (err) {
    if (err instanceof PdfTimeoutError) {
      res.status(504).json({ error: "PDF generation timed out." });
      return;
    }
    console.error("pdf-server: export failed", err);
    res.status(500).json({ error: "PDF generation failed." });
  }
  }
);
