# Show All Stars in InsightsPanel for All Timeframes

## Mission
Remove the star count limit in InsightsPanel so that all stars in a palace are displayed regardless of timeframe (Natal, Dayun, Liu Nian, Liu Month).

## Problem
Currently, InsightsPanel filters stars based on timeframe:
- **Natal**: Shows all stars (999)
- **Dayun**: Shows top 3 stars only
- **Liu Nian**: Shows top 2 stars only
- **Liu Month**: Shows top 1 star only

This filtering causes valid stars like "Tian Xiang" (天相) to be hidden when viewing non-Natal timeframes, even though they are present in the palace and detected correctly.

## Solution
Remove the timeframe-based filtering and always show all stars that are present in the selected palace.

## Your Task

### Update InsightsPanel Star Count Logic

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Around line 144-150

**Find this code:**
```typescript
// Determine star count based on timeframe
const starCount = {
  natal: 999, // Show all
  dayun: 3,
  liunian: 2,
  liumonth: 1
}[timeframe];

// Filter and rank stars
const rankedStars = filterStarsByRelevance(allStars, aspect, starCount);
```

**Replace with:**
```typescript
// Show all stars regardless of timeframe
const starCount = 999;

// Filter and rank stars (will show all, ranked by relevance)
const rankedStars = filterStarsByRelevance(allStars, aspect, starCount);
```

**Alternative (with comment explaining the change):**
```typescript
// Determine star count based on timeframe
// Updated: Show all stars for all timeframes to ensure no star is hidden
const starCount = 999; // Always show all stars

// Filter and rank stars
const rankedStars = filterStarsByRelevance(allStars, aspect, starCount);
```

## Expected Behavior

### Before Fix
```
Liu Month - Wealth Palace:
Active Stars: 1 Star
- Lian Zhen (rank 1)
- Tian Xiang (rank 2) ← HIDDEN!
```

### After Fix
```
Liu Month - Wealth Palace:
Active Stars: 2 Stars
- Lian Zhen (rank 1)
- Tian Xiang (rank 2) ← NOW VISIBLE!
```

## Quality Checklist

- [ ] `starCount` variable set to `999` for all timeframes
- [ ] Stars are still ranked by relevance (most relevant first)
- [ ] No TypeScript errors
- [ ] No ESLint errors

## Testing

After implementation:

1. **Navigate to any aspect with multiple stars → Liu Month**
   - Should see ALL stars in the palace
   - Stars should be ranked by relevance (most relevant at top)
   - Example: If palace has 2 stars, both should be visible

2. **Verify ranking still works**
   - Stars should appear in order of relevance to the aspect
   - More relevant stars at the top

3. **Test all timeframes**
   - Natal: Shows all stars ✓
   - Dayun: Shows all stars ✓ (was limited to 3)
   - Liu Nian: Shows all stars ✓ (was limited to 2)
   - Liu Month: Shows all stars ✓ (was limited to 1)

## Notes

- The `filterStarsByRelevance()` function still ranks stars by relevance
- Stars will appear in order from most to least relevant
- Only stars that have interpretation data in `STAR_INTERPRETATIONS` will be shown
- If a palace has 0 stars, the "No Stars Found" message will display

## Output Files

Modified files:
1. `src/components/destiny-navigator/analysis/InsightsPanel.tsx`
