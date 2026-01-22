/**
 * ContinueButton - Smart reading continuation component
 * Shows "Continue W##: Title" for in-progress, or defaults to today's week for new users
 */

import { useEffect, useState } from 'react';
import { ReadingProvider, useReading } from '../../lib/state/ReadingContext';
import { formatWeekNumber } from '../../lib/utils/weeks';

interface WeekData {
  week: number;
  title: string;
  russianTitle?: string;
  slug: string;
  month: string;
}

interface ContinueButtonProps {
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
  // Clamp to 1-52
  return Math.max(1, Math.min(52, weekNumber));
}

function ContinueButtonInner({ weeks }: ContinueButtonProps) {
  const { state, getCurrentWeek } = useReading();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Find the week to continue
  const getContinueWeek = (): WeekData | null => {
    if (!isClient) {
      // During SSR, show today's week
      const todayWeek = getCurrentWeekOfYear();
      return weeks.find(w => w.week === todayWeek) || weeks[0] || null;
    }

    // 1. Check if there's a current IN_PROGRESS week
    const currentWeek = getCurrentWeek();
    if (currentWeek) {
      const week = weeks.find((w) => w.week === currentWeek);
      if (week) return week;
    }

    // 2. Check if user has any reading history
    const hasHistory = Object.keys(state.progress).length > 0;

    if (hasHistory) {
      // Find the first unread week
      const firstUnread = weeks.find((w) => {
        const progress = state.progress[w.week];
        return !progress || progress.state === 'UNSEEN' || progress.state === 'VISITED';
      });
      if (firstUnread) return firstUnread;
    }

    // 3. New user - default to today's week of the year
    const todayWeek = getCurrentWeekOfYear();
    const todayReading = weeks.find(w => w.week === todayWeek);
    if (todayReading) return todayReading;

    // 4. Fallback to week 1
    return weeks[0] || null;
  };

  const continueWeek = getContinueWeek();

  if (!continueWeek) {
    return null;
  }

  const progress = state.progress[continueWeek.week];
  const isInProgress = progress && progress.state === 'IN_PROGRESS';
  const isCompleted = progress && progress.state === 'COMPLETED';
  const hasHistory = Object.keys(state.progress).length > 0;

  // Determine button text - short version for mobile, full for desktop
  let shortText = `Read ${formatWeekNumber(continueWeek.week)}`;
  let fullText = `Read This Week: ${continueWeek.title}`;

  if (isInProgress) {
    shortText = `Continue ${formatWeekNumber(continueWeek.week)}`;
    fullText = `Continue ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  } else if (isCompleted) {
    shortText = `Revisit ${formatWeekNumber(continueWeek.week)}`;
    fullText = `Revisit ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  } else if (progress && progress.state === 'VISITED') {
    shortText = `Read ${formatWeekNumber(continueWeek.week)}`;
    fullText = `Read ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  } else if (hasHistory) {
    shortText = `Begin ${formatWeekNumber(continueWeek.week)}`;
    fullText = `Begin ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  }

  return (
    <a
      href={`/week/${continueWeek.slug}/`}
      className="continue-button inline-flex items-center gap-3 px-6 sm:px-8 py-4 font-sans text-sm font-medium tracking-wide uppercase hover:opacity-80 transition-opacity duration-200"
    >
      <span className="sm:hidden">{shortText}</span>
      <span className="hidden sm:inline">{fullText}</span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
}

export function ContinueButton({ weeks }: ContinueButtonProps) {
  return (
    <ReadingProvider>
      <ContinueButtonInner weeks={weeks} />
    </ReadingProvider>
  );
}
