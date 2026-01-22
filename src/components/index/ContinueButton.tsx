/**
 * ContinueButton - Shows today's date and a simple link to this week's reading
 */

import { useEffect, useState } from 'react';
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
  return Math.max(1, Math.min(52, weekNumber));
}

/**
 * Format today's date as "Wed Jan 21"
 */
function formatTodayDate(): string {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;
}

function ContinueButtonInner({ weeks }: ContinueButtonProps) {
  const [dateInfo, setDateInfo] = useState({ date: '', week: 0, slug: '' });

  useEffect(() => {
    const weekNum = getCurrentWeekOfYear();
    const weekData = weeks.find(w => w.week === weekNum) || weeks[0];
    setDateInfo({
      date: formatTodayDate(),
      week: weekNum,
      slug: weekData?.slug || 'W01',
    });
  }, [weeks]);

  if (!dateInfo.week) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Date display */}
      <p className="font-sans text-sm text-[var(--color-gray-400)] light:text-[var(--color-gray-500)] tracking-wide">
        {dateInfo.date} <span className="mx-2 opacity-50">·</span> Week {String(dateInfo.week).padStart(2, '0')}
      </p>

      {/* Simple button */}
      <a
        href={`/week/${dateInfo.slug}/`}
        className="continue-button inline-flex items-center gap-3 px-8 py-4 font-sans text-sm font-medium tracking-wide uppercase hover:opacity-80 transition-opacity duration-200"
      >
        <span>View This Week's Reading</span>
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
    </div>
  );
}

export function ContinueButton({ weeks }: ContinueButtonProps) {
  return <ContinueButtonInner weeks={weeks} />;
}
