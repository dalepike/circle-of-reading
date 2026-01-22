# Circle of Reading - Route Migration Plan

## Overview

This document outlines the migration from the old month-based routes to the new week-based routes for weekly readings.

## Route Changes

### Old Route Pattern
- **Pattern**: `/[month]/[slug]`
- **Example**: `/january/01-the-thiefs-son`
- **File**: `src/pages/[month]/[slug].astro`
- **Layout**: `ReadingLayout.astro`

### New Route Pattern
- **Pattern**: `/week/[week]`
- **Example**: `/week/W01`
- **File**: `src/pages/week/[week].astro`
- **Layout**: `NewReaderLayout.astro` (to be created)

## Migration Strategy

### Phase 1: Parallel Routes (Recommended)
Keep both old and new routes active during transition:

1. **New route active**: `/week/W01` → Works immediately
2. **Old route preserved**: `/january/01-the-thiefs-son` → Still works
3. **User experience**: No broken links during transition
4. **Timeline**: 3-6 months overlap recommended

### Phase 2: Redirect Implementation
After transition period, implement redirects:

#### Option A: Astro Redirects (astro.config.mjs)
```javascript
export default defineConfig({
  redirects: {
    '/january/01-the-thiefs-son': '/week/W01',
    '/january/03-perfection': '/week/W03',
    '/january/04-essence-of-christian-teaching': '/week/W04',
    // ... (52 redirects total)
  }
});
```

#### Option B: Dynamic Redirect Route
Create `src/pages/[month]/[slug].astro` as a redirect handler:

```astro
---
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const allReadings = await getCollection("readings");
  const weeklyReadings = allReadings.filter(r => r.data.type === "weekly");

  return weeklyReadings.map((reading) => {
    const weekNum = Array.isArray(reading.data.number)
      ? reading.data.number[0]
      : reading.data.number;
    const weekSlug = `W${weekNum < 10 ? '0' + weekNum : weekNum}`;

    return {
      params: {
        month: reading.data.month,
        slug: reading.data.slug,
      },
      props: {
        redirectTo: `/week/${weekSlug}`,
      },
    };
  });
}

const { redirectTo } = Astro.props;
return Astro.redirect(redirectTo, 301); // 301 = permanent redirect
---
```

#### Option C: Vercel/Netlify redirects
For deployment platforms, use their native redirect files:

**vercel.json**:
```json
{
  "redirects": [
    { "source": "/january/01-the-thiefs-son", "destination": "/week/W01", "permanent": true },
    { "source": "/january/03-perfection", "destination": "/week/W03", "permanent": true }
  ]
}
```

**_redirects** (Netlify):
```
/january/01-the-thiefs-son  /week/W01  301
/january/03-perfection      /week/W03  301
```

## Required Components

### NewReaderLayout.astro
The new layout component needs to be created with these props:

```typescript
interface Props {
  week: number;
  title: string;
  russianTitle?: string;
  month: string;
  volume?: number;
  pages?: string;
  description?: string;
  prevWeek?: { week: number; title: string; slug: string } | null;
  nextWeek?: { week: number; title: string; slug: string } | null;
  allWeeks?: Array<{ week: number; title: string; russianTitle?: string; slug: string }>;
}
```

### Key Differences from Old Layout
1. **Week-based navigation**: `prevWeek`/`nextWeek` instead of `prevReading`/`nextReading`
2. **Jump drawer data**: `allWeeks` array for week selector
3. **Week number display**: Show "Week N" prominently
4. **URL structure**: Links use `/week/W##` format

## Data Mapping

### Week to Month Mapping
Already defined in `src/lib/utils/weeks.ts`:
- January: W01-W04
- February: W05-W08
- March: W09-W13
- April: W14-W17
- May: W18-W21
- June: W22-W26
- July: W27-W30
- August: W31-W34
- September: W35-W39
- October: W40-W43
- November: W44-W47
- December: W48-W52

## Implementation Checklist

- [x] Create `/src/pages/week/[week].astro` dynamic route
- [ ] Create `NewReaderLayout.astro` component
- [ ] Test new week routes work correctly
- [ ] Verify all 52 weeks generate properly
- [ ] Update navigation components to link to week routes
- [ ] Create redirect strategy (choose Option A, B, or C above)
- [ ] Test redirects from old routes to new routes
- [ ] Update sitemap generation (if applicable)
- [ ] Update any hardcoded links in content
- [ ] Communicate route changes to users (if public site)

## Rollback Plan

If issues arise:
1. Keep old route file intact during testing
2. New routes can be disabled by renaming/deleting `src/pages/week/` directory
3. No data changes required - content files remain unchanged

## Notes

- Monthly readings (not weekly) continue to use `/monthly/[slug]` route
- Week numbering is consistent: 1-52, formatted as W01-W52
- Content files don't need changes - frontmatter already has necessary data
- The `formatWeekNumber()` utility ensures consistent W01, W16 formatting
