# 🎯 IDEAL STATE CRITERIA — Circle of Reading Redesign

**Request:** Complete redesign of Tolstoy Weekly Readings web reader with year navigation
**Effort:** DETERMINED | **Phase:** THINK | **Iteration:** 1
**Created:** 2026-01-19

---

## Mission Statement

A reading-first web experience where navigation communicates where the reader is, where they've been, and where they can go next, without competing with the text.

---

## ISC Categories

| Category | Rows | Focus |
|----------|------|-------|
| **ARCHITECTURE** | A01-A12 | Data layer, state management, routing |
| **READER VIEW** | R01-R25 | Main reading experience |
| **PROGRESS RAIL** | P01-P18 | Left navigation rail |
| **MICRO-HEADER** | H01-H10 | Sticky context header |
| **JUMP DRAWER** | J01-J12 | Month/week navigation drawer |
| **SMART NEXT** | N01-N08 | End-of-reading panel |
| **CALENDAR INDEX** | C01-C18 | 12-month overview view |
| **PROGRESS TRACKING** | T01-T12 | State persistence |
| **RESPONSIVE** | M01-M10 | Mobile/tablet adaptation |
| **ACCESSIBILITY** | X01-X10 | A11y requirements |
| **DEEP LINKING** | L01-L06 | URL routing |
| **REMOVAL** | D01-D05 | Features to remove |

**Total ISC Rows: 146**

---

## ARCHITECTURE (A01-A12)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| A01 | Content schema updated: W## number, English title, Russian title, month, volume (41/42), type | EXPLICIT | grep | ⏳ PENDING |
| A02 | Week-to-month mapping defined (W01-W04=Jan, W05-W08=Feb, etc.) | EXPLICIT | test | ⏳ PENDING |
| A03 | Volume mapping: V41=W01-W34, V42=W35-W52 | EXPLICIT | test | ⏳ PENDING |
| A04 | Reader state interface: unseen, visited, in-progress, completed per week | EXPLICIT | test | ⏳ PENDING |
| A05 | Recents state: last 10 weeks opened (ordered) | EXPLICIT | test | ⏳ PENDING |
| A06 | Current state: last opened week + scroll position | EXPLICIT | test | ⏳ PENDING |
| A07 | State persisted to localStorage | EXPLICIT | browser | ⏳ PENDING |
| A08 | State loaded on app initialization | IMPLICIT | browser | ⏳ PENDING |
| A09 | Two primary routes: Reader View (default), Calendar Index View | EXPLICIT | browser | ⏳ PENDING |
| A10 | Week data fetched from content collection efficiently | IMPLICIT | test | ⏳ PENDING |
| A11 | No server-side state—all progress client-side | INFERRED | grep | ⏳ PENDING |
| A12 | TypeScript strict mode for all new components | INFERRED | lint | ⏳ PENDING |

---

## READER VIEW (R01-R25)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| R01 | Text occupies most of viewport—reading-first layout | EXPLICIT | browser | ⏳ PENDING |
| R02 | Max line length enforced (65-75 char measure, ~40rem) | EXPLICIT | browser | ⏳ PENDING |
| R03 | Generous margins for comfortable reading | EXPLICIT | browser | ⏳ PENDING |
| R04 | Typography optimized for long-form reading (Cormorant Garamond) | EXPLICIT | browser | ⏳ PENDING |
| R05 | Strong typographic hierarchy: title, subtitle, body, blockquotes | EXPLICIT | browser | ⏳ PENDING |
| R06 | Left progress rail always visible (desktop/tablet) | EXPLICIT | browser | ⏳ PENDING |
| R07 | Left progress rail collapses to minimal handle (mobile) | EXPLICIT | browser | ⏳ PENDING |
| R08 | Micro-header sticky at top, single line | EXPLICIT | browser | ⏳ PENDING |
| R09 | Week number + title displayed prominently | EXPLICIT | browser | ⏳ PENDING |
| R10 | Russian title available (secondary, tooltip, or subtitle) | EXPLICIT | browser | ⏳ PENDING |
| R11 | Month context always visible in header | EXPLICIT | browser | ⏳ PENDING |
| R12 | Volume indicator available (optional/info popover) | EXPLICIT | browser | ⏳ PENDING |
| R13 | Jump Drawer opens on micro-header click | EXPLICIT | browser | ⏳ PENDING |
| R14 | Prev/Next arrows subtle, text-adjacent in header | EXPLICIT | browser | ⏳ PENDING |
| R15 | Index button in header opens Calendar Index | EXPLICIT | browser | ⏳ PENDING |
| R16 | Smart Next panel appears at end of reading | EXPLICIT | browser | ⏳ PENDING |
| R17 | Navigation never feels heavier than reading (principle 1) | EXPLICIT | manual | ⏳ PENDING |
| R18 | Week/month/year context recoverable in one gesture (principle 2) | EXPLICIT | browser | ⏳ PENDING |
| R19 | No cognitive load—intuitive UI (principle 3) | EXPLICIT | manual | ⏳ PENDING |
| R20 | Progress indicators subtle, not gamified (principle 4) | EXPLICIT | browser | ⏳ PENDING |
| R21 | Jump anywhere in <2 interactions (principle 5) | EXPLICIT | browser | ⏳ PENDING |
| R22 | Dark mode support with high contrast | EXPLICIT | browser | ⏳ PENDING |
| R23 | Light mode support with high contrast | EXPLICIT | browser | ⏳ PENDING |
| R24 | Increased font size doesn't break layout | EXPLICIT | browser | ⏳ PENDING |
| R25 | Smooth scroll behavior throughout | IMPLICIT | browser | ⏳ PENDING |

---

## PROGRESS RAIL (P01-P18)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| P01 | Narrow vertical rail aligned to left edge | EXPLICIT | browser | ⏳ PENDING |
| P02 | Represents W01-W52 as ticks | EXPLICIT | browser | ⏳ PENDING |
| P03 | Ticks grouped by month segments | EXPLICIT | browser | ⏳ PENDING |
| P04 | Subtle month separators between segments | EXPLICIT | browser | ⏳ PENDING |
| P05 | Month label appears on hover/tap of segment | EXPLICIT | browser | ⏳ PENDING |
| P06 | Current week tick emphasized (stronger contrast/weight) | EXPLICIT | browser | ⏳ PENDING |
| P07 | Visited weeks: lightly filled or outlined tick | EXPLICIT | browser | ⏳ PENDING |
| P08 | In-progress weeks: partial fill or notch indicator | EXPLICIT | browser | ⏳ PENDING |
| P09 | Completed weeks: filled tick | EXPLICIT | browser | ⏳ PENDING |
| P10 | Unseen weeks: empty/minimal tick | EXPLICIT | browser | ⏳ PENDING |
| P11 | Hover on tick (desktop): tooltip shows W## Title, month | EXPLICIT | browser | ⏳ PENDING |
| P12 | Click a tick: navigates to that week's Reader View | EXPLICIT | browser | ⏳ PENDING |
| P13 | Click month segment label: opens Jump Drawer filtered to month | EXPLICIT | browser | ⏳ PENDING |
| P14 | Faint "trail" highlight on last 3-5 visited ticks | EXPLICIT | browser | ⏳ PENDING |
| P15 | Trail distinct from completion indicator | EXPLICIT | browser | ⏳ PENDING |
| P16 | Rail perceivable without hover (mobile/touch) | EXPLICIT | browser | ⏳ PENDING |
| P17 | Rail works in both light and dark mode | IMPLICIT | browser | ⏳ PENDING |
| P18 | Smooth transitions on state changes | IMPLICIT | browser | ⏳ PENDING |

---

## MICRO-HEADER (H01-H10)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| H01 | Always visible, sticky, single line | EXPLICIT | browser | ⏳ PENDING |
| H02 | Displays: W## · Title · Month | EXPLICIT | browser | ⏳ PENDING |
| H03 | Volume indicator optional (behind info popover or secondary) | EXPLICIT | browser | ⏳ PENDING |
| H04 | Clickable—opens Jump Drawer | EXPLICIT | browser | ⏳ PENDING |
| H05 | "Index" button/icon opens Calendar Index | EXPLICIT | browser | ⏳ PENDING |
| H06 | Prev/Next arrows for sequential navigation | EXPLICIT | browser | ⏳ PENDING |
| H07 | Arrows subtle, not visually heavy | EXPLICIT | browser | ⏳ PENDING |
| H08 | Keyboard shortcut for prev/next (arrow keys) | EXPLICIT | browser | ⏳ PENDING |
| H09 | Breadcrumb behavior on click (jump affordance) | EXPLICIT | browser | ⏳ PENDING |
| H10 | Minimal visual footprint—doesn't compete with text | EXPLICIT | browser | ⏳ PENDING |

---

## JUMP DRAWER (J01-J12)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| J01 | Opens from micro-header click | EXPLICIT | browser | ⏳ PENDING |
| J02 | Opens from rail month label click (filtered to that month) | EXPLICIT | browser | ⏳ PENDING |
| J03 | Month list (Jan-Dec) with current month highlighted | EXPLICIT | browser | ⏳ PENDING |
| J04 | Weeks for selected month displayed | EXPLICIT | browser | ⏳ PENDING |
| J05 | Each week row: W##, Title (English), status indicator | EXPLICIT | browser | ⏳ PENDING |
| J06 | Russian title secondary (tooltip or smaller text) | EXPLICIT | browser | ⏳ PENDING |
| J07 | Volume badge optional, very subtle | EXPLICIT | browser | ⏳ PENDING |
| J08 | Recents section at bottom: last 5-10 opened weeks | EXPLICIT | browser | ⏳ PENDING |
| J09 | Closes on selection—returns to reading immediately | EXPLICIT | browser | ⏳ PENDING |
| J10 | Click-outside closes drawer | IMPLICIT | browser | ⏳ PENDING |
| J11 | Keyboard: Escape closes drawer | IMPLICIT | browser | ⏳ PENDING |
| J12 | Lightweight visual—doesn't feel like leaving the reader | EXPLICIT | browser | ⏳ PENDING |

---

## SMART NEXT PANEL (N01-N08)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| N01 | Appears when reader reaches end (or near-end threshold ~95%) | EXPLICIT | browser | ⏳ PENDING |
| N02 | Primary CTA: "Next week: W## Title" | EXPLICIT | browser | ⏳ PENDING |
| N03 | Secondary action: "Back to this month" | EXPLICIT | browser | ⏳ PENDING |
| N04 | Secondary action: "Return to last visited" | EXPLICIT | browser | ⏳ PENDING |
| N05 | Secondary action: "Open Index" | EXPLICIT | browser | ⏳ PENDING |
| N06 | Optional teaser: single line excerpt or descriptive subtitle | EXPLICIT | browser | ⏳ PENDING |
| N07 | Encourages continuity while respecting non-linear browsing | EXPLICIT | manual | ⏳ PENDING |
| N08 | Smooth appearance animation | IMPLICIT | browser | ⏳ PENDING |

---

## CALENDAR INDEX VIEW (C01-C18)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| C01 | Separate view (not overlay)—accessible via /index URL | EXPLICIT | browser | ⏳ PENDING |
| C02 | 12-month grid layout (3x4 or responsive) | EXPLICIT | browser | ⏳ PENDING |
| C03 | Each month section contains week cards for that month | EXPLICIT | browser | ⏳ PENDING |
| C04 | Each week card shows: W##, short title (English) | EXPLICIT | browser | ⏳ PENDING |
| C05 | Each week card shows status indicator (unseen/visited/in-progress/completed) | EXPLICIT | browser | ⏳ PENDING |
| C06 | Status markers match what rail shows | EXPLICIT | browser | ⏳ PENDING |
| C07 | Hover/tap on card shows Russian title | EXPLICIT | browser | ⏳ PENDING |
| C08 | Hover/tap optionally shows volume info | EXPLICIT | browser | ⏳ PENDING |
| C09 | Click week card: opens Reader View at that week | EXPLICIT | browser | ⏳ PENDING |
| C10 | "Continue" button at top of index | EXPLICIT | browser | ⏳ PENDING |
| C11 | If in-progress week exists: "Continue W##…" | EXPLICIT | browser | ⏳ PENDING |
| C12 | Else: "Continue sequentially" (next unread after last completed) | EXPLICIT | browser | ⏳ PENDING |
| C13 | Month header click: scrolls that month into view | EXPLICIT | browser | ⏳ PENDING |
| C14 | Current week highlighted | EXPLICIT | browser | ⏳ PENDING |
| C15 | User-facing 12-month structure always (not 8 source files) | EXPLICIT | grep | ⏳ PENDING |
| C16 | "Back to reading" affordance returns to last position | EXPLICIT | browser | ⏳ PENDING |
| C17 | Minimal chrome—overview feels satisfying, not cluttered | EXPLICIT | browser | ⏳ PENDING |
| C18 | Recents section optional | EXPLICIT | browser | ⏳ PENDING |

---

## PROGRESS TRACKING (T01-T12)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| T01 | Mark Visited when week is opened | EXPLICIT | browser | ⏳ PENDING |
| T02 | Mark In-progress when scrolled past 20% or stayed Y seconds | EXPLICIT | browser | ⏳ PENDING |
| T03 | Mark Completed when reached end or scrolled past 95% | EXPLICIT | browser | ⏳ PENDING |
| T04 | Save reading position to resume | EXPLICIT | browser | ⏳ PENDING |
| T05 | Position restored on return to in-progress week | EXPLICIT | browser | ⏳ PENDING |
| T06 | "Mark as complete" option available (optional manual override) | EXPLICIT | browser | ⏳ PENDING |
| T07 | Recents list maintained: last 10 opened | EXPLICIT | browser | ⏳ PENDING |
| T08 | State survives page refresh | EXPLICIT | browser | ⏳ PENDING |
| T09 | State survives browser close/reopen | EXPLICIT | browser | ⏳ PENDING |
| T10 | State machine: UNSEEN → VISITED → IN_PROGRESS → COMPLETED | EXPLICIT | test | ⏳ PENDING |
| T11 | Transition only forward (completed stays completed) | IMPLICIT | test | ⏳ PENDING |
| T12 | No analytics/gamification of progress (ambient only) | EXPLICIT | grep | ⏳ PENDING |

---

## RESPONSIVE DESIGN (M01-M10)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| M01 | Desktop: full progress rail visible | EXPLICIT | browser | ⏳ PENDING |
| M02 | Tablet: full progress rail visible, responsive grid on index | EXPLICIT | browser | ⏳ PENDING |
| M03 | Mobile: progress rail collapses to minimal handle | EXPLICIT | browser | ⏳ PENDING |
| M04 | Mobile rail handle expands on tap | INFERRED | browser | ⏳ PENDING |
| M05 | Mobile micro-header optimized (abbreviated if needed) | IMPLICIT | browser | ⏳ PENDING |
| M06 | Calendar Index responsive: 3x4 → 2x6 → 1x12 stacked | INFERRED | browser | ⏳ PENDING |
| M07 | Touch targets minimum 44px | IMPLICIT | browser | ⏳ PENDING |
| M08 | Jump Drawer full-screen or bottom sheet on mobile | INFERRED | browser | ⏳ PENDING |
| M09 | No horizontal scroll on any viewport | IMPLICIT | browser | ⏳ PENDING |
| M10 | Breakpoints: sm (640px), md (768px), lg (1024px) | INFERRED | grep | ⏳ PENDING |

---

## ACCESSIBILITY (X01-X10)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| X01 | Keyboard navigation: arrow keys for prev/next week | EXPLICIT | browser | ⏳ PENDING |
| X02 | Keyboard: open/close drawer (shortcut) | EXPLICIT | browser | ⏳ PENDING |
| X03 | Keyboard: open index (shortcut) | EXPLICIT | browser | ⏳ PENDING |
| X04 | Focus states visible on all interactive elements | IMPLICIT | browser | ⏳ PENDING |
| X05 | ARIA labels on progress rail ticks | IMPLICIT | grep | ⏳ PENDING |
| X06 | Tooltips have accessible equivalents (focus states) | EXPLICIT | browser | ⏳ PENDING |
| X07 | Screen reader announces current reading context | IMPLICIT | manual | ⏳ PENDING |
| X08 | Color contrast meets WCAG AA | IMPLICIT | lint | ⏳ PENDING |
| X09 | No information conveyed by color alone | IMPLICIT | browser | ⏳ PENDING |
| X10 | Skip to content link available | IMPLICIT | browser | ⏳ PENDING |

---

## DEEP LINKING (L01-L06)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| L01 | Each week has stable URL: /week/W16 (or similar) | EXPLICIT | browser | ⏳ PENDING |
| L02 | Calendar Index has stable URL: /index | EXPLICIT | browser | ⏳ PENDING |
| L03 | Direct link to week works without prior navigation | EXPLICIT | browser | ⏳ PENDING |
| L04 | URL updates on navigation (pushState) | IMPLICIT | browser | ⏳ PENDING |
| L05 | Back button works correctly | IMPLICIT | browser | ⏳ PENDING |
| L06 | Optional anchors for internal sections (future) | EXPLICIT | n/a | ⏳ PENDING |

---

## REMOVAL / DEPRECATION (D01-D05)

| # | What Ideal Looks Like | Source | Verify | Status |
|---|----------------------|--------|--------|--------|
| D01 | ElevenLabs audio player removed | EXPLICIT | grep | ⏳ PENDING |
| D02 | AudioNative.tsx component removed | EXPLICIT | grep | ⏳ PENDING |
| D03 | AudioNativeEmbed.astro removed | EXPLICIT | grep | ⏳ PENDING |
| D04 | Old month-based navigation replaced | EXPLICIT | browser | ⏳ PENDING |
| D05 | Old home page grid layout replaced | EXPLICIT | browser | ⏳ PENDING |

---

## Summary Statistics

| Status | Count |
|--------|-------|
| ⏳ PENDING | 146 |
| 🔄 ACTIVE | 0 |
| ✅ DONE | 0 |
| 🚫 BLOCKED | 0 |

---

## Implementation Phases (Preview)

### Phase 1: Foundation
- Architecture (A01-A12)
- Progress Tracking core (T01-T11)
- Removal of old features (D01-D05)

### Phase 2: Reader View Core
- Reader layout (R01-R06)
- Typography & theming (R04-R05, R22-R25)

### Phase 3: Navigation Components
- Progress Rail (P01-P18)
- Micro-header (H01-H10)
- Jump Drawer (J01-J12)

### Phase 4: Secondary Views
- Calendar Index (C01-C18)
- Smart Next Panel (N01-N08)

### Phase 5: Polish
- Responsive adaptations (M01-M10)
- Accessibility (X01-X10)
- Deep Linking (L01-L06)

---

*ISC created via THEALGORITHM - DETERMINED effort level*
