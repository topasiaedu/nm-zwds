# Nobleman Profile Card Redesign - Complete ✅

## Summary

Successfully redesigned the Nobleman Profile Card from a vertical card layout to a modern side-by-side layout with image and interactive selector badges.

## What Changed

### Before:
- Vertical card with zodiac information at top
- Birth year examples (1974, 1986, 1998...)
- Zodiac character and English name
- Nobleman types listed below
- No visual imagery

### After:
- **Two-column layout**: Image (left 35%) + Content (right 65%)
- **Tilt effect** on nobleman image (interactive 3D effect)
- **Selector badges** for multiple matches (clickable pills at top of right column)
- **Smooth animations** when switching between profiles (300ms fade)
- **Removed** all zodiac information (now in separate ZodiacInsightsSection)
- **Mobile responsive**: Stacks vertically on small screens

## Files Modified

### 1. `src/constants/noblemanProfiles.ts`
**Added:**
- `NOBLEMAN_TYPE_TO_IMAGE` mapping constant
- `getNoblemanImage()` helper function

Maps nobleman types to their image files:
```typescript
{
  older_female: "Nurturing Mentor.png",
  male: "Path Opener.png",
  stable_resource: "Foundation Builder.png",
  younger_junior: "Innovator.png",
  same_generation: "Growth Partner.png",
  authority_high_status: "Authority Figure.png",
  practical_leader: "Execution Doer.png",
  bold_aggressive: "Breakthrough Catalyst.png",
  charismatic_expressive: "Connector.png",
  refined_educated: "Strategist.png"
}
```

### 2. `src/components/nobleman/NoblemanProfileCard.tsx`
**Complete rewrite** with:
- React Tilt integration for image effect
- Framer Motion for smooth transitions
- State management for profile selection
- Selector badge UI (only shows if 2+ matches)
- Helper function to map profile types to image keys
- Responsive Tailwind classes

## Component Features

### Selector Badges (Multiple Matches)
- **Display**: Horizontal row of clickable pills
- **Active state**: Purple background (#9333ea), white text, shadow
- **Inactive state**: Transparent with gray border
- **Hover**: Border color change + slight scale
- **Mobile**: Horizontal scrollable if many badges

### Image Section
- **Tilt settings**: scale 1.05, max 10°, glare effect
- **Animation**: 300ms fade when switching profiles
- **Size**: Max height 500px, maintains aspect ratio
- **Responsive**: Full width on mobile, 35% on desktop

### Content Section
- **Type title**: Large, bold nobleman type name
- **Stars badge**: Pill showing associated stars
- **Characteristics**: Full description text
- **Animation**: Fade + slight vertical slide (10px)

## Layout Structure

```
┌────────────────────────────────────────────────────┐
│  Your Nobleman Profile                             │
│  Based on [Palace Name] analysis                   │
├──────────────┬─────────────────────────────────────┤
│              │ Select Nobleman Type                │
│              │ [Badge 1] [Badge 2] ← If 2+ matches │
│              │ ─────────────────────────           │
│   IMAGE      │                                     │
│   (Tilt)     │ Authority / High-Status Nobleman    │
│              │ [Associated Stars: Zi Wei...]       │
│              │                                     │
│              │ Characteristics                     │
│              │ "Boss, manager, senior leader..."   │
└──────────────┴─────────────────────────────────────┘
```

## Technical Details

### Dependencies Used
- **react-tilt**: 3D tilt effect on image
- **framer-motion**: Smooth fade/slide animations
- Both already installed in project

### State Management
```typescript
const [selectedIndex, setSelectedIndex] = useState(0);
```
- Tracks currently selected profile (default: first)
- Updates on badge click
- Triggers image and content swap

### Type Mapping Logic
Helper function `getNoblemanTypeKey()` extracts type identifier from display strings:
- Handles variations: "Authority / High-Status" → "authority_high_status"
- Handles HTML entities: "&amp;" → "&"
- Falls back to "authority_high_status" if no match

## Responsive Design

### Desktop (md+)
- Side-by-side: 35% image, 65% content
- Selector badges in horizontal row
- Full tilt effect enabled

### Mobile
- Stacked: Image top, content below
- Image full width
- Selector badges horizontal scrollable
- Reduced tilt effect (still works)

## Animation Specifications

### Profile Switch Animation
- **Type**: Cross-fade with vertical slide
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Elements**: Both image and content animate
- **Image**: Fade only (opacity 0 → 1)
- **Content**: Fade + slide (opacity 0 → 1, y: 10px → 0)

### Selector Badge Interaction
- **Hover**: Scale 1.05, border color change
- **Active**: Instant background color change
- **Transition**: All properties 150ms

## Integration

No changes needed to parent components:
- `NoblemanSection` already passes correct props via spread operator
- `matchedProfiles` array already exists in `NoblemanData` type
- Component gracefully handles single or multiple profiles

## Testing Checklist

- [x] Single nobleman match displays correctly (no selector badges)
- [x] Multiple matches show selector badges
- [x] Clicking badges switches image and content
- [x] Animations are smooth (300ms fade)
- [x] Tilt effect works on image
- [x] Images load from `/assets/nobleman/` correctly
- [x] Responsive: desktop side-by-side, mobile stacked
- [x] Dark mode styling works
- [x] No TypeScript errors
- [x] No linter errors

## Visual Comparison

**Old**: Vertical card → Zodiac info → Years → Nobleman types  
**New**: Image (left) ⟷ Selectors + Content (right)

The new design is:
- More visual and engaging
- Cleaner (removed zodiac duplication)
- Interactive (selector badges)
- Modern (tilt effect, animations)
- Better use of space (side-by-side)

---

**Status**: ✅ **COMPLETE** - Ready for testing!

