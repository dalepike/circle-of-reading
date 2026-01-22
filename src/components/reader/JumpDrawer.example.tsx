/**
 * JumpDrawer Usage Example
 *
 * This file demonstrates how to integrate the JumpDrawer component
 * into a Circle of Reading reader page.
 */

import { useState } from 'react';
import { JumpDrawer } from './JumpDrawer';
import { useReading } from '../../lib/state/ReadingContext';
import type { WeekInfo } from './JumpDrawer';

/**
 * Example 1: Basic integration with a "Jump to Week" button
 */
export function ReaderWithJumpButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getCurrentWeek } = useReading();

  // In a real app, this would come from your content collection
  // Example using Astro content collections:
  // const { data: weeks } = Astro.glob('../../content/readings/**/*.md');
  const allWeeks: WeekInfo[] = [
    { week: 1, title: "What is Religion?", slug: "01-what-is-religion" },
    { week: 2, title: "Faith", russianTitle: "Вера", slug: "02-faith" },
    { week: 20, title: "The Grain the Size of a Hen's Egg", russianTitle: "Zerno s kurinoe yaytso", slug: "20-the-grain" },
    // ... all 52 weeks
  ];

  const handleWeekSelect = (week: number) => {
    const weekInfo = allWeeks.find(w => w.week === week);
    if (weekInfo) {
      // Navigate to the selected week
      window.location.href = `/readings/${weekInfo.slug}`;
    }
  };

  return (
    <div className="reader-container">
      {/* Jump button in header/navigation */}
      <header className="flex items-center justify-between p-4">
        <h1>Circle of Reading</h1>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Jump to Week</span>
        </button>
      </header>

      {/* Reading content */}
      <main className="reading-content">
        {/* Your reading content here */}
      </main>

      {/* Jump drawer */}
      <JumpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onWeekSelect={handleWeekSelect}
        weeks={allWeeks}
        currentWeek={getCurrentWeek() || undefined}
      />
    </div>
  );
}

/**
 * Example 2: Integration with Progress Rail
 * Opens drawer when clicking on a month in the progress rail
 */
export function ProgressRailWithJumpDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [initialMonth, setInitialMonth] = useState<string>();
  const { getProgress } = useReading();

  const allWeeks: WeekInfo[] = []; // Load your weeks

  const handleMonthClick = (month: string) => {
    setInitialMonth(month);
    setIsDrawerOpen(true);
  };

  const handleWeekSelect = (week: number) => {
    // Navigate to week
    const weekInfo = allWeeks.find(w => w.week === week);
    if (weekInfo) {
      window.location.href = `/readings/${weekInfo.slug}`;
    }
  };

  return (
    <div className="progress-rail">
      {/* Month sections in progress rail */}
      <div className="months-container">
        {['january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december'].map(month => (
          <button
            key={month}
            onClick={() => handleMonthClick(month)}
            className="month-section"
          >
            {month.substring(0, 3).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Jump drawer with pre-selected month */}
      <JumpDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setInitialMonth(undefined);
        }}
        onWeekSelect={handleWeekSelect}
        weeks={allWeeks}
        initialMonth={initialMonth}
      />
    </div>
  );
}

/**
 * Example 3: Integration with keyboard shortcuts
 * Press 'J' to open jump drawer
 */
export function ReaderWithKeyboardShortcuts() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getCurrentWeek } = useReading();

  const allWeeks: WeekInfo[] = []; // Load your weeks

  // Add keyboard shortcut
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'J' key to jump
      if (e.key === 'j' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsDrawerOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  const handleWeekSelect = (week: number) => {
    const weekInfo = allWeeks.find(w => w.week === week);
    if (weekInfo) {
      window.location.href = `/readings/${weekInfo.slug}`;
    }
  };

  return (
    <div className="reader-container">
      <div className="keyboard-hint">
        Press <kbd>J</kbd> to jump to any week
      </div>

      <JumpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onWeekSelect={handleWeekSelect}
        weeks={allWeeks}
        currentWeek={getCurrentWeek() || undefined}
      />
    </div>
  );
}

/**
 * Example 4: Integration with Astro (for server-side rendering)
 * This shows how to fetch weeks from Astro content collections
 */

// In your Astro component (.astro file):
/*
---
import { getCollection } from 'astro:content';
import { JumpDrawer } from '../../components/reader/JumpDrawer';

// Fetch all readings
const readings = await getCollection('readings');

// Transform to WeekInfo format
const allWeeks = readings
  .map(reading => ({
    week: reading.data.number,
    title: reading.data.title,
    russianTitle: reading.data.russianTitle,
    slug: reading.slug,
  }))
  .sort((a, b) => a.week - b.week);
---

<div class="reader-container">
  <button id="jump-button">Jump to Week</button>

  <JumpDrawer
    client:load
    isOpen={false}
    onClose={() => {}}
    onWeekSelect={(week) => {
      const weekInfo = allWeeks.find(w => w.week === week);
      if (weekInfo) {
        window.location.href = `/readings/${weekInfo.slug}`;
      }
    }}
    weeks={allWeeks}
  />
</div>

<script>
  // Handle button click on client side
  document.getElementById('jump-button')?.addEventListener('click', () => {
    // Trigger drawer open via custom event
    document.dispatchEvent(new CustomEvent('open-jump-drawer'));
  });
</script>
*/

/**
 * Example 5: Fetching weeks data from content directory
 */
export async function loadAllWeeks(): Promise<WeekInfo[]> {
  // This would be implemented based on your content structure
  // Example with fetch:
  const response = await fetch('/api/weeks');
  const weeks = await response.json();

  return weeks.map((week: any) => ({
    week: week.number,
    title: week.title,
    russianTitle: week.russianTitle,
    slug: week.slug,
  }));
}

/**
 * Example 6: With loading state
 */
export function ReaderWithLoadingState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [weeks, setWeeks] = useState<WeekInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentWeek } = useReading();

  // Load weeks on mount
  useState(() => {
    loadAllWeeks().then(data => {
      setWeeks(data);
      setIsLoading(false);
    });
  });

  const handleWeekSelect = (week: number) => {
    const weekInfo = weeks.find(w => w.week === week);
    if (weekInfo) {
      window.location.href = `/readings/${weekInfo.slug}`;
    }
  };

  return (
    <div className="reader-container">
      <button
        onClick={() => setIsDrawerOpen(true)}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Jump to Week'}
      </button>

      {!isLoading && (
        <JumpDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onWeekSelect={handleWeekSelect}
          weeks={weeks}
          currentWeek={getCurrentWeek() || undefined}
        />
      )}
    </div>
  );
}
