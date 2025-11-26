# Contributing Guide

Thank you for your interest in contributing to NM-ZWDS! This guide will help you get started.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Commit Guidelines](#commit-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Testing](#testing)
7. [Documentation](#documentation)

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm
- Git
- Supabase account
- Code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/nm-zwds.git
   cd nm-zwds
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/nm-zwds.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

6. **Start development server**
   ```bash
   npm start
   ```

See [Quick Start Guide](./QUICK_START.md) for detailed setup instructions.

## Development Workflow

### 1. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write code following our [Code Style](#code-style)
- Add tests for new features
- Update documentation as needed
- Test your changes thoroughly

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template
5. Submit for review

## Code Style

### TypeScript

```typescript
// ✅ Good: Use strict types
interface ChartInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: "male" | "female";
}

// ❌ Bad: Avoid any
function calculate(data: any) { }

// ✅ Good: Use proper types
function calculate(data: ChartInput) { }
```

### Naming Conventions

```typescript
// Components: PascalCase
export const ProfileForm = () => { };

// Functions: camelCase
function calculateChart() { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_PROFILES = 10;

// Interfaces: PascalCase with "I" prefix (optional)
interface IChartData { }
// Or without prefix
interface ChartData { }

// Types: PascalCase
type Gender = "male" | "female";
```

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `ProfileForm.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `supabase.ts`)
- **Types**: `camelCase.ts` or `PascalCase.ts` (e.g., `types.ts`)
- **Folders**: `kebab-case` or `camelCase` (e.g., `free-test/`)

### Imports

```typescript
// ✅ Good: Organized imports
// 1. External libraries
import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";

// 2. Internal modules
import { ZWDSCalculator } from "../../zwds/core";
import { analyzeCareer } from "../../zwds/analyzers";

// 3. Components
import { ProfileForm } from "../forms";

// 4. Types
import type { ChartData } from "../../zwds/core/types";

// 5. Styles
import "./styles.css";
```

### Comments

```typescript
/**
 * Calculates ZWDS chart based on birth data
 * @param input Birth date, time, and gender
 * @returns Complete chart data with all palaces and stars
 */
function calculateChart(input: ChartInput): ChartData {
  // Initialize calculator
  const calculator = new ZWDSCalculator(input);
  
  // Perform calculation
  return calculator.calculate();
}
```

### Strings

```typescript
// ✅ Good: Use double quotes
const name = "John Doe";

// ✅ Good: Use template literals for interpolation
const greeting = `Hello, ${name}!`;

// ✅ Good: Use .join() for concatenation
const path = ["src", "components", "ProfileForm.tsx"].join("/");

// ❌ Bad: Use single quotes (inconsistent)
const name = 'John Doe';

// ❌ Bad: Use + for concatenation
const greeting = "Hello, " + name + "!";
```

### Error Handling

```typescript
// ✅ Good: Proper error handling
try {
  const result = await calculateChart(input);
  return result;
} catch (error) {
  console.error("Chart calculation failed:", error);
  throw new Error("Failed to calculate chart");
}

// ✅ Good: Type-safe error handling
if (error instanceof Error) {
  console.error(error.message);
}
```

See [Code Style Guide](./CODE_STYLE.md) for more details.

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(chart): add zodiac icon animations"

# Bug fix
git commit -m "fix(pdf): resolve export timeout issue"

# Documentation
git commit -m "docs: update ZWDS overview documentation"

# Refactoring
git commit -m "refactor(analyzers): extract career data to separate file"

# With body
git commit -m "feat(analysis): add health recommendations

- Add body part mappings
- Include health tips
- Support translations"
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line max 72 characters
- Reference issues/PRs in footer

## Pull Request Process

### Before Submitting

1. **Update from main**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Check linting**
   ```bash
   npm run lint
   ```

4. **Build successfully**
   ```bash
   npm run build
   ```

5. **Update documentation**
   - Update relevant docs
   - Add JSDoc comments
   - Update CHANGELOG.md

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** run (tests, linting)
2. **Code review** by maintainers
3. **Changes requested** (if needed)
4. **Approval** from maintainer
5. **Merge** to main branch

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ProfileForm.test.tsx
```

### Writing Tests

```typescript
import { render, screen } from "@testing-library/react";
import { ProfileForm } from "./ProfileForm";

describe("ProfileForm", () => {
  it("renders form fields", () => {
    render(<ProfileForm />);
    
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<ProfileForm />);
    
    const submitButton = screen.getByRole("button", { name: "Submit" });
    submitButton.click();
    
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });
});
```

See [Testing Guide](./TESTING.md) for more details.

## Documentation

### When to Update Docs

- Adding new features
- Changing existing behavior
- Fixing bugs (if behavior changes)
- Refactoring (if structure changes)

### What to Update

- **README.md**: If setup changes
- **docs/**: Relevant documentation
- **Code comments**: JSDoc for functions
- **CHANGELOG.md**: All user-facing changes

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep docs up-to-date with code

## Getting Help

### Resources

- [Project Overview](../architecture/PROJECT_OVERVIEW.md)
- [Folder Structure](../architecture/FOLDER_STRUCTURE.md)
- [ZWDS Overview](../zwds/OVERVIEW.md)
- [Known Issues](../KNOWN_ISSUES.md)

### Ask Questions

- **GitHub Issues**: For bugs and features
- **GitHub Discussions**: For questions
- **Code Comments**: For specific code questions

## Code of Conduct

### Our Pledge

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project

### Our Standards

✅ **Encouraged:**
- Friendly and patient
- Respectful of differing viewpoints
- Gracefully accepting criticism
- Focusing on community benefit

❌ **Unacceptable:**
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Recognition

Contributors will be recognized in:
- CHANGELOG.md
- GitHub contributors page
- Project documentation

Thank you for contributing! 🎉

## Related Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Code Style Guide](./CODE_STYLE.md)
- [Testing Guide](./TESTING.md)
- [Project Overview](../architecture/PROJECT_OVERVIEW.md)

