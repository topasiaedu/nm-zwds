# Deploy PDF server on Render

Step-by-step for the Node + Puppeteer service in [`server/`](../../server/).

## 1. Create a Web Service

1. In the Render dashboard, choose **New** → **Web Service**.
2. Connect the `nm-zwds` repository.
3. Set **Root Directory** to `server`.
4. **Runtime:** Node 20 or newer.

## 2. Build and start commands

| Field | Value |
|--------|--------|
| **Build command** | `npm install && npm run build` |
| **Start command** | `npm start` |

`npm start` runs `node dist/index.js` after TypeScript compiles to `dist/`.

## 3. Instance sizing

- **Memory:** at least **1024 MB**; use **2048 MB** if charts or fonts are heavy.
- **Note:** Puppeteer runs a full Chromium; undersized instances OOM or timeout.

## 4. Environment variables

Set these in the Render service **Environment** tab:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `ALLOWED_PDF_ORIGIN` | Yes | Exact origin prefix for `targetUrl` (e.g. `https://your-app.vercel.app`) |
| `ALLOWED_APP_ORIGIN` | Yes | Your CRA site origin for **CORS** (usually same as app URL, e.g. `https://your-app.vercel.app`) |
| `SUPABASE_JWT_SECRET` | Recommended | Supabase **JWT Secret** (Dashboard → Settings → API) for validating `Authorization: Bearer` user JWTs |
| `PDF_API_SECRET` | Optional | Long shared secret; if set, bearer token may equal this for ops/testing |
| `PUPPETEER_EXECUTABLE_PATH` | Optional | Path to Chromium when using `puppeteer-core` instead of bundled Chrome |
| `PORT` | No | Render injects this automatically |

## 5. Frontend (CRA)

- Build the React app with **`REACT_APP_PDF_SERVICE_URL`** set to the Render service URL (e.g. `https://nm-zwds-pdf.onrender.com`), **no trailing slash**.
- Users export PDFs from the app; the browser calls the Render API with their Supabase access token.

## 6. Smoke test

```bash
curl -sS -X POST "https://<your-service>.onrender.com/api/export-pdf" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-jwt-or-PDF_API_SECRET>" \
  -d "{\"targetUrl\":\"https://your-app.vercel.app/print/result/<profile-id>?pdfToken=<jwt>\"}" \
  --output test.pdf
```

## 7. Troubleshooting

- **Chromium fails to start:** add a `Dockerfile` in `server/` with OS deps, or switch to `puppeteer-core` + `PUPPETEER_EXECUTABLE_PATH` (see [`server/README.md`](../../server/README.md)).
- **504 timeouts:** simplify the print page, reduce `networkidle0` sensitivity, or increase timeouts in code with care.
- **401 / CORS:** confirm `ALLOWED_APP_ORIGIN` matches the browser `Origin` header exactly (scheme + host, no path).
- **Rate limiting:** the service uses an in-process limiter on `/api/export-pdf` (see `server/src/middleware/pdfRateLimit.ts`). For multiple instances, add a gateway or Redis-backed limiter.
