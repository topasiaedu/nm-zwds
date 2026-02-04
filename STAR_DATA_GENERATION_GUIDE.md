# 🤖 ZWDS Star Data Generation - Execution Guide

## Overview
Generate complete star interpretation data for the Destiny Navigator using 3 sequential agents.

---

## 📋 Prerequisites

1. All reference materials are in: `E:\Dev\GitHub\nm-zwds\docs\ref\`
2. Target output file: `src/utils/destiny-navigator/star-data/star-interpretations.ts`
3. Each agent will read from the reference materials and generate data grounded in the master's teachings

---

## 🔄 Execution Sequence

### **Step 1: Agent 1 - Power & Authority Stars**

**Prompt File:** `AGENT_1_PROMPT.md`

**Stars to Generate:** 6 stars
- 紫微 (Zi Wei)
- 廉贞 (Lian Zhen)
- 天府 (Tian Fu)
- 天相 (Tian Xiang)
- 太阳 (Tai Yang)
- 太阴 (Tai Yin)

**Output:** Creates `src/utils/destiny-navigator/star-data/star-interpretations.ts` with 6 stars

**Time:** ~30-40 minutes

**Verification:**
```bash
# Check file exists
ls src/utils/destiny-navigator/star-data/star-interpretations.ts

# Count stars (should be 6)
grep -c "chineseName:" src/utils/destiny-navigator/star-data/star-interpretations.ts
```

---

### **Step 2: Agent 2 - Action & Transformation Stars**

**Prompt File:** `AGENT_2_PROMPT.md`

**Stars to Generate:** 6 stars
- 武曲 (Wu Qu)
- 七杀 (Qi Sha)
- 破军 (Po Jun)
- 贪狼 (Tan Lang)
- 天机 (Tian Ji)
- 巨门 (Ju Men)

**Output:** Appends to existing file (total: 12 stars)

**Time:** ~30-40 minutes

**Verification:**
```bash
# Count stars (should be 12 now)
grep -c "chineseName:" src/utils/destiny-navigator/star-data/star-interpretations.ts
```

---

### **Step 3: Agent 3 - Harmony & Support Stars**

**Prompt File:** `AGENT_3_PROMPT.md`

**Stars to Generate:** 6 stars
- 天同 (Tian Tong)
- 天梁 (Tian Liang)
- 文昌 (Wen Chang)
- 文曲 (Wen Qu)
- 左辅 (Zuo Fu)
- 右弼 (You Bi)

**Output:** Completes file (total: 18 stars)

**Time:** ~30-40 minutes

**Verification:**
```bash
# Count stars (should be 18 now)
grep -c "chineseName:" src/utils/destiny-navigator/star-data/star-interpretations.ts

# TypeScript validation
npx tsc --noEmit src/utils/destiny-navigator/star-data/star-interpretations.ts
```

---

## ✅ Final Validation

After all 3 agents complete:

```bash
# 1. Check TypeScript compilation
npx tsc --noEmit src/utils/destiny-navigator/star-data/star-interpretations.ts

# 2. Verify star count
node -e "const data = require('./src/utils/destiny-navigator/star-data/star-interpretations.ts'); console.log('Total stars:', Object.keys(data.STAR_INTERPRETATIONS).length);"

# 3. Check file size (should be ~50-80KB)
ls -lh src/utils/destiny-navigator/star-data/star-interpretations.ts
```

---

## 📊 Expected Output Structure

```typescript
export interface StarData {
  name: string;
  chineseName: string;
  category: "major" | "minor";
  attributes: {
    authority: number;
    resources: number;
    strategy: number;
    discipline: number;
    flow: number;
  };
  keywords: string[];
  essences: {
    life: string;
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
  // 18 stars total
};
```

---

## 🎯 Success Criteria

- [ ] All 18 stars present (14 major + 4 minor)
- [ ] Each star has all 5 attributes (0-100 scale)
- [ ] Each star has 5 keywords
- [ ] Each star has 12 unique essence sentences (one per aspect)
- [ ] File compiles without TypeScript errors
- [ ] All content grounded in master's reference materials
- [ ] No generic astrology language - uses master's strategic framing

---

## ⏱️ Timeline

- **Agent 1:** 30-40 min
- **Agent 2:** 30-40 min
- **Agent 3:** 30-40 min
- **Total:** ~90-120 minutes

---

## 🚀 Ready to Execute

1. Open `AGENT_1_PROMPT.md` 
2. Pass to Sonnet 4.5 agent
3. Wait for completion
4. Verify output
5. Proceed to Agent 2
6. Repeat for Agent 3

**Good luck!** 🎉
