# Circle of Reading - State Management

Functional state management layer for tracking reading progress across 52 weeks of content.

## Architecture

### State Machine Design

Reading states follow a strict progression:

```
UNSEEN → VISITED → IN_PROGRESS → COMPLETED
```

- **UNSEEN**: Week has never been opened
- **VISITED**: Week opened but no significant reading
- **IN_PROGRESS**: Active reading with scroll tracking
- **COMPLETED**: User marked as finished (final state)

Transitions only move forward. Once COMPLETED, state never regresses.

## Usage

### Basic Setup

```typescript
import {
  loadState,
  saveState,
  createInitialState,
  markVisited,
  markInProgress,
  markCompleted,
  updateScrollPosition,
  addToRecents,
  getRecents,
  type AppState,
} from '@/lib/state';

// Initialize or load state
let state: AppState = loadState() || createInitialState();
```

### Tracking Progress

```typescript
// User opens week 5
state = markVisited(state, 5);
state = addToRecents(state, 5);
saveState(state);

// User scrolls to 30%
state = markInProgress(state, 5, 0.3);
saveState(state);

// User scrolls to 75%
state = updateScrollPosition(state, 5, 0.75);
saveState(state);

// User marks complete
state = markCompleted(state, 5);
saveState(state);
```

### Checking Progress

```typescript
import { getWeekProgress } from '@/lib/state';

const progress = getWeekProgress(state, 5);
console.log(progress);
// {
//   week: 5,
//   state: 'COMPLETED',
//   scrollPosition: 1,
//   lastUpdated: '2026-01-19T10:30:00.000Z'
// }
```

### Recent Readings

```typescript
import { getRecents, addToRecents } from '@/lib/state';

// Add to recents (automatically moves to front if already present)
state = addToRecents(state, 12);
state = addToRecents(state, 7);
state = addToRecents(state, 12); // Moves to front

const recent = getRecents(state);
// [12, 7, ...] - Most recent first, max 10 entries
```

## API Reference

### Storage (`storage.ts`)

```typescript
// Load from localStorage (returns null if no data or error)
function loadState(): AppState | null

// Save to localStorage (handles quota errors gracefully)
function saveState(state: AppState): void

// Clear all persisted data
function clearState(): void
```

### Progress (`progress.ts`)

```typescript
// Create fresh state
function createInitialState(): AppState

// Mark week as visited (UNSEEN → VISITED)
function markVisited(state: AppState, week: number): AppState

// Mark week in progress with scroll position
function markInProgress(state: AppState, week: number, scrollPosition: number): AppState

// Mark week completed (final state)
function markCompleted(state: AppState, week: number): AppState

// Update scroll position (0-1 range, clamped)
function updateScrollPosition(state: AppState, week: number, position: number): AppState

// Get progress for specific week
function getWeekProgress(state: AppState, week: number): ReadingProgress

// Check if state transition is valid
function canTransitionTo(current: ReadingState, next: ReadingState): boolean
```

### Recents (`recents.ts`)

```typescript
// Add week to recents (LRU pattern, max 10)
function addToRecents(state: AppState, week: number): AppState

// Get recent weeks (most recent first)
function getRecents(state: AppState): number[]

// Clear all recents
function clearRecents(state: AppState): AppState

// Remove specific week from recents
function removeFromRecents(state: AppState, week: number): AppState
```

## React Integration Example

```typescript
import { useState, useEffect } from 'react';
import {
  loadState,
  saveState,
  createInitialState,
  updateScrollPosition,
  addToRecents,
  type AppState,
} from '@/lib/state';

export function useReadingProgress(weekNumber: number) {
  const [state, setState] = useState<AppState>(() => 
    loadState() || createInitialState()
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Track scroll position
  const handleScroll = (position: number) => {
    setState(prev => updateScrollPosition(prev, weekNumber, position));
  };

  // Mark as visited when component mounts
  useEffect(() => {
    setState(prev => {
      let updated = markVisited(prev, weekNumber);
      updated = addToRecents(updated, weekNumber);
      return updated;
    });
  }, [weekNumber]);

  return {
    progress: getWeekProgress(state, weekNumber),
    handleScroll,
    markComplete: () => setState(prev => markCompleted(prev, weekNumber)),
  };
}
```

## Design Principles

### Immutability

All functions return new state objects. Never mutate existing state:

```typescript
// ✅ Good - returns new state
const newState = markVisited(state, 5);

// ❌ Bad - mutates state
state.progress[5] = { ... };
```

### Pure Functions

State functions have no side effects:

```typescript
// Storage operations (side effects isolated)
saveState(state);  // Only this touches localStorage

// Pure state operations (no side effects)
const newState = markVisited(state, 5);
```

### Error Handling

Storage layer handles all localStorage errors gracefully:

- JSON parse errors → returns `null`
- Quota exceeded → clears old data and retries
- All errors logged to console

### Type Safety

Full TypeScript support with strict types:

```typescript
type ReadingState = 'UNSEEN' | 'VISITED' | 'IN_PROGRESS' | 'COMPLETED';

interface ReadingProgress {
  week: number;
  state: ReadingState;
  scrollPosition: number;
  lastUpdated: string;
}

interface AppState {
  progress: Record<number, ReadingProgress>;
  recents: number[];
  version: number;
}
```

## Testing Strategy

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { createInitialState, markVisited, markCompleted } from './progress';

describe('Progress State Machine', () => {
  it('should not regress from COMPLETED', () => {
    let state = createInitialState();
    state = markCompleted(state, 5);
    state = markVisited(state, 5); // Should be ignored
    
    expect(getWeekProgress(state, 5).state).toBe('COMPLETED');
  });
  
  it('should clamp scroll position to 0-1 range', () => {
    let state = createInitialState();
    state = updateScrollPosition(state, 5, 1.5);
    
    expect(getWeekProgress(state, 5).scrollPosition).toBe(1);
  });
});
```

## Migration Strategy

State includes a `version` field for future schema migrations:

```typescript
interface AppState {
  progress: Record<number, ReadingProgress>;
  recents: number[];
  version: number; // Current: 1
}
```

Future versions can migrate old data:

```typescript
export function migrateState(stored: any): AppState {
  if (stored.version === 1) {
    return stored as AppState;
  }
  
  // Handle version 0 → 1 migration
  if (!stored.version) {
    return {
      ...stored,
      version: 1,
      recents: stored.recents || [],
    };
  }
  
  return createInitialState();
}
```

## Performance Considerations

- **localStorage is synchronous**: Keep state updates minimal
- **Debounce scroll updates**: Don't save on every scroll event
- **Lazy loading**: Only load state when needed
- **State size**: 52 weeks × ~100 bytes = ~5KB (well within limits)

## Security Notes

- No sensitive data stored (just reading progress)
- localStorage is domain-scoped (no cross-site access)
- User can clear via browser dev tools
- Consider adding export/import for user data portability
