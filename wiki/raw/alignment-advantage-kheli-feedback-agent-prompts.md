# Alignment Advantage — Agent Implementation Prompts

Copy one prompt block per agent session. Each task is scoped for a ~200k context model: enough context to execute without loading the entire codebase.

**Before any agent starts:**
```bash
git checkout feature/alignment-advantage
npm install
```

**Read first:** `wiki/raw/alignment-advantage-kheli-feedback-spec.md`

**Code principles:**
- Minimal diff — only files required for the task
- Match existing naming, imports, and styling (`C` constants from `shared/constants.ts`)
- No `any`, no non-null assertions, double-quoted strings
- Do not commit unless explicitly asked
- Run `npm run build` when done; fix errors in touched files

---

## Agent 1 — Twelve-Palace mini grid star colors & activations

```
# Task: Alignment Advantage — Mini grid star colors & activation labels

## Branch
feature/alignment-advantage

## Context
Read: wiki/raw/alignment-advantage-kheli-feedback-spec.md (Section 1)

The TwelvePalaceMiniGrid component renders 12-palace charts across the Alignment Advantage report (web + print). Currently main stars use north=blue / south=red and activations show as gold bracket tags like [Hua Ji]. Kheli feedback: all star names should be black; activations should match the main ZWDS chart.

## Reference implementation
Study how the main chart renders activations:
- File: src/components/zwds/components/Palace.tsx (lines ~603–697)
- 化禄 → green, short label (first word of translation, e.g. "Lu")
- 化权 → blue, "Quan"
- 化科 → yellow, "Ke"
- 化忌 → red, "Ji"

## Files to change
Primary:
- src/components/alignment-advantage/shared/TwelvePalaceMiniGrid.tsx
- src/components/alignment-advantage/shared/constants.ts (add helper for transformation color + short label if needed)

Constants already defined:
- TRANSFORMATION_ENGLISH maps 化禄/化权/化科/化忌 to full English names
- classifyMainStar() — stop using for text color in mini grid

## Requirements
1. All star name text (main + minor) → color C.navy (#1a1e3f), keep existing font sizing
2. Replace gold [Hua Ji] bracket tags with short colored labels matching main chart
3. Apply to both mainStar and minorStars transformation maps
4. Do NOT change src/components/zwds/components/Palace.tsx or ZWDSChart
5. Do NOT change PrintAppendixChart (uses full ZWDSChart — already correct)

## Verification
- npm run build
- Visually: mini grid on /alignment-advantage home + Core Design + Wealth + People chapters
- Print sections using TwelvePalaceMiniGrid should pick up changes automatically

## Deliverable
Summary of changes + list of files modified. No unrelated refactors.
```

---

## Agent 2 — Deal-Flow Checklist (read-only)

```
# Task: Alignment Advantage — Deal-Flow Checklist read-only

## Branch
feature/alignment-advantage

## Context
Read: wiki/raw/alignment-advantage-kheli-feedback-spec.md (Section 2)

The Deal-Flow Checklist in ChapterDecisionFramework feels interactive. This is a report — users should not click buttons. Timing and Wealth alignment is already computed in buildStrategicData().

## Files to change
- src/components/alignment-advantage/chapters/ChapterDecisionFramework.tsx
- src/components/alignment-advantage/shared/AxisCard.tsx

## Current behavior
ChapterDecisionFramework.tsx:
- Structural row: isAutoFilled=false, onAnswer updates local state → shows Yes/Not aligned buttons
- Timing row: isAutoFilled=true, answer=timingAligned (computed)
- Wealth row: isAutoFilled=true, answer=wealthAligned (computed)
- frameworkScore + recommendation block shown when structural answered

AxisCard.tsx:
- isAutoFilled → renders "Auto" badge
- onAnswer defined → renders buttons; else → Aligned ✓ / Caution / -

## Requirements
1. Remove AUTO badge entirely (delete or never render isAutoFilled UI)
2. Remove Yes/Not aligned buttons for Structural — no onAnswer on any row
3. Remove framework score bar (X / 3) and recommendation output block
4. Structural row right side: empty (render nothing, not "-" placeholder)
5. Timing & Wealth rows: keep read-only Aligned ✓ / Caution from computed booleans
6. Remove unused React state (framework, setFramework) and dead imports if safe
7. PrintDecisionFramework.tsx — NO changes (static worksheet, different UX)

## Verification
- npm run build
- /alignment-advantage → Strategic Filter section: 3 rows, no buttons, no AUTO, no score block
- Timing/Wealth still show green Aligned ✓ or Caution based on chart data

## Deliverable
Summary + files modified.
```

---

## Agent 3 — Section removals & Execution Playbook trim

```
# Task: Alignment Advantage — Remove sections + trim Execution Playbook

## Branch
feature/alignment-advantage

## Context
Read: wiki/raw/alignment-advantage-kheli-feedback-spec.md (Sections 3, 4, 8)

Three UI removals on web + one print mirror. Execution Playbook list trim is web-only.

## Part A — Remove Archetype Profile card (Wealth)
File: src/components/alignment-advantage/chapters/ChapterWealthAcceleration.tsx

Remove the right navy card labeled "Archetype Profile" (profileType badge + tagline quote).
Keep the left "Dominant Wealth Archetype" card and examples.
Adjust grid layout so remaining card looks good (md:col-span-2 wrapper may need simplification).

PrintWealthBlueprint.tsx — verify no matching card; likely no change.

## Part B — Remove People Strategy block
Files:
- src/components/alignment-advantage/chapters/ChapterStakeholderIntelligence.tsx
  Remove lines ~83–114: People Strategy header, PeopleCrossPalaceStrategyPanel, Pattern banner
  Remove unused imports/hooks: crossPalaceStrategy, synthesisKey, PEOPLE_SYNTHESIS, PeopleCrossPalaceStrategyPanel if no longer used

- src/components/alignment-advantage/print/sections/PrintStakeholderIntel.tsx
  Remove lines ~238–264: People Strategy header + 3 cards/banner (mirror web)

Do NOT remove:
- Priority dashboard
- Individual palace briefing pages
- PrintIdealCollaborator.tsx (standalone print page — out of scope)

Clean up unused code in PeopleCrossPalaceStrategy.tsx only if nothing imports it after removal.

## Part C — Execution Playbook trim
File: src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx

Data: PALACE_GUIDANCE_DATA from src/utils/forecast/alignmentAdvantage/executionPlaybookData.ts

1. Remove entire "Win Metrics" section (UI block mapping gData.successMetrics)
2. Keep "Strategic Reflection" unchanged (gData.reflectionQuestions.slice(0, 2))
3. Executive Action: render gData.keyActions.slice(0, 3) only
4. Risk Mitigation: render gData.watchOut.slice(0, 3) only
5. Do NOT modify PALACE_MONTH_DATA dimension bars ("Capacity Allocation")
6. Do NOT modify liumonth/LiuMonthCard.tsx or PrintDayunCycle Success Metrics

## Verification
- npm run build
- Wealth chapter: one archetype card, no navy profile card
- People chapter: no People Strategy block; 5 palace briefings still work
- Playbook: select any month → 3 actions, 3 risks, no win metrics, reflection present
- Print preview /print/alignment-advantage — stakeholder page has no People Strategy block

## Deliverable
Summary + files modified + note any dead code removed.
```

---

## Agent 4 — Copywriting sweep & star context layman English

```
# Task: Alignment Advantage — Copywriting sweep (layman English)

## Branch
feature/alignment-advantage

## Context
Read: wiki/raw/alignment-advantage-kheli-feedback-spec.md (Sections 6, 7)

Kheli feedback: avoid specific dollar amounts, avoid copy that sounds like a weekly forecast on repeat visits, use plain English (no jargon like "exacting").

This task is COPY ONLY — do not change UI structure or remove sections.

## Primary files
1. src/components/alignment-advantage/shared/peoplePalaceGuidance.ts
   - PEOPLE_PALACE_BASE_ACTIONS (e.g. $10k line in 夫妻)
   - PEOPLE_PALACE_BASE_WATCH
   - PALACE_ACTIVATION_ACTION
   - PALACE_ACTIVATION_WATCH (e.g. "fragile this week" in 夫妻 ji)
   - PALACE_STAR_CONTEXT (e.g. "exacting" in 兄弟:廉贞)
   - PALACE_STAR_FALLBACK
   - getPalaceActivationHint() strings

2. src/utils/forecast/people/peoplePalaceData.ts — grep for $, this week, jargon

3. src/components/alignment-advantage/shared/phaseWealthGuidance.ts — "this week" phrases

4. src/components/alignment-advantage/shared/catalystGuidance.ts — temporal wording

## Sweep command (run and fix hits in scope)
rg -i '\$[0-9]|this week|this month|fragile|exacting' src/components/alignment-advantage src/utils/forecast

## Copy rules
1. Dollar amounts → relative scale ("major financial commitment", "significant investment of money or time")
2. Watch-outs: never imply "every time you open this report, this week your relationship is fragile"
   - Prefer: "when tension is active", "during strained periods", "while friction is showing up"
3. Action items may keep concrete timeboxes ("48 hours", "30-minute slot") when they are instructions, not predictions
4. Replace jargon: exacting → demanding / hard to please; audit other PALACE_STAR_CONTEXT entries similarly
5. Preserve meaning and tone — still direct, business-focused, plain language
6. Do not change executionPlaybookData.ts list lengths (Agent 3 handles UI slice)

## Out of scope
- LiuMonthCard.tsx
- Non-Alignment-Advantage features
- Chinese source strings in zwds engine

## Verification
- npm run build
- Read through changed strings — no $ amounts, no false weekly temporality in watch-outs
- Star context lines read at ~8th grade level

## Deliverable
Summary of all copy changes (before → after table or bullet list) + files modified.
```

---

## Agent 5 — Children Palace icon redesign

```
# Task: Alignment Advantage — Children Palace SVG icon

## Branch
feature/alignment-advantage

## Context
Read: wiki/raw/alignment-advantage-kheli-feedback-spec.md (Section 5)

PalaceRelationshipSvg in peoplePalaceVisuals.tsx has custom SVGs for 兄弟, 夫妻, 交友, 父母. Children (子女) falls through to a default green "tree" SVG that looks inappropriate.

## File to change
- src/components/alignment-advantage/shared/peoplePalaceVisuals.tsx

## Reference
Study existing palace SVGs in same file (lines 11–56):
- Minimal line art, viewBox="0 0 80 80"
- Colors: C.navy, C.coral, C.gold from ./constants
- Relationship metaphors: two figures (siblings), linked circles (spouse), network (friends), shelter (parents)

## Requirements
1. Add explicit `if (palaceKey === "子女")` branch before the default return
2. Design metaphor: children / people you develop / next generation / mentorship growth
   - NOT abstract vertical stem + circles (current default — reads wrong)
   - Match visual weight and style of sibling/spouse/friends/parents icons
3. Remove or replace the inappropriate default fallback for 子女 only
4. Keep default fallback for any unexpected palaceKey if needed
5. Web + print both use this component via PeoplePalaceBriefingBody — one change covers both

## Verification
- npm run build
- /alignment-advantage → People chapter → Children Palace briefing — icon looks professional
- Compare side-by-side with other 4 palace icons for consistency

## Deliverable
Summary + screenshot description of new icon metaphor + files modified.
```

---

## Orchestration notes (for Stanley)

### Parallelization
| Phase | Agents | Notes |
|-------|--------|-------|
| 1 | Agent 1 | Do first — shared visual component |
| 2 | Agents 2, 3, 4, 5 | Can run in parallel after Agent 1 merges |
| 3 | Human QA | Full report walkthrough + print PDF |

### Merge conflict hotspots
- `ChapterStakeholderIntelligence.tsx` — only Agent 3 touches structure; Agent 4 may touch related copy files only
- `peoplePalaceVisuals.tsx` — only Agent 5
- `TwelvePalaceMiniGrid.tsx` — only Agent 1

### If an agent finishes early
Agent 4 can optionally grep print copy in `PrintStakeholderIntel.tsx` palace briefing text — it pulls from `peoplePalaceGuidance.ts`, so copy fixes auto-mirror.

### Post-implementation PR description template
```
## Summary
Implements Kheli feedback for Alignment Advantage report (branch feature/alignment-advantage).

- Mini grid: black stars, chart-style activation labels
- Deal-flow checklist: read-only (no clicks/AUTO/score)
- Removed: Archetype Profile card, People Strategy block, Win Metrics
- Playbook: 3 exec actions + 3 risks per month
- Copy: layman English, no $10k / false weekly temporality
- Children palace icon redesigned

## Test plan
- [ ] Web report all chapters
- [ ] Print PDF export
- [ ] npm run build
```
