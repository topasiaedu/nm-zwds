# UI/UX Branching Workflow

All frontend design and UI/UX improvement work lives on a dedicated long-lived branch so `main` stays stable while design iterates.

## Branch layout

```
main                          ← production-ready default
└── feature/ui-ux-improvements   ← integration branch for all UI/UX work
    └── feature/ui-ux/<topic>    ← optional short-lived topic branches
```

| Branch | Purpose |
|--------|---------|
| `main` | Stable app; merge UI/UX work here when a milestone is ready |
| `feature/ui-ux-improvements` | Default workspace for color, layout, components, i18n polish, etc. |
| `feature/ui-ux/<topic>` | Optional slices (e.g. `color-scheme`, `chart-layout`) merged back into `feature/ui-ux-improvements` |

This matches existing repo conventions (`feature/ten-year-cycle-report` on the remote).

## Daily workflow

### 1. Start on the UI/UX branch

```powershell
cd e:\projects\nm-zwds
git fetch origin
git checkout feature/ui-ux-improvements
git pull origin feature/ui-ux-improvements   # after first push
```

If the branch does not exist locally yet:

```powershell
git checkout -b feature/ui-ux-improvements origin/feature/ui-ux-improvements
```

### 2. Optional topic branch for a focused change

```powershell
git checkout -b feature/ui-ux/color-scheme
# ... work, commit ...
git checkout feature/ui-ux-improvements
git merge feature/ui-ux/color-scheme
git branch -d feature/ui-ux/color-scheme
```

### 3. Commit and push

```powershell
git add .
git commit -m "feat(ui): describe the visual or UX change"
git push -u origin feature/ui-ux-improvements
```

Use conventional prefixes where helpful: `feat(ui)`, `fix(ui)`, `style`, `refactor(ui)`.

### 4. Open a pull request to `main`

When a chunk of UI/UX work is reviewable:

```powershell
gh pr create --base main --head feature/ui-ux-improvements --title "UI/UX: <summary>" --body "..."
```

Merge to `main` when QA passes. Keep working on `feature/ui-ux-improvements` for the next iteration.

### 5. Stay in sync with `main`

Periodically bring in fixes and releases from `main`:

```powershell
git checkout feature/ui-ux-improvements
git fetch origin
git merge origin/main
# resolve conflicts, then push
git push origin feature/ui-ux-improvements
```

## What belongs on this branch

- CSS / Tailwind / theme tokens (`src/index.css`, design tokens)
- React components and pages (layout, spacing, typography)
- Color and design docs (`docs/color-scheme/`, `docs/ui-ux/`)
- i18n copy and UI-only locale tweaks
- Static assets under `public/` used for presentation

Keep unrelated backend or ZWDS engine changes on `main` or their own `feature/*` branches.

## First-time remote setup

After your first commit on `feature/ui-ux-improvements`:

```powershell
git push -u origin feature/ui-ux-improvements
```

## Current status

- **Active branch:** `feature/ui-ux-improvements` (created from `main`)
- **In progress:** `docs/color-scheme/COLOR_SCHEME.md` (untracked until committed)
