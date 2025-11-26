# Performance Optimization Overview

## 📋 Executive Summary

This document provides a comprehensive overview of performance optimization strategies for the ZWDS (Zi Wei Dou Shu) chart calculation and analysis system.

**Current Focus Areas:**
1. Calculator performance (chart generation)
2. UI component rendering (chart display)
3. Analysis function efficiency (interpretation logic)

**Expected Overall Impact:** 5-10x performance improvement across the system

---

## 🎯 Optimization Goals

### Primary Objectives
- Reduce chart calculation time by 50%+
- Eliminate unnecessary re-renders in UI components
- Optimize analysis functions for instant results
- Maintain code clarity and maintainability

### Secondary Objectives
- Reduce memory footprint
- Improve scalability for future features
- Enable comprehensive testing coverage
- Maintain separation of concerns

---

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
```
Calculator (calculator.ts)
  ↓ Produces optimized ChartData
Analysis Functions (analysis/*.ts)
  ↓ Interprets ChartData
UI Components (components/*.tsx)
  ↓ Presents results
```

### 2. **Calculate Once, Use Many Times**
- Pre-calculate data structures in calculator
- Store results in `ChartData`
- Analysis and UI consume pre-calculated data

### 3. **Optimize Data Access Patterns**
- Replace O(n) searches with O(1) lookups
- Pre-flatten nested arrays
- Create indexes for fast access

---

## 📊 Performance Bottlenecks Identified

### High Impact Issues

#### 1. **Repeated Lunar Conversions** (Calculator)
- **Problem**: `lunar.convertSolarToLunar()` called 3+ times
- **Impact**: Redundant expensive calculations
- **Solution**: Cache lunar date, reuse across steps

#### 2. **Palace Searches** (Analysis)
- **Problem**: `palaces.find(p => p.name === "...")` called 10+ times
- **Impact**: O(n) search repeated across all analysis functions
- **Solution**: Create palace name index (O(1) lookup)

#### 3. **Star Array Extraction** (Analysis)
- **Problem**: Extracting stars from 9 arrays in every analysis function
- **Impact**: Repeated array creation and spreading
- **Solution**: Pre-flatten star arrays in calculator

#### 4. **Palace Component Re-renders** (UI)
- **Problem**: All 12 palaces re-render on any state change
- **Impact**: Unnecessary DOM updates
- **Solution**: Memoize Palace component with custom comparison

### Medium Impact Issues

#### 5. **Branch-to-Palace Lookups** (Calculator)
- **Problem**: Loops to find palace by earthly branch (4+ times)
- **Impact**: O(n) searches during calculation
- **Solution**: Build branch-to-palace index

#### 6. **Transformation Calculations** (UI)
- **Problem**: Recalculating opposite palace influences on every render
- **Impact**: Nested loops in render path
- **Solution**: Memoize opposite influences separately

#### 7. **Analysis Called on Every Render** (UI)
- **Problem**: Analysis functions called directly in component render
- **Impact**: Recalculation even when chartData unchanged
- **Solution**: Wrap with `useMemo`

---

## 🚀 Optimization Strategy

### Phase 1: Calculator Optimizations (High Impact)
**Effort:** Medium | **Impact:** High

1. Cache lunar conversions
2. Build branch-to-palace index
3. Create palace name/number indexes
4. Pre-flatten star arrays
5. Build opposite palace references

**Expected Improvement:** 3-5x faster calculation

### Phase 2: Analysis Optimizations (High Impact)
**Effort:** Medium | **Impact:** High

1. Create shared analysis utilities
2. Refactor all analysis functions to use utilities
3. Add component-level memoization
4. Optimize constant lookups

**Expected Improvement:** 5-10x faster analysis

### Phase 3: UI Optimizations (Medium Impact)
**Effort:** Medium-High | **Impact:** Medium

1. Memoize Palace component
2. Optimize transformation calculations
3. Create lookup tables for palace relationships
4. Reduce unnecessary state updates

**Expected Improvement:** 2-3x faster rendering

---

## 📈 Expected Performance Gains

| Area | Current | Optimized | Improvement |
|------|---------|-----------|-------------|
| Lunar conversions | 3 calls | 1 call | **3x faster** |
| Palace searches | O(n) × 10+ | O(1) × 10+ | **10-12x faster** |
| Star extraction | 9 arrays × 12 | Pre-flattened | **5-8x faster** |
| Analysis recalc | Every render | Memoized | **∞ (cached)** |
| Palace re-renders | All 12 | Only changed | **~10x fewer** |

**Overall System:** **5-10x performance improvement**

---

## 🔍 Key Design Decisions

### ✅ What Goes in Calculator
- Data structure preparation
- Indexes for fast lookups
- Pre-computed relationships
- Structural optimizations

**Rationale:** Calculator produces optimized data structures that all consumers benefit from

### ❌ What Stays Out of Calculator
- Domain interpretation logic
- Analysis-specific scoring
- UI-specific calculations
- Business rules

**Rationale:** Keep calculator focused on chart calculation, maintain separation of concerns

### 🔄 Hybrid Approach for UI Calculations
- Pre-calculate static lookup tables in calculator
- Apply runtime state/context in UI components
- Balance between pre-calculation and flexibility

**Rationale:** Can't pre-calculate data that depends on future user interactions

---

## 📁 Documentation Structure

```
docs/performance/
├── OVERVIEW.md                    # This file - high-level overview
├── CALCULATOR_OPTIMIZATION.md     # Detailed calculator optimization plan
├── ANALYSIS_OPTIMIZATION.md       # Detailed analysis optimization plan
├── UI_OPTIMIZATION.md             # Detailed UI optimization plan
└── TESTING_STRATEGY.md            # Comprehensive testing approach
```

---

## 🎯 Success Metrics

### Performance Metrics
- [ ] Chart calculation time < 100ms
- [ ] Analysis execution time < 50ms
- [ ] Initial render time < 200ms
- [ ] Re-render time < 16ms (60 FPS)

### Code Quality Metrics
- [ ] Test coverage > 85%
- [ ] No O(n²) algorithms in hot paths
- [ ] All analysis functions use shared utilities
- [ ] All components properly memoized

### Developer Experience Metrics
- [ ] Clear separation of concerns
- [ ] Easy to add new analysis types
- [ ] Comprehensive test suite
- [ ] Well-documented optimization patterns

---

## 🔄 Implementation Timeline

### Week 1: Calculator Optimizations
- Implement Steps 17-19 (indexes and data prep)
- Write calculator tests
- Benchmark improvements

### Week 2: Analysis Optimizations
- Create shared utilities
- Refactor analysis functions
- Write analysis tests

### Week 3: UI Optimizations
- Memoize components
- Optimize transformation calculations
- Performance profiling

### Week 4: Testing & Documentation
- Achieve 85%+ test coverage
- Performance benchmarking
- Documentation updates

---

## 📚 Related Documents

- [Calculator Optimization Plan](./CALCULATOR_OPTIMIZATION.md)
- [Analysis Optimization Plan](./ANALYSIS_OPTIMIZATION.md)
- [UI Optimization Plan](./UI_OPTIMIZATION.md)
- [Testing Strategy](./TESTING_STRATEGY.md)
- [ZWDS Overview](../zwds/OVERVIEW.md)
- [Project Architecture](../architecture/PROJECT_OVERVIEW.md)

---

## 🤝 Contributing

When implementing optimizations:
1. Write tests first (TDD approach)
2. Benchmark before and after
3. Document performance impact
4. Update this documentation
5. Review with team before merging

---

**Last Updated:** 2025-11-26
**Status:** Planning Phase
**Next Review:** After Phase 1 Implementation

