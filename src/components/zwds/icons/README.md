# Zodiac Icons

This directory contains SVG icons for the 12 Chinese zodiac signs used in Zi Wei Dou Shu (ZWDS) charts.

## Active icon set

Palace cards and nobleman sections import from `new-icon/` via `index.ts`:

- `rat.svg`, `cow.svg` (ox), `tiger.svg`, `rabbit.svg`, `dragon.svg`, `snake.svg`
- `horse.svg`, `goat.svg`, `monkey.svg`, `chicken.svg` (rooster), `dog.svg`, `pig.svg`

Legacy icons remain in this folder for reference; `index.ts` maps `ox` → `cow.svg` and `rooster` → `chicken.svg`.

## Usage

You can import and use these icons in two ways:

### Method 1: Individual Import

```tsx
import { ReactComponent as Rat } from "./icons/rat.svg";

function MyComponent() {
  return (
    <div>
      <Rat width="24" height="24" />
    </div>
  );
}
```

### Method 2: Using Index Import

```tsx
import ZodiacIcons from "./icons";
// or import specific ones:
import { Rat, Ox, Tiger } from "./icons";

function MyComponent() {
  return (
    <div>
      <ZodiacIcons.rat width="24" height="24" />
      {/* or */}
      <Rat width="24" height="24" />
    </div>
  );
}
```

## Notes

- Each SVG is sized appropriately to contain only the zodiac symbol with minimal whitespace
- All icons maintain the original styling and proportions from the source SVG
- The viewBox is adjusted to properly contain each icon 