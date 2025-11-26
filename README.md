# NM-ZWDS (紫微斗数)

A modern web application for calculating and analyzing **Zi Wei Dou Shu (紫微斗数)** charts, an ancient Chinese astrological system.

## 🌟 Features

- **Accurate Chart Calculation**: Generate ZWDS charts based on birth date, time, and gender
- **Interactive Visualization**: Beautiful, interactive chart display with zodiac symbols
- **Comprehensive Analysis**: Personality, career, health, and life timing insights
- **Multi-language Support**: English and Chinese (Traditional)
- **PDF Export**: Professional PDF reports with full analysis
- **Profile Management**: Save and manage multiple profiles

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Supabase account (for authentication and database)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nm-zwds.git
cd nm-zwds

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- [**Quick Start Guide**](./docs/guides/QUICK_START.md) - Get up and running
- [**Project Overview**](./docs/architecture/PROJECT_OVERVIEW.md) - Architecture and design
- [**Folder Structure**](./docs/architecture/FOLDER_STRUCTURE.md) - Codebase organization
- [**ZWDS Engine**](./docs/zwds/OVERVIEW.md) - Understanding the calculation engine
- [**API Documentation**](./docs/api/CHART_ONLY.md) - Backend integration
- [**Contributing Guide**](./docs/guides/CONTRIBUTING.md) - How to contribute

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Free Test Configuration
REACT_APP_FREE_TEST_START_DATE=2025-01-01
REACT_APP_FREE_TEST_END_DATE=2025-08-11
REACT_APP_FREE_TEST_ENABLED=true

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

See [Environment Variables Guide](./docs/guides/ENVIRONMENT.md) for details.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Flowbite React
- **State Management**: React Context
- **Backend**: Supabase (Auth + Database)
- **Deployment**: Vercel
- **Build Tool**: Create React App

See [Tech Stack Documentation](./docs/architecture/TECH_STACK.md) for details.

## 📦 Available Scripts

```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run lint       # Check code quality
npm run format     # Format code with Prettier
```

## 🏗️ Project Structure

```
nm-zwds/
├── docs/                   # 📚 Documentation
├── src/
│   ├── zwds/              # ZWDS calculation engine
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── context/           # React Context providers
│   ├── translations/      # i18n translations
│   └── utils/             # Utility functions
├── public/                # Static assets
└── package.json           # Dependencies
```

See [Folder Structure](./docs/architecture/FOLDER_STRUCTURE.md) for details.

## 🌐 Internationalization

The app supports multiple languages:

- **English** (`en`)
- **Chinese Traditional** (`zh`)

To add a new language, see [Translation Guide](./docs/guides/TRANSLATIONS.md).

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/guides/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- UI components from [Flowbite React](https://flowbite-react.com/)
- Hosted on [Vercel](https://vercel.com/)
- Database and Auth by [Supabase](https://supabase.com/)

## 📧 Contact

For questions or support, please contact the development team.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] More languages (Japanese, Korean)
- [ ] Advanced timing analysis
- [ ] Compatibility analysis
- [ ] AI-powered insights

See [Project Roadmap](./docs/ROADMAP.md) for details.

---

**Note**: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
