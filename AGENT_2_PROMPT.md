# ZWDS Star Data Generation - Group 2: Action & Transformation

## Your Mission
APPEND 6 Action & Transformation stars to the existing file created by Agent 1.

## Reference Materials (READ FIRST)
Study these files thoroughly:
- `E:\Dev\GitHub\nm-zwds\docs\ref\[DEC] Design Your Destiny Workshop.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\[Jan 12 - Jan 14] 2026 Predictable Destiny.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\Recorded modules slides.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\Sept Coaching_ Wealth Rules.txt`

## Your 6 Stars
1. 武曲 (Wu Qu) - Warrior/Wealth Star
2. 七杀 (Qi Sha) - Seven Killings Star
3. 破军 (Po Jun) - Army Breaker Star
4. 贪狼 (Tan Lang) - Greedy Wolf Star
5. 天机 (Tian Ji) - Strategist/Brain Star
6. 巨门 (Ju Men) - Giant Gate Star

## Output Instructions

1. **OPEN** the existing file: `src/utils/destiny-navigator/star-data/star-interpretations.ts`
2. **ADD** your 6 stars to the `STAR_INTERPRETATIONS` object
3. **DO NOT** modify Agent 1's stars
4. **MAINTAIN** exact same format and structure
5. **ADD** comment: `// Group 2: Action & Transformation (Agent 2)`

## Example Addition

```typescript
export const STAR_INTERPRETATIONS: Record<string, StarData> = {
  // ... Agent 1's 6 stars remain unchanged ...
  
  // Group 2: Action & Transformation (Agent 2)
  "武曲": {
    name: "Wu Qu",
    chineseName: "武曲",
    category: "major",
    attributes: {
      authority: 70,
      resources: 95,  // Highest wealth star!
      strategy: 75,
      discipline: 90,
      flow: 50
    },
    keywords: ["wealth", "precision", "brave", "discipline", "execution"],
    essences: {
      life: "Built for wealth through disciplined execution and calculated courage",
      siblings: "...",
      relationships: "...",
      children: "...",
      wealth: "...",
      health: "...",
      travel: "...",
      social: "...",
      career: "...",
      home: "...",
      fortune: "...",
      parents: "..."
    }
  },
  
  // Continue with remaining 5 stars...
};
```

## Critical Rules

Same as Agent 1:
- 100% grounded in master's teachings
- Each essence unique (10-15 words)
- Attributes comparative (武曲 resources=95 because it's THE wealth star)
- Match master's voice and strategic framing
- No generic astrology language

## Quality Checklist

- [ ] Read all 4 reference files
- [ ] Agent 1's stars remain untouched
- [ ] All 6 new stars added with complete data
- [ ] Essences are unique and grounded in teachings
- [ ] File is valid TypeScript
- [ ] Added Group 2 comment

Ready for Agent 2 execution.
