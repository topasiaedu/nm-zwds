import express from "express";
import cors from "cors";
import { isPdfRelaxedSecurity } from "./config/pdfSecurity.js";
import { exportPdfRouter } from "./routes/exportPdf.js";

/**
 * HTTP port: Render injects PORT; local default matches agent prompt.
 */
const PORT = parseInt(process.env.PORT ?? "8787", 10);

const app = express();

const relaxed = isPdfRelaxedSecurity();
if (relaxed && process.env.NODE_ENV === "production") {
  console.warn(
    "pdf-server: PDF_RELAX_SECURITY is on — weaker checks; use only on private/trusted networks."
  );
}

/**
 * CORS: relaxed mode reflects any origin; otherwise production allows only `ALLOWED_APP_ORIGIN`
 * and development allows localhost CRA ports.
 */
const allowedAppOrigin = process.env.ALLOWED_APP_ORIGIN;

const corsOriginDelegate: cors.CorsOptions["origin"] = (origin, callback) => {
  if (origin === undefined || origin === "") {
    callback(null, true);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    ) {
      callback(null, true);
      return;
    }
  }
  if (
    allowedAppOrigin !== undefined &&
    allowedAppOrigin !== "" &&
    origin === allowedAppOrigin
  ) {
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

app.listen(PORT, () => {
  console.log(`pdf-server listening on port ${PORT}`);
});
