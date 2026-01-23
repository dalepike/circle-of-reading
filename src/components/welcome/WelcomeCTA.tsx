/**
 * WelcomeCTA - Primary call-to-action for the welcome page
 * Marks visitor as introduced and navigates to the current week's reading
 */

import { useEffect, useState } from 'react';
import { setIntroduced, setRedesignAcknowledged } from '../../lib/state/visitor';
import { formatWeekNumber } from '../../lib/utils/weeks';

interface WeekData {
  week: number;
  title: string;
  slug: string;
}

interface WelcomeCTAProps {
  weeks: WeekData[];
  returning?: boolean;
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

export function WelcomeCTA({ weeks, returning = false }: WelcomeCTAProps) {
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  useEffect(() => {
    setCurrentWeek(getCurrentWeekOfYear());
  }, []);

  const handleClick = () => {
    if (returning) {
      setRedesignAcknowledged();
    }
    setIntroduced();
  };

  if (!currentWeek) {
    return null;
  }

  const weekData = weeks.find(w => w.week === currentWeek);
  const slug = weekData?.slug || formatWeekNumber(currentWeek);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Primary CTA */}
      <a
        href={`/week/${slug}/`}
        onClick={handleClick}
        className="continue-button inline-flex items-center gap-3 px-8 py-4 font-sans text-sm font-medium tracking-wide uppercase hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <span>Read Week {currentWeek}'s Entry</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>

      {/* Secondary link */}
      <a
        href="/calendar/"
        onClick={handleClick}
        className="text-sm font-sans text-[var(--color-gray-400)] light:text-[var(--color-gray-500)] hover:text-white light:hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Browse the Calendar
      </a>
    </div>
  );
}
