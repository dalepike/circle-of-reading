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

function WeekCardInner({ week, title, russianTitle, href, isCurrentWeek }: {
  week: number;
  title: string;
  russianTitle?: string;
  href: string;
  isCurrentWeek: boolean;
}) {
  const { getProgress } = useReading();
  const [showTooltip, setShowTooltip] = useState(false);

  const progress = getProgress(week);
  const isCompleted = progress.state === 'COMPLETED';

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

  const statusLabel = getStatusLabel(progress.state);

  // Base classes for the card
  const cardClasses = [
    'flex items-start gap-3 px-3 py-2 transition-colors duration-200 group',
    'hover:bg-[var(--color-gray-900)] light:hover:bg-[var(--color-gray-50)]',
    isCurrentWeek ? 'ring-1 ring-white/50 light:ring-black/30 bg-[var(--color-gray-900)]/50 light:bg-[var(--color-gray-100)]/50' : '',
    isCompleted ? 'opacity-70' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="relative">
      <a
        href={href}
        className={cardClasses}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Week ${week}: ${title} - ${statusLabel}${isCurrentWeek ? ' (Current week)' : ''}`}
      >
        {/* Status indicator */}
        <div className="w-4 h-4 mt-1.5 flex-shrink-0 flex items-center justify-center" aria-hidden="true">
          {isCompleted ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : isCurrentWeek ? (
            <div className="w-2.5 h-2.5 rounded-full bg-white light:bg-black animate-pulse" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-[var(--color-gray-700)] light:bg-[var(--color-gray-300)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className={`font-sans text-xs font-medium uppercase tracking-wider ${isCurrentWeek ? 'text-white light:text-black' : 'text-[var(--color-gray-500)]'}`}>
              {formatWeekNumber(week)}
              {isCurrentWeek && <span className="ml-2 text-[0.65rem] normal-case tracking-normal opacity-70">now</span>}
            </span>
          </div>
          <h4 className={`font-serif text-sm leading-snug mt-1 group-hover:text-white light:group-hover:text-black transition-colors ${isCompleted ? 'line-through decoration-1' : ''}`}>
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
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    // Calculate current week on client side only
    setCurrentWeek(getCurrentWeekOfYear());
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
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
                  isCurrentWeek={week.week === currentWeek}
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
