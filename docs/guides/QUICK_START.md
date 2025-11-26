# Quick Start Guide

Get the NM-ZWDS application running on your local machine in 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase account** ([Sign up](https://supabase.com/)) - Free tier is fine

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/nm-zwds.git
cd nm-zwds
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Free Test Configuration
REACT_APP_FREE_TEST_START_DATE=2025-01-01
REACT_APP_FREE_TEST_END_DATE=2025-08-11
REACT_APP_FREE_TEST_ENABLED=true

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`

## Step 4: Set Up Database

Run the database migration scripts in Supabase:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the migration scripts from `database/migrations/`
3. Or use the Supabase CLI:

```bash
npx supabase db push
```

## Step 5: Start Development Server

```bash
npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000)

## Step 6: Create Your First Chart

1. Click **"Sign Up"** to create an account
2. Sign in with your credentials
3. Click **"Create Profile"**
4. Fill in birth details:
   - Name
   - Birth Date
   - Birth Time
   - Gender
5. Click **"Calculate Chart"**
6. View your ZWDS chart!

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
PORT=3001 npm start
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Error

- Verify your `.env.local` file has correct credentials
- Check if Supabase project is active
- Ensure you're using the **anon public** key, not the service role key

### Build Errors

```bash
# Clear build cache
rm -rf build
npm run build
```

## Next Steps

Now that you're up and running:

1. **Explore the App**: Try creating different profiles
2. **Read the Docs**: Check out [Project Overview](../architecture/PROJECT_OVERVIEW.md)
3. **Understand ZWDS**: Learn about the [ZWDS Engine](../zwds/OVERVIEW.md)

## Development Tips

### Hot Reload

Changes to React components will hot-reload automatically. For other changes, you may need to refresh the browser.

### Dark Mode

Toggle dark mode using the theme switcher in the navbar.

### Language Switching

Switch between English and Chinese using the language toggle.

### Viewing Different Profiles

- **Your Profile**: Click "My Chart" in the navbar
- **Other Profiles**: Go to Dashboard → Select profile

## Common Commands

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Check code quality
npm run lint

# Format code
npm run format

# Generate Supabase types
npm run supabase-sync
```

## Project Structure

```
nm-zwds/
├── src/
│   ├── zwds/              # ZWDS calculation engine
│   ├── components/        # React components
│   ├── pages/             # Page components
│   └── translations/      # i18n files
├── public/                # Static assets
├── docs/                  # Documentation
└── package.json           # Dependencies
```

See [Folder Structure](../architecture/FOLDER_STRUCTURE.md) for details.

## Getting Help

- **Documentation**: Check the [`docs/`](../) folder
- **Issues**: Search [GitHub Issues](https://github.com/your-username/nm-zwds/issues)
- **Questions**: Ask in [Discussions](https://github.com/your-username/nm-zwds/discussions)

## What's Next?

- [Environment Variables](./ENVIRONMENT.md) - Configuration options
- [Project Overview](../architecture/PROJECT_OVERVIEW.md) - Understanding the system
- [ZWDS Engine](../zwds/OVERVIEW.md) - Learn about ZWDS

Happy coding! 🎉

