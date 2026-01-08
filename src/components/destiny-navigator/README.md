# Destiny Navigator Components

## Overview

The Destiny Navigator is an interactive, journey-style interface for ZWDS chart analysis. It provides a guided experience through 3 stages before displaying the analysis results.

## Architecture

```
destiny-navigator/
├── animations/          # Reusable animation components
│   ├── StarfieldBackground.tsx
│   ├── TypewriterText.tsx
│   ├── PulsingOrb.tsx
│   └── index.ts
├── stages/             # Main stage components
│   ├── CosmicPortal.tsx
│   ├── AspectSelector.tsx
│   ├── TimeframeSelector.tsx
│   └── index.ts
└── README.md
```

## Stage Flow

1. **Cosmic Portal** (Auto-advances after 3s)
   - Welcome animation with starfield background
   - Sets the mystical/cosmic tone
   - Pulsing orb effect
   - Typewriter subtitle

2. **Aspect Selector**
   - User selects 1 of 6 life aspects
   - Tiltable cards with glassmorphic design
   - Stagger animation on entry
   - Maps to ZWDS palace names

3. **Timeframe Selector**
   - User selects temporal layer
   - 4 orbital orbs (Natal, Dayun, Liu Nian, Liu Month)
   - Back button to return to aspect selection
   - Horizontal timeline with gradient connector

4. **Analysis** (Coming from Agent 3)
   - Will display chart insights based on selections

## Animation Components

### StarfieldBackground

Animated cosmic background with drifting stars.

**Props:**
- `speed?: number` - Movement speed multiplier (default: 1)
- `density?: number` - Number of stars (default: 150)
- `colors?: string[]` - RGB color strings (default: white)

**Features:**
- 60fps optimized with requestAnimationFrame
- Parallax layers (3 depth levels)
- Respects `prefers-reduced-motion`
- Auto-resizes with viewport

### TypewriterText

Character-by-character text reveal effect.

**Props:**
- `text: string` - Text to display
- `speed?: number` - MS per character (default: 50)
- `onComplete?: () => void` - Callback when done
- `className?: string` - Additional CSS classes
- `showCursor?: boolean` - Show blinking cursor (default: true)

### PulsingOrb

Animated orb with particle ring effect.

**Props:**
- `size?: number` - Diameter in pixels (default: 120)
- `color?: string` - RGB color string (default: cyan)
- `pulseSpeed?: number` - Pulse cycle MS (default: 2000)
- `particleCount?: number` - Ring particles (default: 24)

**Features:**
- Canvas-based particle effects
- Radial gradient glow
- Respects `prefers-reduced-motion`

## Stage Components

### CosmicPortal

**Props:**
- `onComplete: () => void` - Callback after 3-second timer

**Features:**
- Auto-advances after 3000ms
- Full-screen layout
- Starfield + orb + typewriter animations
- Progress indicator dots

### AspectSelector

**Props:**
- `onSelect: (aspect: LifeAspect) => void` - Selection callback

**Features:**
- 6 tiltable cards (react-tilt)
- Responsive grid (1/2/3 columns)
- Stagger animation (80ms delay)
- Keyboard navigation (Enter/Space to select)
- ARIA labels for accessibility

**Aspects:**
1. Career (💼) → 官禄
2. Wealth (💰) → 财帛
3. Relationships (💞) → 夫妻
4. Health (❤️‍🩹) → 疾厄
5. Social (👥) → 交友
6. Home (🏠) → 田宅

### TimeframeSelector

**Props:**
- `selectedAspect: LifeAspect | null` - Current aspect
- `onBack: () => void` - Return to aspect selection
- `onSelect: (timeframe: TimeFrame) => void` - Selection callback

**Features:**
- 4 orbital orbs with particle rings
- Horizontal timeline on desktop
- Vertical stack on mobile
- Back button (Escape key support)
- Keyboard navigation

**Timeframes:**
1. Natal (🔮) - Core blueprint
2. Dayun (🌊) - 10-year cycles
3. Liu Nian (🌙) - Annual forecast
4. Liu Month (⭐) - Monthly rhythm

## Configuration Files

Located in `src/utils/destiny-navigator/`:

### aspect-config.ts

Exports `ASPECT_CONFIGS` array with:
- `key: LifeAspect` - Unique identifier
- `label: string` - Display name
- `icon: string` - Emoji
- `description: string` - Card description
- `palaceName: string` - Chinese palace name

Helper functions:
- `getAspectConfig(key)` - Get by aspect key
- `getAspectByPalace(palaceName)` - Get by palace name

### timeframe-config.ts

Exports `TIMEFRAME_CONFIGS` array with:
- `key: TimeFrame` - Unique identifier
- `label: string` - Display name
- `icon: string` - Emoji
- `description: string` - Card description

Helper function:
- `getTimeframeConfig(key)` - Get by timeframe key

## Styling Patterns

### Glassmorphism
```css
bg-white/10 backdrop-blur-lg border border-white/20
```

### Hover Glow
```css
hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]
```

### Gradients
- Text: `from-cyan-300 via-blue-300 to-purple-300`
- Background: `from-slate-900 via-indigo-900 to-slate-900`
- Timeline: `from-cyan-500 via-blue-500 to-purple-500`

### Motion Timing
- Page transitions: 400ms
- Card stagger: 80ms delay
- Portal timer: 3000ms
- Pulse cycle: 2000ms
- Typewriter: 50ms/char

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Select card or orb
- **Escape**: Go back (TimeframeSelector)

### Screen Readers
- ARIA labels on all interactive elements
- Role attributes on main containers
- Descriptive button labels

### Reduced Motion
- Detects `prefers-reduced-motion` system setting
- Disables animations in StarfieldBackground
- Disables animations in PulsingOrb
- Static display when motion is reduced

### Focus Management
- Visible focus rings (cyan)
- Proper tab order
- Minimum 44x44px touch targets on mobile

## Responsive Design

### Breakpoints
- **Mobile** (< 640px): Single column, larger touch targets
- **Tablet** (640-1024px): 2-column grid
- **Desktop** (> 1024px): 3-column grid

### Mobile Optimizations
- Reduced star count (performance)
- Larger orbs (easier to tap)
- Vertical timeline instead of horizontal
- Full-width cards with proper spacing

## Performance Considerations

1. **Canvas Optimization**
   - requestAnimationFrame for smooth 60fps
   - Static rendering when reduced motion is preferred
   - Efficient particle updates

2. **Animation Strategy**
   - Only animate `transform` and `opacity` (GPU-accelerated)
   - Avoid layout-triggering properties
   - Use framer-motion for orchestration

3. **Asset Loading**
   - No external images or fonts
   - Inline SVG icons
   - Minimal bundle impact

## Integration Example

```typescript
import { AnimatePresence } from "framer-motion";
import { CosmicPortal, AspectSelector, TimeframeSelector } from "./components/destiny-navigator/stages";

const [state, setState] = useState<NavigatorState>({
  currentStage: "portal",
  selectedAspect: null,
  selectedTimeframe: null,
  profileId: "123"
});

<AnimatePresence mode="wait">
  {state.currentStage === "portal" && (
    <CosmicPortal
      onComplete={() => setState(prev => ({...prev, currentStage: "aspect"}))}
    />
  )}
  
  {state.currentStage === "aspect" && (
    <AspectSelector
      onSelect={(aspect) => setState(prev => ({
        ...prev,
        selectedAspect: aspect,
        currentStage: "timeframe"
      }))}
    />
  )}
  
  {state.currentStage === "timeframe" && (
    <TimeframeSelector
      selectedAspect={state.selectedAspect}
      onBack={() => setState(prev => ({
        ...prev,
        selectedTimeframe: null,
        currentStage: "aspect"
      }))}
      onSelect={(timeframe) => setState(prev => ({
        ...prev,
        selectedTimeframe: timeframe,
        currentStage: "analysis"
      }))}
    />
  )}
</AnimatePresence>
```

## TypeScript Types

All types are defined in `src/types/destiny-navigator.ts`:

```typescript
type LifeAspect = "career" | "wealth" | "health" | "relationships" | "social" | "home";
type TimeFrame = "natal" | "dayun" | "liunian" | "liumonth";
type NavigatorStage = "portal" | "aspect" | "timeframe" | "analysis";

interface NavigatorState {
  currentStage: NavigatorStage;
  selectedAspect: LifeAspect | null;
  selectedTimeframe: TimeFrame | null;
  profileId: string;
}
```

## Dependencies

- `framer-motion` - Animation orchestration
- `react-tilt` - 3D card tilt effect
- `tailwindcss` - Styling
- No additional external dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential improvements for future iterations:

1. **Sound Effects** - Subtle audio feedback on interactions
2. **Haptic Feedback** - Vibration on mobile devices
3. **Custom Cursors** - Cosmic-themed cursor on hover
4. **Particle Trails** - Mouse/touch trail effects
5. **3D Transitions** - More dramatic stage transitions
6. **Progress Persistence** - Save state to localStorage
7. **Skip Portal** - For returning users
8. **Animated Constellations** - Connect stars into patterns

## Testing Checklist

- [ ] Portal auto-advances after 3 seconds
- [ ] All 6 aspect cards are clickable
- [ ] Aspect selection advances to timeframe
- [ ] All 4 timeframe orbs are clickable
- [ ] Back button returns to aspect selection
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus states are visible
- [ ] Animations run at 60fps on desktop
- [ ] Mobile layout is responsive (tested at 375px)
- [ ] Touch targets are minimum 44x44px
- [ ] Reduced motion preference is respected
- [ ] ARIA labels are present
- [ ] No console errors or warnings
- [ ] Works in light and dark mode

## Credits

Built as part of the NM-ZWDS project - a modern Zi Wei Dou Shu chart analysis application.














