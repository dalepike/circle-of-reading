# MicroHeader Quick Reference

## Import

```tsx
import { MicroHeader } from "@/components/reader/MicroHeader";
// or
import { MicroHeader } from "@/components/reader";
```

## Basic Usage

```tsx
<MicroHeader
  week={16}
  title="The Darling"
  month="June"
  russianTitle="Душечка"  // optional
  volume={41}              // optional
  onHeaderClick={() => setJumpDrawerOpen(true)}
  onPrevClick={() => navigate("/week/W15")}
  onNextClick={() => navigate("/week/W17")}
  onIndexClick={() => navigate("/")}
  hasPrev={week > 1}
  hasNext={week < 52}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `week` | `number` | ✅ | Week number (1-52) |
| `title` | `string` | ✅ | English title |
| `month` | `string` | ✅ | Calendar month |
| `russianTitle` | `string` | ❌ | Original Russian title |
| `volume` | `number` | ❌ | PSS volume (41 or 42) |
| `onHeaderClick` | `() => void` | ✅ | Opens jump drawer |
| `onPrevClick` | `() => void` | ✅ | Navigate to previous week |
| `onNextClick` | `() => void` | ✅ | Navigate to next week |
| `onIndexClick` | `() => void` | ✅ | Open calendar index |
| `hasPrev` | `boolean` | ✅ | Enable prev button |
| `hasNext` | `boolean` | ✅ | Enable next button |

## Keyboard Shortcuts

| Key | Action | Condition |
|-----|--------|-----------|
| `←` | Previous week | `hasPrev === true` |
| `→` | Next week | `hasNext === true` |
| `i` | Open index | Always |
| `j` | Open jump drawer | Always |

**Note:** Shortcuts disabled when typing in input/textarea

## Responsive Breakpoints

| Viewport | Visible Elements |
|----------|------------------|
| Mobile (<640px) | Week badge, month |
| Tablet (640-768px) | Week badge, title, month |
| Desktop (768px+) | Week badge, title, month, volume |

## Styling

### Colors (Dark Mode)
- Background: `bg-black/80`
- Border: `border-gray-800`
- Text: `text-white`
- Muted: `text-gray-400`
- Badge: `bg-gray-800`

### Colors (Light Mode)
- Background: `bg-white/80` (via `.light` class)
- Border: `border-gray-200`
- Text: `text-black`
- Muted: `text-gray-600`
- Badge: `bg-gray-200`

### Layout
- Height: `h-14` (3.5rem)
- Position: `sticky top-0`
- Z-index: `z-50`
- Backdrop: `backdrop-blur-sm`

## Common Patterns

### First Week (W01)

```tsx
<MicroHeader
  week={1}
  title="The Thief's Son"
  month="January"
  hasPrev={false}  // ← Disable prev
  hasNext={true}
  {...otherProps}
/>
```

### Last Week (W52)

```tsx
<MicroHeader
  week={52}
  title="Love One Another"
  month="December"
  hasPrev={true}
  hasNext={false}  // ← Disable next
  {...otherProps}
/>
```

### With Router (Astro)

```tsx
const handleNavigate = (week: number) => {
  window.location.href = `/week/W${week.toString().padStart(2, '0')}`;
};

<MicroHeader
  onPrevClick={() => handleNavigate(week - 1)}
  onNextClick={() => handleNavigate(week + 1)}
  onIndexClick={() => window.location.href = '/'}
  {...otherProps}
/>
```

### With State Management

```tsx
const [currentWeek, setCurrentWeek] = useState(16);

<MicroHeader
  week={currentWeek}
  onPrevClick={() => setCurrentWeek(prev => prev - 1)}
  onNextClick={() => setCurrentWeek(prev => prev + 1)}
  hasPrev={currentWeek > 1}
  hasNext={currentWeek < 52}
  {...otherProps}
/>
```

## Accessibility

- All buttons have ARIA labels
- Focus states visible (outline + offset)
- Keyboard navigation support
- Screen reader friendly
- Disabled states announced

## Files

- **Component:** `src/components/reader/MicroHeader.tsx`
- **Types:** Defined inline (no separate file)
- **Examples:** `MicroHeader.example.tsx`
- **Docs:** `README.md`, `INTEGRATION.md`
- **Tests:** `MicroHeader.test.md`

## Integration with Other Components

### ProgressRail
- MicroHeader complements the left rail navigation
- Both use week-based navigation
- Should stay synchronized

### JumpDrawer
- Opened by clicking header or pressing `j`
- Pass `onHeaderClick` handler to open drawer
- Drawer should close on week selection

### SmartNext
- Different navigation pattern (end of content)
- MicroHeader for persistent navigation
- SmartNext for contextual next action

## Troubleshooting

### Hydration Errors
- Component uses `mounted` state to prevent mismatch
- Ensure React 19 is installed
- Check `client:load` directive in Astro

### Keyboard Shortcuts Not Working
- Verify not typing in input/textarea
- Check browser console for errors
- Ensure `mounted === true`

### Buttons Not Disabled
- Check `hasPrev` and `hasNext` props
- Verify boolean values (not strings)
- Inspect button `disabled` attribute

### Styling Issues
- Verify global.css is loaded
- Check `.light` class on document element
- Confirm Tailwind CSS v4 is configured

## Performance

- Renders in <16ms
- No unnecessary re-renders
- Efficient keyboard event handling
- Minimal bundle size (~7kb component)

## Version

Component created: 2026-01-19
React version: 19.2.3
Tailwind CSS: v4.1.18
Astro: v5.16.11
