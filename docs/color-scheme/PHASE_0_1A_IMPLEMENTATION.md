# Phase 0 + Phase 1a — Implementation Guide

**Status: implemented.** Source: [COLOR_SCHEME.md](./COLOR_SCHEME.md).

**Ongoing rules:** [IMPLEMENTATION.md](./IMPLEMENTATION.md) (auth gold vs purple accents, Tailwind pitfalls, checklists).

Shared auth styles: `src/styles/authUi.ts`, `src/components/auth/AuthPageLayout.tsx`.

---

## Phase 0 — Foundation

### 1. `tailwind.config.js`

- Add `const colors = require("tailwindcss/colors");`
- Spread `...colors` in `theme.colors` (restores gray, red, etc.)
- Replace `primary` scale with brand purple (`#6B5B95` at 500/700)
- Add under `theme.extend.colors`: `navy`, `cream`, `surface`, `brand`, `accent`, `chart`, `muted`
- Add `backgroundImage`: `footer-light`, `footer-dark`, `gradient-brand-purple` (not `brand-purple` — see [IMPLEMENTATION.md](./IMPLEMENTATION.md#1-never-reuse-a-color-name-for-backgroundimage))

### 2. `src/index.css`

Wire CSS variables (replace lines 17–28):

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

body {
  margin: 0;
  font-family: Inter, InterVariable, ui-sans-serif, system-ui, sans-serif;
  background-color: var(--background-light);
  color: var(--text-light);
}

.dark {
  background-color: var(--background-dark);
  color: var(--text-dark);
}
```

Update scrollbar thumbs to `#D4B896` / `#4A3F6B` (light/dark).

### 3. `src/index.tsx`

```ts
import "./assets/fonts/inter/web/inter.css";
```

### 4. `public/index.html`

Before `</head>`:

```html
<meta name="theme-color" content="#F6F0E8" />
<script>
  (function () {
    var t = localStorage.getItem("theme");
    var dark =
      t === "dark" ||
      (!t && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  })();
</script>
```

### 5. `src/layouts/MainLayout.tsx`

```tsx
className="relative min-h-screen w-full overflow-hidden bg-surface-cream dark:bg-surface-dark transition-colors duration-500"
```

### 6. `src/components/navbar.tsx`

- Nav bar: `bg-surface-elevated/80 dark:bg-surface-darkSecondary/80 border-accent-gold/30 dark:border-brand-purpleDeep`
- Title gradient: `from-brand-purple to-brand-purpleDeep` / dark: `from-accent-goldDark to-accent-coralDark`
- Dropdown: `bg-surface-elevated dark:bg-surface-darkSecondary border-accent-gold/40`
- Avatar ring: `from-brand-purple to-brand-purpleDeep`

### 7. `src/components/ThemeToggle.tsx`

```tsx
className="... text-navy dark:text-cream hover:bg-surface-warm/80 dark:hover:bg-brand-purpleDeep/50"
```

---

## Phase 1a — Auth pages

### New files

**`src/styles/authUi.ts`** — shared class strings + `authTextInputTheme` for Flowbite.

**`src/components/auth/AuthPageLayout.tsx`** — `authPageShellClass` + `authPageInnerClass` wrapper.

### Pages to update

| File | Changes |
|------|---------|
| `sign-in.tsx` | `AuthPageLayout`, `authCardClass`, `authSubmitButtonClass`, `authLinkClass`, `authTextInputTheme` |
| `sign-up.tsx` | Same + `authErrorBannerClass` / `authSuccessBannerClass` / `authInfoBannerClass` |
| `forgot-password.tsx` | Wrap in `AuthPageLayout`; replace blue links and purple gradient button |
| `reset-password.tsx` | Same as sign-in |

### Token class reference

| Element | Light | Dark |
|---------|-------|------|
| Page bg | `bg-surface-cream` | `bg-surface-dark` |
| Card | `bg-surface-elevated border-accent-gold/50` | `bg-surface-darkSecondary border-brand-purpleDeep` |
| Heading | `text-navy` | `text-cream` |
| Body | `text-muted` | `text-muted-dark` |
| Link | `text-brand-purple` | `text-accent-goldDark` (exceptions: forgot-password flow — [IMPLEMENTATION.md](./IMPLEMENTATION.md#auth-pages--implemented-rules)) |
| Button | `bg-brand-purple text-cream` | `bg-accent-goldDark text-surface-darkSecondary` |
| Error | `bg-accent-coral` | `bg-accent-coralDark` |

---

## Verify

1. `npm start` — no Tailwind build errors
2. `/authentication/sign-in` — cream bg light, purple bg dark
3. Toggle theme — no flash (after index.html script)
4. Flowbite inputs visible on both modes

---

## Commit message

```
feat(ui): apply color scheme foundation and auth pages (Phase 0 + 1a)
```

Branch: `feature/ui-ux-improvements`
