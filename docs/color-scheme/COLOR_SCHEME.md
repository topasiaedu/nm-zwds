# Color Scheme Guide

Color palette extracted from Light and Dark mode designs for a Purple Star Astrology project.

> **Full token list (hex, Tailwind classes, CSS variables, usage):** see **[COLORS.md](./COLORS.md)**.  
> **How to apply these rules in code:** see **[IMPLEMENTATION.md](./IMPLEMENTATION.md)**.

---

## 🎨 Light Mode

### Primary Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Cream Background | `#F6F0E8` | Main background (subtle warm yellow) |
| Dark Navy | `#1A1E3F` | Primary text, headings |
| Text Gray | `#5C5C5C` | Secondary text, body copy |

### Accent Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Coral Red | `#C84C5C` | Highlights, important text |
| Gold/Tan | `#D4B896` | Accent borders, dividers |
| Warm Yellow | `#F5E8D4` | Subtle backgrounds |

### Component Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Purple | `#6B5B95` | Interactive elements, charts |
| Light Purple | `#9B8FB5` | Hover states, disabled states |
| Orange | `#E08B5C` | Data visualization |
| Off-White | `#FFFFFF` | Cards, elevated surfaces |

### Footer Gradient
- Start: `#1A1E3F` (Dark Navy)
- End: `#D4B896` (Gold/Tan)

---

## 🌙 Dark Mode

### Primary Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Dark Background | `#2D1B4E` | Main background |
| Dark Navy | `#1A0F2E` | Secondary background |
| Cream Text | `#F6F0E8` | Primary text, headings |

### Accent Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Gold/Amber | `#D4AF7B` | Primary accents, highlights |
| Light Gray | `#C4C4C4` | Secondary text |
| Pale Purple | `#A89BC4` | Subtle text, metadata |

### Component Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Purple | `#6B5B95` | Interactive elements, buttons |
| Deep Purple | `#4A3F6B` | Hover states, borders |
| Coral | `#D97C6E` | Secondary highlights |
| White | `#FFFFFF` | Cards, elevated surfaces |

### Footer Gradient
- Start: `#1A0F2E` (Dark Navy)
- End: `#D4B896` (Gold/Tan) → `#E8A989` (Coral)

---

## 🔄 Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F6F0E8',
          text: '#1A1E3F',
          textSecondary: '#5C5C5C',
          accent: '#C84C5C',
          gold: '#D4B896',
          purple: '#6B5B95',
          lightPurple: '#9B8FB5',
          orange: '#E08B5C',
        },
        dark: {
          bg: '#2D1B4E',
          bgSecondary: '#1A0F2E',
          text: '#F6F0E8',
          textSecondary: '#C4C4C4',
          textTertiary: '#A89BC4',
          accent: '#D4AF7B',
          purple: '#6B5B95',
          deepPurple: '#4A3F6B',
          coral: '#D97C6E',
        },
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(to right, #1A1E3F, #D4B896)',
        'dark-gradient': 'linear-gradient(to right, #1A0F2E, #E8A989)',
      },
    },
  },
  darkMode: 'class', // or 'media'
  plugins: [],
};
```

---

## 🎯 Semantic Color Mapping

### Light Mode
```javascript
const lightColors = {
  // Backgrounds
  background: '#F6F0E8',
  surfacePrimary: '#FFFFFF',
  surfaceSecondary: '#F5E8D4',
  
  // Text
  textPrimary: '#1A1E3F',
  textSecondary: '#5C5C5C',
  textMuted: '#A89BC4',
  
  // Interactive
  primary: '#6B5B95',
  primaryHover: '#9B8FB5',
  secondary: '#C84C5C',
  accent: '#D4B896',
  
  // States
  success: '#6B5B95',
  warning: '#E08B5C',
  error: '#C84C5C',
  info: '#6B5B95',
  
  // Borders
  border: '#D4B896',
  borderLight: '#E5D5C5',
};
```

### Dark Mode
```javascript
const darkColors = {
  // Backgrounds
  background: '#2D1B4E',
  surfacePrimary: '#1A0F2E',
  surfaceSecondary: '#3D2860',
  
  // Text
  textPrimary: '#F6F0E8',
  textSecondary: '#C4C4C4',
  textMuted: '#A89BC4',
  
  // Interactive
  primary: '#D4AF7B',
  primaryHover: '#E8B88E',
  secondary: '#D97C6E',
  accent: '#D4AF7B',
  
  // States
  success: '#6B5B95',
  warning: '#E08B5C',
  error: '#D97C6E',
  info: '#D4AF7B',
  
  // Borders
  border: '#D4AF7B',
  borderLight: '#4A3F6B',
};
```

---

## 🚀 React/Next.js Implementation

### Theme Context Hook
```javascript
// lib/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const preference = localStorage.getItem('theme') || 'light';
    setIsDark(preference === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

### Using Theme in Components
```javascript
// components/Header.jsx
import { useTheme } from '@/lib/ThemeContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`${
        isDark
          ? 'bg-dark-bg text-dark-text'
          : 'bg-light-bg text-light-text'
      }`}
    >
      <button
        onClick={toggleTheme}
        className={`${
          isDark
            ? 'bg-dark-accent text-dark-bgSecondary'
            : 'bg-light-accent text-white'
        }`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
```

---

## 📋 CSS Variables Alternative

```css
/* globals.css */

:root {
  /* Light Mode */
  --bg-light: #F6F0E8;
  --text-light: #1A1E3F;
  --text-secondary-light: #5C5C5C;
  --accent-light: #C84C5C;
  --gold-light: #D4B896;
  --purple-light: #6B5B95;
  --orange-light: #E08B5C;
}

[data-theme='dark'] {
  /* Dark Mode */
  --bg-light: #2D1B4E;
  --text-light: #F6F0E8;
  --text-secondary-light: #C4C4C4;
  --accent-light: #D4AF7B;
  --gold-light: #D4AF7B;
  --purple-light: #6B5B95;
  --orange-light: #D97C6E;
}

body {
  background-color: var(--bg-light);
  color: var(--text-light);
}
```

---

## 🎨 Design Guidelines

### Light Mode Usage
- Use the cream background for main pages
- Apply dark navy for all headings and primary text
- Use coral red sparingly for CTAs and important highlights
- Gold/tan for dividers and premium feel accents
- Purple for interactive elements and data visualization

### Dark Mode Usage
- Use deep purple as the primary background
- Cream text for maximum contrast and readability
- Gold/amber accents for interactive elements (higher contrast on dark)
- Maintain the warm footer gradient for visual consistency
- Purple remains consistent for both modes in charts

### Contrast & Accessibility
- Light mode: Cream bg (#F6F0E8) with Dark Navy text (#1A1E3F) = ✅ ~9:1 ratio
- Dark mode: Dark bg (#2D1B4E) with Cream text (#F6F0E8) = ✅ ~8.5:1 ratio
- All accent colors meet WCAG AA standards for interactive elements

---

## 📝 Notes

- The color scheme maintains visual consistency between light and dark modes
- Gold/amber accents are used to create a premium, sophisticated feel
- Purple is used as the primary accent color, tying to the "Purple Star Astrology" theme
- Footer gradient provides a visual anchor and brand recognition
- All colors are optimized for readability and accessibility

---

**Design Credit:** CAE GOH | © 2025
