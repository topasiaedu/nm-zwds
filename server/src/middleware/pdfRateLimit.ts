import type { Request, Response, NextFunction } from "express";

type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

const buckets = new Map<string, Bucket>();

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded !== "") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress ?? "unknown";
}

/**
 * Simple in-memory rate limit for `POST /api/export-pdf` (one process only; use a gateway for multi-instance).
 */
export function pdfExportRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const key = clientKey(req);
  const now = Date.now();
  const existing = buckets.get(key);

  if (existing === undefined || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (existing.count >= MAX_PER_WINDOW) {
    res.status(429).json({ error: "Too many PDF export requests. Try again shortly." });
    return;
  }

  existing.count += 1;
  next();
}
