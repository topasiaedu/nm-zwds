# ZWDS Star Data Generation - Group 3: Harmony & Support

## Your Mission
COMPLETE the file by adding the final 6 Harmony & Support stars.

## Reference Materials (READ FIRST)
Study these files thoroughly:
- `E:\Dev\GitHub\nm-zwds\docs\ref\[DEC] Design Your Destiny Workshop.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\[Jan 12 - Jan 14] 2026 Predictable Destiny.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\Recorded modules slides.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\Sept Coaching_ Wealth Rules.txt`

## Your 6 Stars
1. 天同 (Tian Tong) - Heavenly Unity/Child Star
2. 天梁 (Tian Liang) - Elder/Wisdom Star
3. 文昌 (Wen Chang) - Literary Star (Minor)
4. 文曲 (Wen Qu) - Literary Music Star (Minor)
5. 左辅 (Zuo Fu) - Left Assistant (Minor)
6. 右弼 (You Bi) - Right Assistant (Minor)

## Output Instructions

1. **OPEN** the existing file: `src/utils/destiny-navigator/star-data/star-interpretations.ts`
2. **ADD** your 6 stars to complete the `STAR_INTERPRETATIONS` object
3. **DO NOT** modify Agent 1 or Agent 2's stars
4. **ENSURE** all 18 stars are now present
5. **ADD** comment: `// Group 3: Harmony & Support (Agent 3)`
6. **ADD** final export statement for validation

## Example Completion

```typescript
export const STAR_INTERPRETATIONS: Record<string, StarData> = {
  // ... Agent 1's 6 stars ...
  // ... Agent 2's 6 stars ...
  
  // Group 3: Harmony & Support (Agent 3)
  "天同": {
    name: "Tian Tong",
    chineseName: "天同",
    category: "major",
    attributes: {
      authority: 40,
      resources: 60,
      strategy: 50,
      discipline: 30,  // Low discipline - goes with flow
      flow: 95        // Highest flow - childlike ease
    },
    keywords: ["harmony", "childlike", "peace", "happiness", "blessing"],
    essences: {
      life: "Navigate life with childlike ease, seeking harmony over hustle",
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
  
  // Continue with 文昌, 文曲, 左辅, 右弼...
  
  "右弼": {
    name: "You Bi",
    chineseName: "右弼",
    category: "minor",  // Note: Minor star
    attributes: {
      authority: 35,
      resources: 50,
      strategy: 60,
      discipline: 70,
      flow: 75
    },
    keywords: ["support", "assistant", "noble", "helper", "loyal"],
    essences: {
      life: "...",
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
  }
};

// Validation: Total star count
export const TOTAL_STARS = Object.keys(STAR_INTERPRETATIONS).length;
if (TOTAL_STARS !== 18) {
  throw new Error(`Expected 18 stars, got ${TOTAL_STARS}`);
}
```

## Critical Rules

Same as Agents 1 & 2:
- 100% grounded in master's teachings
- Each essence unique (10-15 words)
- Attributes comparative (Support stars have lower authority, higher flow)
- Match master's voice
- **Note:** Last 4 stars are "minor" category

## Quality Checklist

- [ ] Read all 4 reference files
- [ ] Agents 1 & 2's stars remain untouched
- [ ] All 6 new stars added
- [ ] Total count = 18 stars
- [ ] Added validation export
- [ ] File is valid TypeScript with no syntax errors
- [ ] Ready for immediate use in codebase

## Final Verification

Run this check:
```bash
npx tsc --noEmit src/utils/destiny-navigator/star-data/star-interpretations.ts
```

If no errors, file is complete and ready!

Ready for Agent 3 execution.
