# PDF export: Render microservice + monorepo layout

## Architecture sanity check

**You do not need Vercel serverless for PDF** if Puppeteer runs on **Render** (or any long-lived Node host). The earlier `api/` + `vercel.json` stubs were an **optional** path for “functions on Vercel”; they are **not** part of the Render-Puppeteer design. You can delete `api/` and simplify `vercel.json` to **SPA-only** (or host the whole app on Render and drop Vercel entirely).

**Folder depth is not required.** `services/pdf-server/` was only a common monorepo habit. The Node service can live **one level under the repo root**, for example:

- **`server/`** (recommended for simplicity), or
- **`pdf-api/`**, or
- **`packages/pdf-server/`** if you later adopt **npm workspaces**.

Render only needs you to set **Root Directory** (e.g. `server`) and **Build/Start** commands for that folder. Nothing has to sit “deep” unless you prefer that structure.

## What we are doing

We are moving **high-fidelity PDF generation** off the browser-only path (`html2canvas` + `jsPDF`) toward **headless Chromium** via **Puppeteer**, hosted as a **small Node.js (TypeScript) service on Render**.

The **React app** (Create React App, build output `build/`) can stay on **Vercel** or **Render Static Site**. The **PDF service** is a **separate process** in the **same Git repository**, deployed as its own Render **Web Service**.

```text
nm-zwds/   (one repo)
├── src/                    # CRA frontend
├── package.json            # Root app (CRA)
├── server/                 # RECOMMENDED: Render Web Service (Node + TS + Puppeteer)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
└── vercel.json             # CRA SPA rewrites (no serverless PDF)
```

## Why two deployables in one repo

| Piece | Role | Typical host |
|-------|------|--------------|
| CRA app | UI, auth session, chart | Vercel or Render Static |
| `server/` (or your chosen folder) | `page.goto` → `page.pdf()` | Render Web Service |

- **Puppeteer + full Chrome** fits a **long-lived Node service** better than **Vercel serverless** (bundle size, cold start, Chromium packaging).
- One repo keeps **shared types**, **docs**, and **versioning** aligned; deploy still **two services** with **two build/start commands**.

## End-to-end flow (target)

1. User clicks **Export PDF** in the app (after re-enabling the button if it was hidden).
2. Frontend obtains **authorization** (existing Supabase session / JWT / or short-lived signed token from your backend).
3. Frontend calls **`POST https://<pdf-service>/api/export-pdf`** (exact path TBD in implementation) with:
   - either a **print-safe URL** the service is allowed to open (recommended), e.g. `https://app.example.com/print/result/:id?token=...`,  
   - or (less ideal) a **bounded HTML payload** with strict sanitization.
4. **pdf-server** launches Chromium, navigates, waits for **fonts / charts / network idle** as needed, returns **`application/pdf`** bytes.
5. Browser triggers download (blob).

## Print URL strategy (recommended)

- Add a **dedicated print route** in the SPA (e.g. `/print/result/:profileId`) that:
  - renders **only** report sections needed for PDF,
  - hides chrome (nav, buttons),
  - uses **`@media print`** or a `?print=1` layout,
  - loads data with the **same token** or **server-validated session**.
- The PDF service must **not** open arbitrary URLs; **allowlist** origin + path pattern + validate token.

## Security (non-negotiable)

- **No unauthenticated PDF generation.**
- **Allowlisted** target URLs (hostname + path prefix).
- **Short-lived** tokens (JWT or HMAC query param) tied to user + resource id.
- **Rate limiting** on the PDF route (Render + middleware or external gateway).
- **CORS**: only your frontend origin; PDF response is **binary**, not credentialed cross-site unless you design it.

**Small private / LAN setups:** the `server` can set `PDF_RELAX_SECURITY=1` to relax the above (optional Bearer, permissive CORS, no per-IP rate limit, any `http`/`https` host). Do **not** use on a public URL; see `server/README.md`.

## Existing repo touchpoints

- Client PDF today: `src/utils/pdfExport.ts`, `result.tsx` / `free-result.tsx` export handlers.
- **Vercel serverless `api/`** — removed in favor of the Render `server/` PDF pipeline; `vercel.json` is SPA-only rewrites.

## Render service expectations

- **Node 20+** LTS.
- **Memory**: plan for **≥ 1 GB**; **2 GB** safer for heavy charts.
- **Start command**: e.g. `node dist/index.js` after `npm run build` in `server/` (or whatever folder you chose).
- **Render dashboard**: set **Root Directory** to that folder (e.g. `server`).
- **Dockerfile** (optional): if stock Node image fails Chromium deps, use Docker on Render with `apt-get` packages for Chromium.

## Environment variables (conceptual)

| Variable | Where | Purpose |
|----------|--------|---------|
| `PDF_SERVICE_URL` | Frontend (build-time or runtime) | Base URL of pdf-server |
| `PDF_SERVICE_SHARED_SECRET` or JWT verify key | pdf-server | Validate incoming requests |
| `ALLOWED_PDF_ORIGIN` | pdf-server | Allowlist for `page.goto` |
| `ALLOWED_APP_ORIGIN` | pdf-server | CORS: exact origin of the CRA app |
| `PDF_RELAX_SECURITY` | pdf-server | Optional; weaker checks for trusted networks only (`server/README.md`) |
| `PUPPETEER_EXECUTABLE_PATH` | pdf-server | Set if using system Chromium in Docker |

### Create React App (build-time)

Set in `.env.local` for local development:

| Variable | Example | Purpose |
|----------|---------|---------|
| `REACT_APP_PDF_SERVICE_URL` | `http://localhost:8787` | Base URL of the pdf-server; when unset, export stays on the client (`html2canvas` + jsPDF). |

**Print URL for Puppeteer:** `https://<app-host>/print/result/<profile-id>?pdfToken=<supabase-access-token>`  
The token is required for headless Chromium (no shared browser session). Treat query tokens as sensitive (HTTPS, short TTL in future iterations).

Deploy checklist: [docs/deployment/RENDER_PDF_SERVICE.md](./deployment/RENDER_PDF_SERVICE.md).

## Definition of done (product)

- [ ] PDFs match **print layout** more closely than html2canvas path for the same profile.
- [ ] **SSRF** risk matches deployment: strict allowlist for public services; relaxed mode only when deliberately enabled on private networks.
- [ ] **Timeouts** and **error responses** are user-safe (no stack traces to client).
- [ ] **Logging** without PII in production.

## Related docs

- Agent implementation prompts: [PDF_RENDER_AGENT_PROMPTS.md](./PDF_RENDER_AGENT_PROMPTS.md)
- Legacy layout audit (A4 UX): [PDF_A4_LAYOUT_AUDIT_PROPOSAL.md](./PDF_A4_LAYOUT_AUDIT_PROPOSAL.md)
