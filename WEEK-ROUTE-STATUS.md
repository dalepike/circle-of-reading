# Week Route Implementation Status

## ✅ Completed

### 1. Dynamic Week Route Created
**File**: `src/pages/week/[week].astro`
**Status**: Created and ready
**Routes Generated**: `/week/W01`, `/week/W02`, ... `/week/W52`

The route file implements:
- Static path generation for all 52 weekly readings
- Week number formatting (W01, W16, etc.)
- Previous/next week navigation data
- All weeks data for jump drawer functionality
- Content rendering from Astro content collections

### 2. Route Migration Documentation
**File**: `ROUTE-MIGRATION.md`
**Contents**:
- Old vs new route comparison
- Migration strategy (3 options)
- Redirect implementation approaches
- Week-to-month mapping reference
- Implementation checklist

## ⚠️ Known Issues

### NewReaderLayout.astro Syntax Error
The `NewReaderLayout.astro` file (which already existed) has syntax errors in its `<script>` section:

**Problem**: Lines 126-132 attempt to use Astro template interpolation inside a `<script>` tag:
```typescript
const layoutData = {
  week: currentWeek,
  title: "{title}",  // ❌ This doesn't work in <script> tags
  // ... etc
};
```

**Solution Needed**:
Pass data from Astro to the script using either:
1. `data-*` attributes on DOM elements
2. A `<script define:vars={...}>` tag
3. `JSON.parse()` from a script tag with `type="application/json"`

**Recommended Approach**:
```astro
<script define:vars={{
  week,
  title,
  russianTitle,
  month: capitalizedMonth,
  volume,
  prevWeek,
  nextWeek,
  allWeeks
}}>
  const layoutData = {
    week,
    title,
    russianTitle,
    month,
    volume,
    prevWeek,
    nextWeek,
    allWeeks,
  };
  // ... rest of script
</script>
```

## 📝 Next Steps

To make the week routes fully functional:

1. **Fix NewReaderLayout.astro** (highest priority)
   - Fix the script data passing issue
   - Test that all React components load correctly

2. **Test Week Routes**
   ```bash
   npm run dev
   # Visit http://localhost:4321/week/W01
   ```

3. **Implement Redirects** (optional, for migration)
   - Choose redirect strategy from ROUTE-MIGRATION.md
   - Implement redirects from old `/[month]/[slug]` to new `/week/W##`

4. **Update Navigation Components**
   - Update any links to use new `/week/W##` format
   - Update sitemap generation if applicable

## Testing Checklist

- [ ] Fix NewReaderLayout.astro syntax errors
- [ ] Build succeeds without errors
- [ ] Week routes generate correctly (all 52)
- [ ] Week page displays correctly in browser
- [ ] Previous/next navigation works
- [ ] Jump drawer functionality works
- [ ] Progress rail displays
- [ ] SmartNext panel appears

## Files Created

1. `/src/pages/week/[week].astro` - Dynamic week route
2. `/ROUTE-MIGRATION.md` - Migration documentation
3. `/WEEK-ROUTE-STATUS.md` - This file
