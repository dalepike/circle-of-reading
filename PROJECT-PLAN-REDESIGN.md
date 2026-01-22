# Circle of Reading — Complete Redesign Project Plan

**Created:** 2026-01-19
**Effort Level:** DETERMINED
**ISC Rows:** 146 requirements across 12 categories
**Site:** https://circle-of-reading.pages.dev

---

## Executive Summary

This plan transforms the Circle of Reading website from its current month-based navigation structure into a reading-first weekly navigation system with:

- **Progress Rail**: Visual year-at-a-glance navigation (W01-W52)
- **Reader View**: Text-dominant layout with persistent context
- **Calendar Index**: 12-month grid overview for discovery
- **Progress Tracking**: Visited/in-progress/completed state per week
- **Smart Navigation**: Jump Drawer, Smart Next panel, keyboard shortcuts

**Key Removal**: ElevenLabs audio player functionality is deprecated.

---

## Current State Analysis

### Existing Stack (Retained)
| Component | Technology | Status |
|-----------|------------|--------|
| Framework | Astro 5.16 | ✅ Keep |
| Components | React 19 (islands) | ✅ Keep |
| Styling | Tailwind CSS v4 | ✅ Keep |
| Search | Pagefind | ✅ Keep |
| Hosting | Cloudflare Pages | ✅ Keep |
| Package Manager | Bun | ✅ Keep |

### Current Content Structure
- **52 weekly readings** (W01-W52) in monthly folders
- **8 monthly essays** (separate collection)
- Content files already use W##-format naming
- Frontmatter includes: number, title, russianTitle, month, volume, pages

### To Be Replaced
| Current | Replacement |
|---------|-------------|
| Month tab navigation | Progress Rail + Micro-header |
| Home page grid | Calendar Index View |
| Individual month pages | Jump Drawer filtered views |
| Reading page layout | Reader View with rail |
| ElevenLabs audio | *Removed* |

---

## Implementation Phases

### Phase 0: Preparation (Pre-work)
**Duration:** Pre-implementation
**Capability:** 🤖 architect

| Task | Description | Files |
|------|-------------|-------|
| 0.1 | Create feature branch | `git checkout -b feature/redesign-2026` |
| 0.2 | Document current state | Screenshots, route inventory |
| 0.3 | Update content schema | `src/content.config.ts` |
| 0.4 | Create week mapping utilities | `src/lib/weeks.ts` |

**Content Schema Updates:**
```typescript
// Enhanced schema for week-centric navigation
{
  week: z.number().min(1).max(52),        // W## number
  title: z.string(),                       // English title
  russianTitle: z.string().optional(),     // Original Russian
  month: z.enum([...months]),              // Calendar month
  volume: z.number().min(41).max(42),      // PSS volume
  pages: z.string().optional(),            // Source pages
  embedded: z.array(z.string()).optional() // For W25, W28, etc.
}
```

---

### Phase 1: Foundation Layer
**Duration:** Sprint 1
**ISC Coverage:** A01-A12, T01-T12, D01-D05
**Capabilities:** 🤖 architect, 🤖 engineer

#### 1.1 State Management
**Files to Create:**
```
src/lib/
├── state/
│   ├── progress.ts        # Progress state machine
│   ├── recents.ts         # Recent readings tracker
│   └── storage.ts         # localStorage wrapper
├── types/
│   └── reading.ts         # TypeScript interfaces
└── utils/
    └── weeks.ts           # W## utilities
```

**Progress State Interface:**
```typescript
interface ReadingProgress {
  state: 'unseen' | 'visited' | 'in_progress' | 'completed';
  scrollPosition?: number;
  lastVisited?: string; // ISO timestamp
}

interface AppState {
  weeks: Record<number, ReadingProgress>; // W01-W52
  recents: number[]; // Last 10 week numbers
  current: {
    week: number;
    position: number;
  } | null;
}
```

**State Machine Rules:**
```
UNSEEN → VISITED     (on week open)
VISITED → IN_PROGRESS (on scroll > 20% OR time > 30s)
IN_PROGRESS → COMPLETED (on scroll > 95%)
COMPLETED stays COMPLETED (no regression)
```

#### 1.2 Remove Deprecated Features
**Files to Delete:**
- `src/components/AudioNative.tsx`
- `src/components/AudioNativeEmbed.astro`
- Remove ElevenLabs script from `BaseLayout.astro`

#### 1.3 Week Mapping Utilities
```typescript
// src/lib/utils/weeks.ts
export const WEEK_TO_MONTH: Record<number, string> = {
  1: 'january', 2: 'january', 3: 'january', 4: 'january',
  5: 'february', 6: 'february', 7: 'february', 8: 'february',
  // ... W09-W52
};

export const VOLUME_RANGES = {
  41: { start: 1, end: 34 },
  42: { start: 35, end: 52 }
};

export function getVolume(week: number): 41 | 42;
export function getMonth(week: number): string;
export function getWeeksForMonth(month: string): number[];
```

---

### Phase 2: Reader View Core
**Duration:** Sprint 2
**ISC Coverage:** R01-R25
**Capabilities:** 🤖 designer, 🤖 engineer

#### 2.1 Layout Structure
**New Files:**
```
src/layouts/
└── ReaderLayout.astro      # Complete replacement

src/components/reader/
├── ReadingColumn.astro     # Main text container
├── ProgressRail.tsx        # Left navigation (React for interactivity)
├── MicroHeader.tsx         # Sticky header (React)
└── SmartNext.tsx           # End-of-reading panel (React)
```

**Layout Grid (Desktop):**
```
┌─────────────────────────────────────────────────────────────┐
│ MicroHeader (sticky)                                        │
├────┬────────────────────────────────────────────────────────┤
│    │                                                        │
│ R  │                    ReadingColumn                       │
│ a  │                    (max-w-prose)                       │
│ i  │                                                        │
│ l  │                    [Week Content]                      │
│    │                                                        │
│ 52 │                                                        │
│ w  │                    SmartNext (appears at end)          │
│    │                                                        │
└────┴────────────────────────────────────────────────────────┘
```

#### 2.2 Typography System
**Existing (Keep):**
- Font: Cormorant Garamond for reading
- Max width: 40rem (~65 chars)
- Line height: 1.85
- Drop caps on first paragraph

**Enhancements:**
- Ensure consistent measure across all viewports
- Add CSS custom properties for theming
- Maintain existing dark/light mode

#### 2.3 Reading Column Component
```astro
<!-- src/components/reader/ReadingColumn.astro -->
<article class="reading-column max-w-prose mx-auto px-4 md:px-8">
  <header class="mb-8">
    <span class="week-badge">W{week}</span>
    <h1 class="text-3xl font-serif">{title}</h1>
    <p class="text-muted italic">{russianTitle}</p>
  </header>

  <div class="prose prose-lg prose-reading">
    <slot /> <!-- Markdown content -->
  </div>
</article>
```

---

### Phase 3: Navigation Components
**Duration:** Sprint 3
**ISC Coverage:** P01-P18, H01-H10, J01-J12
**Capabilities:** 🤖 designer, 🤖 engineer

#### 3.1 Progress Rail
**Component:** `src/components/reader/ProgressRail.tsx`

**Visual Design:**
```
Month Labels (on hover)
   ↓
┌───┐
│ • │ W01 (completed - filled)
│ • │ W02 (completed)
│ • │ W03 (in-progress - partial)
│ ◦ │ W04 (visited - outlined)
├───┤ ← Month separator
│ ○ │ W05 (unseen - empty)
│ ○ │ W06
│ ● │ W07 ← CURRENT (emphasized)
│ ○ │ W08
├───┤
│   │
...
└───┘
```

**Interaction States:**
- **Hover**: Tooltip with "W## · Title · Month"
- **Click**: Navigate to week
- **Trail**: Faint glow on last 3-5 visited

**Props Interface:**
```typescript
interface ProgressRailProps {
  currentWeek: number;
  progress: Record<number, ReadingProgress>;
  recents: number[];
  onWeekSelect: (week: number) => void;
  onMonthClick: (month: string) => void;
}
```

#### 3.2 Micro-Header
**Component:** `src/components/reader/MicroHeader.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← W16 · The Darling · June                    [Grid] → │
└─────────────────────────────────────────────────────────────┘
  ↑   ↑                      ↑                    ↑     ↑
Prev  Clickable (opens drawer)                  Index  Next
```

**Features:**
- Sticky position
- Clickable main section → Jump Drawer
- Prev/Next arrows (keyboard: ←/→)
- Index button (keyboard: i)
- Single line, minimal height

#### 3.3 Jump Drawer
**Component:** `src/components/reader/JumpDrawer.tsx`

**Layout:**
```
┌─────────────────────────────────────┐
│ ✕                Jump to Week       │
├─────────────────────────────────────┤
│ [Jan] [Feb] [Mar] [Apr] [May] [Jun] │
│ [Jul] [Aug] [Sep] [Oct] [Nov] [Dec] │
├─────────────────────────────────────┤
│ JUNE                                │
│ ┌─────────────────────────────────┐ │
│ │ W22 · The Darling          [●] │ │
│ │ W23 · Afterword            [◦] │ │
│ │ W24 · Voluntary Slavery    [○] │ │
│ │ W25 · The Eagle            [○] │ │
│ │ W26 · Order of the World   [○] │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ RECENT                              │
│ W16, W15, W12, W08, W01             │
└─────────────────────────────────────┘
```

**Features:**
- Opens from header click or rail month click
- Months as filter chips
- Week list with status indicators
- Recents section at bottom
- ESC to close, click-outside to close

---

### Phase 4: Secondary Views
**Duration:** Sprint 4
**ISC Coverage:** C01-C18, N01-N08
**Capabilities:** 🤖 designer, 🤖 engineer

#### 4.1 Calendar Index View
**Page:** `src/pages/index.astro` (replaces home)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│              Circle of Reading                              │
│       [Continue: W16 The Darling →]                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  JANUARY          FEBRUARY         MARCH                    │
│  ┌────┐ ┌────┐   ┌────┐ ┌────┐   ┌────┐ ┌────┐ ┌────┐      │
│  │W01●│ │W02●│   │W05◦│ │W06○│   │W09○│ │W10○│ │W11○│      │
│  └────┘ └────┘   └────┘ └────┘   └────┘ └────┘ └────┘      │
│  ┌────┐ ┌────┐   ┌────┐ ┌────┐   ┌────┐ ┌────┐             │
│  │W03●│ │W04●│   │W07○│ │W08○│   │W12○│ │W13○│             │
│  └────┘ └────┘   └────┘ └────┘   └────┘ └────┘             │
│                                                             │
│  APRIL            MAY              JUNE                     │
│  ...              ...              ...                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Week Card Component:**
```typescript
interface WeekCardProps {
  week: number;
  title: string;
  russianTitle?: string;
  status: 'unseen' | 'visited' | 'in_progress' | 'completed';
  isCurrent?: boolean;
}
```

**Features:**
- 12-month grid (responsive: 3×4 → 2×6 → 1×12)
- "Continue" CTA at top (smart: in-progress > next sequential)
- Week cards with status indicators
- Hover shows Russian title
- Click navigates to reader

#### 4.2 Smart Next Panel
**Component:** `src/components/reader/SmartNext.tsx`

**Appearance Trigger:** Intersection Observer at 95% scroll

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                     What's Next?                            │
│                                                             │
│     [Continue to W17: The Repentant Sinner →]               │
│                                                             │
│     Back to June  ·  Return to W12  ·  Open Index           │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Polish & Accessibility
**Duration:** Sprint 5
**ISC Coverage:** M01-M10, X01-X10, L01-L06
**Capabilities:** 🤖 engineer, ✅ qa_tester

#### 5.1 Responsive Adaptations

| Viewport | Rail | Header | Index | Drawer |
|----------|------|--------|-------|--------|
| Desktop (1024+) | Full | Full | 3×4 grid | Side panel |
| Tablet (768-1023) | Full | Full | 2×6 grid | Side panel |
| Mobile (<768) | Handle | Compact | 1×12 stack | Bottom sheet |

**Mobile Rail Handle:**
```
┌─┐
│▸│ ← Tap to expand rail overlay
└─┘
```

#### 5.2 Keyboard Navigation
| Key | Action |
|-----|--------|
| `←` / `→` | Prev/Next week |
| `j` | Open Jump Drawer |
| `i` | Open Index |
| `Escape` | Close drawer/overlay |
| `Cmd+K` / `/` | Search (existing) |

#### 5.3 Accessibility Checklist
- [ ] ARIA labels on all rail ticks
- [ ] Focus visible on all interactive elements
- [ ] Skip to content link
- [ ] Screen reader announcements for navigation
- [ ] Color contrast WCAG AA
- [ ] No information by color alone

#### 5.4 Deep Linking Routes

| Route | View | Notes |
|-------|------|-------|
| `/` | Calendar Index | Home/overview |
| `/index` | Calendar Index | Alias |
| `/week/W16` | Reader View | Deep link to week |
| `/week/W16#section` | Reader View | Future: internal anchors |

**URL Strategy:**
- Use `/week/W##` pattern (not `/january/slug`)
- Redirects from old routes if needed
- pushState for SPA-like navigation

---

## Technical Architecture

### Component Hierarchy
```
App
├── CalendarIndexView (/)
│   ├── ContinueButton
│   └── MonthGrid
│       └── WeekCard (×52)
│
└── ReaderView (/week/W##)
    ├── MicroHeader
    │   ├── NavArrows
    │   └── IndexButton
    ├── ProgressRail
    │   ├── MonthSegment (×12)
    │   └── WeekTick (×52)
    ├── ReadingColumn
    │   └── [Content]
    ├── SmartNext (conditional)
    └── JumpDrawer (overlay)
        ├── MonthChips
        ├── WeekList
        └── RecentsList
```

### State Flow
```
localStorage ←→ AppState ←→ Components
     ↑               ↓
     └── Hydration on load
                     ↓
              Progress updates → Persist
```

### File Structure (Final)
```
src/
├── content/
│   └── readings/          # Existing 52 weeks + 8 monthly
├── lib/
│   ├── state/
│   │   ├── progress.ts
│   │   ├── recents.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── reading.ts
│   └── utils/
│       └── weeks.ts
├── components/
│   ├── reader/
│   │   ├── ProgressRail.tsx
│   │   ├── MicroHeader.tsx
│   │   ├── JumpDrawer.tsx
│   │   ├── SmartNext.tsx
│   │   └── ReadingColumn.astro
│   ├── index/
│   │   ├── MonthGrid.astro
│   │   ├── WeekCard.tsx
│   │   └── ContinueButton.tsx
│   ├── Navigation.astro     # DEPRECATED
│   ├── ThemeToggle.tsx      # KEEP
│   └── SearchDialog.tsx     # KEEP
├── layouts/
│   ├── BaseLayout.astro     # KEEP (remove audio)
│   └── ReaderLayout.astro   # NEW
├── pages/
│   ├── index.astro          # NEW: Calendar Index
│   └── week/
│       └── [week].astro     # NEW: Dynamic reader
└── styles/
    └── global.css           # Update as needed
```

---

## Migration Strategy

### Content Migration
No content migration needed—translations already use W##-format naming.

**Validation:**
```bash
# Verify all 52 weekly readings have W## in filename
ls translations/**/W*.md | wc -l  # Should be 52
```

### URL Migration
| Old Route | New Route | Action |
|-----------|-----------|--------|
| `/` | `/` | Replace page |
| `/january/01-the-thiefs-son/` | `/week/W01` | Add redirect |
| `/february/05-self-renunciation/` | `/week/W05` | Add redirect |
| ... | ... | ... |
| `/monthly/*` | Keep or deprecate | Decision needed |

**Redirect Strategy:**
```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/january/[slug]': '/week/W[1-4]',
    // ... pattern-based redirects
  }
});
```

---

## Testing Strategy

### Unit Tests
- State machine transitions
- Week utilities (mapping, volume lookup)
- Progress persistence

### Component Tests
- ProgressRail renders 52 ticks
- MicroHeader shows correct week info
- JumpDrawer filters by month
- SmartNext appears at scroll threshold

### Integration Tests
- Navigation flow: Index → Reader → Next
- Progress updates persist across refresh
- Deep links work directly
- Keyboard navigation complete

### Visual Regression
- Desktop/tablet/mobile snapshots
- Light/dark mode each view
- Progress states visualization

---

## Success Metrics (From PRD)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time-to-first-text | <500ms | Lighthouse |
| Completion rate tracking | Works | Manual test |
| Return frequency tracking | Works | Analytics event |
| "Continue" vs browse usage | Tracked | Analytics event |
| Fast wayfinding | <2 interactions | User test |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| State persistence bugs | Medium | High | Thorough localStorage testing |
| Mobile rail UX | Medium | Medium | User testing, iterate |
| Route migration breaks SEO | Low | Medium | Proper redirects + canonical |
| Performance regression | Low | Medium | Lighthouse CI checks |

---

## Timeline Overview

| Sprint | Focus | ISC Rows | Key Deliverables |
|--------|-------|----------|------------------|
| 0 | Prep | — | Branch, schema, utilities |
| 1 | Foundation | A01-A12, T01-T12, D01-D05 | State layer, cleanup |
| 2 | Reader Core | R01-R25 | Layout, typography |
| 3 | Navigation | P01-P18, H01-H10, J01-J12 | Rail, header, drawer |
| 4 | Secondary Views | C01-C18, N01-N08 | Index, Smart Next |
| 5 | Polish | M01-M10, X01-X10, L01-L06 | Responsive, a11y, routes |

---

## Appendix A: Week-to-Month Mapping

| Week Range | Month | Count |
|------------|-------|-------|
| W01-W04 | January | 4 |
| W05-W08 | February | 4 |
| W09-W13 | March | 5 |
| W14-W17 | April | 4 |
| W18-W21 | May | 4 |
| W22-W26 | June | 5 |
| W27-W30 | July | 4 |
| W31-W34 | August | 4 |
| W35-W39 | September | 5 |
| W40-W43 | October | 4 |
| W44-W47 | November | 4 |
| W48-W52 | December | 5 |

---

## Appendix B: Embedded Readings

Some weeks contain multiple pieces under a single НЕДЕЛЬНОЕ header:

| Week | Readings |
|------|----------|
| W07 | Self-Renunciation + A Free Man |
| W08 | Archangel Gabriel + Prayer |
| W10 | Unity + Sea Voyage |
| W18 | Education + From a Letter on Education |
| W22 | The Darling + Afterword |
| W25 | Voluntary Slavery + The Eagle |
| W28 | Order of the World (3 parts) |
| W30 | Repentance + Stones |
| W48 | Women + Sisters |
| W49 | Teaching of the Twelve Apostles + Love One Another |

**UI Handling:** These appear as single weeks in navigation. Internal structure may be exposed in future as intra-week TOC.

---

## Appendix C: Volume Mapping

| Volume | Weeks | Notes |
|--------|-------|-------|
| PSS 41 | W01-W34 | January through August |
| PSS 42 | W35-W52 | September through December |

---

## Decision Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Use React for interactive components | Existing pattern, hydration islands | 2026-01-19 |
| Remove audio functionality | Per PRD, simplify scope | 2026-01-19 |
| `/week/W##` URL pattern | Clean, consistent, week-centric | 2026-01-19 |
| Client-side state only | No backend needed for MVP | 2026-01-19 |

---

*Plan generated via THEALGORITHM at DETERMINED effort level*
*ISC Reference: `ISC-REDESIGN.md` (146 rows)*
