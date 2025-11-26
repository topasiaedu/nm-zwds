# Project Overview

## What is NM-ZWDS?

NM-ZWDS is a modern web application for calculating and analyzing **紫微斗数 (Zi Wei Dou Shu)** charts, an ancient Chinese astrological system used for personality analysis, life path guidance, and timing predictions.

## Key Features

### 🎯 Core Functionality
- **Chart Calculation**: Generate accurate ZWDS charts based on birth date, time, and gender
- **Interactive Visualization**: Beautiful, interactive chart display with zodiac symbols
- **Multi-language Support**: English and Chinese (Traditional) interfaces
- **Profile Management**: Save and manage multiple profiles (self and others)

### 📊 Analysis Features
- **Personality Analysis**: Detailed personality traits based on star positions
- **Career Guidance**: Career aptitude analysis across 9 archetypes
- **Health Insights**: Body part analysis based on health palace
- **Life Areas**: Radar chart showing 8 life domains
- **Four Transformations**: Analysis of 四化 (Lu, Quan, Ke, Ji)
- **Timing Analysis**: Decade-by-decade life cycle predictions (大限)

### 💎 Premium Features
- **PDF Export**: Professional PDF reports with full analysis
- **Timing Charts**: 12 decade cycles with detailed predictions
- **Admin Tools**: User management and analytics

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Flowbite React** for UI components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation

### Backend & Services
- **Supabase** for authentication and database
- **Vercel** for hosting and deployment

### Build Tools
- **Create React App** (CRA)
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## User Tiers

### Free Tier
- Basic chart visualization
- Profile management (up to 3 profiles)
- Limited analysis (overview only)

### Tier 2 (Analytics Access)
- Full analysis features
- PDF export
- Unlimited profiles

### Tier 3 (Admin)
- All Tier 2 features
- User management
- Analytics dashboard
- Content management

## Architecture Highlights

### Modular Design
```
src/
├── zwds/           # ZWDS calculation engine (core logic)
├── components/     # React components (UI)
├── pages/          # Page-level components
├── context/        # React Context providers
├── utils/          # Helper utilities
└── translations/   # i18n content
```

### Separation of Concerns
- **Calculation Logic**: Pure TypeScript functions in `src/zwds/core/`
- **Analysis Logic**: Separate analyzers in `src/zwds/analyzers/`
- **UI Components**: Reusable React components
- **Data/Content**: Centralized in `src/zwds/data/`

### State Management
- **React Context** for global state (auth, language, profiles, tier)
- **Local State** for component-specific data
- **Supabase** for persistent data

## Key Design Principles

### 1. Type Safety
- Strict TypeScript throughout
- No `any` types
- Comprehensive interfaces and types

### 2. Performance
- Memoization for expensive calculations
- Lazy loading for routes
- Optimized chart rendering

### 3. Maintainability
- Clear folder structure
- Consistent naming conventions
- Comprehensive documentation
- Separation of data and logic

### 4. Internationalization
- All user-facing text in translation files
- Easy to add new languages
- Fallback to Chinese for missing translations

### 5. Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Dark mode support

## Development Workflow

### Local Development
```bash
npm start           # Start development server
npm test            # Run tests
npm run build       # Build for production
```

### Code Quality
```bash
npm run lint        # Check code quality
npm run format      # Format code with Prettier
```

### Deployment
- **Automatic**: Push to `main` branch triggers Vercel deployment
- **Manual**: `npm run build` then deploy `build/` folder

## Project History

### Origins
- Started as a rushed development project
- Initial focus on getting features working quickly
- Accumulated technical debt over time

### Current State (2025)
- Stable and functional
- Used in production
- Undergoing systematic refactoring
- Improving code organization and documentation

### Future Direction
- Cleaner architecture
- Better separation of concerns
- Comprehensive testing
- Enhanced documentation
- Easier content management

## Related Documentation

- [Folder Structure](./FOLDER_STRUCTURE.md) - Detailed codebase organization
- [Tech Stack](./TECH_STACK.md) - Technologies and libraries
- [Data Flow](./DATA_FLOW.md) - How data moves through the app

