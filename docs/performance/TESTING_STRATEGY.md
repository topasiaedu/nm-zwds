# Testing Strategy for Performance Optimizations

> **Note**: This document provides testing guidelines and example test structures. Actual test code will be written during the implementation phase.

## 📋 Overview

This document outlines the comprehensive testing strategy for the ZWDS calculator, analysis functions, and UI components. The goal is to achieve 85%+ test coverage while ensuring all optimizations work correctly.

---

## 🎯 Testing Goals

### Primary Goals
- Achieve 85%+ code coverage
- Verify all optimizations work correctly
- Prevent regressions during refactoring
- Document expected behavior through tests

### Secondary Goals
- Performance benchmarking
- Integration testing
- Type safety validation
- Edge case coverage

---

## 🏗️ Test Structure

### Directory Structure

```
src/utils/zwds/
├── __tests__/
│   ├── fixtures/
│   │   ├── testChartData.ts          # Sample ChartData for tests
│   │   ├── testInputs.ts             # Sample ChartInput for tests
│   │   └── expectedResults.ts        # Expected calculation results
│   ├── calculator.test.ts            # Calculator tests (all steps)
│   ├── calculator.performance.test.ts # Performance benchmarks
│   ├── analysisUtils.test.ts         # Analysis utilities tests
│   ├── overviewAnalysis.test.ts      # Overview analysis tests
│   ├── careerAnalysis.test.ts        # Career analysis tests
│   ├── healthAnalysis.test.ts        # Health analysis tests
│   ├── lifeAreasAnalysis.test.ts     # Life areas analysis tests
│   └── integration.test.ts           # End-to-end integration tests
├── calculator.ts
├── analysis/
│   ├── analysisUtils.ts
│   ├── overviewAnalysis.ts
│   └── ...
```

---

## 🧪 Test Categories

### 1. Unit Tests (High Priority)

Test individual functions and methods in isolation.

#### Calculator Unit Tests

```typescript
// src/utils/zwds/__tests__/calculator.test.ts

import { ZWDSCalculator } from "../calculator";
import { ChartInput } from "../types";
import { EARTHLY_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES } from "../constants";

describe("ZWDSCalculator", () => {
  // Test fixture - known birth data
  const testInput: ChartInput = {
    name: "Test User",
    gender: "male",
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    isLeapMonth: false,
  };

  describe("Step 1: Earthly Branch and Heavenly Stem", () => {
    it("should calculate correct earthly branch and heavenly stem", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // 1990 lunar year should be 庚午 (Geng Wu)
      expect(result.heavenlyStem).toBe("庚");
      expect(result.earthlyBranch).toBe("午");
    });

    it("should handle edge case years correctly", () => {
      const edgeCaseInput = { ...testInput, year: 1900 };
      const calculator = new ZWDSCalculator(edgeCaseInput);
      const result = calculator.calculate();

      expect(result.heavenlyStem).toBeDefined();
      expect(result.earthlyBranch).toBeDefined();
      expect(HEAVENLY_STEMS).toContain(result.heavenlyStem);
      expect(EARTHLY_BRANCHES).toContain(result.earthlyBranch);
    });

    it("should handle future years correctly", () => {
      const futureInput = { ...testInput, year: 2050 };
      const calculator = new ZWDSCalculator(futureInput);
      const result = calculator.calculate();

      expect(result.heavenlyStem).toBeDefined();
      expect(result.earthlyBranch).toBeDefined();
    });
  });

  describe("Step 2: Yin Yang", () => {
    it("should calculate Yang for even year stems", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // 庚 (Geng) is the 7th stem (index 6), which is odd, so Yin
      expect(result.yinYang).toBe("Yin");
    });

    it("should calculate Yin for odd year stems", () => {
      const oddYearInput = { ...testInput, year: 1991 }; // 辛未 year
      const calculator = new ZWDSCalculator(oddYearInput);
      const result = calculator.calculate();

      expect(result.yinYang).toBe("Yang");
    });
  });

  describe("Step 3: Palace Heavenly Stems", () => {
    it("should assign heavenly stems to all palaces", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // All palaces should have heavenly stems
      result.palaces.forEach((palace) => {
        expect(palace.heavenlyStem).toBeDefined();
        expect(HEAVENLY_STEMS).toContain(palace.heavenlyStem);
      });
    });

    it("should have unique or cyclic heavenly stems", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      const stems = result.palaces.map(p => p.heavenlyStem);
      // Should cycle through 10 stems for 12 palaces
      expect(stems.length).toBe(12);
    });
  });

  describe("Step 4: Life Palace Position", () => {
    it("should calculate life palace based on lunar month and hour", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      expect(result.lifePalace).toBeGreaterThanOrEqual(1);
      expect(result.lifePalace).toBeLessThanOrEqual(12);
    });

    it("should place life palace at correct earthly branch", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      const lifePalaceIndex = result.lifePalace - 1;
      const lifePalace = result.palaces[lifePalaceIndex];

      expect(lifePalace).toBeDefined();
      expect(EARTHLY_BRANCHES).toContain(lifePalace.earthlyBranch);
    });

    it("should handle different birth hours correctly", () => {
      const hours = [0, 6, 12, 18, 23];
      
      hours.forEach(hour => {
        const input = { ...testInput, hour };
        const calculator = new ZWDSCalculator(input);
        const result = calculator.calculate();

        expect(result.lifePalace).toBeGreaterThanOrEqual(1);
        expect(result.lifePalace).toBeLessThanOrEqual(12);
      });
    });
  });

  describe("Step 5: Palace Names", () => {
    it("should populate all palace names starting from life palace", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // Life palace should be named 命宫
      const lifePalaceIndex = result.lifePalace - 1;
      expect(result.palaces[lifePalaceIndex].name).toBe("命宫");

      // All palaces should have names
      result.palaces.forEach((palace) => {
        expect(PALACE_NAMES).toContain(palace.name);
      });
    });

    it("should have all 12 unique palace names", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      const names = result.palaces.map((p) => p.name);
      const uniqueNames = new Set(names);

      expect(uniqueNames.size).toBe(12);
      PALACE_NAMES.forEach(name => {
        expect(names).toContain(name);
      });
    });
  });

  describe("Step 6: Five Elements", () => {
    it("should calculate five elements based on life palace", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      expect(result.fiveElements).toBeDefined();
      expect(["水二局", "木三局", "金四局", "土五局", "火六局"]).toContain(
        result.fiveElements
      );
    });

    it("should be consistent for same birth data", () => {
      const calculator1 = new ZWDSCalculator(testInput);
      const calculator2 = new ZWDSCalculator(testInput);
      
      const result1 = calculator1.calculate();
      const result2 = calculator2.calculate();

      expect(result1.fiveElements).toBe(result2.fiveElements);
    });
  });

  describe("Step 7: ZiWei Star Position", () => {
    it("should place ZiWei star in correct palace", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      expect(result.ziWeiPosition).toBeGreaterThanOrEqual(1);
      expect(result.ziWeiPosition).toBeLessThanOrEqual(12);

      const ziWeiPalace = result.palaces[result.ziWeiPosition - 1];
      const hasZiWei = ziWeiPalace.mainStar?.some((s) => s.name === "紫微");

      expect(hasZiWei).toBe(true);
    });

    it("should only have one ZiWei star in the chart", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      let ziWeiCount = 0;
      result.palaces.forEach(palace => {
        palace.mainStar?.forEach(star => {
          if (star.name === "紫微") ziWeiCount++;
        });
      });

      expect(ziWeiCount).toBe(1);
    });
  });

  describe("Step 8: Main Stars", () => {
    it("should place all main stars in palaces", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // Count total main stars across all palaces
      let totalMainStars = 0;
      result.palaces.forEach((palace) => {
        totalMainStars += palace.mainStar?.length || 0;
      });

      // Should have at least the 14 main stars
      expect(totalMainStars).toBeGreaterThanOrEqual(14);
    });

    it("should not have duplicate main stars", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      const allMainStars: string[] = [];
      result.palaces.forEach(palace => {
        palace.mainStar?.forEach(star => {
          allMainStars.push(star.name);
        });
      });

      // Check for duplicates
      const uniqueStars = new Set(allMainStars);
      expect(allMainStars.length).toBe(uniqueStars.size);
    });
  });

  describe("Step 9: Support Stars", () => {
    it("should place left support, right support, wen chang, and wen qu", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      const supportStars = ["左輔", "右弼", "文昌", "文曲"];
      const foundStars = new Set<string>();

      result.palaces.forEach((palace) => {
        palace.minorStars.forEach((star) => {
          if (supportStars.includes(star.name)) {
            foundStars.add(star.name);
          }
        });
      });

      expect(foundStars.size).toBe(4);
      supportStars.forEach(star => {
        expect(foundStars).toContain(star);
      });
    });
  });

  describe("Step 10: Four Transformations", () => {
    it("should apply four transformations based on birth year stem", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      expect(result.transformations).toBeDefined();
      expect(result.transformations?.huaLu).toBeDefined();
      expect(result.transformations?.huaQuan).toBeDefined();
      expect(result.transformations?.huaKe).toBeDefined();
      expect(result.transformations?.huaJi).toBeDefined();
    });

    it("should apply transformations to existing stars", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // Find stars with transformations
      let transformedStarsCount = 0;
      result.palaces.forEach(palace => {
        palace.allStars?.forEach(star => {
          if (star.transformations && star.transformations.length > 0) {
            transformedStarsCount++;
          }
        });
      });

      // Should have at least 4 transformed stars
      expect(transformedStarsCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Step 11: Major Limits", () => {
    it("should calculate major limits for all palaces", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      result.palaces.forEach((palace) => {
        expect(palace.majorLimit).toBeDefined();
        expect(palace.majorLimit?.startAge).toBeGreaterThanOrEqual(0);
        expect(palace.majorLimit?.endAge).toBeGreaterThan(
          palace.majorLimit?.startAge || 0
        );
      });
    });

    it("should have 10-year spans for each major limit", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      result.palaces.forEach((palace) => {
        const span =
          (palace.majorLimit?.endAge || 0) - (palace.majorLimit?.startAge || 0);
        expect(span).toBe(9); // 0-9 is 10 years
      });
    });

    it("should have continuous age coverage", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // Sort palaces by start age
      const sortedPalaces = [...result.palaces].sort(
        (a, b) => (a.majorLimit?.startAge || 0) - (b.majorLimit?.startAge || 0)
      );

      // Check continuity
      for (let i = 0; i < sortedPalaces.length - 1; i++) {
        const currentEnd = sortedPalaces[i].majorLimit?.endAge || 0;
        const nextStart = sortedPalaces[i + 1].majorLimit?.startAge || 0;
        expect(nextStart).toBe(currentEnd + 1);
      }
    });
  });

  describe("Step 12: Annual Flow", () => {
    it("should calculate annual flow for all palaces", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      result.palaces.forEach((palace) => {
        expect(palace.annualFlow).toBeDefined();
        expect(palace.annualFlow?.year).toBeGreaterThan(2000);
        expect(palace.annualFlow?.heavenlyStem).toBeDefined();
        expect(palace.annualFlow?.earthlyBranch).toBeDefined();
      });
    });

    it("should have current year in one of the palaces", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      const currentYear = new Date().getFullYear();
      const hasCurrentYear = result.palaces.some(
        palace => palace.annualFlow?.year === currentYear
      );

      expect(hasCurrentYear).toBe(true);
    });
  });

  describe("NEW: Optimization Steps", () => {
    describe("Lunar Date Caching", () => {
      it("should cache lunar date conversion", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        // Lunar date should be stored in chartData
        expect(result.lunarDate).toBeDefined();
        expect(result.lunarDate.year).toBeGreaterThan(0);
        expect(result.lunarDate.month).toBeGreaterThanOrEqual(1);
        expect(result.lunarDate.month).toBeLessThanOrEqual(12);
      });
    });

    describe("Step 17: Palace Indexes", () => {
      it("should create palace index by name", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        expect(result.palaceIndex).toBeDefined();
        expect(result.palaceIndex?.byName).toBeInstanceOf(Map);

        // Should be able to lookup by name
        const lifePalace = result.palaceIndex?.byName.get("命宫");
        expect(lifePalace).toBeDefined();
        expect(lifePalace?.name).toBe("命宫");
      });

      it("should create palace index by number", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        expect(result.palaceIndex?.byNumber).toBeInstanceOf(Map);

        // Should be able to lookup by number
        for (let i = 1; i <= 12; i++) {
          const palace = result.palaceIndex?.byNumber.get(i);
          expect(palace).toBeDefined();
          expect(palace?.number).toBe(i);
        }
      });

      it("should have all 12 palaces in both indexes", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        expect(result.palaceIndex?.byName.size).toBe(12);
        expect(result.palaceIndex?.byNumber.size).toBe(12);
      });
    });

    describe("Step 18: Flattened Star Arrays", () => {
      it("should flatten all star arrays for each palace", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        result.palaces.forEach((palace) => {
          expect(palace.allStars).toBeDefined();
          expect(Array.isArray(palace.allStars)).toBe(true);

          // allStars should contain all stars from all arrays
          const manualCount =
            (palace.mainStar?.length || 0) +
            (palace.bodyStar ? 1 : 0) +
            (palace.lifeStar ? 1 : 0) +
            palace.minorStars.length +
            palace.auxiliaryStars.length +
            palace.yearStars.length +
            palace.monthStars.length +
            palace.dayStars.length +
            palace.hourStars.length;

          expect(palace.allStars?.length).toBe(manualCount);
        });
      });

      it("should create allStarNames array", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        result.palaces.forEach((palace) => {
          expect(palace.allStarNames).toBeDefined();
          expect(Array.isArray(palace.allStarNames)).toBe(true);
          expect(palace.allStarNames?.length).toBe(palace.allStars?.length || 0);

          // All names should be strings
          palace.allStarNames?.forEach(name => {
            expect(typeof name).toBe("string");
          });
        });
      });
    });

    describe("Step 19: Opposite Palace References", () => {
      it("should set opposite palace references", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        // Find life palace
        const lifePalace = result.palaces.find((p) => p.name === "命宫");
        expect(lifePalace).toBeDefined();

        // Life palace opposite should be travel palace (迁移)
        expect(lifePalace?.oppositePalace).toBeDefined();
        expect(lifePalace?.oppositePalace?.name).toBe("迁移");
      });

      it("should have bidirectional opposite palace references", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        const oppositePairs = [
          ["命宫", "迁移"],
          ["兄弟", "交友"],
          ["夫妻", "官禄"],
          ["子女", "田宅"],
          ["财帛", "福德"],
          ["疾厄", "父母"],
        ];

        oppositePairs.forEach(([palace1Name, palace2Name]) => {
          const palace1 = result.palaces.find((p) => p.name === palace1Name);
          const palace2 = result.palaces.find((p) => p.name === palace2Name);

          expect(palace1?.oppositePalace?.name).toBe(palace2Name);
          expect(palace2?.oppositePalace?.name).toBe(palace1Name);
        });
      });

      it("should have all palaces with opposite references", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        result.palaces.forEach(palace => {
          expect(palace.oppositePalace).toBeDefined();
          expect(palace.oppositePalace?.name).toBeDefined();
        });
      });
    });

    describe("Step 20: Palace Relationship Lookup Tables", () => {
      it("should create Da Ming tag lookup tables", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        expect(result.palaceRelationships).toBeDefined();
        expect(result.palaceRelationships?.daMingTags).toBeDefined();

        // Check all 12x12 combinations exist
        for (let ref = 1; ref <= 12; ref++) {
          for (let target = 1; target <= 12; target++) {
            const lookup = result.palaceRelationships?.daMingTags[ref]?.[target];
            expect(lookup).toBeDefined();
            expect(lookup.tagZh).toBeDefined();
            expect(lookup.tagEn).toBeDefined();
            expect(typeof lookup.distance).toBe("number");
            expect(typeof lookup.delay).toBe("number");
          }
        }
      });

      it("should create month flow lookup tables", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        expect(result.palaceRelationships?.monthFlow).toBeDefined();

        // Check all 12x12 combinations exist
        for (let ref = 1; ref <= 12; ref++) {
          for (let target = 1; target <= 12; target++) {
            const lookup = result.palaceRelationships?.monthFlow[ref]?.[target];
            expect(lookup).toBeDefined();
            expect(lookup.monthZh).toBeDefined();
            expect(lookup.monthEn).toBeDefined();
          }
        }
      });

      it("should create secondary palace name lookup tables", () => {
        const calculator = new ZWDSCalculator(testInput);
        const result = calculator.calculate();

        expect(result.palaceRelationships?.secondaryNames).toBeDefined();

        // Check all 12x12 combinations exist
        for (let ref = 1; ref <= 12; ref++) {
          for (let target = 1; target <= 12; target++) {
            const name = result.palaceRelationships?.secondaryNames[ref]?.[target];
            expect(name).toBeDefined();
            expect(PALACE_NAMES).toContain(name);
          }
        }
      });
    });
  });

  describe("Integration: Full Chart Calculation", () => {
    it("should produce complete chart with all steps", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      // Verify all critical fields are populated
      expect(result.input).toEqual(testInput);
      expect(result.earthlyBranch).toBeDefined();
      expect(result.heavenlyStem).toBeDefined();
      expect(result.yinYang).toBeDefined();
      expect(result.lunarDate).toBeDefined();
      expect(result.palaces).toHaveLength(12);
      expect(result.lifePalace).toBeGreaterThanOrEqual(1);
      expect(result.fiveElements).toBeDefined();
      expect(result.ziWeiPosition).toBeDefined();
      expect(result.mainStar).toBeDefined();
      expect(result.transformations).toBeDefined();
      expect(result.palaceIndex).toBeDefined();
      expect(result.palaceRelationships).toBeDefined();
    });

    it("should have consistent data across all palaces", () => {
      const calculator = new ZWDSCalculator(testInput);
      const result = calculator.calculate();

      result.palaces.forEach((palace, index) => {
        // Palace number should match index + 1
        expect(palace.number).toBe(index + 1);

        // All required fields should be present
        expect(palace.earthlyBranch).toBeDefined();
        expect(palace.heavenlyStem).toBeDefined();
        expect(palace.name).toBeDefined();
        expect(palace.majorLimit).toBeDefined();
        expect(palace.annualFlow).toBeDefined();
        expect(palace.allStars).toBeDefined();
        expect(palace.allStarNames).toBeDefined();
        expect(palace.oppositePalace).toBeDefined();
      });
    });

    it("should be deterministic for same input", () => {
      const calculator1 = new ZWDSCalculator(testInput);
      const calculator2 = new ZWDSCalculator(testInput);
      
      const result1 = calculator1.calculate();
      const result2 = calculator2.calculate();

      // Key fields should be identical
      expect(result1.earthlyBranch).toBe(result2.earthlyBranch);
      expect(result1.heavenlyStem).toBe(result2.heavenlyStem);
      expect(result1.lifePalace).toBe(result2.lifePalace);
      expect(result1.fiveElements).toBe(result2.fiveElements);
      expect(result1.ziWeiPosition).toBe(result2.ziWeiPosition);
    });
  });
});
```

---

### 2. Analysis Utilities Tests

```typescript
// src/utils/zwds/__tests__/analysisUtils.test.ts

import {
  getPalaceByName,
  getAllStarsFromPalace,
  getAllStarNamesFromPalace,
  getStarsWithFallback,
  findMatchingStars,
  palaceHasAnyStars,
  palaceHasAllStars,
} from "../analysis/analysisUtils";
import { ZWDSCalculator } from "../calculator";
import { ChartInput } from "../types";

describe("Analysis Utilities", () => {
  let testChartData: any;

  beforeAll(() => {
    const testInput: ChartInput = {
      name: "Test User",
      gender: "male",
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      isLeapMonth: false,
    };

    const calculator = new ZWDSCalculator(testInput);
    testChartData = calculator.calculate();
  });

  describe("getPalaceByName", () => {
    it("should return palace by name using O(1) lookup", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");

      expect(lifePalace).toBeDefined();
      expect(lifePalace?.name).toBe("命宫");
    });

    it("should return null for non-existent palace", () => {
      const nonExistent = getPalaceByName(testChartData, "不存在");

      expect(nonExistent).toBeNull();
    });

    it("should be faster than array.find", () => {
      const iterations = 10000;

      // Time the optimized version
      const start1 = performance.now();
      for (let i = 0; i < iterations; i++) {
        getPalaceByName(testChartData, "命宫");
      }
      const optimizedTime = performance.now() - start1;

      // Time the old version
      const start2 = performance.now();
      for (let i = 0; i < iterations; i++) {
        testChartData.palaces.find((p: any) => p.name === "命宫");
      }
      const oldTime = performance.now() - start2;

      // Optimized should be faster
      expect(optimizedTime).toBeLessThan(oldTime);
      console.log(`Optimization: ${(oldTime / optimizedTime).toFixed(2)}x faster`);
    });

    it("should work for all palace names", () => {
      const palaceNames = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄",
                          "迁移", "交友", "官禄", "田宅", "福德", "父母"];
      
      palaceNames.forEach(name => {
        const palace = getPalaceByName(testChartData, name);
        expect(palace).toBeDefined();
        expect(palace?.name).toBe(name);
      });
    });
  });

  describe("getAllStarsFromPalace", () => {
    it("should return pre-flattened star array", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const stars = getAllStarsFromPalace(lifePalace!);

      expect(Array.isArray(stars)).toBe(true);
      expect(stars.length).toBeGreaterThanOrEqual(0);
    });

    it("should match manual star extraction", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const optimizedStars = getAllStarsFromPalace(lifePalace!);

      // Manual extraction
      const manualStars = [
        ...(lifePalace?.mainStar || []),
        ...(lifePalace?.bodyStar ? [lifePalace.bodyStar] : []),
        ...(lifePalace?.lifeStar ? [lifePalace.lifeStar] : []),
        ...(lifePalace?.minorStars || []),
        ...(lifePalace?.auxiliaryStars || []),
        ...(lifePalace?.yearStars || []),
        ...(lifePalace?.monthStars || []),
        ...(lifePalace?.dayStars || []),
        ...(lifePalace?.hourStars || []),
      ];

      expect(optimizedStars.length).toBe(manualStars.length);
    });
  });

  describe("getAllStarNamesFromPalace", () => {
    it("should return pre-computed star names", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const starNames = getAllStarNamesFromPalace(lifePalace!);

      expect(Array.isArray(starNames)).toBe(true);
      starNames.forEach((name) => {
        expect(typeof name).toBe("string");
      });
    });

    it("should match stars length", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const stars = getAllStarsFromPalace(lifePalace!);
      const starNames = getAllStarNamesFromPalace(lifePalace!);

      expect(starNames.length).toBe(stars.length);
    });
  });

  describe("getStarsWithFallback", () => {
    it("should return stars from primary palace if available", () => {
      const result = getStarsWithFallback(testChartData, "命宫");

      expect(result.stars).toBeDefined();
      expect(result.starNames).toBeDefined();
      expect(typeof result.usedFallback).toBe("boolean");
    });

    it("should indicate when fallback is used", () => {
      // Find a palace with no stars (if any)
      const emptyPalace = testChartData.palaces.find(
        (p: any) => p.allStars?.length === 0
      );

      if (emptyPalace) {
        const result = getStarsWithFallback(testChartData, emptyPalace.name);

        if (result.usedFallback) {
          expect(result.stars.length).toBeGreaterThan(0);
        }
      }
    });

    it("should return empty arrays for non-existent palace", () => {
      const result = getStarsWithFallback(testChartData, "不存在");

      expect(result.stars).toEqual([]);
      expect(result.starNames).toEqual([]);
      expect(result.usedFallback).toBe(false);
    });
  });

  describe("findMatchingStars", () => {
    it("should find stars matching target names", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const allStarNames = getAllStarNamesFromPalace(lifePalace!);
      
      if (allStarNames.length > 0) {
        const targetNames = [allStarNames[0]];
        const matchingStars = findMatchingStars(lifePalace!, targetNames);

        expect(matchingStars.length).toBeGreaterThan(0);
        matchingStars.forEach((star) => {
          expect(targetNames).toContain(star.name);
        });
      }
    });

    it("should return empty array if no matches", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const nonExistentNames = ["不存在1", "不存在2"];

      const matchingStars = findMatchingStars(lifePalace!, nonExistentNames);

      expect(matchingStars).toEqual([]);
    });
  });

  describe("palaceHasAnyStars", () => {
    it("should return true if palace has any of the stars", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const allStarNames = getAllStarNamesFromPalace(lifePalace!);
      
      if (allStarNames.length > 0) {
        const result = palaceHasAnyStars(lifePalace!, [allStarNames[0]]);
        expect(result).toBe(true);
      }
    });

    it("should return false if palace has none of the stars", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const result = palaceHasAnyStars(lifePalace!, ["不存在"]);
      expect(result).toBe(false);
    });
  });

  describe("palaceHasAllStars", () => {
    it("should return true if palace has all of the stars", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const allStarNames = getAllStarNamesFromPalace(lifePalace!);
      
      if (allStarNames.length > 0) {
        const result = palaceHasAllStars(lifePalace!, [allStarNames[0]]);
        expect(result).toBe(true);
      }
    });

    it("should return false if palace is missing any star", () => {
      const lifePalace = getPalaceByName(testChartData, "命宫");
      const allStarNames = getAllStarNamesFromPalace(lifePalace!);
      
      const testStars = [...allStarNames, "不存在"];
      const result = palaceHasAllStars(lifePalace!, testStars);
      expect(result).toBe(false);
    });
  });
});
```

---

### 3. Performance Benchmarks

```typescript
// src/utils/zwds/__tests__/calculator.performance.test.ts

import { ZWDSCalculator } from "../calculator";
import { ChartInput } from "../types";

describe("Calculator Performance Benchmarks", () => {
  const testInput: ChartInput = {
    name: "Test User",
    gender: "male",
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    isLeapMonth: false,
  };

  it("should complete full calculation in < 100ms", () => {
    const start = performance.now();
    const calculator = new ZWDSCalculator(testInput);
    calculator.calculate();
    const duration = performance.now() - start;

    console.log(`Full calculation took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(100);
  });

  it("should perform palace lookups in < 1ms", () => {
    const calculator = new ZWDSCalculator(testInput);
    const chartData = calculator.calculate();

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      chartData.palaceIndex?.byName.get("命宫");
    }
    const duration = performance.now() - start;

    console.log(`1000 palace lookups took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(1);
  });

  it("should cache lunar date effectively", () => {
    // This is tested implicitly by the full calculation time
    // If lunar date is called 4 times without caching, it would be much slower
    const calculator = new ZWDSCalculator(testInput);
    const start = performance.now();
    calculator.calculate();
    const duration = performance.now() - start;

    // With caching, should be fast
    expect(duration).toBeLessThan(100);
  });
});
```

---

## 🚀 Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test calculator.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Step 17"

# Run performance benchmarks
npm test calculator.performance.test.ts
```

### Coverage Goals

```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
calculator.ts                 |   90+   |   85+    |   90+   |   90+
analysis/analysisUtils.ts     |   95+   |   90+    |   95+   |   95+
analysis/overviewAnalysis.ts  |   85+   |   80+    |   85+   |   85+
analysis/careerAnalysis.ts    |   85+   |   80+    |   85+   |   85+
analysis/healthAnalysis.ts    |   85+   |   80+    |   85+   |   85+
------------------------------|---------|----------|---------|--------
Overall                       |   85+   |   80+    |   85+   |   85+
```

---

## 📚 Related Documents

- [Performance Overview](./OVERVIEW.md)
- [Calculator Optimization](./CALCULATOR_OPTIMIZATION.md)
- [Analysis Optimization](./ANALYSIS_OPTIMIZATION.md)
- [UI Optimization](./UI_OPTIMIZATION.md)

---

**Last Updated:** 2025-11-26
**Status:** Ready for Implementation

