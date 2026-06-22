# Color Palette Reference

Authoritative list of theme colors used in **nm-zwds**. Tokens are defined in **`src/styles/color-scheme.css`** (canonical). Tailwind reads them via `tailwind.config.js`; TypeScript uses **`src/styles/colorTokens.ts`**. `src/index.css` imports the color template. Dark mode uses the `class` strategy on `<html>` (`darkMode: "class"`).

**Related docs:** [COLOR_SCHEME.md](./COLOR_SCHEME.md) (design intent) · [IMPLEMENTATION.md](./IMPLEMENTATION.md) (code rules) · [PHASE_0_1A_IMPLEMENTATION.md](./PHASE_0_1A_IMPLEMENTATION.md) (rollout notes)

---

## Quick reference — theme accents

| Role | Light mode | Dark mode |
|------|------------|-----------|
| Primary interactive (buttons, links) | `brand-purple` → `brand-purpleDeep` on hover | `accent-goldDark` → `accent-gold` on hover (see auth exceptions below) |
| Primary text | `navy` | `cream` |
| Secondary text | `muted` | `muted-dark` |
| Subtle / metadata text | `muted-subtle-light` (`#7A6B96`) | `muted-subtle` (`#B8AED0` on dark) |
| Page background | `surface-cream` | `surface-dark` |
| Card / elevated surface | `surface-elevated` | `surface-darkSecondary` |
| Card border | `accent-gold` (50% opacity common) | `brand-purpleDeep` |
| Error / danger | `accent-coral` | `accent-coralDark` |
| Logo gradient | `accent-goldDark` → `accent-coralDark` | same |
| Premium gradient **text** | `accent-goldDark` → `accent-coralDark` (`bg-clip-text`) | same |

---

## Brand gradient text (premium highlights)

**Token:** `brandGradientTextClass` in [`src/styles/typographyUi.ts`](../../src/styles/typographyUi.ts)  
**Component:** [`BrandGradientText`](../../src/components/BrandGradientText.tsx), `wrapPhraseInBrandGradient`, `renderTitleWithBrandGradientPhrases`

| Rule | Detail |
|------|--------|
| Gradient | `from-accent-goldDark to-accent-coralDark` + `bg-clip-text text-transparent` |
| Surfaces | Cream page shell, white/`gray-800` cards, dark elevated cards — **not** purple/orange section heroes |
| Budget | ~1–2 gradient targets per viewport (60-30-10 accent layer) |
| Phrases | `Zi Wei Dou Shu`, `Purple Star Astrology`, `紫微斗数` (auto via `renderTitleWithBrandGradientPhrases`) |

**Implemented highlights:** navbar wordmark; dashboard welcome name + featured actions; chart title (product phrase or other profile name); analysis block “LIFE REPORT”; profile display name; calculate/founder heroes; nobleman type; health primary tip; four-key palace name + closing insight; top destiny scoreboard pillar; wealth dominant archetype on scoreboard header.

**Avoid:** `bg-clip-text` on colored hero banners (use white text); light cyan gradients on light backgrounds (see `GRADIENT_TEXT_FIXES.md`).

---

## Tailwind tokens (`tailwind.config.js`)

### Core

| Token | Hex | Tailwind class examples |
|-------|-----|-------------------------|
| Navy | `#1A1E3F` | `text-navy`, `bg-navy` |
| Cream | `#F6F0E8` | `text-cream`, `bg-cream` |

### Surfaces

| Token | Hex | Tailwind class | Typical use |
|-------|-----|----------------|-------------|
| `surface-cream` | `#F6F0E8` | `bg-surface-cream` | App shell background (light) |
| `surface-warm` | `#F5E8D4` | `bg-surface-warm` | Inputs, table headers, hover fills (light) |
| `surface-elevated` | `#FFFFFF` | `bg-surface-elevated` | Cards, navbar (light) |
| `surface-dark` | `#2D1B4E` | `bg-surface-dark` | App shell background (dark) |
| `surface-darkSecondary` | `#1A0F2E` | `bg-surface-darkSecondary` | Cards, navbar, auth card (dark) |
| `surface-darkElevated` | `#3D2860` | `bg-surface-darkElevated` | Dashboard cards/hero on dark shell (lighter than `surface-dark`) |

### Brand (purple)

| Token | Hex | Tailwind class | Typical use |
|-------|-----|----------------|-------------|
| `brand-purple` | `#6B5B95` | `text-brand-purple`, `bg-brand-purple` | Light-mode CTAs, focus rings, icons |
| `brand-purpleLight` | `#9B8FB5` | `text-brand-purpleLight` | Hover / disabled (light), scrollbar hover |
| `brand-purpleDeep` | `#4A3F6B` | `bg-brand-purpleDeep` | Button hover (light), borders (dark), scrollbar (dark) |

### Accent

| Token | Hex | Tailwind class | Typical use |
|-------|-----|----------------|-------------|
| `accent-coral` | `#C84C5C` | `text-accent-coral`, `bg-accent-coral` | Errors, highlights (light) |
| `accent-coralDark` | `#D97C6E` | `text-accent-coralDark`, `bg-accent-coralDark` | Errors, highlights (dark) |
| `accent-gold` | `#D4B896` | `border-accent-gold`, `text-accent-gold` | Borders, dividers, link hover (dark) |
| `accent-goldDark` | `#D4AF7B` | `text-accent-goldDark`, `bg-accent-goldDark` | Dark-mode CTAs, logo gradient start |

### Chart / data viz (brand palette)

| Token | Hex | Tailwind class | Typical use |
|-------|-----|----------------|-------------|
| `chart-orange` | `#E08B5C` | `text-chart-orange`, `bg-chart-orange` | Charts, dashboard icons (light) |

### Muted text

| Token | Hex | Tailwind class | Typical use |
|-------|-----|----------------|-------------|
| `muted` | `#5C5C5C` | `text-muted` | Body / secondary text (light) |
| `muted-dark` | `#C4C4C4` | `text-muted-dark` | Body / secondary text (dark) |
| `muted-subtle` | `#A89BC4` | `text-muted-subtle` | Metadata, chevrons (dark) |

### Flowbite `primary` scale (legacy / calendar)

Used by Flowbite calendar and some older components. Prefer `brand-*` / `accent-*` for new UI.

| Step | Hex |
|------|-----|
| `primary-50` | `#f3f0f7` |
| `primary-100` | `#e8e4ef` |
| `primary-200` | `#d1c9df` |
| `primary-300` | `#b5a8c9` |
| `primary-400` | `#9B8FB5` |
| `primary-500` | `#6B5B95` |
| `primary-600` | `#5a4d7d` |
| `primary-700` | `#6B5B95` |
| `primary-800` | `#4A3F6B` |
| `primary-900` | `#1A1E3F` |

---

## Semantic CSS variables (`src/styles/color-scheme.css`)

| Variable | Light | Dark |
|----------|-------|------|
| `--color-text-accent-muted` | Purple 85% | Gold (`accent-gold`) 80% |
| `--color-text-accent-muted-subtle` | Purple 72% | Gold 55% |
| `--color-text-accent-label` | Purple 78% | Gold 80% |
| `--color-border-default` | Purple 32% | White 10% |
| `--color-surface-featured` | Purple 9% | White 6% |
| `--color-surface-card` | White elevated | `#3D2860` dark elevated |

Tailwind: `text-theme-accent-muted`, `bg-theme-surface-card`, `border-theme-border`, etc.

### Shared semantic Tailwind classes (`theme-*`)

| Class | CSS variable |
|-------|----------------|
| `text-theme-fg` | `--color-text-primary` |
| `text-theme-fg-secondary` | `--color-text-secondary` |
| `bg-theme-btn-primary` | `--color-btn-primary-bg` |
| `text-theme-link-primary` | `--color-link-primary` |
| `text-theme-link-deemphasized` | `--color-link-deemphasized` (forgot-password link) |
| `bg-theme-surface-auth` | `--color-surface-auth-card` |
| `border-theme-border-auth` | `--color-border-auth` |

Auth and dashboard `*Ui.ts` files should use these first; only layout/spacing stays in those modules.

**Light-mode inputs:** `--color-surface-input` is white (`#FFFFFF`); `--color-input-border` is a light purple tint (not gold/warm).

## CSS custom properties (legacy aliases in `color-scheme.css`)

| Variable | Hex | Maps to |
|----------|-----|---------|
| `--background-light` | `#F6F0E8` | `surface-cream` |
| `--background-dark` | `#2D1B4E` | `surface-dark` |
| `--text-light` | `#1A1E3F` | `navy` |
| `--text-dark` | `#F6F0E8` | `cream` |
| `--surface-elevated` | `#FFFFFF` | `surface-elevated` |
| `--accent-gold` | `#D4B896` | `accent-gold` |
| `--brand-purple` | `#6B5B95` | `brand-purple` |

`body` uses `--background-light` / `--text-light`; `.dark` uses `--background-dark` / `--text-dark`.

---

## Background gradients (`backgroundImage` in Tailwind)

| Name | Value | Use |
|------|-------|-----|
| `bg-footer-light` | `linear-gradient(to right, #1A1E3F, #D4B896)` | Footer (light) |
| `bg-footer-dark` | `linear-gradient(to right, #1A0F2E, #E8A989)` | Footer (dark) |
| `bg-gradient-brand-purple` | `linear-gradient(to right, #6B5B95, #4A3F6B)` | Purple brand strip (do not name `brand-purple` — conflicts with solid `bg-brand-purple`) |

**Note:** `#E8A989` appears in `footer-dark` and auth footer bar (dark) but is not a named Tailwind color token.

### Logo (navbar)

| Element | Classes | Colors |
|---------|---------|--------|
| 紫微斗数 | `from-accent-goldDark to-accent-coralDark` | `#D4AF7B` → `#D97C6E` |
| CAE badge | same gradient + `text-surface-darkSecondary` | fill + `#1A0F2E` text |

---

## Decorative overlays (`src/index.css`)

### Auth page (`.auth-page-bg`)

| Layer | Light | Dark |
|-------|-------|------|
| Base fill | `#F6F0E8` | `#2D1B4E` |
| Radial glow (`::before`) | `rgba(107, 91, 149, 0.42)` → transparent (purple) | `rgba(246, 240, 232, 0.28)` → transparent (cream/gold) |
| Bottom bar (`::after`) | `#1A1E3F` → `#D4B896` | `#1A0F2E` → `#D4B896` → `#E8A989` |

### Dashboard (`.dashboard-glow`)

| Mode | Gradient stops (approx.) |
|------|---------------------------|
| Light | Purple radial (aligned with `.auth-page-bg::before`) — no orange stops |
| Dark | Cream/gold radial (aligned with `.dark .auth-page-bg::before`) |

---

## Scrollbars (`src/index.css`)

| Part | Light | Dark |
|------|-------|------|
| Thumb | `#D4B896` (`accent-gold`) | `#4A3F6B` (`brand-purpleDeep`) |
| Thumb hover | `#9B8FB5` (`brand-purpleLight`) | `#6B5B95` (`brand-purple`) |

---

## Semantic UI mapping (implemented)

### Auth (`src/styles/authUi.ts`)

Full rules: [IMPLEMENTATION.md](./IMPLEMENTATION.md#auth-pages--implemented-rules).

| Element | Light | Dark |
|---------|-------|------|
| Submit button (sign-in, sign-up, reset-password) | `bg-brand-purple` / `hover:bg-brand-purpleDeep` / `text-cream` | `bg-accent-goldDark` / `hover:bg-accent-gold` / `text-surface-darkSecondary` |
| Secondary links (sign-in, sign-up, reset-password) | `text-brand-purple` / `hover:text-brand-purpleDeep` | `text-accent-goldDark` / `hover:text-accent-gold` |
| “Forgot password?” link (sign-in only) | `text-brand-purple` / `hover:text-brand-purpleDeep` | `text-brand-purpleLight` / `hover:text-brand-purple` |
| Submit + links (forgot-password page) | same purple as above | `bg-brand-purpleLight` button; links use light purple text |
| Error banner | `bg-accent-coral` / `text-cream` | `bg-accent-coralDark` |
| Input focus (sign-in / sign-up) | `border-brand-purple` / `ring-brand-purple/30` | `border-accent-goldDark` / `ring-accent-goldDark/30` |
| Input focus (forgot-password) | same as sign-in (light) | `border-brand-purpleLight` / `ring-brand-purpleLight/30` |

### Dashboard (`src/styles/dashboardUi.ts`)

Same light purple / dark gold pattern for primary buttons, links, badges, and spinners.

### Navbar (`src/components/navbar.tsx`)

| Element | Light | Dark |
|---------|-------|------|
| Bar | `bg-surface-elevated/80` | `bg-surface-darkSecondary/80` |
| Border | `border-accent-gold/30` | `border-brand-purpleDeep` |
| Logo | gold → coral gradient (`brandGradientTextClass`) | same |

### Chart / analysis highlights

| Element | Class / helper |
|---------|----------------|
| Self chart title phrase | `renderTitleWithBrandGradientPhrases` |
| Other profile chart name | `renderChartTitleWithNameGradient` |
| Analysis section title | `wrapPhraseInBrandGradient` — phrase `LIFE REPORT` |
| Personalized labels | `BrandGradientText` in analysis_v2 + nobleman (see table above) |
| Chart 四化 semantics (frozen) | `src/styles/chartSemanticColors.ts` — green/blue/yellow/red |
| Chart UI chrome (selection, center) | `chartBrandChrome` in `chartSemanticColors.ts` — brand purple |

---

## Colors outside the main theme

These are **not** in `tailwind.config.js` theme tokens. Used for specific features only.

### Footer / auth gradient extra stop

| Hex | Where |
|-----|--------|
| `#E8A989` | `bg-footer-dark`, `.dark .auth-page-bg::after` |

### Neon border (CAEGPT card, `index.css`)

`#ff006e`, `#8338ec`, `#3a86ff`, `#06ffa5`, `#ffbe0b`, `#fb5607`

### Forecast / liu month charts (`liuMonthData.ts`)

Tailwind-style blues, greens, reds, violets (e.g. `#2563eb`, `#059669`, `#e11d48`, `#7c3aed`) — data visualization only.

### PDF / print

`#ffffff` backgrounds in export utilities; separate from app theme.

---

## Copy-paste: all hex values (theme only)

```
#F6F0E8  surface-cream / cream
#F5E8D4  surface-warm
#FFFFFF  surface-elevated
#2D1B4E  surface-dark
#1A0F2E  surface-darkSecondary
#3D2860  surface-darkElevated

#1A1E3F  navy
#F6F0E8  cream (text on dark)

#6B5B95  brand-purple
#9B8FB5  brand-purpleLight
#4A3F6B  brand-purpleDeep

#C84C5C  accent-coral
#D97C6E  accent-coralDark
#D4B896  accent-gold
#D4AF7B  accent-goldDark

#E08B5C  chart-orange

#5C5C5C  muted
#C4C4C4  muted-dark
#A89BC4  muted-subtle (dark metadata)
#7A6B96  muted-subtle-light (light metadata)
#B8AED0  muted-subtle (dark mode text-subtle)

#E8A989  footer-dark stop (unnamed token)
```

---

## Adding or changing colors

1. Add the token under `theme.extend.colors` in `tailwind.config.js`.
2. If needed globally in CSS, add a `:root` variable in `src/index.css`.
3. Use semantic wrappers (`authUi.ts`, `dashboardUi.ts`) for repeated combinations — see [IMPLEMENTATION.md](./IMPLEMENTATION.md).
4. Never add a `backgroundImage` key with the same name as a `colors` token used with `bg-*`.
5. Update this file and [COLOR_SCHEME.md](./COLOR_SCHEME.md) if design intent changes.

**Design credit:** CAE GOH | © 2025
