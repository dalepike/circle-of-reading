# Layout Comparison: ReadingLayout vs NewReaderLayout

## Side-by-Side Feature Comparison

| Feature | ReadingLayout (Old) | NewReaderLayout (New) |
|---------|---------------------|----------------------|
| **Navigation** | Top navbar + bottom prev/next | MicroHeader (sticky) + ProgressRail + SmartNext |
| **Progress Tracking** | None | Visual W01-W52 rail with state indicators |
| **Week Jumping** | Manual URL entry | JumpDrawer with month filtering + search |
| **Keyboard Shortcuts** | None | ←/→ arrows, `i`, `j`, `Esc` |
| **Audio Player** | ElevenLabs embed | To be re-integrated |
| **Typography** | Elegant serif with drop cap | ✅ Preserved identical |
| **Dark/Light Mode** | ✅ Supported | ✅ Supported (enhanced) |
| **Mobile Responsive** | Basic | Enhanced with bottom sheet drawer |
| **State Management** | None | ReadingProvider with localStorage |
| **Accessibility** | Basic | Enhanced ARIA, focus management |

---

## Component Mapping

### Old ReadingLayout Structure

```
ReadingLayout.astro
├── BaseLayout
├── Navigation.astro (top navbar)
├── AudioNativeEmbed (ElevenLabs player)
├── <slot /> (reading content)
├── Bottom prev/next navigation
└── Footer
```

### New NewReaderLayout Structure

```
NewReaderLayout.astro
├── BaseLayout
├── ReadingProvider (state wrapper)
│   ├── ProgressRail (left sidebar, W01-W52)
│   ├── MicroHeader (sticky top header)
│   ├── JumpDrawer (overlay for week selection)
│   └── SmartNext (end-of-reading panel)
├── <slot /> (reading content - identical)
└── Footer
```

---

## Props Comparison

### ReadingLayout Props (Old)

```typescript
interface Props {
  title: string;
  russianTitle?: string;
  author?: string;
  month: string;
  number?: number | number[];       // ❌ Could be array
  volume?: number;
  pages?: string;
  description?: string;
  prevReading?: {                   // ❌ Different shape
    title: string;
    slug: string;
    month: string;
  };
  nextReading?: {
    title: string;
    slug: string;
    month: string;
  };
}
```

### NewReaderLayout Props (New)

```typescript
interface Props {
  week: number;                     // ✅ Always single number
  title: string;
  russianTitle?: string;
  author?: string;
  month: string;
  volume?: number;
  pages?: string;
  description?: string;
  prevWeek?: {                      // ✅ Renamed, includes week number
    week: number;
    title: string;
    slug: string;
    month: string;
  } | null;
  nextWeek?: {
    week: number;
    title: string;
    slug: string;
    month: string;
  } | null;
  allWeeks: Array<{                 // ✅ NEW - for JumpDrawer
    week: number;
    title: string;
    russianTitle?: string;
    slug: string;
  }>;
}
```

---

## CSS/Styling Comparison

### Old ReadingLayout Styles

```css
/* Tailwind utility classes */
.min-h-screen .flex .flex-col
.px-5 .py-12 .md:py-20
.prose (max-width: var(--reading-width))

/* Custom classes */
.metadata
.reading-content
.translator-notes
```

### NewReaderLayout Styles

```css
/* Grid-based layout */
.reader-layout {
  display: grid;
  grid-template-columns: auto 1fr;
}

/* All old styles PRESERVED */
.prose
.metadata
.reading-content
.translator-notes

/* NEW layout classes */
.rail-container (fixed left sidebar)
.content-area (centered content)
.reading-main
```

**Typography:** 100% preserved - drop cap, font sizes, line heights identical.

---

## Migration Guide

### Step 1: Update Import

```diff
- import ReadingLayout from '../../layouts/ReadingLayout.astro';
+ import NewReaderLayout from '../../layouts/NewReaderLayout.astro';
```

### Step 2: Update Props

```diff
const layoutProps = {
+   week: 1,                        // ADD: single number
-   number: 1,                      // REMOVE: old prop name
    title: "Title",
    russianTitle: "Название",
    month: "january",
    volume: 1,
    pages: "1-5",
-   prevReading: { ... },           // REMOVE: old prop name
-   nextReading: { ... },           // REMOVE: old prop name
+   prevWeek: {                     // ADD: new prop name with week number
+     week: 0,
+     title: "...",
+     slug: "...",
+     month: "..."
+   },
+   nextWeek: { ... },              // ADD: new prop name
+   allWeeks: [                     // ADD: all 52 weeks for drawer
+     { week: 1, title: "...", slug: "..." },
+     // ... remaining weeks
+   ]
};
```

### Step 3: Update Content (No Changes Needed!)

```astro
<NewReaderLayout {...layoutProps}>
  <!-- Content remains IDENTICAL -->
  <p>First paragraph with drop cap...</p>

  <h2>Section</h2>
  <p>Content...</p>

  <div class="translator-notes">
    <h2>Translator's Notes</h2>
    <p>Notes...</p>
  </div>
</NewReaderLayout>
```

---

## Feature-by-Feature Migration

### Navigation

**Old Way:**
```astro
<Navigation currentMonth={month} />
<!-- Separate top navbar component -->

<!-- Bottom navigation -->
<nav>
  {prevReading && <a href="...">Previous</a>}
  {nextReading && <a href="...">Next</a>}
</nav>
```

**New Way:**
```astro
<!-- All handled automatically by NewReaderLayout -->
<!-- MicroHeader provides sticky top navigation -->
<!-- SmartNext provides intelligent bottom panel -->
<!-- ProgressRail provides sidebar navigation -->
```

### Audio Player

**Old Way:**
```astro
<AudioNativeEmbed publicUserId="..." />
<!-- Embedded directly in layout -->
```

**New Way:**
```astro
<!-- TODO: Re-integrate AudioNativeEmbed -->
<!-- Will be added back in next iteration -->
<!-- Consider: Collapsible player in MicroHeader? -->
```

### Month Navigation

**Old Way:**
```astro
<a href={`/${month}/`}>
  {capitalizedMonth}
</a>
<!-- Link in metadata -->
```

**New Way:**
```astro
<!-- Click month in ProgressRail -->
<!-- Or use SmartNext "Back to Month" -->
<!-- Or click MicroHeader to open JumpDrawer -->
```

---

## Visual Differences

### Layout Structure

#### Old ReadingLayout
```
┌─────────────────────────────────────┐
│ Navigation Bar                       │ ← Top navbar
├─────────────────────────────────────┤
│                                      │
│         Reading Content              │
│         (centered column)            │
│                                      │
├─────────────────────────────────────┤
│ ← Previous      |      Next →        │ ← Bottom nav
├─────────────────────────────────────┤
│ Footer                               │
└─────────────────────────────────────┘
```

#### NewReaderLayout
```
┌───┬──────────────────────────────────┐
│ P │ ┌──────────────────────────────┐ │
│ r │ │ MicroHeader (sticky)         │ │ ← Sticky header
│ o │ ├──────────────────────────────┤ │
│ g │ │                              │ │
│ r │ │    Reading Content           │ │
│ e │ │    (centered column)         │ │
│ s │ │                              │ │
│ s │ └──────────────────────────────┘ │
│   │ ┌──────────────────────────────┐ │
│ R │ │ SmartNext Panel (appears at  │ │ ← Smart panel
│ a │ │ end of reading)              │ │
│ i │ └──────────────────────────────┘ │
│ l │ Footer                           │
└───┴──────────────────────────────────┘

    ┌────────────────────────────┐
    │ JumpDrawer (overlay)       │ ← Overlay drawer
    │ ├─ Jan Feb Mar...          │   (opens on demand)
    │ ├─ W01: Title ○            │
    │ ├─ W02: Title ●            │
    └────────────────────────────┘
```

---

## Breaking Changes

### 1. Props Shape

**Old:**
```typescript
prevReading?: { title, slug, month }
```

**New:**
```typescript
prevWeek?: { week, title, slug, month } | null
```

**Migration:** Add `week` number and change prop name.

### 2. Week Number Format

**Old:**
```typescript
number?: number | number[]  // Could be array for multi-day
```

**New:**
```typescript
week: number  // Always single number
```

**Migration:** Use single week number. For multi-day readings, use ranges in metadata.

### 3. Required Props

**Old:** Only `title` and `month` required

**New:** `title`, `month`, `week`, and `allWeeks` required

**Migration:** Add `allWeeks` array with all 52 weeks data.

### 4. Component Imports

**Old:**
```astro
import Navigation from "../components/Navigation.astro";
import AudioNativeEmbed from "../components/AudioNativeEmbed.astro";
```

**New:**
```astro
<!-- None needed - all components imported internally -->
```

---

## Non-Breaking Changes (Fully Compatible)

✅ **Typography** - Identical drop cap, font sizes, spacing
✅ **Content slot** - MDX content works identically
✅ **Translator notes** - Same `.translator-notes` class
✅ **Theme toggle** - Dark/light mode works the same
✅ **Metadata display** - Author, volume, pages displayed identically
✅ **Footer** - Same source attribution

---

## Performance Comparison

| Metric | ReadingLayout | NewReaderLayout |
|--------|---------------|-----------------|
| Initial Bundle | ~5KB (minimal) | ~45KB (React components) |
| Hydration Time | <50ms | ~200ms (React hydration) |
| Interactive Features | None (static) | Rich (state, navigation) |
| Persistence | None | localStorage (auto-save) |
| Rehydration | N/A | Instant from localStorage |

**Trade-off:** Slightly larger bundle for significantly enhanced UX.

---

## Recommended Migration Strategy

### Phase 1: Single Week Test
1. Pick one week (e.g., Week 01)
2. Create `allWeeks` array with all 52 weeks
3. Update that week to use NewReaderLayout
4. Test all navigation features
5. Verify typography is identical

### Phase 2: Month Migration
1. Once Week 01 works, migrate entire January
2. Reuse same `allWeeks` array
3. Test inter-week navigation
4. Verify month navigation in ProgressRail

### Phase 3: Full Migration
1. Create shared `allWeeks.ts` data file
2. Batch update remaining 11 months
3. Test edge cases (Week 01 prev, Week 52 next)
4. Add redirects from old URLs if needed

### Phase 4: Cleanup
1. Archive old ReadingLayout.astro
2. Remove old Navigation component if unused
3. Re-integrate AudioNativeEmbed
4. Add analytics tracking to new components

---

## Rollback Plan

If issues arise:

1. **Immediate:** Simply change import back to `ReadingLayout`
2. **Partial:** Keep NewReaderLayout for tested weeks, use old for others
3. **Data:** Old layout still works with existing data structure
4. **No data loss:** State is additive, doesn't affect old layout

---

## Testing Checklist

Before considering migration complete:

**Functionality:**
- [ ] All 52 weeks render correctly
- [ ] Prev/Next navigation works at all boundaries
- [ ] JumpDrawer shows all weeks with correct titles
- [ ] ProgressRail updates state correctly
- [ ] SmartNext appears at scroll threshold
- [ ] Keyboard shortcuts work (←, →, i, j, Esc)

**Visual:**
- [ ] Typography matches old layout exactly
- [ ] Drop cap on first paragraph works
- [ ] Metadata displays correctly
- [ ] Russian titles styled properly
- [ ] Dark/light themes both work
- [ ] Mobile responsive layout works

**Performance:**
- [ ] Page load time acceptable (<3s)
- [ ] No layout shift during hydration
- [ ] Smooth scrolling behavior
- [ ] localStorage persists correctly

**Accessibility:**
- [ ] Screen reader announces navigation
- [ ] Keyboard-only navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels correct

---

## Known Issues & Workarounds

### Issue 1: Audio Player Removed
**Impact:** No audio playback in new layout
**Workaround:** Use old ReadingLayout if audio required
**Fix:** Add AudioNativeEmbed back to NewReaderLayout

### Issue 2: Larger Bundle Size
**Impact:** +40KB JavaScript for React components
**Workaround:** Use lazy loading strategies
**Fix:** Code splitting, dynamic imports for non-critical components

### Issue 3: Hydration Flash
**Impact:** Brief flash before React components appear
**Workaround:** SSR placeholders in layout
**Fix:** Improve hydration strategy, use Astro Islands better

---

## Conclusion

NewReaderLayout provides significantly enhanced UX with:
- Visual progress tracking
- Quick week navigation
- Keyboard shortcuts
- Persistent state

While requiring:
- Props updates
- `allWeeks` data structure
- Larger JavaScript bundle

**Recommendation:** Migrate gradually, test thoroughly, keep old layout as fallback.
