# NM-ZWDS Project Summary

**Quick reference guide for developers, stakeholders, and AI assistants.**

## 🎯 What is This Project?

NM-ZWDS is a modern web application for calculating and analyzing **紫微斗数 (Zi Wei Dou Shu)** charts - an ancient Chinese astrological system for personality analysis, life guidance, and timing predictions.

## 📊 Key Stats

- **Tech Stack**: React 18 + TypeScript + Tailwind CSS + Supabase
- **Lines of Code**: ~50,000 (excluding node_modules)
- **Components**: ~80 React components
- **Pages**: ~20 pages
- **Languages**: English, Chinese (Traditional)
- **Users**: Active production deployment

## 🏗️ Architecture Overview

```
Frontend (React)
├── ZWDS Calculation Engine (Pure TypeScript)
├── Analysis Algorithms (Pure Functions)
├── UI Components (React)
└── State Management (React Context)

Backend (Supabase)
├── Authentication (Supabase Auth)
├── Database (PostgreSQL)
└── Row Level Security (RLS)

Deployment
└── Vercel (Automatic from main branch)
```

## 📁 Codebase Structure

```
nm-zwds/
├── docs/                   # 📚 Comprehensive documentation
│   ├── architecture/       # System design
│   ├── api/                # API documentation
│   ├── guides/             # How-to guides
│   ├── refactoring/        # Refactoring plans
│   └── zwds/               # ZWDS engine docs
│
├── src/
│   ├── zwds/              # ZWDS calculation engine
│   │   ├── core/          # Calculator, constants, types
│   │   ├── analyzers/     # Analysis algorithms
│   │   ├── data/          # Data and content
│   │   └── utils/         # Helper functions
│   │
│   ├── components/        # React components
│   │   ├── analysis/      # Analysis displays
│   │   ├── chart/         # Chart visualization
│   │   ├── pdf/           # PDF export
│   │   ├── auth/          # Authentication
│   │   ├── forms/         # Forms
│   │   └── ui/            # Reusable UI
│   │
│   ├── pages/             # Page components
│   │   ├── auth/          # Auth pages
│   │   ├── dashboard/     # Dashboard
│   │   ├── chart/         # Chart pages
│   │   └── ...
│   │
│   ├── context/           # React Context providers
│   ├── translations/      # i18n translations
│   ├── utils/             # Utilities
│   └── types/             # Type definitions
│
├── public/                # Static assets
├── scripts/               # Utility scripts
└── package.json           # Dependencies
```

## 🔑 Key Features

### For Users
- ✅ Accurate ZWDS chart calculation
- ✅ Interactive chart visualization
- ✅ Comprehensive personality analysis
- ✅ Career aptitude guidance
- ✅ Health insights
- ✅ Timing predictions (decade cycles)
- ✅ PDF export
- ✅ Multi-language support

### For Developers
- ✅ TypeScript for type safety
- ✅ Modular architecture
- ✅ Comprehensive documentation
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Easy to extend

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/your-username/nm-zwds.git
cd nm-zwds
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development
npm start
```

See [Quick Start Guide](./guides/QUICK_START.md) for details.

## 🎨 Tech Stack Details

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Flowbite React**: UI components
- **Framer Motion**: Animations
- **Recharts**: Data visualization
- **React Router**: Navigation
- **React PDF**: PDF generation

### Backend
- **Supabase**: Auth + Database
- **PostgreSQL**: Database
- **Row Level Security**: Data protection

### Build & Deploy
- **Create React App**: Build tool
- **Vercel**: Hosting
- **GitHub**: Version control

### Development
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 📚 Documentation

### For New Developers
1. [Quick Start Guide](./guides/QUICK_START.md) - Get running in 5 minutes
2. [Project Overview](./architecture/PROJECT_OVERVIEW.md) - Understand the system
3. [Folder Structure](./architecture/FOLDER_STRUCTURE.md) - Navigate the code
4. [ZWDS Overview](./zwds/OVERVIEW.md) - Understand ZWDS engine

### For Contributors
1. [Contributing Guide](./guides/CONTRIBUTING.md) - How to contribute
2. [Code Style](./guides/CODE_STYLE.md) - Coding standards
3. [Testing Guide](./guides/TESTING.md) - Testing practices

### For Maintainers
1. [Refactoring Overview](./refactoring/OVERVIEW.md) - Current initiatives
2. [Dead Code List](./refactoring/DEAD_CODE.md) - Files to remove
3. [ZWDS Cleanup Plan](./refactoring/ZWDS_CLEANUP.md) - Module reorganization
4. [Component Reorganization](./refactoring/COMPONENTS.md) - Component cleanup

### For API Users
1. [Chart-Only Endpoint](./api/CHART_ONLY.md) - Backend integration
2. [Supabase Integration](./api/SUPABASE.md) - Database schema

## 🔄 Current Status

### Production
- ✅ Deployed and active
- ✅ Users in production
- ✅ Stable and functional
- ✅ Regular updates

### Refactoring (In Progress)
- ⏳ Documentation creation (this!)
- 📋 ZWDS module cleanup (planned)
- 📋 Component reorganization (planned)
- 📋 Dead code removal (planned)
- 📋 Data centralization (planned)

See [Refactoring Overview](./refactoring/OVERVIEW.md) for details.

## 🎯 Project Goals

### Short Term (1-2 months)
- [ ] Complete documentation
- [ ] Remove dead code
- [ ] Reorganize ZWDS module
- [ ] Reorganize components
- [ ] Centralize data

### Medium Term (3-6 months)
- [ ] Improve test coverage
- [ ] Optimize performance
- [ ] Add more languages
- [ ] Build content management UI
- [ ] Mobile app (React Native)

### Long Term (6-12 months)
- [ ] Advanced timing analysis
- [ ] Compatibility analysis
- [ ] AI-powered insights
- [ ] Community features
- [ ] API for third-party integration

## 🐛 Known Issues

See [Known Issues](./KNOWN_ISSUES.md) for current bugs and limitations.

### High Priority
- Hardcoded strings need extraction
- Dead code needs removal
- File names need clarification

### Medium Priority
- PDF export performance
- Mobile responsiveness
- Test coverage

### Low Priority
- Bundle size optimization
- TypeScript strictness
- Code documentation

## 📈 Version History

See [Changelog](./CHANGELOG.md) for version history.

### Current Version: 1.0.0
- Initial production release
- Core features complete
- Stable and functional

### Next Version: 1.1.0 (Planned)
- Documentation complete
- Dead code removed
- Code reorganized

### Future Version: 2.0.0 (Planned)
- Major refactoring complete
- Clean architecture
- Content management system

## 🤝 Contributing

We welcome contributions! See [Contributing Guide](./guides/CONTRIBUTING.md).

### How to Help
1. **Report bugs**: Create GitHub issues
2. **Fix bugs**: Submit pull requests
3. **Add features**: Propose and implement
4. **Improve docs**: Update documentation
5. **Test**: Help with testing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit pull request

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/your-username/nm-zwds/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nm-zwds/discussions)
- **Email**: [Contact development team]

## 📝 License

Proprietary software. All rights reserved.

## 🙏 Acknowledgments

- ZWDS practitioners for domain expertise
- Open source community for tools
- Users for feedback and support

---

**Last Updated**: November 26, 2025

**Documentation Version**: 1.0.0

**For More Information**: See [docs/README.md](./README.md)

