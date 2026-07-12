# Alignment Advantage: Implementation Prompts

The `src/pages/alignment-advantage/index.tsx` file has become too large and needs to be modularized while simultaneously redesigning Chapters 2 through 6 to match the new premium aesthetic established in Chapter 1.

Pass these prompts sequentially to a Gemini 3.1 Pro High agent. **Do not run them all at once.** Wait for the agent to complete and verify each chunk before moving to the next.

---

## Prompt 1: Modularize Chapter 1 & Shared Components
**Goal:** Extract reusable components and Chapter 1 to reduce the size of `index.tsx`.

**Prompt to Agent:**
```text
You are tasked with modularizing the `src/pages/alignment-advantage/index.tsx` file. It is currently too large.

1. Read `docs/alignment-advantage-redesign-philosophy.md` to understand the design standard.
2. Create a new folder: `src/components/alignment-advantage/shared/`.
3. Extract the following shared UI components from `index.tsx` into individual files in the `shared/` folder (make sure to export them and import necessary dependencies like `C` from semantic colors):
   - `SectionWatermark`
   - `SectionHeader`
   - `AxisCard`
   - `TwelvePalaceMiniGrid`
4. Create a new folder: `src/components/alignment-advantage/chapters/`.
5. Extract the entire "SECTION 2: CORE DESIGN" (Chapter 1) from `index.tsx` into a new component: `src/components/alignment-advantage/chapters/ChapterCoreDesign.tsx`.
6. Update `index.tsx` to import and use these newly extracted components, ensuring no functionality or styling is lost.
7. Run `npm run lint` to ensure all imports and types are correct.
```

---

## Prompt 2: Redesign Chapter 2 (Operating System)
**Goal:** Transform Chapter 2 into a premium, visual-first dashboard.

**Prompt to Agent:**
```text
You are tasked with redesigning Chapter 2 (Operating System) in the Alignment Advantage report.

1. Read `docs/alignment-advantage-redesign-philosophy.md` to understand the strict design and copywriting rules (60/40 visual ratio, no card soup, no em dashes).
2. Extract "SECTION 3: HOW YOU OPERATE" from `index.tsx` into a new file: `src/components/alignment-advantage/chapters/ChapterOperatingSystem.tsx`.
3. Redesign the layout following the premium editorial standard:
   - **The Visual ("Proof of Work"):** Replace the current list of 3 palaces with an "Executive Bandwidth Radar" or telemetry dial. Visually map the Life, Inner Power, and Health palaces into three sleek progress bars or a radar chart representing: Identity & Drive, Mental Resilience, and Physical Output.
   - **The Action (The Playbook):** Replace the astrological star descriptions with a "Founder's Environment Matrix". 
   - **Editorial Styling:** Do NOT use standard bullet points or heavy boxed cards. Use a clean, single-column layout with prominent, coral-colored circular numbers (like we did for Key Traits in Chapter 1). Ensure plenty of whitespace.
     - Optimal Conditions (Where they thrive)
     - Burnout Triggers (What drains them)
     - Delegation Mandate (What they must outsource)
4. Ensure the component is integrated back into `index.tsx`.
```

---

## Prompt 3: Redesign Chapter 3 (Wealth Acceleration)
**Goal:** Transform Chapter 3 into a business model diagram and capital allocation dashboard.

**Prompt to Agent:**
```text
You are tasked with redesigning Chapter 3 (Wealth Acceleration) in the Alignment Advantage report.

1. Read `docs/alignment-advantage-redesign-philosophy.md` to ensure you follow the premium editorial standard.
2. Extract "SECTION 4: TIMING" (which actually contains the Wealth Blueprint/Archetype logic) from `index.tsx` into a new file: `src/components/alignment-advantage/chapters/ChapterWealthAcceleration.tsx`.
3. Redesign the layout:
   - **The Visual ("Proof of Work"):** Create a "Revenue Engine Map". Visually represent their wealth code (e.g., B2B High-Ticket, Asset Acquisition) using premium, literal SVGs (no abstract shapes) and a sleek dashboard layout instead of a plain text card.
   - **The Action (The Playbook):** Replace the "Focus On / Stop Doing" bullet points with a "Capital Allocation Dashboard". 
   - **Editorial Styling:** Do not use `<ul>` lists or heavy white boxes with drop shadows. Use a 2x2 grid or a "Buy / Hold / Sell" interface that explicitly tells them where to spend time/money. Use signature coral/green accents and rely on whitespace for separation.
4. Ensure the component is integrated back into `index.tsx`.
```

---

## Prompt 4: Redesign Chapter 4 (Stakeholder Intelligence)
**Goal:** Transform Chapter 4 into a network topology and hiring playbook.

**Prompt to Agent:**
```text
You are tasked with redesigning Chapter 4 (Stakeholder Intelligence) in the Alignment Advantage report.

1. Read `docs/alignment-advantage-redesign-philosophy.md` to ensure you follow the premium editorial standard.
2. Extract "SECTION 6: PEOPLE INTELLIGENCE" from `index.tsx` into a new file: `src/components/alignment-advantage/chapters/ChapterStakeholderIntelligence.tsx`.
3. Redesign the layout:
   - **The Visual ("Proof of Work"):** Create a "Network Topology" diagram. Use sleek SVGs to show a central node (the founder) connecting to three distinct nodes: Co-Founders, Market/Audience, and Backers/Mentors.
   - **The Action (The Playbook):** Create a "Hiring & Partnership Playbook". Remove the astrological explanations of the Spouse/Friends/Parents palaces. 
   - **Editorial Styling:** Provide highly scannable, editorial lists for Who to Partner With, Who to Hire, and Red Flag Partners. Use the "Traffic Light" board style from Chapter 1 (Green Flags / Red Flags) with tinted backgrounds and large icons, avoiding standard bullet points.
4. Ensure the component is integrated back into `index.tsx`.
```

---

## Prompt 5: Redesign Chapter 5 (Execution Playbook)
**Goal:** Style the timing roadmap like a Silicon Valley product roadmap.

**Prompt to Agent:**
```text
You are tasked with redesigning Chapter 5 (Execution Playbook - Timing) in the Alignment Advantage report.

1. Read `docs/alignment-advantage-redesign-philosophy.md` to ensure you follow the premium editorial standard.
2. Extract the DaYun timeline and 12-month grid from `index.tsx` into a new file: `src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx`.
3. Redesign the layout:
   - **The Visual:** Keep the 10-year timeline and 12-month grid, but style them like a high-end Silicon Valley Product Roadmap. Use clean lines, remove heavy boxes, and use the signature orange/coral accents to highlight the "You Are Here" state.
   - **The Action:** Ensure the monthly breakdowns read like a CEO's briefing. Strip out any remaining astrological reasoning. 
   - **Editorial Styling:** Ensure the layout relies on whitespace and typography rather than borders and drop shadows.
4. Ensure the component is integrated back into `index.tsx`.
```

---

## Prompt 6: Redesign Chapter 6 (Decision Framework)
**Goal:** Transform the 3-axis checker into a deal-flow checklist.

**Prompt to Agent:**
```text
You are tasked with redesigning Chapter 6 (Decision Framework) in the Alignment Advantage report.

1. Read `docs/alignment-advantage-redesign-philosophy.md` to ensure you follow the premium editorial standard.
2. Extract "SECTION 7: DECISION FRAMEWORK" from `index.tsx` into a new file: `src/components/alignment-advantage/chapters/ChapterDecisionFramework.tsx`.
3. Redesign the layout:
   - **The Visual ("Proof of Work"):** Elevate the 3-axis checker into a "Strategic Convergence Venn Diagram" or a high-end filtering funnel using sleek SVGs.
   - **The Action (The Playbook):** Turn this into a literal "Deal-Flow Checklist". 
   - **Editorial Styling:** Use the `AxisCard` component but style it so it looks like a printable, high-stakes checklist for signing contracts or hiring executives. Remove heavy card backgrounds if they cause visual fatigue.
4. Ensure the component is integrated back into `index.tsx`.
```