# Color Guide — Implementation Rules

How the [COLOR_SCHEME.md](./COLOR_SCHEME.md) design guide is applied in **nm-zwds** source code. For hex values and Tailwind class names, see **[COLORS.md](./COLORS.md)**. For the initial rollout checklist, see **[PHASE_0_1A_IMPLEMENTATION.md](./PHASE_0_1A_IMPLEMENTATION.md)**.

**Status:** Active — reflects auth accent rules, shared UI modules, and Tailwind config as implemented in the repo.

---

## Document map

| Doc | Purpose |
|-----|---------|
| [COLOR_SCHEME.md](./COLOR_SCHEME.md) | Design intent, palette tables, accessibility notes |
| [COLORS.md](./COLORS.md) | Token catalog (hex, Tailwind classes, CSS variables) |
| **This file** | Rules and patterns for implementing UI in code |
| [PHASE_0_1A_IMPLEMENTATION.md](./PHASE_0_1A_IMPLEMENTATION.md) | Phase 0 + 1a rollout steps (historical checklist) |

---

## Architecture

### Dark mode

- **Strategy:** `darkMode: "class"` in `tailwind.config.js`
- **Toggle target:** `document.documentElement` (`<html class="dark">`)
- **Boot script:** `public/index.html` reads `localStorage.theme` (or system preference) before paint to avoid flash
- **Runtime toggle:** `src/components/ThemeToggle.tsx`

Always pair light and dark utilities: `text-navy dark:text-cream`, not theme-specific one-off colors in page files.

### Where tokens live

| Layer | File | Responsibility |
|-------|------|----------------|
| **Color template** | `src/styles/color-scheme.css` | All `--color-*` hex + semantic variables (`--color-text-accent-muted`, etc.) |
| **TS retrieval** | `src/styles/colorTokens.ts` | `cssVar` names + `palette` hex for docs/scripts |
| Tailwind theme | `tailwind.config.js` | Maps Tailwind classes to `var(--color-*)` and `theme-*` semantic aliases |
| Global CSS | `src/index.css` | Imports `color-scheme.css`; `.auth-page-bg`, `.dashboard-glow`, scrollbars |
| Auth UI | `src/styles/authUi.ts` | Auth page class strings + Flowbite input themes |
| Dashboard UI | `src/styles/dashboardUi.ts` | Dashboard class strings |
| Layout shell | `src/layouts/MainLayout.tsx` | App background (`surface-cream` / `surface-dark`) |
| Auth shell | `src/components/auth/AuthPageLayout.tsx` | Centered auth column wrapper |

### Rule: prefer semantic modules over inline classes

For any surface that repeats the same light/dark token combination across files:

1. Add or extend an export in `authUi.ts` or `dashboardUi.ts` (or create a new `*Ui.ts` module for a major area).
2. Import that export in pages/components.
3. Do **not** copy long Tailwind strings into multiple TSX files.

Exception: one-off layout spacing (`px-4`, `gap-2`) may stay inline.

---

## Global accent rules (from the design guide)

These rules implement the “Design Guidelines” section of [COLOR_SCHEME.md](./COLOR_SCHEME.md).

### Light mode

| Role | Tokens | Rule |
|------|--------|------|
| Page background | `surface-cream` | Default app shell |
| Primary text | `navy` | Headings, labels, primary copy |
| Secondary text | `muted` | Descriptions, table metadata |
| Primary CTA | `brand-purple` → `brand-purpleDeep` | Buttons, main links |
| CTA text on purple | `cream` | Button label color |
| Accent borders | `accent-gold` (often `/30`–`/60` opacity) | Cards, inputs, dividers |
| Errors / danger | `accent-coral` | Banners, destructive actions |
| Charts / icons | `brand-purple`, `chart-orange` | Data viz (light) |

### Dark mode

| Role | Tokens | Rule |
|------|--------|------|
| Page background | `surface-dark` | Default app shell |
| Elevated surfaces | `surface-darkSecondary` | Cards, navbar, auth card |
| Primary text | `cream` | Headings, labels |
| Secondary text | `muted-dark`, `muted-subtle` | Body, chevrons |
| Primary CTA | `accent-goldDark` → `accent-gold` | Buttons, main links (default pattern) |
| CTA text on gold | `surface-darkSecondary` | Dark gold button label |
| Card borders | `brand-purpleDeep` | Replaces gold borders from light mode |
| Errors | `accent-coralDark` | Banners |
| Charts / icons | `accent-goldDark` | Dashboard icons (dark) |

**Design principle:** In dark mode, gold replaces purple for *primary* interactive emphasis (higher contrast on deep purple backgrounds). Purple remains for structure (borders, secondary flows).

---

## Auth pages — implemented rules

**Files:** `src/pages/authentication/*.tsx`, `src/styles/authUi.ts`, `src/components/auth/AuthPageLayout.tsx`, `src/index.css` (`.auth-page-bg`)

### Page chrome

| Element | Light | Dark |
|---------|-------|------|
| Shell (via MainLayout) | `bg-surface-cream` | `bg-surface-dark` |
| Auth radial layer | `.auth-page-bg` cream + purple glow | `.auth-page-bg` dark purple + cream/gold glow |
| Card | `authCardClass` — elevated white, gold border | dark secondary surface, `brand-purpleDeep` border |
| Title / labels | `authTitleClass`, `authLabelClass` | `cream` text |

### Sign-in and sign-up (dark mode: gold primary)

| Element | Export | Light | Dark |
|---------|--------|-------|------|
| Submit button | `authSubmitButtonClass` | `bg-theme-btn-primary`, `text-theme-btn-primary-text` | same tokens (values switch in `color-scheme.css`) |
| Secondary links (e.g. “Create account”) | `authLinkClass` | `text-theme-link-primary` | `text-theme-link-primary` (gold in dark via CSS vars) |
| Text inputs | `authTextInputTheme` | `focus:border-theme-input-focus` | gold focus via `--color-input-focus-border` |
| Error banner | `authErrorBannerClass` | `bg-theme-banner-error` | `bg-theme-banner-error` |
| Success banner | `authSuccessBannerClass` | `bg-theme-banner-success` | `bg-theme-banner-success` |

### Sign-in only — “Forgot password?” (dark mode: light purple)

Uses **`authForgotPasswordLinkClass`** (not `authLinkClass`):

| Mode | Classes |
|------|---------|
| Light | `text-brand-purple` → hover `brand-purpleDeep` |
| Dark | `text-brand-purpleLight` → hover `brand-purple` |

Rationale: de-emphasize recovery link vs gold primary CTA on the same form.

### Forgot-password page (dark mode: light purple primary)

Uses dedicated exports so the flow is visually distinct from sign-in/sign-up:

| Element | Export | Dark mode |
|---------|--------|-----------|
| Submit button | `authForgotPageSubmitButtonClass` | `bg-brand-purpleLight`, `text-cream`, hover `brand-purple` |
| Back / sign-in links | `authForgotPageLinkClass` | same as `authForgotPasswordLinkClass` |
| Text inputs | `authForgotPageTextInputTheme` | focus `brand-purpleLight` |

### Reset-password page

Follows **sign-in / sign-up** pattern: `authSubmitButtonClass`, `authLinkClass`, `authTextInputTheme` (gold dark accents).

### Wiring checklist (new auth screen)

1. Wrap content in `<AuthPageLayout>`.
2. Use `Card` with `className={authCardClass}`.
3. Pick button/link/input exports from the table above (gold vs forgot-page purple).
4. Do not import raw `bg-brand-purple` on buttons without the shared class string.

---

## Calculate page — implemented rules

**Files:** `src/pages/calculate.tsx`, `src/styles/calculateUi.ts`, `src/styles/profileFormUi.ts`, `src/components/ProfileForm.tsx`

Uses the same `theme-*` tokens as dashboard/auth. Layout class strings live in `calculateUi.ts`; the embedded `ProfileForm` uses `profileFormUi.ts` (also used on create-profile / result when that form is shown).

---

## Dashboard — implemented rules

**File:** `src/styles/dashboardUi.ts`, `src/pages/dashboard/index.tsx`

| Pattern | Light | Dark |
|---------|-------|------|
| Primary button | `dashboardPrimaryButtonClass` — purple fill | gold fill (`accent-goldDark` → `accent-gold` hover) |
| Primary text link | `dashboardPrimaryLinkClass` | gold text |
| Section icons | `dashboardSectionIconClass` | gold icon |
| Spinner | `dashboardSpinnerClass` | gold border |
| Cards / tables | `dashboardCardClass`, table head/row classes | `surface-darkSecondary`, `brand-purpleDeep` borders |

Glow: render `dashboardGlowClass` (`fixed` viewport layer in `index.css`) as a sibling **outside** animated wrappers so transforms do not clip the gradient.

### Dashboard color ratio (60-30-10)

| Layer | ~Share | Tokens | Dashboard usage |
|-------|--------|--------|-----------------|
| Dominant | 60% | `surface-cream` / `surface-dark`, low-opacity `.dashboard-glow` | `MainLayout` shell; glow stays subtle (see `index.css`) |
| Secondary | 30% | `surface-elevated`, `surface-warm`, `surface-darkSecondary`; `muted` / `muted-dark` text | `dashboardHeroClass`, cards, table head, standard action rows |
| Accent | 10% | `brand-purple` / `accent-goldDark`; `accent-coral` for delete only | One featured action (`dashboardActionLinkFeaturedClass` + `dashboardIconAccentClass`); primary links/buttons; section icons; Founder Report may use `chart-orange` |

**Exports:** `dashboardHeroClass`, `dashboardSectionLabelClass`, `dashboardActionLinkFeaturedClass`, `dashboardIconBoxNeutralClass`, `dashboardIconNeutralClass`, `dashboardIconBoxAccentClass`, `dashboardIconAccentClass`, `dashboardTableDividerClass`, `dashboardTableWrapperClass`.

**Rules:** Do not assign purple + coral + orange icon boxes to every quick action; only the Calculate row uses featured accent styling. Table dividers use `dashboardTableDividerClass`, not inline `divide-*` in TSX.

**Accent parity with auth:** Light dashboard uses `brand-purple` borders, links, featured row, and glow (not `surface-warm` / `accent-gold` fills). Dark dashboard uses `accent-goldDark` for links, featured row, table header tint, and glow — purple is structural (`brand-purpleDeep` borders) only.

**Dark card lift:** Dashboard cards/hero use `surface-darkElevated` (`#3D2860`) on the `surface-dark` shell so panels read above the page. Nested rows use `dark:bg-white/[0.04]` and `dark:border-white/10` instead of stacking `surface-darkSecondary` / `brand-purpleDeep` fills.

---

## Navbar and shell

**Files:** `src/components/navbar.tsx`, `src/layouts/MainLayout.tsx`

| Element | Light | Dark |
|---------|-------|------|
| Bar background | `surface-elevated/80` | `surface-darkSecondary/80` |
| Bar border | `accent-gold/30` | `brand-purpleDeep` |
| Logo wordmark gradient | `from-brand-purple to-brand-purpleDeep` | `from-accent-goldDark to-accent-coralDark` |
| Theme toggle hover | `surface-warm/80` | `brand-purpleDeep/50` |

Use `bg-gradient-to-r from-brand-purple to-brand-purpleDeep` for avatar rings — **not** `bg-brand-purple` (see pitfalls below).

---

## Tailwind pitfalls

### 1. Never reuse a color name for `backgroundImage`

**Problem:** Defining both `theme.extend.colors.brand.purple` and `backgroundImage["brand-purple"]` makes `bg-brand-purple` emit **solid fill and gradient** in the same utility. `dark:bg-accent-goldDark` then changes only `background-color`; a purple gradient remains visible.

**Fix (implemented):** Gradient token is `gradient-brand-purple`:

```js
// tailwind.config.js — use bg-gradient-brand-purple for strips
"gradient-brand-purple": "linear-gradient(to right, #6B5B95, #4A3F6B)",
```

Solid buttons use `bg-brand-purple` only.

**After changing `tailwind.config.js`:** restart the dev server so Tailwind rebuilds.

### 2. `text-*` vs `bg-*` on the same token name

`text-brand-purple` and `bg-brand-purple` are safe together. The collision is specific to **`bg-{name}`** conflicting with **`backgroundImage.{name}`**.

### 3. Flowbite components

Pass theme overrides via `theme={authTextInputTheme}` (or local theme object). Do not rely on default Flowbite blue focus rings on auth pages.

### 4. Opacity modifiers

Prefer token opacity (`border-accent-gold/50`) over arbitrary hex alpha in TSX unless the design doc specifies a one-off.

---

## CSS variables (`src/index.css`)

Used for document-level defaults (not every component):

```css
:root {
  --background-light: #F6F0E8;
  --background-dark: #2D1B4E;
  --text-light: #1A1E3F;
  --text-dark: #F6F0E8;
  --surface-elevated: #FFFFFF;
  --accent-gold: #D4B896;
  --brand-purple: #6B5B95;
}
```

Prefer Tailwind semantic tokens in React. Add a CSS variable only when plain CSS must reference the color (e.g. `body` background).

---

## Adding a new themed surface

1. **Design** — Confirm light/dark tokens in [COLOR_SCHEME.md](./COLOR_SCHEME.md); add hex to [COLORS.md](./COLORS.md) if new.
2. **Token** — Add under `theme.extend.colors` in `tailwind.config.js` (never duplicate the name under `backgroundImage`).
3. **Module** — Add a named export in the closest `*Ui.ts` file with both `dark:` variants.
4. **Page** — Import the export; keep TSX limited to layout classes.
5. **Verify** — Toggle theme on the page; check buttons (gradient bug), focus rings, and link hover states.
6. **Docs** — Update [COLORS.md](./COLORS.md) semantic mapping table if the pattern is reusable.

---

## Verification checklist

| Check | How |
|-------|-----|
| No flash on load | Hard refresh sign-in; theme script in `index.html` |
| Sign-in dark submit | Button is solid gold `#D4AF7B`, not purple gradient |
| Sign-in “Forgot password?” | Light purple `#9B8FB5` in dark mode |
| Sign-in “Create account” | Gold link in dark mode |
| Forgot-password page | Light purple button in dark mode |
| Sign-up / reset-password | Gold button in dark mode |
| Dashboard primary CTA | Gold button in dark mode |
| Tailwind build | `npm start` with no missing class warnings |

---

## Source index (quick)

| Area | Primary files |
|------|----------------|
| Tokens | `tailwind.config.js` |
| Global / auth bg | `src/index.css` |
| Auth classes | `src/styles/authUi.ts` |
| Dashboard classes | `src/styles/dashboardUi.ts` |
| Sign-in | `src/pages/authentication/sign-in.tsx` |
| Sign-up | `src/pages/authentication/sign-up.tsx` |
| Forgot password | `src/pages/authentication/forgot-password.tsx` |
| Reset password | `src/pages/authentication/reset-password.tsx` |
| Theme toggle | `src/components/ThemeToggle.tsx` |

---

**Design credit:** CAE GOH | © 2025
