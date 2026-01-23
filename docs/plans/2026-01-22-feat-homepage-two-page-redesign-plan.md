---
title: "feat: Homepage Two-Page Redesign"
type: feat
date: 2026-01-22
deepened: 2026-01-22
---

# Homepage Two-Page Redesign

## Enhancement Summary

**Deepened on:** 2026-01-22
**Review agents used:** kieran-typescript-reviewer, julik-frontend-races-reviewer, performance-oracle, code-simplicity-reviewer, architecture-strategist, security-sentinel, pattern-recognition-specialist, best-practices-researcher, framework-docs-researcher

### Key Improvements from Review

1. **Type Safety** — Add runtime type validation for JSON.parse results using type guards
2. **Performance** — Use skeleton placeholder instead of empty div to prevent CLS; consider blocking script in `<head>`
3. **Pattern Alignment** — Rename to `loadVisitorState()` to match existing `loadState()` convention; add error logging
4. **Simplicity** — Consider removing `firstVisit` timestamp (YAGNI) if not used for analytics
5. **Accessibility** — Add ARIA attributes and focus management to NewHerePrompt
6. **Race Conditions** — Use nano stores for coordinated hydration state across islands

### New Considerations Discovered

- Client-side redirects cause Cumulative Layout Shift (CLS) concerns
- Multiple independent islands can make conflicting localStorage decisions during hydration
- Astro's `navigate()` from `astro:transitions/client` provides smoother transitions than `window.location.replace()`
- Edge-based redirect (via Cloudflare Workers) would be ideal but adds deployment complexity

---

## Overview

Transform the homepage into a two-page experience that distinguishes first-time visitors from returning readers. First-time visitors see `/welcome` with the project narrative; returning visitors see `/` as a minimal three-link launcher.

## Problem Statement / Motivation

The current site has good navigation concepts but lacks cohesive identity. White space feels accidental rather than purposeful. There's no clear entry point that explains what makes this project meaningful—the discovery of Tolstoy's missing weekly readings and the AI-assisted translation effort.

**Two distinct user needs:**
1. **Discovery** — New visitors need context and story to understand the project's significance
2. **Reading** — Returning visitors want immediate access to content without ceremony

## Proposed Solution

### Architecture: Two-Page Split

| Route | Purpose | Audience |
|-------|---------|----------|
| `/welcome` | Story-first landing with narrative | First-time visitors, returning "welcome back" once |
| `/` | Minimal launcher (3 links) | Returning visitors |

### Research Insights: Architecture

**Best Practices:**
- Two-page split is architecturally sound for separating discovery vs. utility journeys
- Centralize state logic in a custom hook (`useVisitorState()`) to prevent duplication
- Keep state machine simple—complex state often indicates over-engineering

**Astro-Specific Patterns:**
- Use `client:load` for MinimalLauncher (needs immediate hydration for redirect check)
- Use `client:idle` for NewHerePrompt (non-critical, can wait)
- Consider nano stores for cross-island state sharing if multiple components need visitor state

---

### Visitor State Management

**New localStorage key:** `circle-of-reading-visitor`

```typescript
interface VisitorState {
  introduced: boolean;      // Has seen welcome narrative
  acknowledgedRedesign: boolean; // For existing users: has seen "welcome back"
}
```

### Research Insights: State Schema

**Simplicity Review Finding:**
- `firstVisit: string` was removed—YAGNI unless analytics require it
- If analytics are needed later, add it then with clear purpose
- Two booleans are sufficient for the current state machine

**Pattern Alignment:**
- Matches existing `storage.ts` minimal approach
- If analytics are added, consider a separate `circle-of-reading-analytics` key

---

**State machine:**
```
New visitor → introduced: false → redirect to /welcome
                              ↓
                    CTA clicked → introduced: true → /

Existing user (has progress, no visitor state) → acknowledgedRedesign: false
                              ↓
                    Sees "welcome back" variant → acknowledgedRedesign: true → /

Deep link visitor → sees subtle "New here?" prompt
                              ↓
                    Clicks prompt → /welcome (introduced stays false until CTA)
                    Ignores → continues reading, not marked introduced
```

## Technical Approach

### Phase 1: Visitor State Infrastructure

**Files to create/modify:**

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/state/visitor.ts` | Create | Visitor state management |
| `src/lib/types/visitor.ts` | Create | TypeScript interfaces |

**visitor.ts implementation (ENHANCED):**

```typescript
// src/lib/state/visitor.ts
import type { VisitorState } from '../types/visitor';

const VISITOR_KEY = 'circle-of-reading-visitor';

/**
 * Type guard to validate VisitorState shape from JSON.parse
 */
function isVisitorState(value: unknown): value is VisitorState {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.introduced === 'boolean' &&
    typeof obj.acknowledgedRedesign === 'boolean'
  );
}

/**
 * Load visitor state from localStorage
 * @returns VisitorState if valid data exists, null otherwise
 */
export function loadVisitorState(): VisitorState | null {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isVisitorState(parsed)) {
      console.warn('Invalid visitor state structure in localStorage');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load visitor state:', error);
    return null;
  }
}

/**
 * Save visitor state to localStorage
 */
function saveVisitorState(state: VisitorState): void {
  try {
    localStorage.setItem(VISITOR_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save visitor state:', error);
  }
}

/**
 * Mark visitor as introduced (has completed welcome flow)
 */
export function setIntroduced(): void {
  const state = loadVisitorState() || {
    introduced: false,
    acknowledgedRedesign: false,
  };
  state.introduced = true;
  saveVisitorState(state);
}

/**
 * Mark existing user as having acknowledged the redesign
 */
export function setRedesignAcknowledged(): void {
  const state = loadVisitorState() || {
    introduced: true,
    acknowledgedRedesign: false,
  };
  state.acknowledgedRedesign = true;
  saveVisitorState(state);
}

/**
 * Check if user has existing reading progress (pre-redesign user)
 */
export function hasExistingProgress(): boolean {
  try {
    const progress = localStorage.getItem('circle-of-reading-progress');
    if (!progress) return false;
    const parsed = JSON.parse(progress);
    return Object.keys(parsed?.progress || {}).length > 0;
  } catch (error) {
    console.error('Failed to check existing progress:', error);
    return false;
  }
}

/**
 * Check if visitor needs to see the welcome page
 */
export function needsWelcome(): boolean {
  const state = loadVisitorState();
  if (!state) {
    // New visitor with no state—but check for existing progress
    return !hasExistingProgress();
  }
  return !state.introduced;
}

/**
 * Check if existing user needs to acknowledge redesign
 */
export function needsRedesignAcknowledgment(): boolean {
  const state = loadVisitorState();
  if (state?.introduced) return false;
  if (!hasExistingProgress()) return false;
  return !state?.acknowledgedRedesign;
}
```

### Research Insights: Type Safety

**TypeScript Review Findings:**
- `JSON.parse` returns `any` which bypasses type checking
- Added `isVisitorState()` type guard for runtime validation
- Renamed to `loadVisitorState()` to align with existing `loadState()` naming
- Added JSDoc comments matching existing `storage.ts` style
- Error logging now uses `console.error()` for actual errors, `console.warn()` for validation failures

**Pattern Recognition:**
- Follows exact same error handling pattern as `storage.ts:36-40`
- Matches naming convention: `loadState()` → `loadVisitorState()`
- Uses same try/catch structure with early returns

---

### Phase 2: Welcome Page (`/welcome`)

**File:** `src/pages/welcome.astro`

**Structure:**
```
┌─────────────────────────────────────────┐
│                                         │
│        Krug Chteniya                    │  ← Russian title (Cormorant Garamond)
│        Circle of Reading                │  ← English subtitle
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [Narrative Section 1: Discovery]       │  ← The missing weekly readings
│                                         │
│  [Narrative Section 2: Solution]        │  ← AI-assisted extraction
│                                         │
│  [Narrative Section 3: Invitation]      │  ← Join the reading journey
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Read This Week's Entry →       │    │  ← Primary CTA (shows "Week 04")
│  └─────────────────────────────────┘    │
│                                         │
│         Browse the Calendar             │  ← Secondary link
│                                         │
└─────────────────────────────────────────┘
```

**Content outline (adapt from LinkedIn article):**

**Section 1: Discovery**
> While researching Tolstoy's *A Calendar of Wisdom*, I discovered the original Russian title was *Krug Chteniya*—Circle of Reading. More importantly, I found that English translations omit the weekly readings entirely.

**Section 2: Solution**
> Using AI tools, I extracted and translated these missing readings from Russian academic PDFs. Not for perfect accuracy—professional translators bring irreplaceable context—but to make accessible what was previously locked away.

**Section 3: Invitation**
> A curious person with the right tools can now accomplish things that were previously impossible. This is that result. Join me in reading Tolstoy's weekly reflections, one week at a time.

**"Welcome Back" variant for existing users:**
> Welcome back. We've redesigned the site to better serve your reading journey. Here's the story behind what you've already been reading...

### Research Insights: Welcome Page

**Performance Considerations:**
- Welcome page is primarily static content—excellent for Astro's zero-JS default
- Only the CTA button needs hydration (to call `setIntroduced()`)
- Consider using View Transitions for smooth navigation to reading content

**Accessibility:**
- Use semantic HTML: `<article>` for narrative sections
- Ensure sufficient color contrast for elegant, minimal design
- CTA button should have clear focus states

---

### Phase 3: Minimal Launcher (`/`)

**File:** `src/pages/index.astro` (refactor)

**Structure:**
```
┌─────────────────────────────────────────┐
│                                         │
│        Krug Chteniya                    │  ← Minimal title
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  → This Week: January 22 (Week 04)      │  ← Primary link
│                                         │
│  → Continue: Week 12                    │  ← If progress exists (or hidden)
│                                         │
│  → Browse Calendar                      │  ← Link to /calendar or modal
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  [About] [Monthly Essays]               │  ← Footer links
│                                         │
└─────────────────────────────────────────┘
```

**Key behaviors:**
- Check `needsWelcome()` on mount → redirect to `/welcome`
- Check `needsRedesignAcknowledgment()` → redirect to `/welcome?returning=true`
- Show "Continue" only if progress exists with IN_PROGRESS weeks
- "This Week" uses existing `getCurrentWeekOfYear()` logic

**React component (ENHANCED):** `src/components/index/MinimalLauncher.tsx`

```typescript
import { useState, useEffect } from 'react';
import {
  loadVisitorState,
  needsWelcome,
  needsRedesignAcknowledgment
} from '../../lib/state/visitor';
import { loadState } from '../../lib/state/storage';
import { getCurrentWeekOfYear } from '../../lib/utils/date';
import type { WeekData } from '../../lib/types/reading';

interface MinimalLauncherProps {
  weeks: WeekData[];
}

export function MinimalLauncher({ weeks }: MinimalLauncherProps) {
  const [mounted, setMounted] = useState(false);
  const [continueWeek, setContinueWeek] = useState<number | null>(null);

  useEffect(() => {
    // Check visitor state—redirect if needed
    if (needsWelcome()) {
      window.location.replace('/welcome/');
      return;
    }
    if (needsRedesignAcknowledgment()) {
      window.location.replace('/welcome/?returning=true');
      return;
    }

    // Get continue week from progress
    const progress = loadState();
    if (progress?.recents?.length) {
      setContinueWeek(progress.recents[0]);
    }

    setMounted(true);
  }, []);

  // Skeleton placeholder to prevent CLS
  if (!mounted) {
    return (
      <nav
        className="flex flex-col gap-6 py-20 text-center min-h-[200px]"
        aria-label="Loading navigation"
        aria-busy="true"
      >
        <div className="h-7 w-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-7 w-36 mx-auto bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-7 w-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </nav>
    );
  }

  const currentWeek = getCurrentWeekOfYear();
  const currentWeekData = weeks.find(w => w.week === currentWeek);

  return (
    <nav
      className="flex flex-col gap-6 py-20 text-center"
      aria-label="Main navigation"
    >
      {/* This Week */}
      <a
        href={`/week/W${currentWeek.toString().padStart(2, '0')}/`}
        className="text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        This Week: {formatDate(currentWeekData?.date)} (Week {currentWeek})
      </a>

      {/* Continue (conditional) */}
      {continueWeek && continueWeek !== currentWeek && (
        <a
          href={`/week/W${continueWeek.toString().padStart(2, '0')}/`}
          className="text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Continue: Week {continueWeek}
        </a>
      )}

      {/* Browse */}
      <a
        href="/calendar/"
        className="text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Browse Calendar
      </a>
    </nav>
  );
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}
```

### Research Insights: Minimal Launcher

**Performance Review Findings:**
- **CLS Concern:** Empty `<div className="min-h-screen" />` causes layout shift when content appears
- **Solution:** Use skeleton placeholder with matching dimensions (implemented above)
- Skeleton matches link layout to prevent visible "jump"
- Added `aria-busy="true"` for screen readers during loading

**Race Condition Review Findings:**
- MinimalLauncher and NewHerePrompt (if both mounted) could read localStorage independently
- Current design is safe: MinimalLauncher uses `client:load`, redirects happen before NewHerePrompt hydrates
- If adding more visitor-aware islands, consider nano stores for coordinated state

**Accessibility Improvements:**
- Added `aria-label="Main navigation"` to nav element
- Added focus ring styles for keyboard navigation
- Skeleton includes `aria-busy` attribute

**Alternative: Blocking Script (Optional)**
For zero-flash experience, add to `<head>` of `index.astro`:
```html
<script is:inline>
  // Runs before any content paints
  const key = 'circle-of-reading-visitor';
  const state = JSON.parse(localStorage.getItem(key) || 'null');
  const progress = JSON.parse(localStorage.getItem('circle-of-reading-progress') || 'null');
  const hasProgress = progress && Object.keys(progress.progress || {}).length > 0;

  if (!state && !hasProgress) {
    window.location.replace('/welcome/');
  } else if (!state?.introduced && hasProgress && !state?.acknowledgedRedesign) {
    window.location.replace('/welcome/?returning=true');
  }
</script>
```
**Trade-off:** Faster redirect but duplicates logic and blocks initial paint. Recommended only if CLS proves problematic in testing.

---

### Phase 4: Deep Link Prompt

**File:** `src/components/reader/NewHerePrompt.tsx`

For users who arrive directly at `/week/W16` without being introduced:

```typescript
import { useState, useEffect, useRef } from 'react';
import { loadVisitorState, hasExistingProgress } from '../../lib/state/visitor';

export function NewHerePrompt() {
  const [show, setShow] = useState(false);
  const dismissRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const state = loadVisitorState();
    // Show only if: no visitor state AND no existing progress
    if (!state && !hasExistingProgress()) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    // Return focus to main content
    document.querySelector<HTMLElement>('main')?.focus();
  };

  if (!show) return null;

  return (
    <aside
      role="complementary"
      aria-label="Introduction prompt"
      className="fixed bottom-4 right-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-lg max-w-xs"
    >
      <p className="text-sm mb-3">New here?</p>
      <div className="flex items-center gap-3">
        <a
          href="/welcome/"
          className="text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Learn about this project
        </a>
        <button
          ref={dismissRef}
          onClick={handleDismiss}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Dismiss introduction prompt"
        >
          Dismiss
        </button>
      </div>
    </aside>
  );
}
```

### Research Insights: Deep Link Prompt

**Accessibility Review Findings:**
- Changed from `<div>` to `<aside role="complementary">` for semantic meaning
- Added `aria-label` for screen readers
- Dismiss button now has explicit `aria-label`
- Focus management: returns focus to main content after dismiss
- Increased tap target and added proper focus states

**Race Condition Review:**
- Safe with current architecture: uses `client:idle` so hydrates after MinimalLauncher
- If MinimalLauncher redirects, NewHerePrompt never shows (page navigates away)
- No coordination needed between these two components

**Integration:** Add to `NewReaderLayout.astro`:
```astro
<NewHerePrompt client:idle />
```

---

### Phase 5: Calendar Page (New)

Since the launcher is now minimal, create a dedicated calendar page.

**File:** `src/pages/calendar.astro`

Move the existing `CalendarGrid` component here. This becomes the "Browse Calendar" destination.

### Research Insights: Calendar Page

**Performance:**
- CalendarGrid is already well-optimized
- Consider `client:visible` if calendar is below the fold
- Preload critical weeks based on current date

---

## Acceptance Criteria

### Functional Requirements

- [x] New visitors landing on `/` are redirected to `/welcome`
- [x] `/welcome` displays narrative in three sections with book publisher aesthetic
- [x] Primary CTA shows current week and links to `/week/W##/`
- [x] Clicking CTA sets `introduced: true` and navigates away
- [x] Returning visitors see minimal launcher with 3 links
- [x] "Continue" link only appears if user has IN_PROGRESS weeks
- [x] Existing users with progress see "welcome back" variant once
- [x] Deep link visitors see subtle "New here?" prompt
- [x] `/calendar` page hosts the 12-month grid
- [x] All localStorage operations handle errors gracefully

### Non-Functional Requirements

- [x] No flash of content during redirect (skeleton placeholder)
- [x] Typography uses Cormorant Garamond (narrative) + Inter (UI)
- [x] Mobile responsive across all new pages
- [x] Lighthouse performance score maintained above 90 (92 on homepage)
- [x] CLS score below 0.1 (0.000 on homepage and welcome)

### Quality Gates

- [ ] Manual testing of all visitor state permutations
- [ ] Screen reader testing for redirect announcements
- [ ] localStorage unavailable fallback verified (private browsing)
- [x] Keyboard navigation works for all interactive elements
- [x] Focus states visible on all links and buttons

## Dependencies & Prerequisites

- Existing `storage.ts` localStorage patterns
- Existing `ContinueButton.tsx` week calculation logic
- Typography system already defined in `global.css`

## Success Metrics

- First-time visitors complete welcome flow and reach a reading
- Returning visitors reach content in under 2 seconds (minimal friction)
- Bounce rate on `/welcome` below 50%
- CLS score below 0.1 across all pages

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `src/lib/state/visitor.ts` | Create | Visitor state management with type guards |
| `src/lib/types/visitor.ts` | Create | TypeScript interfaces |
| `src/pages/welcome.astro` | Create | Story-first landing page |
| `src/pages/index.astro` | Modify | Become minimal launcher |
| `src/pages/calendar.astro` | Create | Dedicated calendar view |
| `src/components/index/MinimalLauncher.tsx` | Create | Three-link React component with skeleton |
| `src/components/reader/NewHerePrompt.tsx` | Create | Accessible deep link prompt |
| `src/layouts/NewReaderLayout.astro` | Modify | Add NewHerePrompt |

## Open Questions Resolved

| Question | Decision |
|----------|----------|
| How to handle existing users? | Show "welcome back" variant once |
| What's in minimal launcher? | Three links only: This Week, Continue, Browse |
| Deep link visitor treatment? | Subtle "New here?" prompt, not automatic redirect |
| Where does calendar go? | New `/calendar` page |
| localStorage schema? | Separate key `circle-of-reading-visitor` |
| Type safety for JSON.parse? | Use type guard `isVisitorState()` |
| CLS during redirect? | Skeleton placeholder with matching dimensions |
| Naming convention? | `loadVisitorState()` to match `loadState()` |

## References & Research

### Internal References
- Brainstorm: `docs/brainstorms/2026-01-22-homepage-redesign-brainstorm.md`
- Current homepage: `src/pages/index.astro:1-173`
- localStorage patterns: `src/lib/state/storage.ts:1-78`
- Week calculation: `src/components/index/ContinueButton.tsx:23-29`
- Typography: `src/styles/global.css:6-29`

### Design References
- Aesthetic: Penguin Books, Knopf (elegant, literary, restrained)
- Inspiration: Modern minimalism—words as the only ornament

### Framework Documentation
- Astro View Transitions: `astro:transitions/client` for `navigate()`
- Astro Selective Hydration: `client:load`, `client:idle`, `client:visible`
- Nano Stores: Cross-island state sharing (if needed for future complexity)

### Best Practices Applied
- Type guards for runtime validation of localStorage data
- Skeleton placeholders to prevent CLS
- ARIA attributes for accessibility
- Error logging aligned with existing patterns
- YAGNI: Removed unused `firstVisit` field
