/**
 * Circle of Reading - Progress Rail Component
 * Vertical navigation rail showing W01-W52 progress with month grouping
 */

import { useReading } from '../../lib/state/ReadingContext';
import { MONTH_TO_WEEKS, getMonth, formatWeekNumber } from '../../lib/utils/weeks';
import type { ReadingState } from '../../lib/types/reading';
import { useState } from 'react';

interface ProgressRailProps {
  currentWeek: number;
  onWeekSelect: (week: number) => void;
  onMonthClick?: (month: string) => void;
  collapsed?: boolean; // For mobile collapsed state
}

interface TooltipData {
  week: number;
  month: string;
  title?: string;
}

export function ProgressRail({
  currentWeek,
  onWeekSelect,
  onMonthClick,
  collapsed = false
}: ProgressRailProps) {
  const { state, getProgress } = useReading();
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  // Month names in order
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  // Get last 5 recents for "trail" effect
  const recentTrail = state.recents.slice(0, 5);

  // Determine tick styling based on state
  const getTickClasses = (week: number, weekState: ReadingState): string => {
    const isCurrent = week === currentWeek;
    const isRecent = recentTrail.includes(week);

    // Base classes
    let classes = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ';

    // State-based styling
    switch (weekState) {
      case 'UNSEEN':
        // Empty outline only
        classes += 'border border-gray-600 hover:border-gray-400 ';
        if (collapsed) classes += 'bg-transparent ';
        break;

      case 'VISITED':
        // Lighter fill
        classes += 'bg-gray-600 border border-gray-600 hover:bg-gray-500 hover:border-gray-500 ';
        break;

      case 'IN_PROGRESS':
        // Partial fill effect (half circle via gradient)
        classes += 'bg-gradient-to-r from-gray-300 from-50% to-transparent to-50% ';
        classes += 'border border-gray-400 hover:border-gray-300 ';
        break;

      case 'COMPLETED':
        // Solid fill
        classes += 'bg-white border border-white hover:bg-gray-200 hover:border-gray-200 ';
        break;
    }

    // Current week emphasis (ring effect)
    if (isCurrent) {
      classes += 'ring-2 ring-white ring-offset-2 ring-offset-black ';
      // Light mode ring
      classes += 'light:ring-black light:ring-offset-white ';
    }

    // Recent trail glow effect
    if (isRecent && !isCurrent) {
      const trailIndex = recentTrail.indexOf(week);
      const opacity = 30 - (trailIndex * 5); // Fade from 30% to 10%
      classes += `shadow-[0_0_8px_rgba(255,255,255,${opacity / 100})] `;
    }

    // Light mode adjustments
    classes += 'light:border-gray-300 light:hover:border-gray-600 ';
    classes += 'light:[&.bg-gray-600]:bg-gray-400 light:[&.bg-gray-600]:hover:bg-gray-500 ';
    classes += 'light:[&.bg-white]:bg-black light:[&.bg-white]:hover:bg-gray-800 ';
    classes += 'light:[&.bg-gradient-to-r]:from-gray-600 ';

    return classes;
  };

  // Handle week click
  const handleWeekClick = (week: number) => {
    onWeekSelect(week);
  };

  // Handle month label click
  const handleMonthClick = (month: string) => {
    if (onMonthClick) {
      onMonthClick(month);
    }
  };

  // Show tooltip on hover
  const handleWeekHover = (week: number, event: React.MouseEvent) => {
    const month = getMonth(week);
    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
    setTooltipData({
      week,
      month: monthCapitalized,
      // Title would come from parent/props if needed
    });
  };

  // Hide tooltip
  const handleWeekLeave = () => {
    setTooltipData(null);
  };

  // Capitalize month name
  const capitalizeMonth = (month: string): string => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  if (collapsed) {
    return (
      <nav
        className="progress-rail w-8 h-full border-r border-gray-800 light:border-gray-200 bg-black light:bg-white overflow-y-auto"
        aria-label="Reading progress"
      >
        <div className="py-4 px-1.5 space-y-1">
          {/* Collapsed state - show only dots */}
          {Array.from({ length: 52 }, (_, i) => i + 1).map(week => {
            const progress = getProgress(week);
            return (
              <div
                key={week}
                className={getTickClasses(week, progress.state)}
                onClick={() => handleWeekClick(week)}
                aria-label={`Week ${week}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleWeekClick(week)}
              />
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="progress-rail w-20 h-full border-r border-gray-800 light:border-gray-200 bg-black light:bg-white overflow-y-auto relative"
      aria-label="Reading progress"
    >
      {/* Tooltip */}
      {tooltipData && (
        <div
          className="fixed z-50 bg-gray-900 light:bg-gray-100 border border-gray-700 light:border-gray-300 px-3 py-2 rounded text-xs font-sans pointer-events-none"
          style={{
            left: '5.5rem', // Position to right of rail
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <div className="text-white light:text-black font-medium">
            {formatWeekNumber(tooltipData.week)}
          </div>
          <div className="text-gray-400 light:text-gray-600">
            {tooltipData.month}
          </div>
          {tooltipData.title && (
            <div className="text-gray-300 light:text-gray-700 mt-1 italic">
              {tooltipData.title}
            </div>
          )}
        </div>
      )}

      {/* Month groups with week ticks */}
      <div className="py-6 space-y-6">
        {months.map(month => {
          const weeks = MONTH_TO_WEEKS[month];
          const monthCapitalized = capitalizeMonth(month);
          const monthAbbrev = monthCapitalized.slice(0, 3);

          return (
            <div key={month} className="relative">
              {/* Month label */}
              <div
                className={`
                  text-[0.625rem] font-sans font-light uppercase tracking-widest
                  text-gray-500 light:text-gray-400 px-3 mb-2
                  ${onMonthClick ? 'cursor-pointer hover:text-gray-300 light:hover:text-gray-600' : ''}
                `}
                onClick={() => handleMonthClick(month)}
                role={onMonthClick ? 'button' : undefined}
                tabIndex={onMonthClick ? 0 : undefined}
                onKeyDown={(e) => onMonthClick && e.key === 'Enter' && handleMonthClick(month)}
                aria-label={`${monthCapitalized} - ${weeks.length} weeks`}
              >
                {monthAbbrev}
              </div>

              {/* Week ticks */}
              <div className="space-y-2 px-3">
                {weeks.map(week => {
                  const progress = getProgress(week);

                  return (
                    <div
                      key={week}
                      className="flex items-center gap-2"
                    >
                      {/* Tick dot */}
                      <div
                        className={getTickClasses(week, progress.state)}
                        onClick={() => handleWeekClick(week)}
                        onMouseEnter={(e) => handleWeekHover(week, e)}
                        onMouseLeave={handleWeekLeave}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleWeekClick(week)}
                        aria-label={`Week ${week} - ${progress.state.toLowerCase().replace('_', ' ')}`}
                      />

                      {/* Week number (visible on hover or for current week) */}
                      {week === currentWeek && (
                        <span className="text-[0.625rem] font-sans text-gray-400 light:text-gray-600">
                          {formatWeekNumber(week)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Month separator - subtle line */}
              {month !== 'december' && (
                <div className="mt-4 mx-3 border-b border-gray-900 light:border-gray-100" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
