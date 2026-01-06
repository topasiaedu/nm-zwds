# Documentation Index

Complete index of all NM-ZWDS documentation.

## 📖 Quick Navigation

### 🚀 Getting Started
- [Quick Start Guide](./guides/QUICK_START.md) - Get up and running in 5 minutes
- [Environment Variables](./guides/ENVIRONMENT.md) - Configuration guide
- [Project Summary](./PROJECT_SUMMARY.md) - Quick reference for the entire project
- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md) - **NEW!** 4-6 week scaling plan

### 🔒 Security **NEW!**
- [Security Audit 2025](./security/SECURITY_AUDIT_2025.md) - **CRITICAL!** Security findings & fixes
- RLS implementation guide, XSS protection, security headers

### 🧪 Testing & QA **NEW!**
- [Production Testing Strategy](./testing/PRODUCTION_TESTING.md) - Testing for small teams
- [Automated Testing Guide](./testing/AUTOMATED_TESTING.md) - Playwright E2E tests (FREE)
- [QA Checklist](./testing/QA_CHECKLIST.md) - Manual testing checklist

### 🚢 Deployment **NEW!**
- [Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md) - Complete deployment workflow
- Preview environments, rollback procedures, monitoring setup

### 🏗️ Architecture
- [Project Overview](./architecture/PROJECT_OVERVIEW.md) - High-level system design
- [Folder Structure](./architecture/FOLDER_STRUCTURE.md) - Codebase organization

### 🔮 ZWDS Engine
- [ZWDS Overview](./zwds/OVERVIEW.md) - Understanding the ZWDS calculation engine

### ⚡ Performance Optimization
- [Performance Overview](./performance/OVERVIEW.md) - Comprehensive optimization strategy
- [Data Structure](./performance/DATA_STRUCTURE.md) - ChartData structure improvements
- [Calculator Optimization](./performance/CALCULATOR_OPTIMIZATION.md) - Chart calculation improvements
- [Analysis Optimization](./performance/ANALYSIS_OPTIMIZATION.md) - Analysis function improvements
- [UI Optimization](./performance/UI_OPTIMIZATION.md) - Component rendering improvements
- [Testing Strategy](./performance/TESTING_STRATEGY.md) - Comprehensive testing approach

### 🔌 API Documentation
- [Chart-Only Endpoint](./api/CHART_ONLY.md) - Backend integration for screenshots

### 👨‍💻 Development Guides
- [Quick Start Guide](./guides/QUICK_START.md) - Get up and running in 5 minutes
- [Environment Variables](./guides/ENVIRONMENT.md) - Configuration guide

### 🔧 Refactoring Plans
- [Refactoring Overview](./refactoring/OVERVIEW.md) - Current refactoring initiatives
- [ZWDS Module Cleanup](./refactoring/ZWDS_CLEANUP.md) - Reorganizing ZWDS code
- [Component Reorganization](./refactoring/COMPONENTS.md) - Component structure improvements
- [Dead Code Removal](./refactoring/DEAD_CODE.md) - Files to delete

### 📋 Project Management
- [Changelog](./CHANGELOG.md) - Version history
- [Known Issues](./KNOWN_ISSUES.md) - Current bugs and limitations
- [Roadmap](./ROADMAP.md) - Future plans *(planned)*

## 📚 Documentation by Topic

### For New Developers

**Start Here:**
1. [Quick Start Guide](./guides/QUICK_START.md)
2. [Project Overview](./architecture/PROJECT_OVERVIEW.md)
3. [Folder Structure](./architecture/FOLDER_STRUCTURE.md)
4. [ZWDS Overview](./zwds/OVERVIEW.md)

### For Scaling to Production (Read First!)

**Critical Path:**
1. [Security Audit 2025](./security/SECURITY_AUDIT_2025.md) - **MUST READ!**
2. [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md) - 4-6 week plan
3. [Automated Testing Guide](./testing/AUTOMATED_TESTING.md) - Setup testing
4. [Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md) - Deploy safely

### For Performance Optimization

**Optimization Plans:**
1. [Performance Overview](./performance/OVERVIEW.md)
2. [Data Structure Improvements](./performance/DATA_STRUCTURE.md)
3. [Calculator Optimization](./performance/CALCULATOR_OPTIMIZATION.md)
4. [Analysis Optimization](./performance/ANALYSIS_OPTIMIZATION.md)
5. [UI Optimization](./performance/UI_OPTIMIZATION.md)
6. [Testing Strategy](./performance/TESTING_STRATEGY.md)

### For Maintainers

**Refactoring:**
1. [Refactoring Overview](./refactoring/OVERVIEW.md)
2. [ZWDS Cleanup Plan](./refactoring/ZWDS_CLEANUP.md)
3. [Component Reorganization](./refactoring/COMPONENTS.md)
4. [Dead Code Removal](./refactoring/DEAD_CODE.md)

**Project Management:**
5. [Changelog](./CHANGELOG.md)
6. [Known Issues](./KNOWN_ISSUES.md)
7. [Roadmap](./ROADMAP.md) *(planned)*

### For API Users

**Integration:**
1. [Chart-Only Endpoint](./api/CHART_ONLY.md)

### For Understanding ZWDS

**Learn ZWDS:**
1. [ZWDS Overview](./zwds/OVERVIEW.md)

## 📂 Documentation Structure

```
docs/
├── README.md                   # Main documentation hub
├── INDEX.md                    # This file - complete index
├── PROJECT_SUMMARY.md          # Quick reference
├── CHANGELOG.md                # Version history
├── KNOWN_ISSUES.md             # Current issues (updated!)
├── IMPLEMENTATION_ROADMAP.md   # NEW! 4-6 week scaling plan
│
├── security/                   # NEW! Security documentation
│   └── SECURITY_AUDIT_2025.md  # Critical security audit
│
├── testing/                    # NEW! Testing documentation
│   ├── PRODUCTION_TESTING.md   # Production testing strategy
│   ├── AUTOMATED_TESTING.md    # Playwright guide
│   └── QA_CHECKLIST.md         # Manual testing checklist
│
├── deployment/                 # NEW! Deployment documentation
│   └── DEPLOYMENT_GUIDE.md     # Complete deployment workflow
│
├── architecture/               # System architecture
│   ├── PROJECT_OVERVIEW.md
│   └── FOLDER_STRUCTURE.md
│
├── api/                        # API documentation
│   └── CHART_ONLY.md
│
├── guides/                     # How-to guides
│   ├── QUICK_START.md
│   └── ENVIRONMENT.md
│
├── performance/                # Performance optimization
│   ├── OVERVIEW.md
│   ├── DATA_STRUCTURE.md
│   ├── CALCULATOR_OPTIMIZATION.md
│   ├── ANALYSIS_OPTIMIZATION.md
│   ├── UI_OPTIMIZATION.md
│   ├── TESTING_STRATEGY.md
│   └── IMPLEMENTATION_SUMMARY.md
│
├── refactoring/                # Refactoring plans
│   ├── OVERVIEW.md
│   ├── ZWDS_CLEANUP.md
│   ├── COMPONENTS.md
│   └── DEAD_CODE.md
│
└── zwds/                       # ZWDS engine docs
    └── OVERVIEW.md
```

## ✅ Documentation Status

**Total Files**: 25 documentation files (+6 new!)
**Status**: Production-ready documentation complete

### Completed
- ✅ Project Overview & Folder Structure
- ✅ ZWDS Engine Overview (comprehensive)
- ✅ Chart-Only API Endpoint
- ✅ Quick Start & Environment Setup
- ✅ Complete Refactoring Plans
- ✅ Project Management (Changelog, Known Issues, Summary)
- ✅ Performance Optimization Plans (7 docs)
- ✅ Data Structure Improvements
- ✅ **Security Audit & Implementation Guide** (NEW!)
- ✅ **Production Testing Strategy** (NEW!)
- ✅ **Automated Testing Guide** (NEW!)
- ✅ **Deployment Workflow** (NEW!)
- ✅ **Implementation Roadmap** (NEW!)

### January 2025 Update
**Added production-ready documentation:**
- 🔒 Security audit with critical findings
- 🧪 Complete testing strategy (manual + automated)
- 🚢 Deployment procedures and rollback guides
- 📋 4-6 week implementation roadmap
- ⚠️ Updated Known Issues with accurate security status

## 🔍 Finding Documentation

### By Feature

**Chart Calculation:**
- [ZWDS Overview](./zwds/OVERVIEW.md)
- [Calculator Optimization](./performance/CALCULATOR_OPTIMIZATION.md)

**Analysis:**
- [ZWDS Overview](./zwds/OVERVIEW.md) - Analysis section
- [Analysis Optimization](./performance/ANALYSIS_OPTIMIZATION.md)

**UI/Rendering:**
- [UI Optimization](./performance/UI_OPTIMIZATION.md)

**PDF Export:**
- [Component Reorganization](./refactoring/COMPONENTS.md) - PDF section

**Testing:**
- [Testing Strategy](./performance/TESTING_STRATEGY.md)

**Translations:**
- Translation files in `src/translations/`

### By Task

**Setting Up:**
- [Quick Start Guide](./guides/QUICK_START.md)
- [Environment Variables](./guides/ENVIRONMENT.md)

**Refactoring:**
- [Refactoring Overview](./refactoring/OVERVIEW.md)
- [ZWDS Cleanup](./refactoring/ZWDS_CLEANUP.md)
- [Component Reorganization](./refactoring/COMPONENTS.md)

**Performance Optimization:**
- [Performance Overview](./performance/OVERVIEW.md)
- [Calculator Optimization](./performance/CALCULATOR_OPTIMIZATION.md)
- [Analysis Optimization](./performance/ANALYSIS_OPTIMIZATION.md)
- [UI Optimization](./performance/UI_OPTIMIZATION.md)

## 📊 Documentation Stats

- **Total Files**: 25 (+6 new!)
- **Total Words**: ~60,000+
- **Total Lines**: ~6,000+
- **Status**: Production-ready documentation complete
- **Last Major Update**: January 5, 2025


## 📝 Documentation Standards

### File Naming
- Use SCREAMING_SNAKE_CASE for main docs (e.g., `PROJECT_OVERVIEW.md`)
- Use kebab-case for guides (e.g., `quick-start.md`) - *or* SCREAMING_SNAKE_CASE
- Use descriptive names

### Content Structure
1. **Title** (H1)
2. **Overview/Introduction**
3. **Table of Contents** (for long docs)
4. **Main Content** (H2, H3, etc.)
5. **Related Documentation** (links at bottom)

### Formatting
- Use headers for sections
- Use code blocks for code
- Use lists for steps
- Use tables for comparisons
- Use blockquotes for notes
- Use emojis sparingly (for visual hierarchy)

### Links
- Use relative links for internal docs
- Use descriptive link text
- Check links regularly
- Update links when moving files

## 🔗 External Resources

### Technologies
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### ZWDS Resources
- [Purple Star Astrology](https://en.wikipedia.org/wiki/Zi_Wei_Dou_Shu)
- Classical ZWDS texts (Chinese)


---

**Last Updated**: January 5, 2026

**Documentation Version**: 2.0.0 (Production-Ready)

**Maintained By**: Development Team

**Recent Updates**:
- ✨ Added Security Audit 2025
- ✨ Added Production Testing Strategy
- ✨ Added Automated Testing Guide
- ✨ Added Deployment Guide
- ✨ Added Implementation Roadmap
- ✨ Updated Known Issues

