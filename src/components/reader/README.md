# Reader Components

This directory contains the React components for the redesigned Circle of Reading reader interface.

## Components

### MicroHeader.tsx

**Purpose:** Sticky single-line header providing week context and navigation controls.

**Features:**
- Sticky positioning at top of viewport
- Week badge (W01-W52)
- Truncated title and month display
- Navigation arrows (prev/next week)
- Grid icon for calendar index
- Clickable header opens Jump Drawer
- Keyboard shortcuts:
  - `←` Previous week
  - `→` Next week
  - `i` Open index
  - `j` Open jump drawer
- Light/dark mode support
- Fully accessible with ARIA labels
- Hydration-safe (prevents SSR mismatch)

**Props:**
```typescript
interface MicroHeaderProps {
  week: number;              // W## number (1-52)
  title: string;             // English title
  month: string;             // Calendar month
  russianTitle?: string;     // Original Russian title (for ARIA)
  volume?: number;           // PSS volume (41 or 42)
  onHeaderClick: () => void; // Opens jump drawer
  onPrevClick: () => void;   // Navigate to previous week
  onNextClick: () => void;   // Navigate to next week
  onIndexClick: () => void;  // Open calendar index
  hasPrev: boolean;          // Enable/disable prev button
  hasNext: boolean;          // Enable/disable next button
}
```

**Usage Example:**
```tsx
import { MicroHeader } from "@/components/reader/MicroHeader";

<MicroHeader
  week={16}
  title="The Darling"
  month="June"
  russianTitle="Душечка"
  volume={41}
  onHeaderClick={() => setJumpDrawerOpen(true)}
  onPrevClick={() => navigate("/week/W15")}
  onNextClick={() => navigate("/week/W17")}
  onIndexClick={() => navigate("/")}
  hasPrev={true}
  hasNext={true}
/>
```

**Styling:**
- Height: `h-14` (3.5rem)
- Background: `bg-black/80` dark, `bg-white/80` light
- Backdrop blur: `backdrop-blur-sm`
- Border: `border-b border-gray-800` dark, `border-gray-200` light
- Typography: Sans-serif (`font-sans`)
- Week badge: Monochrome with rounded corners
- Focus states: Visible outline with offset

**Responsive Behavior:**
- **Mobile (<640px):** Hides title, shows only week badge and month
- **Tablet (640-768px):** Shows title and month
- **Desktop (768px+):** Shows title, month, and volume

**Accessibility:**
- ARIA labels on all interactive elements
- Focus-visible states on all buttons
- Keyboard navigation support
- Screen reader announcements
- Disabled states clearly indicated

## Styling Notes

All components use the global CSS custom properties defined in `src/styles/global.css`:
- `--color-black`, `--color-white`
- `--color-gray-*` scale (50-900)
- `--font-sans` (Inter)
- `--font-serif` (Cormorant Garamond)

Light mode is activated via `.light` class on document element, using the custom Tailwind variant defined in global.css.

---

### JumpDrawer.tsx

**Purpose:** Navigation drawer for jumping to any week in the 52-week collection.

**Features:**
- Month-based week filtering (12 month toggle chips)
- Visual progress indicators for each week:
  - `●` Completed (white/black)
  - `◦` Visited/In Progress (gray-400)
  - `○` Unseen (gray-700/300)
- Recent weeks section (last 10 accessed)
- Responsive design:
  - Desktop: Slides in from right as side drawer
  - Mobile: Bottom sheet modal (85vh)
- Full keyboard navigation and accessibility
- Focus trap when open
- ESC key and backdrop click to close
- Smooth animations (fadeIn, slideInRight, slideUp)

**Props:**
```typescript
interface JumpDrawerProps {
  isOpen: boolean;              // Controls drawer visibility
  onClose: () => void;          // Callback when drawer closes
  onWeekSelect: (week: number) => void; // Callback when week selected
  weeks: WeekInfo[];            // All 52 weeks with metadata
  currentWeek?: number;         // Currently active week (highlighted)
  initialMonth?: string;        // Optional: Pre-select a month
}

interface WeekInfo {
  week: number;                 // Week number (1-52)
  title: string;                // English title
  russianTitle?: string;        // Original Russian title
  slug: string;                 // URL slug for the week
}
```

**Usage Example:**
```tsx
import { JumpDrawer } from "@/components/reader/JumpDrawer";

<JumpDrawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  onWeekSelect={(week) => navigate(`/readings/${weeks[week].slug}`)}
  weeks={allWeeks}
  currentWeek={16}
  initialMonth="june"
/>
```

**Integration with Reading State:**
The component automatically integrates with `ReadingContext`:
```typescript
const { getProgress, getRecentWeeks } = useReading();
const progress = getProgress(weekNumber); // Get status for each week
const recents = getRecentWeeks();         // Get last 10 accessed weeks
```

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ ✕                Jump to Week       │ ← Header
├─────────────────────────────────────┤
│ [Jan] [Feb] [Mar] [Apr] [May] [Jun] │ ← Month chips
│ [Jul] [Aug] [Sep] [Oct] [Nov] [Dec] │   (horizontal scroll)
├─────────────────────────────────────┤
│ JUNE                                │ ← Selected month label
│ ┌─────────────────────────────────┐ │
│ │ W22 · The Darling          [●] │ │ ← Week rows
│ │ W23 · Afterword            [◦] │ │   (with status)
│ │ W24 · Voluntary Slavery    [○] │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ RECENT                              │ ← Recent weeks
│ W16, W15, W12, W08, W01             │   (chips with status)
└─────────────────────────────────────┘
```

**Keyboard Shortcuts:**
- `ESC` - Close drawer
- `Tab/Shift+Tab` - Navigate (focus trap active)
- `Enter/Space` - Select focused week

**Accessibility:**
- ARIA roles: `dialog`, `tablist`, `tab`, `listbox`, `option`
- Focus trap prevents tabbing outside drawer
- Screen reader labels for status indicators
- Proper aria-selected states

**Responsive Behavior:**
- **Desktop (768px+):** Slides from right, full height, 28rem max width
- **Mobile (<768px):** Bottom sheet, 85vh height, rounded top corners

**Documentation:**
- `JumpDrawer.md` - Full component documentation
- `JumpDrawer.example.tsx` - 6 integration examples
- `JumpDrawer.test.tsx` - Comprehensive test suite

---

## Testing Checklist

### MicroHeader
- [ ] Component renders without hydration errors
- [ ] Prev/Next buttons disabled appropriately
- [ ] Keyboard shortcuts work (←, →, i, j)
- [ ] Click handlers fire correctly
- [ ] Light/dark mode switching works
- [ ] Responsive layout adapts at breakpoints
- [ ] Focus states visible and correct
- [ ] ARIA labels present and descriptive
- [ ] Week badge formats correctly (W01, W16, W52)
- [ ] Title truncates on overflow

### JumpDrawer
- [ ] Drawer opens/closes correctly
- [ ] Month selection filters weeks properly
- [ ] Status indicators show correct state
- [ ] Recent weeks section displays
- [ ] ESC key closes drawer
- [ ] Backdrop click closes drawer
- [ ] Focus trap prevents tabbing outside
- [ ] Week selection triggers callback
- [ ] Mobile bottom sheet renders correctly
- [ ] Desktop side drawer renders correctly
- [ ] Animations smooth and performant
- [ ] Russian titles display when available
