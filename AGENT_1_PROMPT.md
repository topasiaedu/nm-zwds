# ZWDS Star Data Generation - Group 1: Power & Authority

## Your Mission
Generate interpretation data for 6 Power & Authority stars based ONLY on the master's teachings.

## Reference Materials (READ FIRST)
Study these files thoroughly before generating any data:
- `E:\Dev\GitHub\nm-zwds\docs\ref\[DEC] Design Your Destiny Workshop.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\[Jan 12 - Jan 14] 2026 Predictable Destiny.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\Recorded modules slides.txt`
- `E:\Dev\GitHub\nm-zwds\docs\ref\Sept Coaching_ Wealth Rules.txt`

## Your 6 Stars
1. 紫微 (Zi Wei) - Emperor Star
2. 廉贞 (Lian Zhen) - Commander Star  
3. 天府 (Tian Fu) - Treasury/Empress Star
4. 天相 (Tian Xiang) - Prime Minister Star
5. 太阳 (Tai Yang) - Sun Star
6. 太阴 (Tai Yin) - Moon Star

## Output Format

Create a TypeScript file: `src/utils/destiny-navigator/star-data/star-interpretations.ts`

```typescript
/**
 * ZWDS Star Interpretation Data
 * Generated from master's teachings
 * DO NOT EDIT MANUALLY - regenerate if needed
 */

export interface StarData {
  name: string;
  chineseName: string;
  category: "major" | "minor";
  attributes: {
    authority: number;    // 0-100: Command, respect, leadership ability
    resources: number;    // 0-100: Material wealth, assets, accumulation
    strategy: number;     // 0-100: Planning, foresight, tactical thinking
    discipline: number;   // 0-100: Execution, consistency, follow-through
    flow: number;        // 0-100: Ease, natural momentum, effortlessness
  };
  keywords: string[];    // 5 actionable keywords
  essences: {
    life: string;        // 10-15 words, unique prose
    siblings: string;
    relationships: string;
    children: string;
    wealth: string;
    health: string;
    travel: string;
    social: string;
    career: string;
    home: string;
    fortune: string;
    parents: string;
  };
}

export const STAR_INTERPRETATIONS: Record<string, StarData> = {
  "紫微": {
    name: "Zi Wei",
    chineseName: "紫微",
    category: "major",
    attributes: {
      authority: 95,
      resources: 75,
      strategy: 85,
      discipline: 80,
      flow: 60
    },
    keywords: ["authority", "leadership", "premium", "systems", "command"],
    essences: {
      life: "Born to lead with natural command presence and systematic vision",
      siblings: "Command respect naturally among peers, often the dominant sibling",
      relationships: "Attract strong independent partners who respect your authority",
      children: "Raise disciplined leaders through structured dignified parenting",
      wealth: "Build wealth through authority-based roles and premium positioning",
      health: "Imperial constitution demands systematic premium care and balance",
      travel: "Lead trips naturally, preferring control even outside comfort zones",
      social: "Attract high-quality connections through commanding presence",
      career: "Excel in structured environments with clear hierarchy and mission",
      home: "Create imperial sanctuary reflecting status and systematic values",
      fortune: "Inner nobility manifests through dignified composed mindset",
      parents: "Inherit authority patterns and high expectations from strict upbringing"
    }
  },
  
  // Generate remaining 5 stars following same structure...
};
```

## Critical Rules

1. **Stay 100% aligned with master's teachings** - Quote directly from reference materials
2. **Each essence must be unique** - No templates, no fill-in-blanks
3. **Attributes are comparative** - Score relative to other stars (Zi Wei authority=95, support stars authority=40)
4. **Ground in examples** - Use actual language from the master's scripts
5. **Maintain voice** - Match the master's direct, strategic, modern teaching style

## Quality Checklist

Before outputting, verify:
- [ ] Read all 4 reference files completely
- [ ] Each essence is 10-15 words, compelling and specific
- [ ] Attributes reflect star's core nature from teachings
- [ ] Keywords are actionable and grounded in master's language
- [ ] No generic astrology language - use master's modern strategic framing
- [ ] All 6 stars completed with 12 essences each

## Output Instructions

1. Create the file: `src/utils/destiny-navigator/star-data/star-interpretations.ts`
2. Include the full TypeScript code with proper types
3. Complete all 6 stars with all data fields
4. Ensure valid TypeScript syntax
5. Add brief comment noting this is Group 1 data

Ready to proceed with Agent 1 generation.
