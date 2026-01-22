# JumpDrawer Component

Navigation drawer component for Circle of Reading that allows users to jump to any week in the collection.

## Features

- **Month-based filtering**: Toggle between months to view weeks in each month
- **Status indicators**: Visual progress tracking for each week (completed ●, visited ◦, unseen ○)
- **Recent weeks**: Quick access to the 10 most recently viewed weeks
- **Responsive design**:
  - Desktop: Slides in from right as side drawer
  - Mobile: Bottom sheet modal
- **Accessibility**: Full ARIA support, focus trap, keyboard navigation
- **Animations**: Smooth entrance/exit transitions

## Props

```typescript
interface JumpDrawerProps {
  isOpen: boolean;              // Controls drawer visibility
  onClose: () => void;          // Callback when drawer closes
  onWeekSelect: (week: number) => void; // Callback when week is selected
  weeks: WeekInfo[];            // All 52 weeks with metadata
  currentWeek?: number;         // Currently active week (highlighted)
  initialMonth?: string;        // Optional: Pre-select a month
}

interface WeekInfo {
  week: number;                 // Week number (1-52)
  title: string;                // English title
  russianTitle?: string;        // Original Russian title (optional)
  slug: string;                 // URL slug for the week
}
```

## Usage Example

```tsx
import { useState } from 'react';
import { JumpDrawer } from './components/reader/JumpDrawer';
import { useReading } from './lib/state/ReadingContext';

function ReaderPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getCurrentWeek } = useReading();

  // Fetch all weeks data from your content source
  const allWeeks: WeekInfo[] = [
    { week: 1, title: "What is Religion?", slug: "01-what-is-religion" },
    { week: 2, title: "Faith", russianTitle: "Вера", slug: "02-faith" },
    // ... all 52 weeks
  ];

  const handleWeekSelect = (week: number) => {
    // Navigate to the selected week
    window.location.href = `/week/${week}`;
  };

  return (
    <>
      <button onClick={() => setIsDrawerOpen(true)}>
        Jump to Week
      </button>

      <JumpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onWeekSelect={handleWeekSelect}
        weeks={allWeeks}
        currentWeek={getCurrentWeek() || undefined}
      />
    </>
  );
}
```

## Opening from Month Click

You can pre-select a specific month when opening the drawer:

```tsx
function MonthButton({ month }: { month: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>();

  const handleMonthClick = () => {
    setSelectedMonth(month);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <button onClick={handleMonthClick}>
        {month}
      </button>

      <JumpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onWeekSelect={handleWeekSelect}
        weeks={allWeeks}
        initialMonth={selectedMonth}
      />
    </>
  );
}
```

## Keyboard Shortcuts

- **ESC**: Close drawer
- **Tab/Shift+Tab**: Navigate through focusable elements (focus trap active)
- **Enter/Space**: Select highlighted week

## Integration with ReadingContext

The component automatically integrates with the Circle of Reading state management:

```typescript
const { getProgress, getRecentWeeks } = useReading();

// Get progress for each week
const progress = getProgress(weekNumber);
// Returns: { week: number, state: ReadingState, scrollPosition: number, lastUpdated: string }

// Get recent weeks
const recentWeeks = getRecentWeeks();
// Returns: number[] - Array of week numbers, most recent first
```

## Status Indicators

- **● (Filled circle)**: Week completed
- **◦ (Open circle with dot)**: Week visited or in progress
- **○ (Hollow circle)**: Week not yet seen

Colors:
- Completed: White (dark mode) / Black (light mode)
- Visited: Gray-400
- Unseen: Gray-700 (dark mode) / Gray-300 (light mode)

## Styling

The component uses Tailwind CSS and matches the Circle of Reading design system:

- **Dark mode**: Black background with white/gray text
- **Light mode**: White background with black/gray text
- **Fonts**: Sans-serif for UI elements, Serif for titles
- **Animations**: Smooth transitions using CSS keyframes

## Accessibility

- **ARIA roles**: `dialog`, `tablist`, `tab`, `listbox`, `option`
- **ARIA labels**: All interactive elements properly labeled
- **Focus management**: Focus trap when drawer is open
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Status indicators with appropriate labels

## Mobile Considerations

On mobile devices (max-width: 768px):
- Drawer becomes a bottom sheet covering 85% of viewport height
- Rounded top corners for sheet appearance
- Touch-optimized tap targets
- Horizontal scroll for month selector with thin scrollbar

## Performance Notes

- Component only renders when `isOpen` is true
- Uses React hooks for efficient state management
- Prevents body scroll when drawer is open
- Event listeners cleaned up on unmount

## Dependencies

- React 19+
- Tailwind CSS 4+
- Circle of Reading state management (`useReading` hook)
- Week utilities (`formatWeekNumber`, `MONTH_TO_WEEKS`)

## File Location

```
src/
└── components/
    └── reader/
        ├── JumpDrawer.tsx    ← Component implementation
        └── JumpDrawer.md     ← This documentation
```
