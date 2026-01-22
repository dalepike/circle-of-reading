# MicroHeader Component - Test Plan

## Manual Testing Checklist

### Visual Tests

- [ ] **Sticky Positioning**
  - Header stays at top when scrolling
  - z-index (50) keeps it above content
  - Backdrop blur effect is visible

- [ ] **Layout Structure**
  - Single line height (h-14 = 3.5rem)
  - Proper spacing between elements
  - Elements aligned vertically centered

- [ ] **Week Badge**
  - Shows as "W01" through "W52" with zero-padding
  - Monochrome background (gray-800 dark, gray-200 light)
  - Rounded corners
  - Proper contrast

- [ ] **Title Display**
  - Title truncates with ellipsis on overflow
  - Dot separator (·) visible between title and month
  - Month in muted color
  - Volume shows on desktop only

- [ ] **Navigation Buttons**
  - Prev arrow on left
  - Next arrow on right
  - Grid icon for index
  - Proper spacing (gap-2)
  - Consistent button sizing (w-8 h-8)

### Interaction Tests

- [ ] **Click Events**
  - Prev button navigates to previous week
  - Next button navigates to next week
  - Index button opens calendar
  - Header click opens jump drawer
  - All buttons have hover opacity effect (0.7)

- [ ] **Disabled States**
  - Prev button disabled on W01
  - Next button disabled on W52
  - Disabled buttons show opacity-30
  - Disabled buttons show not-allowed cursor
  - Disabled buttons don't trigger clicks

- [ ] **Keyboard Navigation**
  - `←` triggers prev week (when available)
  - `→` triggers next week (when available)
  - `i` triggers index view
  - `j` triggers jump drawer
  - Shortcuts disabled when typing in input/textarea

### Theme Tests

- [ ] **Dark Mode (Default)**
  - Background: black with 80% opacity
  - Text: white
  - Border: gray-800
  - Buttons: white icons

- [ ] **Light Mode**
  - Background: white with 80% opacity
  - Text: black
  - Border: gray-200
  - Buttons: black icons

- [ ] **Theme Transitions**
  - Smooth color transitions
  - No flash of unstyled content
  - All elements update correctly

### Responsive Tests

- [ ] **Mobile (<640px)**
  - Title hidden (only week badge + month visible)
  - All buttons remain functional
  - Touch targets large enough (minimum 44x44px)
  - Layout doesn't overflow

- [ ] **Tablet (640px-768px)**
  - Title visible
  - Month visible
  - Volume hidden
  - Proper spacing maintained

- [ ] **Desktop (768px+)**
  - All elements visible including volume
  - Maximum width constraint (max-w-7xl)
  - Centered with auto margins
  - Padding on sides (px-4)

### Accessibility Tests

- [ ] **ARIA Labels**
  - Prev button: "Previous week"
  - Next button: "Next week"
  - Index button: "Open calendar index"
  - Header button includes full context (week, title, month, Russian title)

- [ ] **Focus States**
  - Focus visible on all interactive elements
  - Outline offset (2px) prevents overlap
  - Outline color (white/black) has proper contrast
  - Tab order is logical (left to right)

- [ ] **Screen Reader**
  - aria-hidden on decorative SVG icons
  - Disabled state announced correctly
  - Button purposes clear from labels

### Edge Cases

- [ ] **Long Titles**
  - Title with 50+ characters truncates properly
  - Ellipsis appears at truncation point
  - Doesn't break layout

- [ ] **Week 1 Edge Case**
  - hasPrev = false
  - Prev button disabled
  - Next button enabled

- [ ] **Week 52 Edge Case**
  - hasNext = false
  - Next button disabled
  - Prev button enabled

- [ ] **Missing Optional Props**
  - russianTitle can be undefined
  - volume can be undefined
  - Component renders without errors

- [ ] **Hydration**
  - No console errors on initial load
  - No hydration mismatch warnings
  - Mounted state prevents flash

## Automated Testing (Future)

### Unit Tests (Jest/Vitest)

```typescript
describe('MicroHeader', () => {
  it('renders with required props', () => {});
  it('disables prev button when hasPrev is false', () => {});
  it('disables next button when hasNext is false', () => {});
  it('calls onPrevClick when prev button clicked', () => {});
  it('calls onNextClick when next button clicked', () => {});
  it('calls onIndexClick when index button clicked', () => {});
  it('calls onHeaderClick when header clicked', () => {});
  it('formats week number with zero padding', () => {});
  it('prevents hydration mismatch', () => {});
});
```

### Integration Tests (Playwright/Cypress)

```typescript
describe('MicroHeader Integration', () => {
  it('navigates between weeks', () => {});
  it('opens jump drawer on header click', () => {});
  it('opens index on grid button click', () => {});
  it('responds to keyboard shortcuts', () => {});
  it('adapts to viewport size', () => {});
  it('maintains sticky position on scroll', () => {});
});
```

### Visual Regression Tests (Chromatic/Percy)

- [ ] Desktop light mode
- [ ] Desktop dark mode
- [ ] Tablet light mode
- [ ] Tablet dark mode
- [ ] Mobile light mode
- [ ] Mobile dark mode
- [ ] Disabled state (prev)
- [ ] Disabled state (next)
- [ ] Long title truncation
- [ ] Focus states

## Performance Tests

- [ ] **Rendering Performance**
  - Component renders in <16ms
  - No unnecessary re-renders
  - Smooth scrolling with sticky header

- [ ] **Interaction Performance**
  - Click handlers respond instantly
  - Keyboard shortcuts have <100ms latency
  - Hover effects smooth (no jank)

- [ ] **Bundle Size**
  - Component adds <5kb gzipped
  - No duplicate dependencies
  - Tree-shaking works correctly

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Mobile Chrome (Android)

## Test Results Template

```
Test Date: YYYY-MM-DD
Tester: [Name]
Browser: [Browser + Version]
Device: [Desktop/Tablet/Mobile]

PASS/FAIL: [Overall Result]

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
- [Additional observations]
```

## Known Issues

None currently identified.

## Testing Resources

- **Component File:** `src/components/reader/MicroHeader.tsx`
- **Examples:** `src/components/reader/MicroHeader.example.tsx`
- **Integration:** `src/components/reader/INTEGRATION.md`
- **Documentation:** `src/components/reader/README.md`
