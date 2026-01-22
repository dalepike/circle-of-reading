# ReadingContext Usage Guide

This guide shows how to use the React Context for state management in your Circle of Reading application.

## Setup

Wrap your application with the `ReadingProvider` at the top level:

```tsx
// src/layouts/Layout.astro or your root component
import { ReadingProvider } from '@/lib/state/ReadingContext';

export default function App() {
  return (
    <ReadingProvider>
      <YourApp />
    </ReadingProvider>
  );
}
```

## Basic Usage

### Accessing Context

Use the `useReading` hook in any component within the provider:

```tsx
import { useReading } from '@/lib/state/ReadingContext';

export function WeekPage({ weekNumber }: { weekNumber: number }) {
  const { getProgress, visitWeek, startReading } = useReading();

  const progress = getProgress(weekNumber);

  return (
    <div>
      <h1>Week {weekNumber}</h1>
      <p>Status: {progress.state}</p>
      <p>Progress: {Math.round(progress.scrollPosition * 100)}%</p>
    </div>
  );
}
```

## Complete Example: Week Reading Page

```tsx
import { useEffect, useCallback } from 'react';
import { useReading, useIsClient } from '@/lib/state/ReadingContext';

export function WeekReading({ weekNumber }: { weekNumber: number }) {
  const {
    getProgress,
    visitWeek,
    startReading,
    completeReading,
    updatePosition,
  } = useReading();

  const isClient = useIsClient();
  const progress = getProgress(weekNumber);

  // Mark as visited on mount
  useEffect(() => {
    visitWeek(weekNumber);
  }, [weekNumber, visitWeek]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const scrollPercent = window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight);

    // Clamp between 0 and 1
    const position = Math.max(0, Math.min(1, scrollPercent));

    // Start reading if scrolled past 10%
    if (position > 0.1 && progress.state === 'VISITED') {
      startReading(weekNumber, position);
    } else if (progress.state === 'IN_PROGRESS') {
      updatePosition(weekNumber, position);
    }
  }, [weekNumber, progress.state, startReading, updatePosition]);

  // Add scroll listener
  useEffect(() => {
    if (!isClient) return;

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [isClient, handleScroll]);

  // Complete button handler
  const handleComplete = () => {
    completeReading(weekNumber);
  };

  return (
    <div>
      <article>
        {/* Your week content here */}
      </article>

      {progress.state !== 'COMPLETED' && (
        <button onClick={handleComplete}>
          Mark as Complete
        </button>
      )}

      {progress.state === 'COMPLETED' && (
        <div className="completed-badge">
          ✓ Completed
        </div>
      )}
    </div>
  );
}
```

## Recent Weeks Sidebar

```tsx
import { useReading } from '@/lib/state/ReadingContext';

export function RecentsSidebar() {
  const { getRecentWeeks, getProgress } = useReading();
  const recents = getRecentWeeks();

  return (
    <aside>
      <h2>Recently Viewed</h2>
      <ul>
        {recents.map((week) => {
          const progress = getProgress(week);
          return (
            <li key={week}>
              <a href={`/week-${week.toString().padStart(2, '0')}`}>
                Week {week}
                <span className={`status-${progress.state}`}>
                  {progress.state}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
```

## Progress Dashboard

```tsx
import { useReading } from '@/lib/state/ReadingContext';

export function ProgressDashboard() {
  const { state } = useReading();

  // Calculate stats
  const stats = Object.values(state.progress).reduce(
    (acc, progress) => {
      acc[progress.state] = (acc[progress.state] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const completed = stats.COMPLETED || 0;
  const inProgress = stats.IN_PROGRESS || 0;
  const visited = stats.VISITED || 0;
  const unseen = 52 - completed - inProgress - visited;

  return (
    <div className="dashboard">
      <h2>Your Progress</h2>
      <div className="stats">
        <div className="stat">
          <span className="count">{completed}</span>
          <span className="label">Completed</span>
        </div>
        <div className="stat">
          <span className="count">{inProgress}</span>
          <span className="label">In Progress</span>
        </div>
        <div className="stat">
          <span className="count">{visited}</span>
          <span className="label">Visited</span>
        </div>
        <div className="stat">
          <span className="count">{unseen}</span>
          <span className="label">Not Started</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(completed / 52) * 100}%` }}
        />
      </div>
      <p>{Math.round((completed / 52) * 100)}% of year completed</p>
    </div>
  );
}
```

## Week Grid with Status Indicators

```tsx
import { useReading } from '@/lib/state/ReadingContext';

export function WeekGrid() {
  const { getProgress } = useReading();

  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div className="week-grid">
      {weeks.map((week) => {
        const progress = getProgress(week);
        return (
          <a
            key={week}
            href={`/week-${week.toString().padStart(2, '0')}`}
            className={`week-card status-${progress.state}`}
          >
            <span className="week-number">{week}</span>
            {progress.state === 'IN_PROGRESS' && (
              <div className="progress-indicator">
                {Math.round(progress.scrollPosition * 100)}%
              </div>
            )}
            {progress.state === 'COMPLETED' && (
              <div className="completed-check">✓</div>
            )}
          </a>
        );
      })}
    </div>
  );
}
```

## SSR Safety

Always check if you're on the client before accessing state-dependent features:

```tsx
import { useIsClient, useReading } from '@/lib/state/ReadingContext';

export function ClientOnlyFeature() {
  const isClient = useIsClient();
  const { getCurrentWeek } = useReading();

  if (!isClient) {
    // Show loading state or placeholder during SSR
    return <div>Loading...</div>;
  }

  const currentWeek = getCurrentWeek();

  return (
    <div>
      {currentWeek ? (
        <a href={`/week-${currentWeek.toString().padStart(2, '0')}`}>
          Continue Reading Week {currentWeek}
        </a>
      ) : (
        <p>Start your reading journey!</p>
      )}
    </div>
  );
}
```

## API Reference

### Context Value

```typescript
interface ReadingContextValue {
  state: AppState;

  // Actions
  visitWeek: (week: number) => void;
  startReading: (week: number, scrollPosition: number) => void;
  completeReading: (week: number) => void;
  updatePosition: (week: number, position: number) => void;

  // Getters
  getProgress: (week: number) => ReadingProgress;
  getRecentWeeks: () => number[];
  getCurrentWeek: () => number | null;
}
```

### Actions

- **visitWeek(week)**: Mark a week as visited (first interaction)
- **startReading(week, position)**: Mark a week as in progress with initial scroll position
- **completeReading(week)**: Mark a week as completed
- **updatePosition(week, position)**: Update scroll position (0-1 range)

### Getters

- **getProgress(week)**: Get progress object for a specific week
- **getRecentWeeks()**: Get array of recently viewed weeks (max 10, most recent first)
- **getCurrentWeek()**: Get the week currently being read (IN_PROGRESS state)

## Best Practices

1. **Mark visited on mount**: Call `visitWeek()` when a week page loads
2. **Throttle scroll updates**: Don't call `updatePosition()` on every scroll event
3. **Use SSR-safe hooks**: Check `isClient` before rendering client-only features
4. **Debounce state changes**: Batch rapid state updates when possible
5. **Let context handle persistence**: Don't call `saveState()` manually - the context does it automatically
