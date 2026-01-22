# NewReaderLayout - Implementation Guide

**Location:** `src/layouts/NewReaderLayout.astro`

## Overview

NewReaderLayout is the modern, redesigned reading experience for Circle of Reading. It combines all the new React components into a cohesive, elegant reading interface while preserving the beautiful black & white aesthetic and typography from the original layout.

## Architecture

### Component Composition

```
NewReaderLayout (Astro)
├── BaseLayout (Astro wrapper)
├── ReadingProvider (React Context)
│   ├── ProgressRail (React - left sidebar)
│   ├── MicroHeader (React - sticky top)
│   ├── JumpDrawer (React - overlay)
│   └── SmartNext (React - bottom panel)
├── Reading Content (MDX slot)
└── ThemeToggle (React)
```

### Key Features

1. **ProgressRail** - Vertical W01-W52 navigation with progress indicators
2. **MicroHeader** - Minimal sticky header with keyboard shortcuts
3. **JumpDrawer** - Quick week selection with month filtering
4. **SmartNext** - Intelligent end-of-reading navigation panel
5. **Beautiful Typography** - Preserved drop cap, elegant serif text
6. **State Management** - Coordinated via ReadingProvider context

## Props Interface

```typescript
interface Props {
  week: number;                    // Current week number (1-52)
  title: string;                   // Reading title
  russianTitle?: string;           // Optional Russian title
  author?: string;                 // Optional author name
  month: string;                   // Month name (lowercase)
  volume?: number;                 // Optional volume number
  pages?: string;                  // Optional page range
  description?: string;            // SEO description
  prevWeek?: {                     // Previous week navigation
    week: number;
    title: string;
    slug: string;
    month: string;
  } | null;
  nextWeek?: {                     // Next week navigation
    week: number;
    title: string;
    slug: string;
    month: string;
  } | null;
  allWeeks: Array<{                // All 52 weeks for JumpDrawer
    week: number;
    title: string;
    russianTitle?: string;
    slug: string;
  }>;
}
```

## Usage Example

### In a Week MDX File

```astro
---
// src/pages/january/week-01.mdx
import NewReaderLayout from '../../layouts/NewReaderLayout.astro';

const layoutProps = {
  week: 1,
  title: "The Circle of Reading Begins",
  russianTitle: "Круг чтения начинается",
  author: "Leo Tolstoy",
  month: "january",
  volume: 1,
  pages: "1-5",
  description: "Week 1 of Leo Tolstoy's Circle of Reading",
  prevWeek: null,
  nextWeek: {
    week: 2,
    title: "On Truth",
    slug: "week-02",
    month: "january"
  },
  allWeeks: [
    { week: 1, title: "The Circle of Reading Begins", slug: "week-01" },
    { week: 2, title: "On Truth", slug: "week-02" },
    // ... all 52 weeks
  ]
};
---

<NewReaderLayout {...layoutProps}>
  <!-- Your reading content here -->

  <p>The first paragraph will have a beautiful drop cap...</p>

  <h2>Section Title</h2>

  <p>Reading content continues...</p>

  <!-- Translator notes (optional) -->
  <div class="translator-notes">
    <h2>Translator's Notes</h2>
    <p>Additional context or explanations...</p>
  </div>
</NewReaderLayout>
```

## Layout Structure

### Grid System

```css
.reader-layout {
  display: grid;
  grid-template-columns: auto 1fr;  /* Rail + Content */
  min-height: 100vh;
}
```

### Responsive Breakpoints

- **Desktop (>1024px)**: Full rail (5rem width) + centered content
- **Tablet (769-1024px)**: Narrower rail (4rem width) + content
- **Mobile (<768px)**: Rail hidden, full-width content

### Z-Index Layers

```
Layer 50: JumpDrawer overlay
Layer 40: React components mount point
Layer 30: ProgressRail (fixed left)
Layer 20: MicroHeader (sticky top)
Layer 10: SmartNext (fixed bottom)
Layer 0: Content area
```

## Component Integration

### State Management

All components share state via `ReadingProvider`:

```typescript
// Reading state includes:
- progress: Map of week -> ReadingState (UNSEEN, VISITED, IN_PROGRESS, COMPLETED)
- recents: Array of recently visited week numbers
- currentWeek: Currently active week
```

### Navigation Flow

```
User Interactions:
1. Click week in ProgressRail → Navigate to week page
2. Click MicroHeader center → Open JumpDrawer
3. Arrow keys in MicroHeader → Prev/Next week
4. Reach end of reading → SmartNext panel appears
5. Click next in SmartNext → Navigate to next week
```

### Keyboard Shortcuts

Implemented in MicroHeader:

- `←` - Previous week
- `→` - Next week
- `i` - Open calendar index
- `j` - Open jump drawer
- `Esc` - Close jump drawer (in JumpDrawer component)

## Styling

### Typography Hierarchy

```css
/* Preserved from ReadingLayout */
.prose h1     → Large sans-serif (3-4rem, weight 600)
.prose h2     → Thin sans-serif subtitle (1.5rem, weight 300)
.prose h3     → Uppercase sans-serif (1.125rem, weight 300)
.prose p      → Elegant serif (1.25rem, weight 400)
.reading-content > p:first-of-type → Larger with drop cap
```

### Color System

Monochrome palette from `global.css`:

```css
Dark mode (default):
- Background: #000000 (black)
- Text: #ffffff (white)
- Borders: #1a1a1a (gray-800)

Light mode (.light):
- Background: #ffffff (white)
- Text: #000000 (black)
- Borders: #cccccc (gray-200)
```

### Custom CSS Variables

```css
--reading-width: 40rem;              /* Max content width */
--line-height-reading: 1.85;         /* Comfortable reading line height */
--letter-spacing-reading: 0.01em;    /* Subtle letter spacing */
```

## Migration from ReadingLayout

### Changes from Old Layout

**Removed:**
- Old Navigation component (replaced by MicroHeader)
- AudioNativeEmbed (will be integrated separately)
- Bottom navigation arrows (replaced by SmartNext)

**Added:**
- ProgressRail for visual progress tracking
- MicroHeader for minimal sticky navigation
- JumpDrawer for quick week selection
- SmartNext for intelligent end-of-reading options
- ReadingProvider for state coordination

**Preserved:**
- Beautiful typography and drop cap
- Metadata display (author, volume, pages)
- Translator notes section
- Footer with source attribution
- Dark/light theme support

### Migration Steps

1. Update your MDX files to import `NewReaderLayout` instead of `ReadingLayout`
2. Update props to include `allWeeks` array
3. Rename `number` prop to `week` if using old format
4. Add `prevWeek` and `nextWeek` navigation data
5. Test keyboard navigation and state management

## Performance Considerations

### Hydration Strategy

All React components use `client:load` for immediate hydration:

```astro
<MicroHeader client:load {...props} />
```

This ensures interactive features work immediately after page load.

### Lazy Loading Considerations

For production optimization, consider:

- `client:visible` for SmartNext (only loads when scrolled near bottom)
- `client:idle` for JumpDrawer (loads after main content interactive)

Currently using `client:load` for development consistency.

### Bundle Size

React components are bundled together via the inline script tag. For production:

1. Extract to separate `.tsx` entry file
2. Configure Astro to bundle React components
3. Enable code splitting for larger components

## Accessibility

### ARIA Labels

- ProgressRail: `aria-label="Reading progress"`
- MicroHeader buttons: Descriptive `aria-label` for each action
- JumpDrawer: `role="dialog"` with `aria-modal="true"`
- SmartNext: `role="navigation"` with context labels

### Keyboard Navigation

- Tab order: MicroHeader → Content → SmartNext → JumpDrawer
- Arrow keys for week navigation
- Escape key to close overlays
- Enter/Space for all interactive elements

### Screen Reader Support

- Semantic HTML structure
- Progress indicators announced via `aria-label`
- State changes communicated via context
- Focus management in JumpDrawer

## Troubleshooting

### Common Issues

**1. Components not rendering**
- Check that React dependencies are installed (`react`, `react-dom`)
- Verify `client:load` directive is present
- Check browser console for hydration errors

**2. State not persisting**
- ReadingProvider uses localStorage for persistence
- Check browser localStorage is enabled
- State key: `circle-of-reading-state`

**3. Navigation not working**
- Verify `allWeeks` array is populated correctly
- Check that slugs match your file structure
- Ensure month names are lowercase in URLs

**4. Styling conflicts**
- NewReaderLayout styles are scoped to avoid conflicts
- Check `global.css` is imported in BaseLayout
- Verify CSS custom properties are defined

**5. Mobile layout issues**
- Test responsive breakpoints (768px, 1024px)
- Check that rail is hidden on mobile
- Verify MicroHeader touch targets are at least 44x44px

## Future Enhancements

### Planned Features

1. **Audio Integration** - Add AudioNativeEmbed back with ElevenLabs
2. **Progress Persistence** - Sync across devices via API
3. **Reading Analytics** - Track time spent, completion rates
4. **Bookmarks** - Save specific positions within readings
5. **Search** - Full-text search across all 52 weeks
6. **Annotations** - User highlights and notes
7. **Reading Streaks** - Gamification for daily reading

### Performance Optimizations

1. Preload adjacent weeks for faster navigation
2. Service worker for offline reading
3. Image optimization for any future illustrations
4. Font subsetting for faster initial load

## Testing Checklist

Before deploying:

- [ ] Test all keyboard shortcuts (←, →, i, j, Esc)
- [ ] Verify progress indicators update correctly
- [ ] Test dark/light theme switching
- [ ] Check mobile responsive layout
- [ ] Verify print styles hide UI chrome
- [ ] Test screen reader navigation
- [ ] Check navigation between weeks
- [ ] Verify SmartNext appears at scroll threshold
- [ ] Test JumpDrawer month filtering
- [ ] Validate localStorage state persistence

## Support

For issues or questions:
1. Check this documentation first
2. Review component source in `src/components/reader/`
3. Check Astro documentation for layout patterns
4. Test in isolation using component examples

## Version History

- **v1.0** (2026-01-19) - Initial NewReaderLayout implementation
  - ProgressRail integration
  - MicroHeader with keyboard navigation
  - JumpDrawer for week selection
  - SmartNext intelligent navigation
  - Preserved elegant typography from ReadingLayout
