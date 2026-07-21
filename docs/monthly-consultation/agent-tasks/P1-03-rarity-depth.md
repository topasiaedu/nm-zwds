# P1-03 — Rarity page depth

**Agent brief.** You are deepening the Pattern / rarity chapter so it feels consultation-grade: **exact stack in plain English**, prior months listed with meaning, and clear coaching on **what that pattern usually asks** and **how to use history**. Strengthen trust without inventing population rarity percentages.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → Must-have **P1** (rarity / fingerprint page). Note: agent series calls this **P1-03**; feedback doc ID **P1** is the same product item.

**Assumes:** P0 done. Prefer after P1-01/P1-02 if session order matters, but this brief can ship alone. Do not undo P0. Do **not** add fake “~5–7% of charts” population stats (EXAMPLE demo is dramatized; product rule forbids it).

**Read first:** this file + `rarity.ts` + `ChapterRarity`.

---

## Goal

Rarity chapter answers: *why this month is not generic* — exact stack, personal priors, what that usually asks, how to use history.

## Acceptance criteria

- [ ] Page shows the **exact stack** in plain English (decade area, month focus palace, main activation star + signal + landing) — not only step tips.
- [ ] Prior months are visible (already pill chips) **and** narrative explains how to use them (repeat what helped / skip what leaked) with more depth than one short line when `priorCount > 0`.
- [ ] When `priorCount === 0`, first-time framing stays honest (experiment + note), still explains **why the stack is personal** via chart layers.
- [ ] “What it usually asks” is concrete for **this** palace + primary activation (theme + avoid), not generic self-help.
- [ ] **No** population rarity % or “across all charts” claims.
- [ ] English-only UI; no em/en dashes; no Chinese characters in user-facing strings (`fingerprintDisplayLabel` / chapter copy).
- [ ] `npx tsc --noEmit` passes.

## Problem statement

From buyer feedback:

> History hook (“Seen before…”) is high trust; believers want *you’ve been here before — repeat what helped*.
>
> Pattern + steps — practical; **history could be deeper (what typically happened)**.
>
> Must-have: **Rarity / fingerprint page** — exact stack, prior months it appeared, plain-language meaning. Turns “1 earlier match” into consultation-grade trust.

Acceptance: *Rarity / prior-match page explains why this month is not generic.*

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/rarity.ts` | **`buildRarityFingerprint`** (~233–324), **`buildActionableGuidance`** (~183–228), **`PALACE_GUIDANCE`**, **`ACTIVATION_COACH`**, **`DEFAULT_PALACE_GUIDANCE`**. Scan loop already finds `priorOccurrences` via `buildFingerprintKey` + `resolveMonthlyTimingStack` / `resolveLiuYueStemSiHua` |
| `src/utils/forecast/monthlyConsultation/stemSiHua.ts` | **`buildFingerprintKey`** (~122–136) — matching key (Chinese palace names + hua); do not break matching when improving display |
| `src/utils/forecast/monthlyConsultation/englishLabels.ts` | **`fingerprintDisplayLabel`** (~139–151), `starToEnglish`, `SI_HUA_LABEL`, `palaceToEnglish` |
| `src/utils/forecast/monthlyConsultation/types.ts` | **`RarityFingerprint`** (~68–80): today `fingerprintKey` (already a **display** label), `priorOccurrences`, `priorCount`, `narrative`, `whatItMeans`, `actionSteps`, `historyCoach`. Extend if needed (e.g. `stackLines: string[]`, `usualAsk: string`, `priorMonthsDetail: string`) — keep names honest |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | Call site ~267–277 (`includeRarity` true for main bundle; stub when false for prior-month core) |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | **`ChapterRarity`** (~151–201): currently title “What to do with this month”, subtitle `whatItMeans`, Steps box, TipList (`historyCoach` + `narrative`), prior count pills. **Does not render `fingerprintKey` / stack as a first-class “Your exact configuration” block** |

**Print:** same `ChapterRarity` via body / print document.

### Current gaps

- `fingerprintKey` is built as English display via `fingerprintDisplayLabel` but **ChapterRarity never shows it**.
- `whatItMeans` is two short clauses (palace theme + primary activation meaning).
- `historyCoach` is one sentence for repeats; does not spell “what that window usually asks” beyond `ACTIVATION_COACH`.
- `priorOccurrences` capped at last **5** (`MAX_LISTED_DATES`) — fine; ensure list + coach stay aligned.
- EXAMPLE report’s population % is **forbidden** in product.

## Current vs desired behavior

### Current UI shape

1. Steps (actionSteps × 3)
2. Use your history tips
3. “N earlier matches” + M{month} {year} chips

### Desired (consultation-grade, still compact)

1. **Exact stack** block (labeled lines from decade / month focus / main activation) — use `fingerprintKey` split into bullets **or** new structured fields.
2. **Why not generic** — one short paragraph: this is *your* Da Xian + Liu Yue focus + this activation landing, not “July advice.”
3. **What it usually asks** — palace theme + activation ask + one avoid (`ACTIVATION_COACH.avoid`).
4. **History** — if priors: list months + “Repeat what helped… / What these months tend to reopen: {theme}.” If none: first-time coach unchanged in tone but still show full stack.
5. Keep 2–3 action steps (do not turn rarity into another checklist chapter).

## Implementation steps

1. **Extend `RarityFingerprint`** only as needed for clean UI (prefer structured `stackSummary` lines over stuffing one megastring).
2. **Enrich `buildActionableGuidance` / `buildRarityFingerprint`:**
   - Always populate stack display fields from decade English, month focus English, primary activation English.
   - Deepen `historyCoach` when `priorCount > 0`: include prior date list + “what this pattern usually asks” (theme + avoid).
   - Keep matching logic (`buildFingerprintKey`) unchanged.
3. **Update `ChapterRarity`:**
   - Show exact stack above or beside steps.
   - Subtitle / section titles: “Why this month is yours” energy without redesigning all chapter chrome.
   - Render prior months + history coach clearly; do not hide stack behind tips only.
4. Guardrails: grep new copy for `%`, “population”, “of charts”, “of readings”.
5. Smoke: month with `priorCount >= 1` and a first-time month.
6. `npx tsc --noEmit`.

## Out of scope

- Month contract (P1-01), decision hierarchy (P1-02), letter bridge (P1-04)
- Changing fingerprint matching algorithm to include secondary Si Hua (optional later; not required)
- Fake combinatorial population frequencies
- Full EXAMPLE.md Chinese tables in the product UI
- Mid-month pulse / subscriber notes (S4/S5)

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Viewer → Pattern chapter: reader can answer “what is my exact stack?” without opening Signals.
3. With priors: months listed and history coach says how to use them + what the pattern usually asks.
4. No population rarity percentage anywhere in monthly UI copy.
5. PDF shows the same depth.
6. Confirm `fingerprintKey` matching still finds the same priors before/after display changes (spot-check one known profile/month if available).
