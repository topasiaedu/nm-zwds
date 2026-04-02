# NM-ZWDS PDF server

Node.js + TypeScript service for headless PDF generation (Puppeteer). Deploy as a separate **Render Web Service**; see [PDF_RENDER_MICROSERVICE_OVERVIEW.md](../docs/PDF_RENDER_MICROSERVICE_OVERVIEW.md).

## Local development

```bash
cd server
npm install
npm run dev
```

- Health: [http://localhost:8787/health](http://localhost:8787/health)

## Production build

```bash
cd server
npm install
npm run build
npm start
```

Uses `node dist/index.js` after `tsc` emits to `dist/`.

## `POST /api/export-pdf`

JSON body: `{ "targetUrl": string }` (exact field name).

Headers: `Authorization: Bearer <token>` — use `PDF_API_SECRET` (long shared secret) for manual tests, or a valid Supabase **access token** when `SUPABASE_JWT_SECRET` is set on the server.

**Production:** set `ALLOWED_PDF_ORIGIN` to the prefix your app URLs must match (e.g. `https://your-deployment.vercel.app`). **Development:** if unset, only URLs starting with `http://localhost:3000` are accepted (warning logged).

**Relaxed mode:** set `PDF_RELAX_SECURITY=1` to skip rate limiting, allow any `http`/`https` target (no origin prefix), use permissive CORS, and make `Authorization` optional. Still rejects non-http(s) schemes and URLs with embedded credentials. Intended for LAN or trusted hosts only.

Example (dev, long dummy token ≥32 chars):

```bash
curl -sS -X POST http://localhost:8787/api/export-pdf ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer 01234567890123456789012345678901" ^
  -d "{\"targetUrl\":\"http://localhost:3000/\"}"
```

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No | Listen port (default `8787`) |
| `ALLOWED_PDF_ORIGIN` | Yes in production | Allowlisted prefix for `targetUrl` |
| `PDF_API_SECRET` | No* | If set, bearer token must match exactly |
| `SUPABASE_JWT_SECRET` | No* | If set, bearer can be Supabase HS256 JWT |
| `ALLOWED_APP_ORIGIN` | Yes in production | CRA origin for CORS (e.g. `https://your-app.vercel.app`); dev allows `http://localhost:*` |
| `PDF_RELAX_SECURITY` | No | `1` / `true` / `yes` — weaker checks (see above); logs a warning if `NODE_ENV=production` |
| `PUPPETEER_EXECUTABLE_PATH` | No | Use with `puppeteer-core` + system Chromium if full `puppeteer` fails on host |

\* In production without `PDF_RELAX_SECURITY`, configure at least one of `PDF_API_SECRET` or `SUPABASE_JWT_SECRET` for authenticated export; with relaxed mode, Bearer is optional.

See [`.env.example`](./.env.example).

## Render / Puppeteer

- Use a plan with **≥ 1024 MB RAM** (2 GB safer for heavy pages).
- **Max duration:** allow ~90s for generation + idle wait; clients may see **504** if the job exceeds the server timeout.
- **Rate limit:** `POST /api/export-pdf` is limited in-process (30 requests / minute / IP) unless `PDF_RELAX_SECURITY` is set; scale-out needs a shared store or edge limiter.
- If `puppeteer` fails to download or run Chromium on Render’s image, switch to **`puppeteer-core`**, install system Chromium, and set `PUPPETEER_EXECUTABLE_PATH` (documented in Puppeteer docs).
