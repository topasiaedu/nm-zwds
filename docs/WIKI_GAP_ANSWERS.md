# Wiki gap answers — from chart / report repo (`nm-zwds`)

**Date:** 2026-07-11  
**For:** `chatbot-gen-client/docs/wiki-information-gaps.md`  
**Authority rule:** Prefer **report engine + live UI labels** over classical blogs. Where workshop slides and code diverge, both are noted — do not collapse them.

---

## ANSWERS

### GAP-001 — Qi Sha: Southern list vs Branding Magnet / Sha Po Lang

- **Status:** answered
- **Answer:**
  - **Yes — dual taxonomy is intentional.** Families (Wealth Codes) and Northern/Southern are **different frameworks**. A star can be Southern *and* Branding Magnet.
  - **(1) Southern (南斗) — workshop / CAE slides (teaching authority for N/S):** Tian Fu, Tian Tong, Tian Liang, Tian Xiang, Tian Ji **+ Qi Sha**
  - **(2) Northern (北斗) — workshop:** Zi Wei, Wu Qu, Ju Men, Lian Zhen, Tan Lang, Po Jun
  - **Neutral (中天星):** Tai Yang & Tai Yin only
  - **(3) Branding Magnet overlap:** Qi Sha is a **Branding Magnet** star (with Tan Lang, Ju Men, Tai Yang, Pojun). That is a *wealth-code / visibility* lane, not a N/S claim.
  - **杀破狼:** Classical aggressive cluster (Qi Sha + Pojun + Tan Lang). Product Branding Magnet includes all three plus Ju Men + Tai Yang. Reports do **not** require naming 杀破狼 as a formal product term; if used, frame as “aggressive / market-facing cluster,” not as N/S.
  - **Chat one-liner when taxonomies conflict:** “Qi Sha is **Southern** in CAE’s North/South energy teaching, and **Branding Magnet** in Wealth Code teaching — those answer different questions (team energy vs money lane).”
  - **Code caveat (do not teach as workshop N/S):** `structureAnalysis.ts` puts Qi Sha in a **Northern** set for Speed/Endurance scoring. That is an internal scoring set, **not** the slide list. Ella should follow **workshop N/S** for student Q&A.
- **Paste targets:** `northern-southern-stars.md`, `star-families.md`, future `entities/qi-sha.md`
- **Sources:** `docs/ref/[DEC] Design Your Destiny Workshop.txt` (~6203–6221, ~6729–6738); `src/utils/zwds/analysis_constants/wealth_code_mapping.ts`; `src/utils/zwds/analysis/structureAnalysis.ts`

---

### GAP-002 — Missing entity: Tian Liang (天梁)

- **Status:** answered
- **Answer:**
  - **Core identity:** Old-soul wisdom / protection / longevity / service / legacy. People listen even when you’re not #1. Strategy Planner primary.
  - **Family:** Strategy Planner (战略 / systems lane)
  - **N/S:** Southern (南斗)
  - **Major/minor:** Major (`category: "major"` in star-interpretations)
  - **Palace table (EN labels = chart app):**

  | Palace (EN) | CN | Product essence |
  |-------------|----|-----------------|
  | Life | 命宫 | Old soul who thinks twice before moving; people listen even when you’re not number one |
  | Wealth | 财帛 | Build wealth by serving — consulting, helping, healing; monetize experience, not fast money |
  | Career | 官禄 | Thrive guiding / mentoring / protecting; trusted director, not aggressive CEO |
  | Travel | 迁移 | Return to familiar places; sit hours at a café drinking tea in peace |
  | Siblings | 兄弟 | Elder stabilizer role even if not eldest |
  | Spouse | 夫妻 | Attract older mature partners; build trust, don’t chase romance |
  | Children | 子女 | Kids mature beyond age; sharp deep thinkers |
  | Friends | 交友 | Cross-generation friendships; depth over age similarity |
  | Health | 疾厄 | Illness lingers; watch rheumatism / arthritis / chronic fatigue — prevention first |
  | Property | 田宅 | Buy what you can see/touch/confirm; prefer pre-built / proven |
  | Wellbeing | 福德 | Peace in old things — tea, antiques, books, history |
  | Parents | 父母 | Father lives long or leaves strong legacy; traditional moral upbringing |

- **Paste targets:** `entities/tian-liang.md`, `star-families.md`
- **Sources:** `src/utils/destiny-navigator/star-data/star-interpretations.ts` (`天梁`); `wealth_code_mapping.ts`

---

### GAP-003 — Missing entity: Tai Yin (太阴)

- **Status:** answered
- **Answer:**
  - **Core identity:** Soft power & feminine wealth — charming without trying; magnetic softness; passive-income / elegance / emotional intelligence.
  - **Family:** Investment Brain (primary)
  - **N/S:** **Neutral (中天星)** with Tai Yang — not North or South
  - **Contrast with Tai Yang:** Tai Yang = outward shine / hot markets / visible leadership; Tai Yin = quiet attraction / passive means / beauty–branding–finance / soft leadership. Same Neutral pair, opposite visibility style.
  - **Palace highlights:**

  | Palace | Essence |
  |--------|---------|
  | Life | Charming without trying; elegant grace |
  | Wealth | Money magnet through passive means — investments, real estate, beauty, branding |
  | Career | Finance, beauty, branding, quiet leadership — attract through presence not force |
  | Travel | Men attract women abroad; women shop when traveling |
  | Spouse | Attract naturally through beauty/emotion; risk love triangles or secret affairs |
  | Health | Emotional eating, weight fluctuations, digestive stress |
  | Property | Multiple homes or inherit; beautiful refined spaces |
  | Parents | Mother’s influence strong |

  - **Neutral-star note:** For team-fit N/S rules, Neutral stars “depend on palace and activation” — do not force Northern-over-Southern money rule onto Tai Yin alone.

- **Paste targets:** `entities/tai-yin.md`, `star-families.md`, `northern-southern-stars.md`
- **Sources:** `star-interpretations.ts`; workshop Tai Yin “Star of Soft Power & Feminine Wealth”; `wealth_code_mapping.ts`

---

### GAP-004 — Missing entity: Ju Men (巨门)

- **Status:** answered
- **Answer:**
  - **Core identity:** Observant, sharp words — talk to understand, protect, or influence. Persuasion / communication / secrets / depth.
  - **Family:** Branding Magnet
  - **N/S:** Northern (北斗) — workshop money examples use Ju Men as Northern over Southern (e.g. vs Tian Tong)
  - **Wealth Rules “powerful stars”:** Wu Qu, Tian Fu, Tai Yin, **Ju Men** (income cases)
  - **Palace highlights:**

  | Palace | Essence |
  |--------|---------|
  | Life | Born observant with sharp words |
  | Wealth | Make money using your mouth — speaking, teaching, negotiating, selling, advising |
  | Career | Law, politics, media, psychology — persuasive words and depth |
  | Travel | Prefer solitude or secret retreats; don’t announce plans |
  | Spouse | Something hidden; skeptical; complex layers |
  | Health | Mouth, stomach, internal organs; stress → digestion |
  | Friends | Keep friends private |

  - **Sales/communication teaching lines:**
    1. Ju Men = “mouthpiece” — persuasive, expressive, strong in communication (Branding Magnet script).
    2. For money questions with two stars in one palace: prefer **Northern Ju Men** over Southern soft star (e.g. Tian Tong).

- **Paste targets:** `entities/ju-men.md`
- **Sources:** `star-interpretations.ts`; workshop Branding Magnet list; `wealth-rules` powerful-stars list

---

### GAP-005 — Missing entity: Qi Sha (七杀)

- **Status:** answered
- **Answer:**
  - **Core identity:** Battle & breakthrough / enforcer — think fast, act fast; move before asking; high-risk high-reward. Courage, urgency, pressure.
  - **Family:** Branding Magnet
  - **N/S:** **Southern** in CAE workshop slides (see GAP-001). Not “Northern because aggressive.”
  - **杀破狼:** Optional classical framing with Pojun + Tan Lang; product primary label is Branding Magnet membership.
  - **Palace highlights:**

  | Palace | Essence |
  |--------|---------|
  | Life | Think fast act fast; high-risk high-reward mindset |
  | Wealth | Earn fast or lose fast; bold investments; need systems to tame speed |
  | Career | Sales, fighting industries, crisis response; high-pressure roles |
  | Spouse | Fall fast / marry fast; instant fire; power couple or power struggle |
  | Travel | Spontaneous; book now, think later |
  | Health | Gut, bones, injuries; body breaks from fighting energy |
  | Property | Buy on impulse; may regret location / rush renovations |

  - **Workshop line:** “Qi Sha doesn’t wait. It attacks. Wherever this star sits, you’ll find courage, urgency, and pressure.”
  - **Taxonomy Notes:** Dual frameworks intentional — Southern + Branding Magnet. Do not invent a single “Qi Sha is Northern” answer for students.

- **Paste targets:** `entities/qi-sha.md`
- **Sources:** workshop Qi Sha section (~4666+); `star-interpretations.ts`; `wealth_code_mapping.ts`

---

### GAP-006 — Missing entity: Wen Chang (文昌)

- **Status:** answered
- **Answer:**
  - **Major vs minor?** **Minor amplifier** in product data (`category: "minor"`), listed in **Collaborator** Wealth Code (with Zuo Fu, You Bi, Wen Qu). Workshop: “Wen Chang and Wen Qu are the brains of the team.”
  - **Not** a Strategy Planner primary star in the report engine (wiki currently wrong if it lists Wen Chang under Strategy Planner).
  - **Traits:** Intellect, structure, logic, teaching, documentation. Observe before acting; organize chaos into systems.
  - **When reports mention it:** Support / refinement / academic–content–systems work; amplifies majors in the same palace; does **not** get Northern/Southern classification.
  - **Palace (selected):** Life = cerebral thinker; Wealth = teaching/coaching/content/copywriting; Career = research, strategy, academic, editorial.
- **Paste targets:** `entities/wen-chang.md`, `star-families.md`, `northern-southern-stars.md`
- **Sources:** `star-interpretations.ts`; workshop Collaborator list; `wealth_code_mapping.ts` (`primaryWealthCode: "collaborator"`)

---

### GAP-007 — Missing entity: Wen Qu (文曲)

- **Status:** answered
- **Answer:**
  - **Major vs minor?** **Minor** (`category: "minor"`).
  - **Family (report engine primary):** Collaborator.
  - **Workshop dual-list:** Also named under **Investment Brain** slide list (“Wu Qu, Tian Fu, Tai Yin, Wen Qu”) *and* Collaborator. Prefer **Collaborator** for “which Wealth Code is Wen Qu?” in app/report; note workshop may mention it with Investment Brain for asset/brain work.
  - **Branding Magnet?** **No** in report engine / Branding Magnet workshop list (wiki currently errs if Wen Qu is under Branding Magnet).
  - **Traits:** Sharp articulate expressive thinker; artistic delivery + precision; teaching/writing/coaching income.
- **Paste targets:** `entities/wen-qu.md`, fix `star-families.md`
- **Sources:** `wealth_code_mapping.ts`; workshop ~6670 & ~6714; `star-interpretations.ts`

---

### GAP-008 — Any other 14 / 18 majors missing from wiki?

- **Status:** answered
- **Answer:** Canonical **product inventory for Wealth Codes** = **18 names** across four families (14 classical majors + Wen Chang, Wen Qu, Zuo Fu, You Bi). Report engine primary mapping:

  | Star | CN | Family (primary) | Major/minor | Wiki page needed |
  |------|----|------------------|-------------|------------------|
  | Zi Wei | 紫微 | Strategy Planner | major | exists |
  | Lian Zhen | 廉贞 | Strategy Planner | major | exists |
  | Tian Ji | 天机 | Strategy Planner | major | exists |
  | Tian Liang | 天梁 | Strategy Planner | major | **Y** |
  | Wu Qu | 武曲 | Investment Brain | major | exists |
  | Tian Fu | 天府 | Investment Brain | major | exists |
  | Tai Yin | 太阴 | Investment Brain | major | **Y** |
  | Tan Lang | 贪狼 | Branding Magnet | major | enrich |
  | Ju Men | 巨门 | Branding Magnet | major | **Y** |
  | Tai Yang | 太阳 | Branding Magnet | major | enrich |
  | Qi Sha | 七杀 | Branding Magnet | major | **Y** |
  | Pojun | 破军 | Branding Magnet | major | exists (fix family: not Strategy Planner) |
  | Tian Tong | 天同 | Collaborator | major | exists |
  | Tian Xiang | 天相 | Collaborator | major | exists |
  | Zuo Fu | 左辅 | Collaborator | minor | optional |
  | You Bi | 右弼 | Collaborator | minor | optional |
  | Wen Chang | 文昌 | Collaborator | minor | **Y** |
  | Wen Qu | 文曲 | Collaborator | minor | **Y** |

  - **Wiki error to fix:** Current `star-families.md` puts Pojun + Wen Chang in Strategy Planner and Wen Qu in Branding Magnet — **incorrect vs report engine + workshop Branding/Collaborator lists.**
  - Classical “14 majors” omit Wen Chang/Wen Qu/Zuo Fu/You Bi; product still teaches them in the 18-star Wealth Code set.

- **Paste targets:** `star-families.md`, `AGENTS.md`
- **Sources:** `wealth_code_mapping.ts`; workshop wealth-code scripts

---

### GAP-009 — Activations Lu / Quan / Ke / Ji

- **Status:** answered
- **Answer:**

  | Symbol | CN | EN chip (chart) | 1-line meaning (workshop) | UI color | Chat do/don’t |
  |--------|----|-----------------|---------------------------|----------|---------------|
  | Lu | 化禄 | Lu | Striker — opportunities/money flow smooth | green (`#22c55e` / `text-green-500`) | Do: opportunity/flow. Don’t: guarantee wealth. |
  | Quan | 化权 | Quan | Captain — power, control, authority | blue | Do: leadership/drive. Don’t: always “good.” |
  | Ke | 化科 | Ke | Defender — fame, status, noble help, reputation | yellow | Do: recognition/support. Don’t: only “exams.” |
  | Ji | 化忌 | Ji | Warning / leak — challenges, insufficiency, where trouble slips in | red | Do: reminder/blockage to manage. **Don’t:** doom/fate curse. |

  - **Ji policy:** Confirmed — reminder / goalkeeper warning, not doom (aligns with PAS wiki).
  - **Empty palace:** Check opposite palace (对宫) and/or flying stars — yes in teaching.
  - **Report label variants (same 四化):** Alignment Advantage may say Hua Lu/Quan/Ke/Ji; some analysis copy uses Prosperity / Power / Achievement / Obstacle. Chart chips stay **Ke / Lu / Quan / Ji**.
- **Paste targets:** new `concepts/activations-si-hua.md` or expand `pas-framework.md`
- **Sources:** workshop football metaphor (~1036–1044); `src/styles/chartSemanticColors.ts`; `alignment-advantage/shared/constants.ts`

---

### GAP-010 — Star families: full canonical lists

- **Status:** answered (with workshop vs engine note)
- **Answer:** **Four families only — no fifth.** Product EN names: Strategy Planner, Investment Brain, Collaborator, Branding Magnet. Chinese family titles 战略星 / 大财星 / 辅助星 / 魅力星 are **wiki/workshop shorthand**; report UI uses English Wealth Code labels. (Chinese essays may say 魅力星 for Tan Lang-type, 辅佐星 for support stars — not the four-family UI.)

  **Report engine primary (authoritative for “which code is this star?”):**
  - **Strategy Planner:** Zi Wei, Lian Zhen, Tian Ji, Tian Liang
  - **Investment Brain:** Wu Qu, Tian Fu, Tai Yin
  - **Branding Magnet:** Tan Lang, Ju Men, Tai Yang, Qi Sha, Pojun
  - **Collaborator:** Tian Tong, Tian Xiang, Zuo Fu, You Bi, Wen Qu, Wen Chang

  **Workshop slide lists (teaching scripts):**
  - Strategy Planner: Zi Wei, Tian Liang, Lian Zhen, Tian Ji *(same majors)*
  - Investment Brain: Wu Qu, Tian Fu, Tai Yin, **Wen Qu** *(Wen Qu dual-listed)*
  - Branding Magnet: Tan Lang, Ju Men, Tai Yang, Qi Sha, Pojun *(same)*
  - Collaborator: Zuo Fu, You Bi, Wen Chang, Wen Qu *(workshop omits Tian Tong/Tian Xiang in that bullet; engine includes them)*

  - **Wiki errors:** Pojun ≠ Strategy Planner; Wen Chang ≠ Strategy Planner; Wen Qu ≠ Branding Magnet.
- **Paste targets:** `star-families.md`
- **Sources:** `wealth_code_mapping.ts`; `docs/ref/[DEC] Design Your Destiny Workshop.txt`; `docs/ref/Side Income Mastery Script.txt`

---

### GAP-011 — Northern / Southern / Neutral lists

- **Status:** answered
- **Answer:** **Teaching authority = workshop slides:**

  | Group | Stars |
  |-------|--------|
  | **Southern 南斗** | Tian Fu, Tian Tong, Tian Liang, Tian Xiang, Tian Ji, **Qi Sha** |
  | **Northern 北斗** | Zi Wei, Wu Qu, Ju Men, Lian Zhen, Tan Lang, Pojun |
  | **Neutral 中天星** | **Tai Yang & Tai Yin only** |

  - **Tian Ji:** Southern — confirm wiki.
  - **Qi Sha:** Southern — confirm (GAP-001).
  - **Minors:** Wen Chang, Wen Qu, Zuo Fu, You Bi — **no N/S**; they amplify majors.
  - **Code caveat:** `structureAnalysis.ts` N/S sets differ (e.g. Qi Sha Northern, Tai Yang Northern, Tai Yin Southern, Tian Ji Northern). **Do not paste code sets into student wiki as CAE N/S.** Use workshop lists for Ella.
- **Paste targets:** `northern-southern-stars.md`
- **Sources:** workshop ~6203–6221; `structureAnalysis.ts` (internal only)

---

### GAP-012 — DNA Chart vs legacy “Home”

- **Status:** answered
- **Answer:** Glossary:

  | Term | Means | Never means |
  |------|-------|-------------|
  | **DNA Chart** | Natal blueprint tab (`dna`) — full birth chart, no flow overlay | A report analysis section; “Home” tab |
  | **Da Yun (10 Year)** | 10-year limit overlay tab | Monthly |
  | **Liu Nian (Yearly)** | Annual overlay tab | DNA Chart |
  | **Liu Month (Monthly)** | Monthly overlay tab | “Timing / Monthly” as tab name |
  | **DESTINY BLUEPRINT** | Chart center title (CSS uppercase of “Destiny Blueprint”) | The analysis report title |
  | **PERSONALIZED LIFE REPORT** | Result-page analysis header | Chart center title |
  | **Wealth Code** / **WEALTH CODE ANALYSIS** | Result analysis section (earning style) | DNA Chart tab |
  | **Wealth Code DNA** | Founder-report section label only | DNA Chart tab |
  | **Home** | Nav / Property “Home Stability” metric / legacy FAQ language | Blueprint natal tab |
  | **Property** | 田宅 palace on chart | “Home” tab |

- **Paste targets:** `dna-chart-home-section.md`, `AGENTS.md`
- **Sources:** `ChartBlueprintSwitcher.tsx`; `CenterInfo.tsx`; `result.tsx`; `founder-report.tsx`

---

### GAP-013 — Liu Month UI labels + starting-point steps

- **Status:** answered (partial on traffic lights)
- **Answer:**
  - **Logged-in click path:** Open chart/result → blueprint strip → **Liu Month (Monthly)** (mobile shortLabel: **Month**). Path is DNA Chart → Liu Month (Monthly), not “Timing.”
  - **Green / yellow / red month signals:** **Yes in Alignment Advantage timing**, not on the main result-page `LiuMonthCard`.
    - Mapping: 5★ → green (“Green Light: Execute” / short “Peak”); 4★ → yellow (caution); else red (“Red Light: Protect & Plan” / “Protect”).
  - **Result-page Liu Month card badge:** **“Monthly Briefing · {area}”** — not “Monthly Rhythm.”
  - **“Monthly Rhythm”:** Destiny Navigator timeframe label.
  - **“Monthly Directive”:** Alignment Advantage print executive summary label.
  - Ella should: teach Liu Month tab by exact name; for traffic lights, say they appear in **Alignment Advantage / timing** views, not invent them on every chart chrome.
- **Paste targets:** `monthly-chart-starting-point.md`, `UI_VERIFICATION.md`
- **Sources:** `ChartBlueprintSwitcher.tsx`; `LiuMonthCard.tsx`; `palaceData.ts`; `MonthGrid.tsx`

---

### GAP-014 — Report / chart fields the bot should know

- **Status:** answered
- **Answer:** There is **no single 10-item ordered array** matching the bundle hint list. Use surface-specific maps:

  **A. Main result page (`result.tsx`) — primary for Ella “your report”:**
  1. Chart — 12-palace visualization  
  2. Overview — Life palace summary  
  3. Wealth Code — Earning style analysis  
  4. Health — Wellness patterns  
  5. Destiny Alert Map — Four key palaces  
  6. Areas of Life — All palace areas  
  (+ Da Yun / Liu Month sections when those blueprints are active)

  **B. Founder report:** Chart → Wealth Code DNA → Wealth Timing Cycle → Talent Strategy → Income Blueprint → Business Calendar

  **C. Chart chrome / toggles (not always “sections”):** Da Yun Highlight, Liu Nian Tags (settings); transformation chips Ke/Lu/Quan/Ji; palace EN labels; DESTINY BLUEPRINT center.

  **D. Destiny Navigator metrics (separate product surface):** Home Stability, Fertility & Timing, Monthly Rhythm, etc.

  | Hint label | Wiki-safe? | Notes |
  |------------|------------|-------|
  | Wealth Code DNA | Yes as founder-report section | ≠ DNA Chart |
  | Wealth Timing Cycle | Founder-report | |
  | Da Yun Highlight | Chart setting/toggle | |
  | Liu Nian Tags | Chart setting/toggle | |
  | Home Stability | DN metric | Not blueprint tab |
  | Fertility & Timing | DN metric | |
  | Monthly Rhythm | DN timeframe | ≠ Liu Month card badge |
  | Monthly Directive | AA print | |
  | Talent / Calendar / Income | Founder short names | Full labels above |

  **Ella explain vs refuse:** Explain labels that exist on the user’s surface; refuse inventing a unified 10-section “standard report” or telling users to click “Home” for natal chart.

- **Paste targets:** new `concepts/report-sections.md`
- **Sources:** `result.tsx`; `founder-report.tsx`; ChartSettingsModal; DN configs

---

### GAP-015 — Palace pages beyond Travel

- **Status:** answered
- **Answer:** **Yes — all 12 need pages** for wealth product; priority order: Life, Wealth, Career, Property, Friends, Spouse, then Health, Wellbeing, Children, Parents, Siblings (Travel exists).

  **EN labels matching chart app** (`translations/en/zwds.ts`): Life, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Wellbeing, Parents.

  **Product meanings (analysis + chart):**

  | Palace | Bullets |
  |--------|---------|
  | **Life** | Self-state, mindset, personality; starting point of every reading; winter Da Yun season |
  | **Siblings** | Partnership / peer / brotherhood; autumn season |
  | **Spouse** | Love, partner, long-term pairing; autumn |
  | **Children** | Students, children, teams, creative products; fertility/timing metrics; autumn |
  | **Wealth** | Income, cash flow, investment; business-owner focus palace; summer |
  | **Health** | Body, stress, accidents; winter with Life |
  | **Travel** | External development, foreign opportunities, outward image (deep page exists) |
  | **Friends** | Social circle, benefactors/troublemakers, cooperation; spring |
  | **Career** | Job/employee path, workplace, status; spring; with Wealth+Life = 1-5-9 |
  | **Property** | Real estate, living environment, security; “Home Stability” metric lives here conceptually; summer |
  | **Wellbeing** | Mental richness, enjoyment, soul nourishment (chart EN **Wellbeing**, not Fortune); summer |
  | **Parents** | Original family, elders, spiritual support; autumn |

  Note: some analysis strings still say “Destiny Palace” / “Happiness Palace” / “Marriage Palace” — **chart grid EN is authoritative for Ella click-path.**

- **Paste targets:** `concepts/twelve-palaces.md` or per-palace pages
- **Sources:** `translations/en/zwds.ts`; `translations/en/analysis.ts`; `seasonMapper.ts`

---

### GAP-016 — Wealth Rules completeness vs report engine

- **Status:** answered
- **Answer:**
  - **PAS acronym:** **Not in chart repo code** — teaching lives in workshop/coaching docs. Report engine encodes wealth-code scoring, flying stars (`FOUR_TRANSFORMATIONS`), structure — not a named “PAS” module.
  - **Wealth Rules in teaching (Ella must know):** Lu paths on Wealth/Career/Life/Travel; Ji decline patterns; powerful stars Wu Qu / Tian Fu / Tai Yin / Ju Men; team N/S fit — as in `wealth-rules.md` + Sept coaching ref.
  - **Ding stem table:** **Example of the general 10-stem template**, not Ding-only magic. Full table exists in code (`FOUR_TRANSFORMATIONS`) — see GAP-023.
  - **Extra vs wiki:** Engine also scores Wealth Codes per star; Speed/Endurance uses different N/S sets (don’t teach those as Wealth Rules).
- **Paste targets:** `wealth-rules.md`
- **Sources:** `docs/ref/Sept Coaching_ Wealth Rules.txt`; workshop ~8436+; `constants.ts` `FOUR_TRANSFORMATIONS`

---

### GAP-017 — PAS framework completeness

- **Status:** answered (confirm wiki; amend sources)
- **Answer:**
  - **Confirm order:** Goal → **P**alace → **A**ctivation → **S**tars. Wiki steps are correct for teaching.
  - **Goal→palace:** employee → Career; business/freelance → Wealth; character → Life; 1-5-9 Life+Wealth+Career — confirm.
  - **Product amendment:** Before Stars, workshops also push **time frame** (Da Yun season / Liu Nian / Liu Month) as a Wealth Rules layer. Practical stack: Time frame → PAS. Not a fifth PAS letter — a prior context check.
  - **Repo note:** PAS string not in code; keep wiki sourced from workshop VTT/scripts.
- **Paste targets:** `pas-framework.md`
- **Sources:** workshop; Sept Wealth Rules; wiki already good

---

### GAP-018 — Dominant / Soft vs Families vs N/S

- **Status:** answered
- **Answer:**
  - **Still taught?** Yes in workshop birth-time / temperament slides — **not** implemented as app scoring sets.
  - **Two slide variants exist — do not merge:**

  | Variant | Dominant / Leadership | Soft / Gentle | Outgoing / Spotlight |
  |---------|----------------------|---------------|----------------------|
  | A | Zi Wei, Pojun, Qi Sha, Tian Xiang, Wu Qu | Tian Ji, Tian Liang, Tian Tong, Tian Fu, Lian Zhen | Ju Men, Tan Lang |
  | B | Zi Wei, Pojun, Qi Sha, Wu Qu, Lian Zhen | Tian Ji, Tian Liang, Tian Tong, Tian Fu, Tian Xiang, Tai Yin | Ju Men, Tan Lang, Tai Yang |

  - **Notes sentence for chat:** “Dominant/Soft, Northern/Southern, and Wealth Code families are **three different lenses** — same star can look ‘soft’ in one list and Northern in another; don’t treat them as identical.”
- **Paste targets:** Notes on `star-families.md` + `northern-southern-stars.md`
- **Sources:** workshop ~499–526

---

### GAP-019 — Tan Lang & Tai Yang enrichment

- **Status:** answered
- **Answer:** Use full palace essences from `star-interpretations.ts` (same format as Wu Qu / Tian Fu wiki pages).

  **Tan Lang (Branding Magnet, Northern):** Life = big desires, expressive charming magnetic presence; Wealth = luxury/performance/beauty — charm is cashflow; Career = entertainment, beauty, teaching, media, luxury branding — you are the product; Travel = shopping/pleasure, easy to lose control emotionally abroad; etc. (full 12 in source file).

  **Tai Yang (Branding Magnet, Neutral):** Life = born to stand out, generous; Wealth = hot markets, visible roles, mainstream industries; Career = big systems — law, politics, luxury, energy; Health = heart, head, eyes; Travel = shine brighter outside comfort zone; etc.

  Workshop Branding Magnet one-liners: Tan Lang = charm/attraction; Tai Yang = sun — visibility and warmth.
- **Paste targets:** `entities/tan-lang.md`, `entities/tai-yang.md`
- **Sources:** `star-interpretations.ts`; workshop Branding Magnet script

---

### GAP-020 — Appearance / health claims policy

- **Status:** answered
- **Answer:**
  - **Policy: soften** for Ella — keep as optional **teaching color**, never medical fate or body-shaming certainty.
  - Chart repo: appearance lines live mainly in **workshop scripts**, not as hard report fields. Health body maps exist in `health_analysis.ts` (organ associations) — frame as “watch areas,” not diagnosis.
  - **Example rewrite (Tai Yang):** Instead of “化禄 in Life: may wear glasses or be bald,” use: “Teaching note: Tai Yang Life is sometimes illustrated with high-visibility / ‘face’ imagery in class — treat as metaphor for being seen, not a prediction about appearance or health.”
  - **Omit** absolute Chinese lines like “坐命一定要肥” in chat unless user asks about workshop anecdotes — then label as anecdote, not rule.
- **Paste targets:** affected entities + `AGENTS.md` policy line
- **Sources:** workshop appearance asides; `health_analysis.ts`

---

### GAP-021 — Pojun Life-Palace quote (ASR residue)

- **Status:** answered
- **Answer:**
  - **Clean EN (workshop slide + script):**  
    - Slide: “Direct, rebellious, stubborn; confronts people openly”  
    - Script: “This star doesn’t walk away. It argues. It challenges. And it only learns after crashing.” / Life: “You speak directly. You confront things head-on. You challenge ideas publicly.”
  - **Code essence:** “Intense aggressive forward energy, break then rebuild through chaos before clarity”; relationships: “argue and challenge but learn through crashing first.”
  - **“guailan”:** **Not found** in chart repo — discard ASR residue.
  - **Optional CN personality note from coaching:** 破军 — “爱理不理” (aloof) in team exercises — different line, not Life argue quote.
- **Paste targets:** `entities/po-jun.md`
- **Sources:** workshop ~4952–4968; `star-interpretations.ts`; Sept Wealth Rules ~226

---

### GAP-022 — Zuo Fu / You Bi product treatment

- **Status:** answered
- **Answer:**
  - **Policy:** Collaborator family **minors** — amplify majors; “support appears even without major stars” (You Bi Life essence). Worth short entity pages or a shared “support stars” concept note.
  - **Report phrases:**
    - Zuo Fu Life: “Life feels supported, others help you grow stabilize even when you’re confused or lost.”
    - You Bi Life: “Never fully alone, support appears to amplify your energy even without major stars present.”
    - You Bi Wealth: “Doubles power of money-making efforts.”
  - Workshop: Zuo Fu = supportive helper; You Bi = alliance-builder.
- **Paste targets:** optional `entities/zuo-fu.md` / `you-bi.md` or Collaborator note
- **Sources:** `star-interpretations.ts`; workshop Collaborator list; `wealth_code_mapping.ts`

---

### GAP-023 — Flying stars / stem tables

- **Status:** answered
- **Answer:**
  - **Does engine expose full tables?** Yes — `FOUR_TRANSFORMATIONS` in `src/utils/zwds/constants.ts` (甲–癸 → 祿/權/科/忌 stars). Used for chart calculation.
  - **Should wiki publish full tables?** **Yes, as reference** (students already see results on chart). Always say: use **your year’s heavenly stem** (birth year for natal 四化; annual stem for Liu Nian) — don’t memorize one stem as universal.
  - Full table:

  | Stem | Lu 禄 | Quan 权 | Ke 科 | Ji 忌 |
  |------|-------|---------|-------|-------|
  | 甲 Jia | 廉贞 | 破军 | 武曲 | 太阳 |
  | 乙 Yi | 天机 | 天梁 | 紫微 | 太阴 |
  | 丙 Bing | 天同 | 天机 | 文昌 | 廉贞 |
  | 丁 Ding | 太阴 | 天同 | 天机 | 巨门 |
  | 戊 Wu | 贪狼 | 太阴 | 右弼 | 天机 |
  | 己 Ji | 武曲 | 贪狼 | 天梁 | 文曲 |
  | 庚 Geng | 太阳 | 武曲 | 太阴 | 天同 |
  | 辛 Xin | 巨门 | 太阳 | 文曲 | 文昌 |
  | 壬 Ren | 天梁 | 紫微 | 左輔 | 武曲 |
  | 癸 Gui | 破军 | 巨门 | 太阴 | 贪狼 |

  - If wiki prefers short form: principle + “open Liu Nian / DNA Chart chips” + link table in appendix.
- **Paste targets:** `wealth-rules.md` or `concepts/flying-stars-si-hua.md`
- **Sources:** `src/utils/zwds/constants.ts`

---

### GAP-024 — Liu Nian (Yearly) UI / teaching

- **Status:** answered
- **Answer:**
  - **Tab:** **Liu Nian (Yearly)** — annual flow overlay on the same 12-palace grid (mobile shortLabel: **Year**).
  - **Liu Nian tag on grid:** Marks which palace is the **current year’s** annual palace / related annual markers (with settings toggle “Liu Nian Tags”) — not a separate report product.
  - **vs tab:** Tag = chrome on the chart; tab = switch blueprint mode to yearly reading.
  - **Year-specific blocks Ella can name:** Liu Nian (Yearly) tab; annual 四化 chips for that year’s stem; Wealth Rules “read Wealth+Career for target year”; optional founder “Wealth Timing Cycle.”
  - Prefer dedicated `concepts/timing-liu-nian.md` mirroring Da Yun depth.
- **Paste targets:** new timing page / expand Da Yun page
- **Sources:** `ChartBlueprintSwitcher.tsx`; chart settings; Wealth Rules checklist

---

### GAP-025 — Da Yun season map

- **Status:** answered — **confirm wiki**
- **Answer:** Matches `seasonMapper.ts` exactly:

  | Season | Palaces |
  |--------|---------|
  | Spring (Grow) | Career, Travel, Friends |
  | Summer (Harvest) | Wealth, Property, Wellbeing |
  | Autumn (Defend) | Spouse, Siblings, Children, Parents |
  | Winter (Reset) | **Life, Health** (code lists Life then Health) |

  No exceptions found in mapper. Wiki winter order “Health/Life” is fine semantically; code order is Life, Health.
- **Paste targets:** `timing-cycles-da-yun.md`
- **Sources:** `src/utils/dayun/seasonMapper.ts`

---

### GAP-026 — Index title normalization

- **Status:** answered
- **Answer:** Preferred EN display names for chat (match chart):

  **Palaces:** Life, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Wellbeing, Parents  

  **Stars (preferred spelling):** Zi Wei, Lian Zhen, Tian Ji, Tian Liang, Wu Qu, Tian Fu, Tai Yin, Tai Yang, Tan Lang, Ju Men, Qi Sha, **Po Jun** (two words OK; avoid “PoJun”), Tian Tong, Tian Xiang, Wen Chang, Wen Qu, Zuo Fu, You Bi  

  **Tabs:** DNA Chart, Da Yun (10 Year), Liu Nian (Yearly), Liu Month (Monthly)  

  **Activations:** Lu, Quan, Ke, Ji  

  **Families:** Strategy Planner, Investment Brain, Branding Magnet, Collaborator  

  Avoid analysis-only aliases in click instructions: Destiny Palace, Happiness Palace, Marriage Palace, Fortune (for 福德).
- **Paste targets:** `index.md`, entity H1s
- **Sources:** `translations/en/zwds.ts`; Wealth Code labels

---

### GAP-027 — Auth-only chrome verification

- **Status:** answered (labels; screenshots partial)
- **Answer:**
  - **Blueprint tabs only (4):** DNA Chart | Da Yun (10 Year) | Liu Nian (Yearly) | Liu Month (Monthly). Mobile: DNA | 10 Year | Year | Month. **No other blueprint tabs. No Home tab.**
  - **Screenshot paths in this repo:**
    - `tmp-mobile-verify/chart-mobile.png` — tabs + DESTINY BLUEPRINT + chips
    - `tmp-mobile-verify/result-mobile.png` — same
    - `tmp-mobile-verify/chart-mobile-sections-sheet.png` — Jump to Section list
  - **Not in tmp:** dedicated Liu Month mode calendar with green/yellow/red pills (those live in Alignment Advantage timing UI).
- **Paste targets:** `UI_VERIFICATION.md`
- **Sources:** `ChartBlueprintSwitcher.tsx`; tmp-mobile-verify screenshots

---

## Critical wiki corrections (do first)

1. **`star-families.md` membership** — align to GAP-010 report engine lists (Po Jun → Branding Magnet; Wen Chang/Wen Qu → Collaborator; remove Wen Qu from Branding Magnet).
2. **Po Jun family tag** on `entities/po-jun.md` — Branding Magnet, not Strategy Planner.
3. **Qi Sha N/S** — Southern in teaching; Branding Magnet in families (GAP-001).
4. **Appearance/health** — soften policy (GAP-020).
5. **Po Jun Life quote** — replace `guailan` ASR with workshop EN (GAP-021).

---

## Source index (chart repo)

| Topic | Path |
|-------|------|
| Wealth Code map | `src/utils/zwds/analysis_constants/wealth_code_mapping.ts` |
| Palace essences | `src/utils/destiny-navigator/star-data/star-interpretations.ts` |
| 四化 stem table | `src/utils/zwds/constants.ts` (`FOUR_TRANSFORMATIONS`) |
| N/S scoring (internal) | `src/utils/zwds/analysis/structureAnalysis.ts` |
| Blueprint tabs | `src/components/zwds/components/ChartBlueprintSwitcher.tsx` |
| Palace EN | `src/translations/en/zwds.ts` |
| Da Yun seasons | `src/utils/dayun/seasonMapper.ts` |
| Workshop teaching | `docs/ref/[DEC] Design Your Destiny Workshop.txt` |
| Wealth Rules coaching | `docs/ref/Sept Coaching_ Wealth Rules.txt` |
| Side income family lists | `docs/ref/Side Income Mastery Script.txt` |
