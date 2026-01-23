/**
 * MinimalLauncher - Three-link navigation for returning visitors
 * Checks visitor state and redirects to /welcome if needed
 */

import { useState, useEffect } from 'react';
import {
  needsWelcome,
  needsRedesignAcknowledgment,
} from '../../lib/state/visitor';
import { loadState } from '../../lib/state/storage';
import { formatWeekNumber } from '../../lib/utils/weeks';

interface WeekData {
  week: number;
  title: string;
  slug: string;
}

interface MinimalLauncherProps {
  weeks: WeekData[];
}

/**
 * Get the current week of the year (1-52)
 */
function getCurrentWeekOfYear(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return Math.max(1, Math.min(52, weekNumber));
}

/**
 * Format today's date as "January 22"
 */
function formatTodayDate(): string {
  const now = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[now.getMonth()]} ${now.getDate()}`;
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

    // Get continue week from progress (most recent)
    const progress = loadState();
    if (progress?.recents?.length) {
      setContinueWeek(progress.recents[0]);
    }

    setMounted(true);
  }, []);

  // Skeleton placeholder to prevent CLS - matches actual nav structure (2 links by default)
  if (!mounted) {
    return (
      <nav
        className="flex flex-col gap-6 py-20 text-center"
        aria-label="Loading navigation"
        aria-busy="true"
      >
        <div className="h-7 w-72 mx-auto bg-[var(--color-gray-800)] light:bg-[var(--color-gray-200)] rounded animate-pulse" />
        <div className="h-7 w-36 mx-auto bg-[var(--color-gray-800)] light:bg-[var(--color-gray-200)] rounded animate-pulse" />
      </nav>
    );
  }

  const currentWeek = getCurrentWeekOfYear();
  const currentWeekData = weeks.find(w => w.week === currentWeek);
  const currentSlug = currentWeekData?.slug || formatWeekNumber(currentWeek);

  return (
    <nav
      className="flex flex-col gap-6 py-20 text-center"
      aria-label="Main navigation"
    >
      {/* This Week */}
      <a
        href={`/week/${currentSlug}/`}
        className="text-lg font-serif text-[var(--color-gray-200)] light:text-[var(--color-gray-700)] hover:text-white light:hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        This Week: {formatTodayDate()} (Week {currentWeek})
      </a>

      {/* Continue (conditional) */}
      {continueWeek && continueWeek !== currentWeek && (
        <a
          href={`/week/${formatWeekNumber(continueWeek)}/`}
          className="text-lg font-serif text-[var(--color-gray-200)] light:text-[var(--color-gray-700)] hover:text-white light:hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Continue: Week {continueWeek}
        </a>
      )}

      {/* Browse */}
      <a
        href="/calendar/"
        className="text-lg font-serif text-[var(--color-gray-200)] light:text-[var(--color-gray-700)] hover:text-white light:hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Browse Calendar
      </a>
    </nav>
  );
}
