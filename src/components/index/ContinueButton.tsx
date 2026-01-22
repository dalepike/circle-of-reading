/**
 * ContinueButton - Smart reading continuation component
 * Shows "Continue W##: Title" for in-progress or "Start Reading" for new users
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

function ContinueButtonInner({ weeks }: ContinueButtonProps) {
  const { state, getCurrentWeek } = useReading();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Find the week to continue
  const getContinueWeek = (): WeekData | null => {
    if (!isClient) {
      // During SSR, just show week 1
      return weeks[0] || null;
    }

    // 1. Check if there's a current IN_PROGRESS week
    const currentWeek = getCurrentWeek();
    if (currentWeek) {
      const week = weeks.find((w) => w.week === currentWeek);
      if (week) return week;
    }

    // 2. Find the first unread week
    const firstUnread = weeks.find((w) => {
      const progress = state.progress[w.week];
      return !progress || progress.state === 'UNSEEN' || progress.state === 'VISITED';
    });
    if (firstUnread) return firstUnread;

    // 3. All weeks completed - show week 1
    return weeks[0] || null;
  };

  const continueWeek = getContinueWeek();

  if (!continueWeek) {
    return null;
  }

  const progress = state.progress[continueWeek.week];
  const isInProgress = progress && progress.state === 'IN_PROGRESS';
  const isCompleted = progress && progress.state === 'COMPLETED';

  // Determine button text
  let buttonText = 'Start Reading';
  if (isInProgress) {
    buttonText = `Continue ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  } else if (isCompleted) {
    buttonText = `Revisit ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  } else if (progress && progress.state === 'VISITED') {
    buttonText = `Read ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  } else if (continueWeek.week > 1) {
    buttonText = `Begin ${formatWeekNumber(continueWeek.week)}: ${continueWeek.title}`;
  }

  return (
    <a
      href={`/week/${continueWeek.slug}/`}
      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black light:bg-black light:text-white font-sans text-sm font-medium tracking-wide uppercase hover:opacity-80 transition-opacity duration-200"
    >
      <span>{buttonText}</span>
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
