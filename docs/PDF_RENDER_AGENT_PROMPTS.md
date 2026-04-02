# Agent prompts: Render PDF microservice (monorepo)

Use with **Gemini 3.1 Pro** (or similar). Run prompts **in order**. Each block is self-contained: paste **one** block per agent session. If an agent finishes early, continue with the next prompt in a **new** session and attach the **file list** it changed.

**Repository:** `nm-zwds` — Create React App at repo root; new service under **`server/`** (flat, one level down). Equivalent: `pdf-api/` or `services/pdf-server/` if you prefer — adjust paths in prompts accordingly.

**Read first:** [PDF_RENDER_MICROSERVICE_OVERVIEW.md](./PDF_RENDER_MICROSERVICE_OVERVIEW.md)

---

## Prompt 1 — Scaffold `server/` (no Puppeteer yet)

**Goal:** Add a deployable Node + TypeScript **Web Service** skeleton: health check, CORS placeholder, strict TypeScript, scripts `build` / `start` / `dev`.

**Constraints:**

- Use **Express** (or Fastify) with **TypeScript**.
- Output compiled JS to **`dist/`**; start with **`node dist/index.js`**.
- **Do not** add Puppeteer in this prompt (keeps install fast and avoids context bloat).
- **No `any`**, no non-null assertion `!`, no `as unknown as`.
- Port from **`process.env.PORT`** (Render sets this), default `8787` locally.

**Deliverables:**

1. `server/package.json` — dependencies: `express`, `cors` (optional), `typescript`, `@types/express`, `@types/node`, `tsx` or `ts-node-dev` for dev.
2. `server/tsconfig.json` — `strict`, `esModuleInterop`, `outDir: dist`, `rootDir: src`.
3. `server/src/index.ts` — `GET /health` → `{ "ok": true }`; `GET /` → short JSON service name.
4. `server/README.md` — how to run locally (`npm install`, `npm run dev`, `npm run build`, `npm start`).
5. Root `README.md` **or** one paragraph in `server/README.md` linking to overview doc (minimal edit to root).

**Acceptance:**

- `cd server && npm install && npm run build && npm start` works.
- Health endpoint returns 200 JSON.

---

## Prompt 2 — `POST /api/export-pdf` stub + validation contract

**Goal:** Define the **HTTP contract** for PDF generation **without** launching Chromium yet. Validates body, auth header, and allowlisted URL shape; returns **501** with JSON `hint` until Prompt 3 wires Puppeteer.

**Constraints:**

- Route: **`POST /api/export-pdf`**.
- Request body (JSON): `{ "targetUrl": string }` (exact field name; document in README).
- Header: **`Authorization: Bearer <token>`** (opaque string for now; validate non-empty and min length ≥ 32, or compare to `process.env.PDF_API_SECRET` if set).
- **Allowlist:** `targetUrl` must start with `process.env.ALLOWED_PDF_ORIGIN` (required env in production); if missing in dev, log warning and reject with 503 in production, or allow only `http://localhost:3000` in dev when `NODE_ENV !== "production"`.
- Reject **non-http(s)** URLs, **private IPs**, and obvious SSRF patterns (document blocked patterns in code comments).
- Use **double quotes** for strings in TS.

**Deliverables:**

1. `server/src/routes/exportPdf.ts` (or inline in `index.ts` if small) — validation + 501 response.
2. `server/README.md` — curl example, required env vars.
3. Optional: `server/.env.example` with `PORT`, `PDF_API_SECRET`, `ALLOWED_PDF_ORIGIN`.

**Acceptance:**

- Valid request shape → **501** + JSON message.
- Missing auth → **401**.
- Bad URL / SSRF → **400** with safe error message (no internal details).

---

## Prompt 3 — Puppeteer: real PDF buffer + response

**Goal:** Implement **`POST /api/export-pdf`** to return **`application/pdf`** using **Puppeteer**.

**Constraints:**

- Prefer **`puppeteer`** full package for **Render Node Web Service** first (simplest). If bundle/install fails on Render, document switch to **`puppeteer-core`** + system Chromium + `PUPPETEER_EXECUTABLE_PATH` in README.
- **`page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 60000 })`** (or `load` + fixed delay if idle is flaky — document choice).
- **`page.pdf({ format: "A4", printBackground: true, margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" } })`** — tune slightly if needed.
- **Timeout** wrapper: fail with **504** if generation exceeds e.g. 90s.
- **Close browser** in `finally`.
- Handle errors: **500** with generic message; log server-side only.

**Deliverables:**

1. Updated `server/package.json` with `puppeteer` dependency.
2. `server/src/pdf/renderPdf.ts` — `renderPdfFromUrl(url: string): Promise<Buffer>`.
3. Wire route to return buffer with headers `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="report.pdf"`.
4. README: Render **memory** recommendation (≥1024 MB), **max request** note.

**Acceptance:**

- Against a **public** test URL (e.g. `https://example.com`) in dev only **or** local static page — returns non-empty PDF buffer (manual test documented).
- With invalid token — still **401** before launch.

---

## Prompt 4 — CRA integration: call pdf-server and download

**Goal:** From the existing app, add an **optional** code path: if `REACT_APP_PDF_SERVICE_URL` is set, **POST** to pdf-server and download blob; else keep current **client-side** `exportChartAsPdf` behavior (or show message — pick one and document).

**Constraints:**

- Use **`REACT_APP_*`** env vars only for CRA.
- **Do not** embed `PDF_API_SECRET` in frontend; use a **user-scoped token** from your existing auth (Supabase session JWT) **or** a dedicated **short-lived token** endpoint (if none exists, pass JWT in `Authorization` and have pdf-server validate with Supabase JWKS — only if already comfortable; otherwise use shared secret **only for internal MVP** and document as temporary).
- **Minimum change:** one function in `src/utils/` e.g. `pdfExportServer.ts` + small change in `result.tsx` handler.
- TypeScript strict; **no `any`**.

**Deliverables:**

1. `src/utils/pdfExportServer.ts` — `exportPdfViaServer(targetUrl: string, getAuthHeader: () => Promise<string | null>)`.
2. Wire in `result.tsx` (and `free-result.tsx` if export enabled there): branch on env var.
3. `docs/guides/` or short section in `PDF_RENDER_MICROSERVICE_OVERVIEW.md`: env vars for local dev (`REACT_APP_PDF_SERVICE_URL=http://localhost:8787`).

**Acceptance:**

- With env unset → existing behavior unchanged.
- With env set + valid backend → PDF downloads from server response.

---

## Prompt 5 — Print route + token handoff (SPA)

**Goal:** Add a **minimal** print-only route in CRA, e.g. **`/print/result/:id`**, that renders a **stripped** report layout suitable for Puppeteer (no nav, no export buttons). Pass **`?pdfToken=`** from parent window or generate server-side later; for this prompt, **read token from query** and store in memory only for API calls if needed.

**Constraints:**

- Reuse existing chart data loading patterns from `result.tsx` where possible (extract shared loader hook if small refactor helps — avoid huge refactors).
- **`@media print`** or dedicated class `.print-root` with max width ~794px for A4 consistency.
- **Do not** log token to console in production build.

**Deliverables:**

1. New route in React Router config (find router setup in app).
2. `src/pages/PrintResult.tsx` (name can vary) — loads profile by id, shows chart + agreed sections.
3. Document **targetUrl** shape for pdf-server: `https://app.../print/result/:id?pdfToken=...`.

**Acceptance:**

- Opening print URL in normal browser shows readable report.
- Puppeteer hit against **local** print URL (with dev token) produces multi-page PDF (manual test).

---

## Prompt 6 — Hardening checklist (small PR)

**Goal:** Single pass: **CORS** lockdown, **rate limit** note or `express-rate-limit`, **Render `render.yaml`** or dashboard checklist, remove dead code paths, align **error JSON** shape.

**Deliverables:**

1. `render.yaml` **or** `docs/deployment/RENDER_PDF_SERVICE.md` with step-by-step Render dashboard fields (build command, start command, root directory `server`, env vars).
2. CORS: allow only `ALLOWED_APP_ORIGIN` env.
3. Optional: `express-rate-limit` on `/api/export-pdf`.

**Acceptance:**

- Documented deploy steps another developer can follow without asking questions.

---

## Optional follow-up (separate sessions, smaller)

- **Dockerfile** in `server/` if Chromium deps fail on native Render image.
- **Supabase JWT verification** in the Render service (JWKS) instead of shared secret.
- **Queue** (BullMQ + Redis) if PDFs exceed HTTP timeout.

---

## Suggested agent session sizes

| Prompt | Rough focus | Fits one context window? |
|--------|-------------|---------------------------|
| 1 | Scaffold | Yes |
| 2 | Validation / SSRF | Yes |
| 3 | Puppeteer core path | Yes (largest; split 3a launch only / 3b pdf options if needed) |
| 4 | CRA fetch + download | Yes |
| 5 | Print route | Medium; split 5a route shell / 5b content if chart loading is heavy |
| 6 | Ops + CORS + docs | Yes |

If Prompt 3 is too large for one run, split into:

- **3a:** Install puppeteer, open page, screenshot PNG (prove Chromium works).
- **3b:** Switch screenshot to `page.pdf()` + production headers.
