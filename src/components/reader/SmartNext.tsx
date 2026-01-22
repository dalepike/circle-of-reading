/**
 * Circle of Reading - Smart Next Panel Component
 *
 * Appears when the reader reaches the end of a reading.
 * Provides intelligent navigation based on reading context:
 * - Continue to next week
 * - Return to current month
 * - Return to last visited week
 * - Open index
 *
 * Design: Minimal black & white aesthetic with smooth animations
 */

import { useReading } from '../../lib/state/ReadingContext';
import { getNextWeek, formatWeekNumber, getMonth } from '../../lib/utils/weeks';

interface SmartNextProps {
  currentWeek: number;
  nextWeek: {
    week: number;
    title: string;
    slug: string;
  } | null;
  onNextClick: () => void;
  onMonthClick: () => void; // Back to this month
  onRecentClick: () => void; // Return to last visited
  onIndexClick: () => void; // Open index
  isVisible: boolean; // Controlled by scroll threshold
}

export function SmartNext({
  currentWeek,
  nextWeek,
  onNextClick,
  onMonthClick,
  onRecentClick,
  onIndexClick,
  isVisible,
}: SmartNextProps) {
  const currentMonth = getMonth(currentWeek);
  const { state } = useReading();

  // Get last visited that's not current
  const lastVisited = state.recents.find(w => w !== currentWeek);

  // Capitalize first letter of month
  const capitalizeMonth = (month: string) => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        transition-all duration-500 ease-out
        ${isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
        }
      `}
      role="navigation"
      aria-label="Next reading navigation"
    >
      <div className="max-w-3xl mx-auto px-5 pb-8">
        {/* Panel Container */}
        <div className="
          bg-black/95 light:bg-white/95
          backdrop-blur-md
          border border-gray-800 light:border-gray-200
          p-8
          shadow-2xl
        ">
          {/* Title */}
          <h2 className="
            font-sans text-sm font-light uppercase tracking-widest
            text-gray-400 light:text-gray-500
            text-center mb-6
          ">
            What's Next?
          </h2>

          {/* Primary CTA - Next Week */}
          {nextWeek ? (
            <button
              onClick={onNextClick}
              className="
                w-full mb-6
                bg-white light:bg-black
                text-black light:text-white
                font-sans text-base font-normal
                px-6 py-4
                border border-white light:border-black
                transition-all duration-200
                hover:bg-gray-100 light:hover:bg-gray-900
                hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-white light:focus:ring-black focus:ring-offset-2 focus:ring-offset-black light:focus:ring-offset-white
                active:scale-[0.98]
              "
              aria-label={`Continue to ${formatWeekNumber(nextWeek.week)}: ${nextWeek.title}`}
            >
              <span className="block">
                Continue to <span className="font-medium">{formatWeekNumber(nextWeek.week)}</span>: {nextWeek.title}
                <span className="ml-2" aria-hidden="true">→</span>
              </span>
            </button>
          ) : (
            <div className="
              w-full mb-6
              text-center
              font-sans text-base font-light
              text-gray-400 light:text-gray-500
              px-6 py-4
            ">
              You've reached the end of the Circle of Reading
            </div>
          )}

          {/* Secondary Actions */}
          <nav className="
            flex flex-wrap items-center justify-center gap-x-4 gap-y-2
            font-sans text-sm font-light
            text-gray-400 light:text-gray-500
          " aria-label="Secondary navigation">
            {/* Back to Month */}
            <button
              onClick={onMonthClick}
              className="
                hover:text-white light:hover:text-black
                transition-colors duration-200
                focus:outline-none focus:underline
                underline-offset-4
              "
              aria-label={`Back to ${capitalizeMonth(currentMonth)}`}
            >
              Back to {capitalizeMonth(currentMonth)}
            </button>

            {/* Separator */}
            <span aria-hidden="true" className="text-gray-600 light:text-gray-400">·</span>

            {/* Return to Recent (only show if there's a last visited) */}
            {lastVisited && (
              <>
                <button
                  onClick={onRecentClick}
                  className="
                    hover:text-white light:hover:text-black
                    transition-colors duration-200
                    focus:outline-none focus:underline
                    underline-offset-4
                  "
                  aria-label={`Return to ${formatWeekNumber(lastVisited)}`}
                >
                  Return to {formatWeekNumber(lastVisited)}
                </button>
                <span aria-hidden="true" className="text-gray-600 light:text-gray-400">·</span>
              </>
            )}

            {/* Open Index */}
            <button
              onClick={onIndexClick}
              className="
                hover:text-white light:hover:text-black
                transition-colors duration-200
                focus:outline-none focus:underline
                underline-offset-4
              "
              aria-label="Open index"
            >
              Open Index
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
