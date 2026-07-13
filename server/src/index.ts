import express from "express";
import cors from "cors";
import { isPdfRelaxedSecurity } from "./config/pdfSecurity.js";
import { exportPdfRouter } from "./routes/exportPdf.js";

/**
 * HTTP port: Render injects PORT; local default matches agent prompt.
 */
const PORT = parseInt(process.env.PORT ?? "8787", 10);
/**
 * Render / Docker: must bind 0.0.0.0 so the platform health check sees an open port.
 * Binding only :: or 127.0.0.1 can produce "No open ports detected" on deploy.
 */
const LISTEN_HOST = "0.0.0.0";

const app = express();

const relaxed = isPdfRelaxedSecurity();
if (relaxed && process.env.NODE_ENV === "production") {
  console.warn(
    "pdf-server: PDF_RELAX_SECURITY is on — weaker checks; use only on private/trusted networks."
  );
}

/**
 * CORS: relaxed mode reflects any origin; otherwise production allows:
 * - ALLOWED_APP_ORIGIN (single origin, backwards-compatible)
 * - ALLOWED_APP_ORIGINS (comma-separated origin allowlist)
 * Development also allows localhost / 127.0.0.1 and RFC1918 LAN CRA origins
 * (Create React App prints "On Your Network: http://192.168.x.x:3000").
 */
const allowedOriginEnv = process.env.ALLOWED_APP_ORIGINS ?? "";
const allowedOrigins = allowedOriginEnv
  .split(",")
  .map((value) => value.trim())
  .filter((value) => value.length > 0);
const allowedAppOrigin = process.env.ALLOWED_APP_ORIGIN?.trim() ?? "";
if (allowedAppOrigin.length > 0 && !allowedOrigins.includes(allowedAppOrigin)) {
  allowedOrigins.push(allowedAppOrigin);
}

/**
 * True when the browser Origin is a local CRA host we should allow in development.
 * Without this, opening the app via the LAN URL makes fetch() fail with TypeError
 * ("Could not reach the PDF service") because CORS returns no ACAO header.
 */
function isDevLocalAppOrigin(origin: string): boolean {
  if (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.startsWith("http://[::1]:")
  ) {
    return true;
  }
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:") {
      return false;
    }
    const host = parsed.hostname;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true;
    }
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true;
    }
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

const corsOriginDelegate: cors.CorsOptions["origin"] = (origin, callback) => {
  if (origin === undefined || origin === "") {
    callback(null, true);
    return;
  }
  if (process.env.NODE_ENV !== "production" && isDevLocalAppOrigin(origin)) {
    callback(null, true);
    return;
  }
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }
  callback(null, false);
};

app.use(
  cors(
    relaxed
      ? { origin: true, credentials: false }
      : {
          origin: corsOriginDelegate,
          credentials: false,
        }
  )
);
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "nm-zwds-pdf-server",
    version: "1.0.0",
  });
});

app.use("/api", exportPdfRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

const server = app.listen(PORT, LISTEN_HOST, () => {
  console.log(`pdf-server listening on ${LISTEN_HOST}:${PORT}`);
  if (process.env.ALLOWED_PDF_ORIGIN) {
    console.log(`pdf-server: ALLOWED_PDF_ORIGIN=${process.env.ALLOWED_PDF_ORIGIN}`);
  }
  if (allowedOrigins.length > 0) {
    console.log(`pdf-server: CORS allowlist=${allowedOrigins.join(",")}`);
  }
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `pdf-server: port ${PORT} already in use. Stop the other process (lsof -i :${PORT}) and retry.`
    );
    process.exit(1);
  }
  throw err;
});
