# JumpDrawer Visual Reference

Visual design reference for the JumpDrawer component.

## Desktop View (768px+)

```
┌──────────────────────────────────────────────────────┐
│ Full Screen Layout                                    │
│                                                       │
│ ┌────────────────────────────┐                       │
│ │ Content/Background         │  ┌──────────────────┐ │
│ │                            │  │ ✕  Jump to Week  │ │
│ │  [Backdrop Overlay         │  ├──────────────────┤ │
│ │   with blur]               │  │ Month Chips      │ │
│ │                            │  │ [Jan][Feb][Mar]  │ │
│ │                            │  │ [Apr][May][Jun]  │ │
│ │                            │  │ [Jul][Aug][Sep]  │ │
│ │                            │  │ [Oct][Nov][Dec]  │ │
│ │                            │  ├──────────────────┤ │
│ │                            │  │ SELECTED MONTH   │ │
│ │                            │  │ Week List        │ │
│ │                            │  │ W22 Title [●]    │ │
│ │                            │  │ W23 Title [◦]    │ │
│ │                            │  │ W24 Title [○]    │ │
│ │                            │  │ (scrollable)     │ │
│ │                            │  ├──────────────────┤ │
│ │                            │  │ RECENT           │ │
│ │                            │  │ W16 W15 W12 ...  │ │
│ └────────────────────────────┘  └──────────────────┘ │
└──────────────────────────────────────────────────────┘
                                   ↑
                          Slides in from right
                          Max width: 28rem (448px)
```

## Mobile View (<768px)

```
┌────────────────────────────────┐
│                                │
│  [Backdrop Overlay]            │
│                                │
│  ┌────────────────────────────┤ ↑
│  │ ○  Drag Handle (optional)  │ │
│  ├────────────────────────────┤ │
│  │ ✕       Jump to Week       │ │ 85vh
│  ├────────────────────────────┤ │
│  │ Month Chips (scroll →)     │ │
│  │ [Jan][Feb][Mar][Apr][May]  │ │
│  ├────────────────────────────┤ │
│  │ SELECTED MONTH             │ │
│  │ Week List                  │ │
│  │ W22 Title          [●]     │ │
│  │ W23 Title          [◦]     │ │
│  │ W24 Title          [○]     │ │
│  │ (scrollable)               │ │
│  ├────────────────────────────┤ │
│  │ RECENT                     │ │
│  │ W16 W15 W12 W08 W01        │ ↓
└──┴────────────────────────────┘
     ↑
Slides up from bottom
Rounded top corners
Full width
```

## Color Palette

### Dark Mode (default)
```
Background:       #000000 (black)
Border:           rgb(38, 38, 38)  --color-gray-800
Text Primary:     #FFFFFF (white)
Text Secondary:   rgb(163, 163, 163)  --color-gray-400
Text Tertiary:    rgb(115, 115, 115)  --color-gray-500
Backdrop:         rgba(0, 0, 0, 0.8) + backdrop-blur

Status Colors:
  Completed:      #FFFFFF (white)
  Visited:        rgb(163, 163, 163)  --color-gray-400
  Unseen:         rgb(64, 64, 64)  --color-gray-700
```

### Light Mode
```
Background:       #FFFFFF (white)
Border:           rgb(229, 229, 229)  --color-gray-200
Text Primary:     #000000 (black)
Text Secondary:   rgb(115, 115, 115)  --color-gray-500
Text Tertiary:    rgb(163, 163, 163)  --color-gray-400
Backdrop:         rgba(255, 255, 255, 0.8) + backdrop-blur

Status Colors:
  Completed:      #000000 (black)
  Visited:        rgb(115, 115, 115)  --color-gray-500
  Unseen:         rgb(212, 212, 212)  --color-gray-300
```

## Typography

```
Header Title:     font-serif, text-xl (20px)
Month Label:      font-sans, text-xs, uppercase, tracking-widest
Month Chip:       font-sans, text-xs, uppercase, tracking-widest
Week Number:      font-sans, text-xs, font-light
Week Title:       font-serif, text-base (16px), leading-tight
Russian Title:    font-serif, text-xs, italic
```

## Spacing & Sizing

```
Drawer Width (Desktop):     28rem (448px) max
Drawer Height (Mobile):     85vh
Header Height:              Auto (p-6)
Month Chips:                px-3 py-1.5, gap-2
Week Row:                   p-3, gap-3
Recent Chips:               px-3 py-2, gap-2
Border Width:               1px
```

## Interactive States

### Month Chip
```
┌────────┐  ┌────────┐  ┌────────┐
│  JAN   │  │  FEB   │  │  MAR   │
└────────┘  └────────┘  └────────┘
   idle       hover      selected

Idle:     border-gray-700, text-gray-400
Hover:    border-gray-500, text-white
Selected: bg-white, text-black, border-white
```

### Week Row
```
W22 · The Darling                    [●]
─────────────────────────────────────────
  idle: transparent background

W22 · The Darling                    [●]
─────────────────────────────────────────
  hover: bg-gray-900 (dark) / bg-gray-50 (light)

W22 · The Darling                    [●]
─────────────────────────────────────────
  current: bg-gray-900, persistent highlight
```

### Recent Week Chip
```
┌──────────┐
│ W16  ●   │  ← Completed week
└──────────┘

┌──────────┐
│ W15  ◦   │  ← Visited week
└──────────┘

┌──────────┐
│ W12  ○   │  ← Unseen week
└──────────┘

Hover: border-gray-500, bg-gray-900
```

## Animations

### Desktop Entry
```
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);  ← Off-screen right
  }
  to {
    opacity: 1;
    transform: translateX(0);      ← On-screen
  }
}

Duration: 0.3s
Easing: ease-out
```

### Mobile Entry
```
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100%);  ← Below viewport
  }
  to {
    opacity: 1;
    transform: translateY(0);      ← At bottom
  }
}

Duration: 0.3s
Easing: ease-out
```

### Backdrop
```
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

Duration: 0.2s
Easing: ease-out
```

## Status Indicators

```
●  Completed
   Size: text-lg (18px)
   Color: white (dark) / black (light)
   Unicode: U+25CF (Black Circle)

◦  Visited / In Progress
   Size: text-lg (18px)
   Color: gray-400
   Unicode: U+25E6 (White Bullet)

○  Unseen
   Size: text-lg (18px)
   Color: gray-700 (dark) / gray-300 (light)
   Unicode: U+25CB (White Circle)
```

## Focus States

```
Focusable elements:
- Close button
- Month chips (tab navigation)
- Week rows (clickable)
- Recent week chips

Focus ring:
  outline: 2px solid currentColor
  outline-offset: 2px
  transition: outline 0.2s
```

## Scrollbar Styling

```
/* Thin horizontal scrollbar for month chips */
::-webkit-scrollbar {
  height: 4px;
}

::-webkit-scrollbar-track {
  background: gray-900 (dark) / gray-100 (light)
}

::-webkit-scrollbar-thumb {
  background: gray-700 (dark) / gray-300 (light)
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: gray-600 (dark) / gray-400 (light)
}
```

## Accessibility Features

### Focus Trap
```
┌────────────────────────────┐
│ [Close Button]      ← Tab  │ ↑
├────────────────────────────┤ │
│ [Jan] [Feb] [Mar]...       │ │ Focus cycles
├────────────────────────────┤ │ within drawer
│ [Week 1]                   │ │
│ [Week 2]                   │ │
│ [Week 3]                   │ │
├────────────────────────────┤ │
│ [Recent: W16] [W15]...     │ ↓
└────────────────────────────┘
  Tab → (cycles back to close)
```

### ARIA Structure
```html
<div role="dialog" aria-modal="true" aria-label="Jump to week">
  <div role="tablist" aria-label="Select month">
    <button role="tab" aria-selected="true">Jan</button>
    <button role="tab" aria-selected="false">Feb</button>
  </div>

  <ul role="listbox" aria-labelledby="month-label">
    <li role="option" aria-selected="false">
      Week 22: The Darling
    </li>
  </ul>
</div>
```

## Responsive Breakpoints

```
Mobile:   < 768px   (max-md)
Desktop:  ≥ 768px   (md:)

Mobile specific:
- max-md:bottom-0
- max-md:top-auto
- max-md:h-[85vh]
- max-md:rounded-t-lg
- max-md:border-l-0
- max-md:animate-slideUp

Desktop specific:
- md:animate-slideInRight
- right-0
- top-0
- h-full
- w-full max-w-md
```

## Z-Index Layers

```
Layer Stack (bottom to top):
1. Page content             z-0
2. Backdrop overlay         z-50
3. Drawer container         z-50

Within drawer:
- Header                    relative
- Month chips               relative
- Week list                 relative
- Recent section            relative
```

## Implementation Notes

- **Performance**: Component only renders when `isOpen` is true
- **Body Scroll**: Locked when drawer is open via `body { overflow: hidden }`
- **Event Cleanup**: All event listeners properly cleaned up on unmount
- **SSR Safe**: No client-only hooks called during SSR
- **Hydration**: No hydration mismatches due to conditional rendering

---

*This visual reference complements the technical documentation in JumpDrawer.md*
