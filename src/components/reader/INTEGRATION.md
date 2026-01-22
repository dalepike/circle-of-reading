# MicroHeader Integration Guide

## Overview

This guide explains how to integrate the MicroHeader component into the Circle of Reading redesign.

## File Location

```
src/components/reader/MicroHeader.tsx
```

## Dependencies

- React 19 (already installed)
- Tailwind CSS v4 (already installed)
- No additional dependencies required

## Integration Steps

### Step 1: Import the Component

In your reader layout or page component:

```tsx
import { MicroHeader } from "@/components/reader/MicroHeader";
```

### Step 2: Set Up State and Handlers

```tsx
// Example in an Astro page with React island
import { useState } from "react";

const [jumpDrawerOpen, setJumpDrawerOpen] = useState(false);

// Navigation handlers
const handlePrevWeek = () => {
  // Navigate to previous week
  window.location.href = `/week/W${(week - 1).toString().padStart(2, "0")}`;
};

const handleNextWeek = () => {
  // Navigate to next week
  window.location.href = `/week/W${(week + 1).toString().padStart(2, "0")}`;
};

const handleIndex = () => {
  window.location.href = "/";
};

const handleJumpDrawer = () => {
  setJumpDrawerOpen(true);
};
```

### Step 3: Render the Component

```tsx
<MicroHeader
  week={week}
  title={title}
  month={month}
  russianTitle={russianTitle}
  volume={volume}
  onHeaderClick={handleJumpDrawer}
  onPrevClick={handlePrevWeek}
  onNextClick={handleNextWeek}
  onIndexClick={handleIndex}
  hasPrev={week > 1}
  hasNext={week < 52}
/>
```

## Astro Integration Pattern

Since Circle of Reading uses Astro with React islands, here's the recommended pattern:

### Option A: React Island in Layout

```astro
---
// src/layouts/ReaderLayout.astro
import { MicroHeader } from "@/components/reader/MicroHeader";

interface Props {
  week: number;
  title: string;
  month: string;
  russianTitle?: string;
  volume?: number;
}

const { week, title, month, russianTitle, volume } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
  </head>
  <body>
    <MicroHeader
      client:load
      week={week}
      title={title}
      month={month}
      russianTitle={russianTitle}
      volume={volume}
      onHeaderClick={() => {
        // Will be defined in client-side script
        window.dispatchEvent(new CustomEvent("open-jump-drawer"));
      }}
      onPrevClick={() => {
        window.location.href = `/week/W${(week - 1).toString().padStart(2, "0")}`;
      }}
      onNextClick={() => {
        window.location.href = `/week/W${(week + 1).toString().padStart(2, "0")}`;
      }}
      onIndexClick={() => {
        window.location.href = "/";
      }}
      hasPrev={week > 1}
      hasNext={week < 52}
    />

    <slot />
  </body>
</html>
```

### Option B: Wrapper Component for Client-Side Logic

Create a wrapper that handles all the client-side logic:

```tsx
// src/components/reader/MicroHeaderWrapper.tsx
import { useState } from "react";
import { MicroHeader } from "./MicroHeader";

interface MicroHeaderWrapperProps {
  week: number;
  title: string;
  month: string;
  russianTitle?: string;
  volume?: number;
}

export function MicroHeaderWrapper({
  week,
  title,
  month,
  russianTitle,
  volume,
}: MicroHeaderWrapperProps) {
  const [jumpDrawerOpen, setJumpDrawerOpen] = useState(false);

  const handleNavigate = (weekNumber: number) => {
    window.location.href = `/week/W${weekNumber.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <MicroHeader
        week={week}
        title={title}
        month={month}
        russianTitle={russianTitle}
        volume={volume}
        onHeaderClick={() => setJumpDrawerOpen(true)}
        onPrevClick={() => handleNavigate(week - 1)}
        onNextClick={() => handleNavigate(week + 1)}
        onIndexClick={() => (window.location.href = "/")}
        hasPrev={week > 1}
        hasNext={week < 52}
      />

      {/* Jump Drawer will be added in Phase 3 */}
      {jumpDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <button onClick={() => setJumpDrawerOpen(false)}>
            Close Jump Drawer
          </button>
        </div>
      )}
    </>
  );
}
```

Then in your Astro layout:

```astro
---
import { MicroHeaderWrapper } from "@/components/reader/MicroHeaderWrapper";
---

<MicroHeaderWrapper
  client:load
  week={week}
  title={title}
  month={month}
  russianTitle={russianTitle}
  volume={volume}
/>
```

## Keyboard Shortcuts

The MicroHeader implements keyboard navigation:

| Key | Action |
|-----|--------|
| `←` | Previous week (if available) |
| `→` | Next week (if available) |
| `i` | Open index |
| `j` | Open jump drawer |

**Note:** Keyboard shortcuts are automatically disabled when the user is typing in an input or textarea.

## Styling Customization

The component uses Tailwind classes and respects the global theme defined in `src/styles/global.css`.

### Color Variables Used

- `--color-black` / `--color-white`
- `--color-gray-800`, `--color-gray-600`, `--color-gray-500`, `--color-gray-400`, `--color-gray-200`
- `--font-sans` (Inter)

### Custom Styling

To customize the appearance, you can:

1. Modify the global CSS variables in `src/styles/global.css`
2. Wrap the component in a container with custom classes
3. Override specific Tailwind classes (not recommended)

## Responsive Behavior

### Mobile (<640px)
- Hides the reading title
- Shows only week badge and month
- Compact layout

### Tablet (640px-768px)
- Shows week badge, title, and month
- Hides volume indicator

### Desktop (768px+)
- Shows all elements including volume
- Full spacing and padding

## Accessibility Features

- **ARIA Labels:** All interactive elements have descriptive labels
- **Focus Management:** Visible focus states on all buttons
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader Support:** Semantic HTML and proper ARIA attributes
- **Disabled States:** Clear visual and functional indication

## Testing Checklist

- [ ] Component renders on page load
- [ ] No hydration errors in browser console
- [ ] Prev button disabled on W01
- [ ] Next button disabled on W52
- [ ] Click handlers trigger correctly
- [ ] Keyboard shortcuts work (←, →, i, j)
- [ ] Light/dark mode toggle affects header
- [ ] Responsive layout adapts at breakpoints
- [ ] Focus states visible on tab navigation
- [ ] Week badge formats correctly (W01-W52)
- [ ] Long titles truncate with ellipsis

## Known Issues & Limitations

1. **Navigation:** Currently uses `window.location.href` for navigation. Consider using Astro's View Transitions API for smoother transitions.

2. **Jump Drawer:** The jump drawer component is not yet implemented. The `onHeaderClick` handler should be updated when JumpDrawer.tsx is created.

3. **State Persistence:** Current implementation doesn't persist navigation state. Consider adding localStorage or session storage for better UX.

## Next Steps

After MicroHeader implementation, the following components should be created:

1. **ProgressRail.tsx** (Phase 3) - Left navigation rail with 52 week ticks
2. **JumpDrawer.tsx** (Phase 3) - Month-filtered week selector
3. **SmartNext.tsx** (Phase 4) - End-of-reading panel
4. **ReadingColumn.astro** (Phase 2) - Main content container

See `PROJECT-PLAN-REDESIGN.md` for the complete implementation roadmap.

## Support

For issues or questions about this component:
- Review the examples in `MicroHeader.example.tsx`
- Check the component documentation in `README.md`
- Reference the project plan in `PROJECT-PLAN-REDESIGN.md`
