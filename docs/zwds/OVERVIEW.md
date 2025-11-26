# ZWDS Engine Overview

This document explains the ZWDS (紫微斗数, Zi Wei Dou Shu) calculation and analysis engine.

## What is ZWDS?

**Zi Wei Dou Shu (紫微斗数)** is an ancient Chinese astrological system, also known as "Purple Star Astrology". It's used for:

- **Personality Analysis**: Understanding character traits and tendencies
- **Life Path Guidance**: Career, relationships, health insights
- **Timing Predictions**: Decade-by-decade life cycle analysis
- **Decision Making**: Optimal timing for major life decisions

## How It Works

### Input Data
The system requires:
- **Birth Date**: Year, month, day (lunar or solar)
- **Birth Time**: Hour (24-hour format)
- **Gender**: Male or female

### Calculation Process
1. **Convert to Lunar Calendar**: If solar date provided
2. **Calculate Life Palace**: Based on birth month and hour
3. **Place 12 Palaces**: Around the chart in specific order
4. **Place Major Stars**: ~100 stars based on birth data
5. **Calculate Transformations**: Four transformations (四化)
6. **Determine Decade Cycles**: 10-year periods (大限)
7. **Generate Analysis**: Interpret star positions and relationships

### Output
- **Interactive Chart**: Visual representation with all palaces and stars
- **Personality Analysis**: Detailed personality traits
- **Career Guidance**: Career aptitudes and recommendations
- **Health Insights**: Body part analysis
- **Timing Analysis**: Decade-by-decade predictions

## Architecture

### Core Components

```
src/zwds/
├── core/                   # Calculation engine
│   ├── calculator.ts       # Main calculation logic
│   ├── constants.ts        # ZWDS lookup tables
│   ├── types.ts            # Type definitions
│   └── utils.ts            # Helper functions
│
├── analyzers/              # Analysis algorithms
│   ├── career.ts           # Career analysis
│   ├── health.ts           # Health analysis
│   ├── personality.ts      # Personality analysis
│   └── timing/             # Timing analysis
│
├── data/                   # Data and content
│   ├── constants/          # Non-translatable data
│   └── content/            # Translatable content
│
└── utils/                  # Utilities
    ├── palace-helpers.ts   # Palace utilities
    └── star-helpers.ts     # Star utilities
```

## The 12 Palaces (十二宫)

Each chart has 12 palaces representing different life areas:

1. **命宫 (Life Palace)**: Core personality, life direction
2. **兄弟宫 (Siblings Palace)**: Siblings, close friends
3. **夫妻宫 (Spouse Palace)**: Marriage, partnerships
4. **子女宫 (Children Palace)**: Children, creativity
5. **财帛宫 (Wealth Palace)**: Money, resources
6. **疾厄宫 (Health Palace)**: Health, body
7. **迁移宫 (Travel Palace)**: Travel, external opportunities
8. **交友宫 (Friends Palace)**: Social circle, subordinates
9. **事业宫 (Career Palace)**: Career, achievements
10. **田宅宫 (Property Palace)**: Home, real estate
11. **福德宫 (Fortune Palace)**: Mental state, happiness
12. **父母宫 (Parents Palace)**: Parents, authority figures

## Major Stars

### Primary Stars (主星)
The most important stars that define personality:

**Leadership Group (领导型)**
- 紫微 (Zi Wei): Emperor Star
- 天府 (Tian Fu): Treasury Star

**Support Group (辅佐型)**
- 太阳 (Tai Yang): Sun Star
- 太阴 (Tai Yin): Moon Star
- 天机 (Tian Ji): Wisdom Star
- 天同 (Tian Tong): Harmony Star
- 天梁 (Tian Liang): Elder Star

**Action Group (行动型)**
- 武曲 (Wu Qu): Military Star
- 破军 (Po Jun): Breakthrough Star
- 七杀 (Qi Sha): Seven Killings Star
- 廉贞 (Lian Zhen): Integrity Star
- 贪狼 (Tan Lang): Greedy Wolf Star

**Creative Group (创造型)**
- 巨门 (Ju Men): Great Door Star
- 天相 (Tian Xiang): Minister Star

### Auxiliary Stars (辅星)
Supporting stars that modify the main stars:
- 左辅 (Zuo Fu): Left Assistant
- 右弼 (You Bi): Right Assistant
- 文昌 (Wen Chang): Literary Star
- 文曲 (Wen Qu): Literary Melody
- 天魁 (Tian Kui): Heavenly Leader
- 天钺 (Tian Yue): Heavenly Halberd
- 禄存 (Lu Cun): Wealth Preservation
- 天马 (Tian Ma): Heavenly Horse

### Transformation Stars (化星)
Four transformations that modify star energy:
- 化禄 (Hua Lu): Transform to Wealth
- 化权 (Hua Quan): Transform to Power
- 化科 (Hua Ke): Transform to Fame
- 化忌 (Hua Ji): Transform to Obstruction

### Inauspicious Stars (煞星)
Challenging stars that create obstacles:
- 擎羊 (Qing Yang): Goat Blade
- 陀罗 (Tuo Luo): Spinning Top
- 火星 (Huo Xing): Fire Star
- 铃星 (Ling Xing): Bell Star
- 地空 (Di Kong): Earth Void
- 地劫 (Di Jie): Earth Robbery

## Four Transformations (四化)

The four transformations are the most important aspect of ZWDS analysis:

### 化禄 (Hua Lu) - Wealth/Benefit
- **Meaning**: Smooth, beneficial, profitable
- **Effect**: Brings opportunities and resources
- **Best in**: Wealth, Career, Life palaces

### 化权 (Hua Quan) - Power/Authority
- **Meaning**: Control, leadership, authority
- **Effect**: Increases influence and decision-making power
- **Best in**: Career, Life palaces

### 化科 (Hua Ke) - Fame/Recognition
- **Meaning**: Reputation, academic success, recognition
- **Effect**: Brings honor and smooth relationships
- **Best in**: Career, Life, Spouse palaces

### 化忌 (Hua Ji) - Obstruction/Challenge
- **Meaning**: Obstacles, worries, difficulties
- **Effect**: Creates challenges and requires extra effort
- **Caution in**: All palaces, especially Life and Health

## Decade Cycles (大限)

ZWDS divides life into 10-year periods called 大限 (Da Xian):

### Cycle Calculation
- Each palace governs a 10-year period
- Starting palace determined by Life Palace position
- Clockwise or counter-clockwise based on gender and Five Element

### Cycle Analysis
Each decade has:
- **Governing Palace**: Main theme of the decade
- **Active Stars**: Stars in that palace
- **Transformations**: Special activations
- **Opportunities**: Best areas to focus on
- **Challenges**: Areas requiring caution

### Example
If Life Palace is in 子 (Rat) position:
- Ages 0-9: Life Palace (命宫)
- Ages 10-19: Parents Palace (父母宫)
- Ages 20-29: Fortune Palace (福德宫)
- And so on...

## Analysis Algorithms

### Career Analysis
1. Identify stars in Career Palace (事业宫)
2. Check Life Palace stars (personality fit)
3. Analyze transformations
4. Map to 9 career archetypes:
   - Visionaries (创新者)
   - Strategists (战略家)
   - Guardians (守护者)
   - Advisors (顾问)
   - Architects (建筑师)
   - Educators (教育者)
   - Stewards (管家)
   - Lifekeepers (生命守护者)
   - Vanguards (先锋)

### Health Analysis
1. Identify stars in Health Palace (疾厄宫)
2. Map stars to body parts
3. Check for inauspicious stars
4. Provide health recommendations

### Personality Analysis
1. Analyze Life Palace (命宫) stars
2. Check Fortune Palace (福德宫) for inner nature
3. Consider transformations
4. Generate personality description

### Timing Analysis
1. Calculate current decade cycle
2. Identify governing palace
3. Analyze active stars
4. Determine opportunities and challenges
5. Provide guidance for the period

## Calculation Details

### Step-by-Step Process

The `ZWDSCalculator` class performs these steps:

1. **Initialize Chart Data**
   - Set birth date, time, gender
   - Convert solar to lunar if needed

2. **Calculate Five Element (五行)**
   - Based on birth year Heavenly Stem

3. **Calculate Life Palace Position**
   - Formula: (Birth Month + Birth Hour) mod 12

4. **Place 12 Palaces**
   - Starting from Life Palace
   - Clockwise around the chart

5. **Calculate Body Palace (身宫)**
   - Formula based on Life Palace and birth month

6. **Place Major Stars**
   - 紫微 (Zi Wei) placement first
   - Other stars based on Zi Wei position
   - ~100 stars total

7. **Calculate Four Transformations**
   - Based on birth year Heavenly Stem
   - Apply to specific stars

8. **Calculate Decade Cycles**
   - Starting age based on Life Palace
   - Direction based on gender and Five Element
   - 12 cycles total

9. **Calculate Annual/Monthly Positions**
   - For timing analysis

10. **Generate Final Chart**
    - All data combined into `ChartData` object

### Key Formulas

```typescript
// Life Palace Position
lifePalaceIndex = (birthMonth + birthHour) % 12;

// Body Palace Position
bodyPalaceIndex = (lifePalaceIndex + birthMonth - 1) % 12;

// Decade Cycle Starting Age
startingAge = calculateStartingAge(lifePalaceIndex, fiveElement);

// Zi Wei Position (simplified)
ziWeiPosition = calculateZiWeiPosition(birthDay, lifePalaceIndex);
```

## Data Structures

### ChartInput
```typescript
interface ChartInput {
  year: number;        // Birth year (1900-2100)
  month: number;       // Birth month (1-12)
  day: number;         // Birth day (1-31)
  hour: number;        // Birth hour (0-23)
  gender: "male" | "female";
  isLunar?: boolean;   // Lunar or solar calendar
}
```

### ChartData
```typescript
interface ChartData {
  palaces: Palace[];           // 12 palaces
  transformations: Transformation[];
  decadeCycles: DecadeCycle[];
  lifePalaceIndex: number;
  bodyPalaceIndex: number;
  fiveElement: string;
  // ... more fields
}
```

### Palace
```typescript
interface Palace {
  name: string;               // Palace name (e.g., "命宫")
  earthlyBranch: string;      // Earthly Branch (e.g., "子")
  heavenlyStem: string;       // Heavenly Stem (e.g., "甲")
  majorStars: Star[];         // Major stars in palace
  minorStars: Star[];         // Minor stars in palace
  transformations: string[];  // Transformations in palace
  // ... more fields
}
```

## Performance Considerations

### Calculation Speed
- **Simple chart**: ~50ms
- **Complex chart**: ~200ms
- **With analysis**: ~500ms

### Optimization Techniques
- Memoization of expensive calculations
- Lazy loading of analysis
- Caching of lookup tables
- Efficient data structures

### Future Optimizations
- Web Workers for calculation
- IndexedDB for caching
- Progressive loading
- Code splitting

## Accuracy and Validation

### Data Sources
- Classical ZWDS texts
- Modern ZWDS interpretations
- Expert consultation
- Community feedback

### Validation
- Tested against known charts
- Compared with other ZWDS software
- Verified by ZWDS practitioners
- Continuous improvement

### Limitations
- Based on specific ZWDS school
- Interpretation may vary
- Requires accurate birth time
- Not a substitute for professional consultation

## Related Documentation

- [Calculator Logic](./CALCULATOR.md) - Detailed calculation steps
- [Analysis System](./ANALYSIS.md) - Analysis algorithms
- [Data Structure](./DATA_STRUCTURE.md) - Data organization
- [Project Overview](../architecture/PROJECT_OVERVIEW.md) - High-level architecture

