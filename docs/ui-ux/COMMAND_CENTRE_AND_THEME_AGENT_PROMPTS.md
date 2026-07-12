# Command Centre Shell & Theme — Agent Prompts

Use these prompts with a coding agent (~200k context). **Run one prompt per session.** Verify `npm run build` passes before starting the next.

**Read first:** [COMMAND_CENTRE_AND_THEME_ROLLOUT.md](./COMMAND_CENTRE_AND_THEME_ROLLOUT.md)

**Repo:** `nm-zwds` (React + TypeScript + Tailwind + Supabase)

**Conventions:**
- Double quotes for strings
- No `any`, no non-null assertion `!`
- Match existing Cae Goh palette (`C` in `src/components/alignment-advantage/shared/constants.ts`)
- Preserve mobile drawer, section sheet, and z-index fixes already on result/dashboard
- Do not commit unless asked

---

## Execution order

```text
Track 1 — Shell (do first)
  Prompt 1 → 2 → 3 → 4

Track 2 — Theme (after Prompt 1 at minimum; best after Prompt 3)
  Prompt 5 → 6 → 7

Track 3 — Page rollout (after Prompt 3; can overlap with Track 2 after Prompt 5)
  Prompt 8 → 9 → 10 → 11

Track 4 — Polish (optional, last)
  Prompt 12
```

---

## Prompt 1: Extract `CommandCentreShell` + `useAppNavItems`

**Prerequisite:** None  
**Estimated touch:** 2–4 new files, light edits to existing layouts  
**Do not migrate pages yet** — only add shared infrastructure.

```text
You are working in the nm-zwds React repo.

Goal:
Create the shared Command Centre layout foundation without breaking existing pages.

Read first:
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_ROLLOUT.md
- src/components/layout/ReportViewerLayout.tsx (full file — this is the reference implementation)
- src/pages/dashboard/index.tsx (sidebar + mobile drawer sections)
- src/pages/result.tsx (appNavItems useMemo ~line 434)

Create:

1) src/hooks/useAppNavItems.ts
   - Export a hook returning sidebar nav items: Dashboard, My Chart, Calculate, Destiny Navigator, AI Wealth Assistant, Founder Report, Alignment Advantage
   - Use useTierAccess() for tier gating (mirror logic in result.tsx appNavItems and dashboard)
   - Tier 3 users: My Chart → /tier3-result not /chart
   - Return { items, chartUrl, destinyNavigatorUrl } or similar typed shape
   - Icons can be simple SVG elements or extracted from dashboard — keep inline if needed

2) src/components/layout/CommandCentreShell.tsx
   - Props:
     - brandLabel, brandSubLabel (e.g. "Purple Star Astrology", profile name)
     - appNavItems (from hook or passed in)
     - contextTitle, contextSubtitle (sticky bar)
     - sidebarFooter?: ReactNode (user avatar + dashboard link)
     - mobileHeaderExtra?: ReactNode (optional slot)
     - children (main scroll content)
     - navSlot?: ReactNode (optional: report sections or AA chapters below app nav)
   - Behavior to include (copy from ReportViewerLayout / dashboard):
     - Fixed full-viewport flex shell, z-index 40
     - 230px sidebar desktop; off-screen drawer mobile with backdrop, Escape, hamburger
     - Sticky context bar (navy, Sparkle, title, date)
     - Main: flex-1 min-w-0 overflow-y-auto overflow-x-hidden, cream gradient background
     - Dot-texture sidebar gradient using C tokens
   - Do NOT include report scroll-spy or section bottom sheet yet — those stay in ReportViewerLayout for now

3) src/components/layout/commandCentreTypes.ts (optional)
   - Shared types: AppNavItem, etc.

Constraints:
- Do not modify result.tsx or dashboard/index.tsx consumption yet (only add new files)
- Reuse C from alignment-advantage/shared/constants.ts and Sparkle component
- npm run build must pass

Acceptance:
- New files compile
- No visual change to existing app (nothing wired yet)
- Types exported for next prompts
```

---

## Prompt 2: Migrate dashboard to `CommandCentreShell`

**Prerequisite:** Prompt 1 complete  
**Estimated touch:** `dashboard/index.tsx`, possibly delete duplicated shell code (~200–400 lines)

```text
You are working in nm-zwds.

Goal:
Refactor src/pages/dashboard/index.tsx to use CommandCentreShell + useAppNavItems, removing duplicated sidebar/drawer/mobile header code.

Read first:
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_ROLLOUT.md (sections 3, 8)
- src/components/layout/CommandCentreShell.tsx
- src/hooks/useAppNavItems.ts
- src/pages/dashboard/index.tsx (current implementation)

Tasks:
1. Replace inline shell (fixed sidebar, mobile drawer, sticky bar) with <CommandCentreShell>
2. Use useAppNavItems() for sidebar links; mark active route for Dashboard
3. Keep all dashboard MAIN content unchanged:
   - Greeting, Your Tools grid, Recent Profiles (mobile cards + desktop table)
   - ToolCard, SectionHeader, tier gating, delete profile flow
4. Preserve mobile behavior:
   - hidden md:inline-flex on "N saved" pill and Premium badges
   - grid-cols-1 sm:grid-cols-2 md:grid-cols-3 for tools
   - Profile cards below md, table on md+
5. Pass user footer (avatar, name, email) via sidebarFooter prop
6. Remove dead code (duplicate NavItem, drawer state, etc.) after migration
7. npm run build

Acceptance:
- /dashboard looks the same desktop + mobile (390px)
- Hamburger opens drawer; main content full width on mobile
- No regression to tool cards or recent profiles
```

---

## Prompt 3: Refactor `ReportViewerLayout` to compose `CommandCentreShell`

**Prerequisite:** Prompt 1 complete (Prompt 2 recommended)  
**Estimated touch:** `ReportViewerLayout.tsx`, possibly `result.tsx` (minor)

```text
You are working in nm-zwds.

Goal:
ReportViewerLayout should compose CommandCentreShell and only own report-specific features (scroll-spy, section bottom sheet, section nav in sidebar).

Read first:
- src/components/layout/CommandCentreShell.tsx
- src/components/layout/ReportViewerLayout.tsx (current ~800 lines)
- src/pages/result.tsx (reportSections, section ids: chart, overview, wealth-code, health, four-key-palace, areas-of-life, dayun, liu-month)

Tasks:
1. Move shared chrome (sidebar shell, drawer, context bar, main wrapper) into CommandCentreShell
2. ReportViewerLayout keeps:
   - reportSections prop + IntersectionObserver scroll-spy
   - Mobile "Now viewing" animated row (framer-motion) + section bottom sheet
   - Section nav buttons in sidebar (navSlot)
   - footerActions prop
3. result.tsx should need minimal changes — same public props on ReportViewerLayout
4. Verify chartSectionContainerClass does NOT use viewport breakout (w-full only inside shell)
5. npm run build

Test mentally / locally:
- /chart and /result/:id — sidebar beside content, not under
- Section sheet opens; chart arrows do not cover sheet (z-index/isolation preserved)

Acceptance:
- ReportViewerLayout shrinks significantly; no duplicated drawer code vs dashboard
- All result page behavior unchanged
```

---

## Prompt 4: `DocumentViewerLayout` + migrate Alignment Advantage index

**Prerequisite:** Prompt 1 complete, Prompt 3 recommended  
**Estimated touch:** New layout file + `alignment-advantage/index.tsx`

```text
You are working in nm-zwds.

Goal:
Create DocumentViewerLayout for chapter-based reports and migrate src/pages/alignment-advantage/index.tsx to use it.

Read first:
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_ROLLOUT.md
- src/components/layout/CommandCentreShell.tsx
- src/pages/alignment-advantage/index.tsx (CHAPTERS array, scrollTo, sidebar, access gate)
- src/hooks/useAppNavItems.ts

Create src/components/layout/DocumentViewerLayout.tsx:
- Composes CommandCentreShell
- Props: chapters: { id, label, sub }[], activeChapter, onChapterClick, profileName, contextTitle, children
- Sidebar: chapter list with coral active state (same visual as current AA)
- Main: scrollable content area with sticky session tag bar ("Alignment Advantage · Cae Goh")
- Mobile: reuse drawer; chapter picker can be bottom sheet OR scroll in drawer (match premium feel from ReportViewerLayout section sheet)

Migrate index.tsx:
- Replace inline shell with DocumentViewerLayout
- Keep AccessDeniedView, PDF download, all chapter components unchanged
- useAppNavItems for app nav section in sidebar
- hasAlignmentAdvantage tier gate unchanged

Do NOT migrate timing.tsx or wealth.tsx in this prompt.

npm run build

Acceptance:
- /alignment-advantage works desktop + mobile
- Chapter nav scrolls/highlights correctly
- Premium gate still works
```

---

## Prompt 5: Theme infrastructure + toggle in shell

**Prerequisite:** Prompt 1 complete (Prompt 3 strongly recommended)  
**Estimated touch:** 2–3 new files, `CommandCentreShell.tsx`, `ThemeToggle.tsx`

```text
You are working in nm-zwds.

Goal:
Add light/dark theme support to Command Centre shell — infrastructure + visible toggle.

Read first:
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_ROLLOUT.md (section 4)
- src/components/ThemeToggle.tsx
- src/styles/color-scheme.css (.dark variables, .light-panel)
- src/components/layout/CommandCentreShell.tsx

Create:

1) src/hooks/useTheme.ts
   - Returns { isDark, toggleTheme }
   - Same logic as ThemeToggle (localStorage + documentElement.classList + prefers-color-scheme default)
   - Refactor ThemeToggle.tsx to use useTheme internally (no behavior change on legacy pages)

2) src/styles/shellTheme.ts
   - export getShellTokens(isDark: boolean) returning:
     - mainBackground (CSS gradient string)
     - contextBarBg, contextBarText, contextBarMuted
     - cardBg, cardBorder, textPrimary, textMuted
     - sheetBg, sheetBackdrop (for modals)
   - Light values: current cream gradients from shell
   - Dark values: use color-scheme.css dark surfaces (--color-surface-dark, --color-cream text)

3) Wire into CommandCentreShell:
   - Import useTheme + getShellTokens
   - Add ThemeToggle button in sticky context bar (right side, desktop + mobile)
   - Apply tokens to main background and context bar (replace hardcoded cream where practical)
   - Sidebar gradient: keep same in both modes (already dark)

Constraints:
- Navbar-hidden pages must have toggle in shell — this fixes the "can't switch theme on dashboard" bug
- Do not theme every AA chapter yet
- npm run build

Acceptance:
- Toggle visible on /dashboard and /chart
- Switching theme changes main area background visibly
- Legacy pages with navbar still work (ThemeToggle in navbar unchanged)
```

---

## Prompt 6: Dark mode — dashboard content

**Prerequisite:** Prompt 5 complete, Prompt 2 complete  
**Estimated touch:** `dashboard/index.tsx`, possibly `shellTheme.ts`

```text
You are working in nm-zwds.

Goal:
Apply dark mode styling to dashboard main content (not sidebar).

Read first:
- src/styles/shellTheme.ts
- src/pages/dashboard/index.tsx (ToolCard, SectionHeader, profile cards, greeting)
- src/styles/color-scheme.css

Tasks:
1. Replace hardcoded C.navy / C.cream / C.muted inline styles in dashboard MAIN area with getShellTokens(isDark) or Tailwind dark: where simpler
2. Tool cards: gradient headers can stay; body text and borders should adapt
3. Recent profile cards (mobile): readable in dark mode
4. Section headers ("Your Tools", "Recent Profiles"): text contrast
5. Do not break light mode — verify both
6. npm run build

Acceptance:
- /dashboard readable in light and dark
- Sidebar unchanged appearance
- Mobile cards and desktop table both work
```

---

## Prompt 7: Dark mode — result shell + AA shell main areas

**Prerequisite:** Prompt 5 complete, Prompts 3–4 recommended  
**Estimated touch:** `ReportViewerLayout.tsx`, `DocumentViewerLayout.tsx`, `shellTheme.ts`

```text
You are working in nm-zwds.

Goal:
Apply dark mode to report and document viewer shell UI (not full analysis_v2 yet).

Read first:
- src/components/layout/ReportViewerLayout.tsx (mobile header, section sheet, "Now viewing" row)
- src/components/layout/DocumentViewerLayout.tsx
- src/styles/shellTheme.ts

Tasks:
1. Section bottom sheet + backdrop: dark tokens
2. Mobile "Now viewing" header row: dark tokens
3. Sidebar section nav active states: verify readable (sidebar stays dark — likely OK)
4. DocumentViewerLayout session tag bar + main background in dark mode
5. npm run build

Do NOT rewrite Overview/WealthCode/Health in this prompt — shell chrome only.

Acceptance:
- /chart and /alignment-advantage shell UI works in dark mode
- Section sheet readable; no white flash on backdrop
```

---

## Prompt 8: Migrate `/calculate` to Command Centre shell

**Prerequisite:** Prompt 2 complete (CommandCentreShell + dashboard pattern)  
**Estimated touch:** `calculate.tsx`, `navbar.tsx`, delete hero chrome

```text
You are working in nm-zwds.

Goal:
Wrap src/pages/calculate.tsx in CommandCentreShell (DashboardShell pattern — no scroll-spy).

Read first:
- src/pages/calculate.tsx
- src/pages/dashboard/index.tsx (reference for shell usage)
- src/hooks/useAppNavItems.ts
- src/components/navbar.tsx (NAVBAR_HIDDEN_ROUTES)

Tasks:
1. Add "/calculate" to NAVBAR_HIDDEN_ROUTES
2. Remove calculateHeroClass / back button header / calculateGlowClass page chrome
3. Wrap content in CommandCentreShell:
   - contextTitle: "Calculate" or i18n equivalent
   - Mark Calculate active in app nav
4. Keep ProfileForm, profile list, search, delete modal — all business logic unchanged
5. Main content can keep calculateUi classes where they work; adjust padding for shell
6. npm run build

Acceptance:
- /calculate has sidebar + no top navbar
- Form and profile list still work
- Mobile drawer works
```

---

## Prompt 9: Migrate `/founder-report` to shell

**Prerequisite:** Prompt 3 complete  
**Estimated touch:** `founder-report.tsx`, `navbar.tsx`

```text
You are working in nm-zwds.

Goal:
Migrate src/pages/founder-report.tsx to ReportViewerLayout or CommandCentreShell with optional sections.

Read first:
- src/pages/founder-report.tsx (chart + sidebar grid ~line 750, sections)
- src/pages/result.tsx (reference for ReportViewerLayout usage)
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_ROLLOUT.md

Tasks:
1. Add "/founder-report" to NAVBAR_HIDDEN_ROUTES
2. Identify natural section anchors (chart, analysis sections) — add id attributes if missing
3. Wrap in ReportViewerLayout if sections make sense; otherwise CommandCentreShell only
4. Remove duplicate page-level hero/nav if present
5. hasFounderReport tier gate unchanged
6. npm run build

Acceptance:
- /founder-report/:id renders in shell
- Chart + profile sidebar grid still correct (no under-sidebar overlap)
- Desktop + mobile smoke OK
```

---

## Prompt 10: Migrate `destiny-navigator` + `timing-chart`

**Prerequisite:** Prompt 3 complete  
**Estimated touch:** 2 page files, `navbar.tsx`

```text
You are working in nm-zwds.

Goal:
Migrate timing-chart and destiny-navigator pages to Command Centre shell.

Read first:
- src/pages/timing-chart.tsx
- src/pages/destiny-navigator.tsx
- src/pages/result.tsx (layout reference)

Tasks:
1. Add "/timing-chart" and "/destiny-navigator" to NAVBAR_HIDDEN_ROUTES (prefix match)
2. Wrap each page appropriately:
   - timing-chart: likely ReportViewerLayout with chart-focused sections
   - destiny-navigator: CommandCentreShell or ReportViewerLayout with aspect sections
3. Remove old hero/back chrome; use context bar title with profile name
4. useAppNavItems for sidebar
5. Preserve all chart interaction logic — layout only
6. npm run build

Acceptance:
- Both routes work with shell, no navbar
- No functional regression to chart/timing features
```

---

## Prompt 11: Migrate `tier3-result`, `caegpt`, `profile`

**Prerequisite:** Prompt 3 for tier3-result; Prompt 2 for others  
**Estimated touch:** 3 page files

```text
You are working in nm-zwds.

Goal:
Migrate remaining Tier A pages to Command Centre shell.

Pages:
1. src/pages/tier3-result.tsx → same pattern as result.tsx / ReportViewerLayout (may share helper with result)
2. src/pages/caegpt.tsx → CommandCentreShell (simple main content)
3. src/pages/profile.tsx → CommandCentreShell

Read each page first. Add routes to NAVBAR_HIDDEN_ROUTES.

For tier3-result:
- Reuse ReportViewerLayout if structurally similar to result
- Tier 3 redirect logic in App.tsx must still work

For caegpt + profile:
- DashboardShell-style (no section scroll-spy unless natural)
- contextTitle appropriate to page

npm run build

Acceptance:
- All three routes render in shell without navbar
- Tier 3 users still land on correct result page
```

---

## Prompt 12 (optional): `analysis_v2` dark mode on result page

**Prerequisite:** Prompt 7 complete  
**Estimated touch:** `analysis_v2` components, `chartUi.ts`

```text
You are working in nm-zwds.

Goal:
Improve dark mode for analysis sections shown on /result (Overview, WealthCode, Health, FourKeyPalace, AreasOfLife).

Read first:
- src/styles/color-scheme.css (.light-panel)
- src/components/analysis_v2/Overview.tsx
- src/components/analysis_v2/shared/CorePersonalitySection.tsx
- src/styles/chartUi.ts

Strategy:
- Prefer .light-panel wrapper on cream editorial cards so existing text tokens work in dark mode
- OR add dark: variants to section headers where needed
- PNG backgrounds with baked cream: keep hidden in dark (existing pattern)

Tasks:
1. Audit each analysis_v2 section used in result.tsx for hardcoded light colors
2. Apply consistent approach (light-panel or semantic tokens)
3. Verify /chart in dark mode: analysis readable, chart grid still OK
4. npm run build

Acceptance:
- Scrolling analysis on result page readable in dark mode
- Light mode unchanged
- No PDF export regression (pdfExport strips dark)
```

---

## Prompt sizing guide (for future prompts)

| Too small | Right size | Too large |
|-----------|------------|-----------|
| "Add dark class to one button" | One layout migration OR one theme layer | Entire Track 3 + Track 4 in one prompt |
| Single color tweak | Shell refactor + one consumer page | All analysis_v2 + all AA chapters + all pages |
| — | 3–8 files, one npm run build | Whole repo theme pass |

If an agent runs low on context:
- Stop after build passes
- Note remaining files in commit message or handoff note
- Continue with a follow-up prompt scoped to those files only

---

## Handoff template (paste when starting a new agent)

```text
Continue nm-zwds Command Centre rollout.

Completed prompts: [list numbers]
Current prompt: [number and name from this doc]

Read:
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_ROLLOUT.md
- docs/ui-ux/COMMAND_CENTRE_AND_THEME_AGENT_PROMPTS.md (Prompt N section)

Branch: feature/alignment-advantage

Test login: stanley121499@gmail.com (local only)

Run npm run build before finishing.
```
