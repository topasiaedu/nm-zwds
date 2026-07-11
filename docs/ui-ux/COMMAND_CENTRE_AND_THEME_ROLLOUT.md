# Command Centre Shell & Theme Rollout

**Status:** In progress (result page done; dashboard/AA partially done; rollout + dark mode pending)  
**Last updated:** July 2026  
**Companion doc:** [COMMAND_CENTRE_AND_THEME_AGENT_PROMPTS.md](./COMMAND_CENTRE_AND_THEME_AGENT_PROMPTS.md)

---

## 1. Why we are doing this

After merging `staging` (chart/result redesign) with `feature/alignment-advantage` (dashboard + AA), the app has **two UI paradigms**:

| Paradigm | Pages | Chrome |
|----------|-------|--------|
| **Legacy** | calculate, founder-report, auth, free-test, most admin | `MainLayout` + top navbar + page hero |
| **Command Centre** | dashboard, result/chart, alignment-advantage | Full-viewport shell: dark sidebar, sticky context bar, no navbar |

Users experience a jarring jump when moving between dashboard → calculate → result. We want **one consistent shell** for authenticated product pages, plus **working light/dark mode** on the new surfaces.

---

## 2. What is done already

### Merge (`feature/alignment-advantage` + `staging`)
- Staging chart/result content (`analysis_v2`, `ZWDSChart`, blueprint switcher, profile sidebar)
- Dashboard redesign (`src/pages/dashboard/index.tsx`) — Cae Goh slide visual language
- Alignment Advantage report pages and routes
- `ReportViewerLayout` wrapping `/chart` and `/result/:id`

### Mobile fixes (recent)
- Collapsible sidebar drawer on dashboard + result
- Profile cards instead of table on mobile dashboard
- Section bottom sheet on result (replaces cheap horizontal pills)
- Z-index fix: chart transformation arrows no longer bleed over modals
- Opposite-palace fallback for empty life palace in `overviewAnalysis.ts`

### Navbar hidden routes (`src/components/navbar.tsx`)
```text
/dashboard
/alignment-advantage
/chart
/result
/tier3-result
```

---

## 3. Target architecture

### 3.1 Layout hierarchy (to build)

```text
CommandCentreShell          ← shared base (sidebar, drawer, context bar, theme toggle)
├── DashboardShell          ← dashboard: tool cards + recent profiles, no scroll-spy
├── ReportViewerLayout      ← result/chart: scroll-spy + section sheet (exists today; refactor to extend shell)
└── DocumentViewerLayout    ← AA: chapter nav + scroll-to-section (not scroll-spy)
```

### 3.2 Shared hooks / utilities (to build)

| Artifact | Purpose |
|----------|---------|
| `useAppNavItems()` | Tier-aware sidebar links: Dashboard, My Chart, Calculate, tools, premium reports |
| `useTheme()` | Read/toggle `dark` on `<html>` (extract from `ThemeToggle.tsx`) |
| `getShellTokens(isDark)` | Light/dark colors for main area (sidebar can stay dark in both modes) |

### 3.3 Design tokens today

**Shell (light-only — problem for dark mode):**  
`src/components/alignment-advantage/shared/constants.ts` → `C` object with hardcoded hex (`navy`, `coral`, `cream`, etc.). Used via inline `style={{}}` in dashboard, AA, `ReportViewerLayout`.

**Legacy theme (works):**  
- `src/components/ThemeToggle.tsx` — toggles `dark` class on `document.documentElement`, persists `localStorage.theme`
- `src/styles/color-scheme.css` — CSS variables swap in `.dark`
- Tailwind `dark:` on legacy pages (`founder-report`, `calculateUi`, `chartUi`, etc.)

**Gap:** New shell pages hide the navbar → **no theme toggle visible**. Shell uses hardcoded light colors → **dark mode has no effect**.

---

## 4. Theme strategy (light / dark)

### Recommended approach: **dark sidebar, adaptive main**

The sidebar is already a dark navy→coral gradient. Keep it **stable across themes** (premium brand chrome).

Adapt for dark mode:
- **Main scroll area** background (cream → deep purple/navy gradient)
- **Sticky context bar** text and borders
- **Cards** in main content (use semantic tokens or `.light-panel` where analysis must stay cream)
- **Mobile drawer / bottom sheet** surfaces

Do **not** try to add `dark:` to every inline `style={{ color: C.navy }}` long-term. Introduce `shellTokens` / CSS variables first, then migrate shell components.

### Theme toggle placement
Add `ThemeToggle` to:
- `CommandCentreShell` sticky header (desktop + mobile)
- Optionally user menu area in sidebar footer

### Edge cases (do not break)
| Case | Behavior |
|------|----------|
| PDF export | `pdfExport.ts` strips `dark` on clone — keep |
| `/chart-only` | Forces light theme — keep |
| PNG assets with baked cream bg | Hide in dark (see `CorePersonalitySection.tsx`) |
| `analysis_v2` | Partially themed; use `.light-panel` on cream cards in dark mode |

---

## 5. Page rollout tiers

### Tier A — Command Centre shell (migrate)
| Route | Current layout | Target variant |
|-------|----------------|----------------|
| `/dashboard` | Inline shell (duplicated) | `DashboardShell` |
| `/chart`, `/result/:id` | `ReportViewerLayout` | Refactor to extend `CommandCentreShell` |
| `/alignment-advantage` | Inline shell in `index.tsx` | `DocumentViewerLayout` |
| `/alignment-advantage/timing`, `/wealth` | Legacy-ish pages | Reconcile with AA shell or link from index |
| `/calculate` | `MainLayout` + `calculateUi` hero | `DashboardShell` |
| `/founder-report/:id` | `MainLayout` + custom grid | `ReportViewerLayout` or custom sections |
| `/destiny-navigator/:id` | Legacy | `ReportViewerLayout`-like |
| `/timing-chart/:id` | Legacy | `ReportViewerLayout`-like |
| `/tier3-result` | Legacy (navbar hidden but no shell) | Same as result |
| `/caegpt` | Legacy | `DashboardShell` |
| `/profile` | Legacy | `DashboardShell` |

### Tier B — Keep MainLayout + navbar
- `/authentication/*`
- `/free-test`, `/free-result`
- `/admin/*`
- `/membership-expired`, `/membership-paused`

### Tier C — No shell (intentional)
- `/chart-only`, `/print/*`, `/12month-forecast`
- Dev/test pages

### Per-page migration checklist
1. Add route prefix to `NAVBAR_HIDDEN_ROUTES` in `navbar.tsx`
2. Wrap page in appropriate shell variant
3. Use `useAppNavItems()` for sidebar
4. Remove old hero/back header and glow wrappers
5. Define `sections` or `chapters` if needed
6. Verify mobile drawer + theme toggle
7. `npm run build` passes
8. Smoke-test desktop + 390px mobile

---

## 6. Key files reference

| File | Role |
|------|------|
| `src/components/layout/ReportViewerLayout.tsx` | Result/chart shell (~800 lines) — extract base from here |
| `src/pages/dashboard/index.tsx` | Dashboard shell (duplicated pattern) |
| `src/pages/alignment-advantage/index.tsx` | AA document viewer shell |
| `src/pages/result.tsx` | Uses `ReportViewerLayout`; defines `appNavItems`, `reportSections` |
| `src/components/navbar.tsx` | `NAVBAR_HIDDEN_ROUTES`, `ThemeToggle` |
| `src/components/ThemeToggle.tsx` | Theme mechanism |
| `src/styles/color-scheme.css` | Semantic CSS variables, `.dark`, `.light-panel` |
| `src/components/alignment-advantage/shared/constants.ts` | `C` palette (light-only) |
| `src/layouts/MainLayout.tsx` | Legacy wrapper |
| `src/styles/chartUi.ts` | Chart page styles; `chartSectionContainerClass` (no viewport breakout inside shell) |

---

## 7. Phased rollout order

**Do shell extraction before theming everything twice.**

```text
Phase 0  ✅  Result page on ReportViewerLayout + mobile fixes
Phase 1     Extract CommandCentreShell + useAppNavItems
Phase 2     Migrate dashboard to shared shell (delete duplication)
Phase 3     Refactor ReportViewerLayout → extends CommandCentreShell
Phase 4     DocumentViewerLayout for AA index
Phase 5     Theme: useTheme + shell tokens + ThemeToggle in shell
Phase 6     Theme: dashboard + AA shell surfaces
Phase 7     Migrate calculate, founder-report
Phase 8     Migrate destiny-navigator, timing-chart, tier3-result
Phase 9     Migrate caegpt, profile
Phase 10    Theme: content inside migrated pages (analysis_v2, AA chapters)
```

Phases 1–4 and 5–6 can interleave slightly, but **Phase 5 should follow Phase 1** so theme work targets one shell.

---

## 8. Mobile behavior (must preserve)

Any shell work must keep:
- Sidebar off-screen below `md` (768px); hamburger opens drawer with backdrop
- Full-width main content when drawer closed
- Result page: tappable "Now viewing" row → section bottom sheet (not horizontal pills)
- Dashboard: profile cards on mobile, table on `md+`
- `min-w-0` on main flex child (prevents chart under sidebar)
- No `left-1/2 w-screen -translate-x-1/2` breakout inside shell main column

---

## 9. Testing

### Local
```bash
npm start
# Sign in: stanley121499@gmail.com (note spelling: stanley not stnaley)
```

### Smoke routes
- `/dashboard` — drawer, tool cards, profile cards mobile
- `/chart` — shell, section sheet, chart renders
- `/result/:id` — same + analysis sections scroll
- `/alignment-advantage` — chapter nav, premium gate
- Toggle theme after Phase 5 — main area should respond

### Build gate
```bash
npm run build
```
Every agent prompt must end with a passing build.

---

## 10. Out of scope (for now)

- Admin pages shell migration
- Auth page redesign
- Free-test public pages
- Replacing all legacy `*Ui.ts` style modules
- Full `analysis_v2` dark redesign in one pass

---

## 11. Agent execution notes

- Use [COMMAND_CENTRE_AND_THEME_AGENT_PROMPTS.md](./COMMAND_CENTRE_AND_THEME_AGENT_PROMPTS.md)
- **One prompt per agent session** — verify build before next prompt
- Do not run parallel prompts that edit the same files
- Prefer minimal diffs; match existing `C` / coral / navy aesthetic
- No `any`, no non-null assertion `!` per project standards
