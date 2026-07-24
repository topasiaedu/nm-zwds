# Monthly Consultation — agent tasks

Buyer feedback (`MONTHLY_REPORT_FEEDBACK.md`) says the report feels like a strong automated timing brief, not a $50 consultation.

| Track | Intent | Feedback IDs |
| ----- | ------ | ------------ |
| **P0** | Trust killers | P2 empty stars, P3 scorecard, P6 aspect actions |
| **P1** | Premium (~$50) feel | P5 month contract, P4 signal hierarchy + decision board, P1 rarity depth, operational close / bridge |

**P1 assumes P0 is done** (or at least already in the tree). Do not undo P0 while implementing P1. Do not merge an entire track into one agent session.

## Keep / do not dilute

While fixing P0 or P1, leave these intact (strengthen if you touch adjacent copy, do not strip):

- Month spine (one priority + one move)
- Si Hua framed as moves (`activationCards` / signals)
- History / rarity hook
- Trap + Exact Words (scripts)
- Convergence score + tips

## P0 — trust killers

### Recommended agent order

| Order | Brief | Why first |
| ----- | ----- | --------- |
| 1 | [`P0-01-empty-stars-rewrite.md`](./P0-01-empty-stars-rewrite.md) | Smallest surface; unblocks “Your chart” trust on empty Life palace months |
| 2 | [`P0-02-scorecard-distinct-drivers.md`](./P0-02-scorecard-distinct-drivers.md) | Needs aspect palace snapshots + activations; types may grow |
| 3 | [`P0-03-aspect-chart-tied-actions.md`](./P0-03-aspect-chart-tied-actions.md) | Heaviest content work; can reuse star/palace driver patterns from P0-02 |

### How to verify after each P0 task

1. **Typecheck:** `npx tsc --noEmit` from repo root (CRA project; there is no dedicated `typecheck` script).
2. **Lint (optional):** `npm run lint` on touched files if noisy.
3. **UI:** with `npm start`, open Monthly Consultation Document Viewer for a real profile.
4. **PDF:** print route that renders `MonthlyConsultationPrintDocument` (same chapters as viewer via `MonthlyConsultationBody`).

| Task | Look for |
| ---- | -------- |
| P0-01 | Empty focus palace: full meaning section, not “light on main stars / skip”. Non-empty: real star cues still present |
| P0-02 | Four bars, **four different** mechanism lines; trends not all “rising” with identical drivers; one protect / press line visible |
| P0-03 | Work / Money / People each show **≤3 ranked** Do actions that name that aspect’s palace and/or stars; Avoid lists not identical across aspects |

## P1 — must-have for ~$50 consultation feel

Run **after** P0. Prefer this order so Cover contract and shared ranking land before Close reuses them. P1-03 (rarity) can swap with P1-02 if needed; do **not** split hierarchy away from decisions.

### Recommended agent order

| Order | Brief | Why |
| ----- | ----- | --- |
| 1 | [`P1-01-month-contract.md`](./P1-01-month-contract.md) | Cover plan fields; Close (P1-04) reuses move / deadline / success |
| 2 | [`P1-02-signal-hierarchy-and-decisions.md`](./P1-02-signal-hierarchy-and-decisions.md) | Shared priority model for activations + Hard Yes / Soft Yes / Wait / No |
| 3 | [`P1-03-rarity-depth.md`](./P1-03-rarity-depth.md) | Exact stack + history depth; no population % |
| 4 | [`P1-04-operational-close-bridge.md`](./P1-04-operational-close-bridge.md) | Operational Close + next-month bridge; prefers P1-01 fields |

### How to verify after each P1 task

Same typecheck / UI / PDF path as P0.

| Task | Look for |
| ---- | -------- |
| P1-01 | Cover states primary move, deadline, success measure, anti-pattern |
| P1-02 | Activations ranked by urgency; decisions use Hard Yes / Soft Yes / Wait / No; ≥1 Wait or No when launches should wait; Prosperity does not override Challenge / Consolidation wait |
| P1-03 | Rarity shows exact English stack + priors + how to use history; no fake population % |
| P1-04 | Close has one decision, by when, success measure, and bridge naming next month’s palace |

## Shared constraints (every agent)

- TypeScript: no `any`, no non-null assertion (`!`), no `as unknown as T`
- Strings: double quotes (`"`); prefer templates or `.join()` over `+` concatenation
- English-only UI copy for monthly consultation
- No em dashes or en dashes in user-facing copy (use commas, periods, or hyphens)
- No Chinese characters in user-facing monthly report copy (Chinese may remain in chart data keys internally)
- Do not invent fake population rarity percentages
- Match existing chapter visual language (`ChapterShell`, warm cards); do not redesign the whole report
- Prefer editing data builders (`contentLibraries`, `buildMonthlyConsultationBundle`, `rarity`) over hardcoding copy only in JSX
