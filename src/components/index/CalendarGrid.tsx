/**
 * CalendarGrid - 12-month calendar grid with all week cards
 * Wraps everything in a single React context for proper state sharing
 */

import { useState, useEffect } from 'react';
import { ReadingProvider, useReading } from '../../lib/state/ReadingContext';
import { formatWeekNumber } from '../../lib/utils/weeks';
import type { ReadingState } from '../../lib/types/reading';

interface WeekData {
  week: number;
  title: string;
  russianTitle?: string;
  slug: string;
  month: string;
}

interface CalendarGridProps {
  weeks: WeekData[];
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

function WeekCardInner({ week, title, russianTitle, href }: {
  week: number;
  title: string;
  russianTitle?: string;
  href: string;
}) {
  const { getProgress } = useReading();
  const [showTooltip, setShowTooltip] = useState(false);

  const progress = getProgress(week);

  const getStatusColor = (state: ReadingState): string => {
    switch (state) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'VISITED':
        return 'bg-yellow-500';
      case 'UNSEEN':
      default:
        return 'bg-[var(--color-gray-700)]';
    }
  };

  const getStatusLabel = (state: ReadingState): string => {
    switch (state) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'VISITED':
        return 'Visited';
      case 'UNSEEN':
      default:
        return 'Unread';
    }
  };

  const statusColor = getStatusColor(progress.state);
  const statusLabel = getStatusLabel(progress.state);

  return (
    <div className="relative">
      <a
        href={href}
        className="flex items-start gap-3 px-3 py-2 hover:bg-[var(--color-gray-900)] light:hover:bg-[var(--color-gray-50)] transition-colors duration-200 group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Week ${week}: ${title} - ${statusLabel}`}
      >
        <div
          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${statusColor}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
              {formatWeekNumber(week)}
            </span>
          </div>
          <h4 className="font-serif text-sm leading-snug mt-1 group-hover:text-white light:group-hover:text-black transition-colors">
            {title}
          </h4>
        </div>
      </a>

      {showTooltip && russianTitle && (
        <div className="absolute left-0 top-full mt-2 z-10 px-3 py-2 bg-black light:bg-white border border-[var(--color-gray-700)] light:border-[var(--color-gray-300)] font-serif text-sm whitespace-nowrap pointer-events-none animate-fadeIn">
          {russianTitle}
        </div>
      )}
    </div>
  );
}

function CalendarGridInner({ weeks }: CalendarGridProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Group weeks by month
  const weeksByMonth = MONTHS.map(month => ({
    month,
    weeks: weeks.filter(w => w.month === month),
  }));

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>

      <div className="calendar-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
      }}>
        {weeksByMonth.map(({ month, weeks: monthWeeks }) => (
          <section
            key={month}
            className="month-section"
            id={month}
            style={{
              padding: '1.5rem',
              border: '1px solid var(--color-gray-800)',
            }}
          >
            <h3
              className="month-header"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1rem',
                color: 'var(--color-gray-400)',
              }}
            >
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </h3>
            <div className="week-cards" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              {monthWeeks.map(week => (
                <WeekCardInner
                  key={week.week}
                  week={week.week}
                  title={week.title}
                  russianTitle={week.russianTitle}
                  href={`/week/${week.slug}/`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export function CalendarGrid({ weeks }: CalendarGridProps) {
  return (
    <ReadingProvider>
      <CalendarGridInner weeks={weeks} />
    </ReadingProvider>
  );
}
