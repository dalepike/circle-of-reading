/**
 * JumpDrawer - Navigation drawer for jumping to any week in Circle of Reading
 * Provides month-based filtering, status indicators, and recent weeks access
 */

import { useEffect, useRef, useState } from 'react';
import { useReading } from '../../lib/state/ReadingContext';
import { MONTH_TO_WEEKS, formatWeekNumber } from '../../lib/utils/weeks';
import type { ReadingState } from '../../lib/types/reading';

interface WeekInfo {
  week: number;
  title: string;
  russianTitle?: string;
  slug: string;
}

interface JumpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onWeekSelect: (week: number) => void;
  weeks: WeekInfo[]; // All 52 weeks with their info
  currentWeek?: number;
  initialMonth?: string; // If opened from month click, filter to this month
}

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const MONTH_ABBREV: Record<string, string> = {
  january: 'Jan',
  february: 'Feb',
  march: 'Mar',
  april: 'Apr',
  may: 'May',
  june: 'Jun',
  july: 'Jul',
  august: 'Aug',
  september: 'Sep',
  october: 'Oct',
  november: 'Nov',
  december: 'Dec',
};

/**
 * Get status indicator for a week's reading progress
 */
function getStatusIndicator(state: ReadingState): string {
  switch (state) {
    case 'COMPLETED':
      return '●'; // Filled circle
    case 'VISITED':
    case 'IN_PROGRESS':
      return '◦'; // Open circle with center
    case 'UNSEEN':
    default:
      return '○'; // Hollow circle
  }
}

/**
 * Get status color class for a week's reading progress
 */
function getStatusColor(state: ReadingState): string {
  switch (state) {
    case 'COMPLETED':
      return 'text-white light:text-black';
    case 'VISITED':
    case 'IN_PROGRESS':
      return 'text-[var(--color-gray-400)]';
    case 'UNSEEN':
    default:
      return 'text-[var(--color-gray-700)] light:text-[var(--color-gray-300)]';
  }
}

export function JumpDrawer({
  isOpen,
  onClose,
  onWeekSelect,
  weeks,
  currentWeek,
  initialMonth,
}: JumpDrawerProps) {
  const { getProgress, getRecentWeeks } = useReading();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || 'january');
  const drawerRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);

  // Get weeks for selected month
  const monthWeeks = MONTH_TO_WEEKS[selectedMonth] || [];
  const weeksData = weeks.filter((w) => monthWeeks.includes(w.week));

  // Get recent weeks (limit to 10)
  const recentWeeks = getRecentWeeks().slice(0, 10);
  const recentWeeksData = weeks.filter((w) => recentWeeks.includes(w.week));

  // ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close on backdrop click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return;

          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        document.addEventListener('keydown', handleTabKey);
        firstElement.focus();

        return () => document.removeEventListener('keydown', handleTabKey);
      }
    }
  }, [isOpen, selectedMonth]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleWeekClick = (week: number) => {
    onWeekSelect(week);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 light:bg-white/80 backdrop-blur-sm animate-fadeIn"
        aria-hidden="true"
      />

      {/* Drawer - slide from right on desktop, bottom sheet on mobile */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Jump to week"
        className="fixed z-50 bg-black light:bg-white border-l border-[var(--color-gray-800)] light:border-[var(--color-gray-200)] shadow-2xl
                   right-0 top-0 h-full w-full max-w-md
                   md:animate-slideInRight
                   max-md:bottom-0 max-md:top-auto max-md:h-[85vh] max-md:max-h-[85vh] max-md:rounded-t-lg max-md:border-l-0 max-md:border-t max-md:animate-slideUp"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-gray-800)] light:border-[var(--color-gray-200)]">
          <h2 className="text-xl font-serif">Jump to Week</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-gray-400)] hover:text-white light:hover:text-black transition-colors p-2 -mr-2"
            aria-label="Close drawer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Month selector */}
        <div className="border-b border-[var(--color-gray-800)] light:border-[var(--color-gray-200)] p-4">
          <div
            ref={monthScrollRef}
            role="tablist"
            aria-label="Select month"
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
          >
            {MONTHS.map((month) => {
              const isSelected = month === selectedMonth;
              return (
                <button
                  key={month}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${month}-weeks`}
                  onClick={() => setSelectedMonth(month)}
                  className={`
                    px-3 py-1.5 text-xs font-sans font-light uppercase tracking-widest whitespace-nowrap
                    border transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-white text-black light:bg-black light:text-white border-white light:border-black'
                        : 'bg-transparent text-[var(--color-gray-400)] border-[var(--color-gray-700)] light:border-[var(--color-gray-300)] hover:text-white light:hover:text-black hover:border-[var(--color-gray-500)]'
                    }
                  `}
                >
                  {MONTH_ABBREV[month]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Week list for selected month */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3
              id={`${selectedMonth}-label`}
              className="text-xs font-sans font-light uppercase tracking-widest text-[var(--color-gray-500)] mb-4"
            >
              {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}
            </h3>
            <ul
              id={`${selectedMonth}-weeks`}
              role="listbox"
              aria-labelledby={`${selectedMonth}-label`}
              className="space-y-1"
            >
              {weeksData.map((weekInfo) => {
                const progress = getProgress(weekInfo.week);
                const statusIndicator = getStatusIndicator(progress.state);
                const statusColor = getStatusColor(progress.state);
                const isCurrent = weekInfo.week === currentWeek;

                return (
                  <li key={weekInfo.week} role="option" aria-selected={isCurrent}>
                    <button
                      onClick={() => handleWeekClick(weekInfo.week)}
                      className={`
                        w-full flex items-start gap-3 p-3 text-left
                        hover:bg-[var(--color-gray-900)] light:hover:bg-[var(--color-gray-50)]
                        transition-colors duration-200 group
                        ${isCurrent ? 'bg-[var(--color-gray-900)] light:bg-[var(--color-gray-50)]' : ''}
                      `}
                    >
                      {/* Week number */}
                      <span className="text-xs font-sans font-light text-[var(--color-gray-500)] mt-0.5 flex-shrink-0">
                        {formatWeekNumber(weekInfo.week)}
                      </span>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-base leading-tight group-hover:text-white light:group-hover:text-black transition-colors">
                          {weekInfo.title}
                        </div>
                        {weekInfo.russianTitle && (
                          <div className="text-xs text-[var(--color-gray-500)] mt-1 font-serif italic">
                            {weekInfo.russianTitle}
                          </div>
                        )}
                      </div>

                      {/* Status indicator */}
                      <span
                        className={`text-lg flex-shrink-0 ${statusColor} transition-colors`}
                        aria-label={`Status: ${progress.state.toLowerCase()}`}
                      >
                        {statusIndicator}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recent weeks section */}
          {recentWeeksData.length > 0 && (
            <div className="border-t border-[var(--color-gray-800)] light:border-[var(--color-gray-200)] p-6">
              <h3 className="text-xs font-sans font-light uppercase tracking-widest text-[var(--color-gray-500)] mb-4">
                Recent
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentWeeksData.map((weekInfo) => {
                  const progress = getProgress(weekInfo.week);
                  const statusIndicator = getStatusIndicator(progress.state);
                  const statusColor = getStatusColor(progress.state);

                  return (
                    <button
                      key={weekInfo.week}
                      onClick={() => handleWeekClick(weekInfo.week)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-sans font-light
                                 border border-[var(--color-gray-700)] light:border-[var(--color-gray-300)]
                                 hover:border-[var(--color-gray-500)] light:hover:border-[var(--color-gray-400)]
                                 hover:bg-[var(--color-gray-900)] light:hover:bg-[var(--color-gray-50)]
                                 transition-all duration-200"
                      title={weekInfo.title}
                    >
                      <span className="text-[var(--color-gray-400)]">
                        {formatWeekNumber(weekInfo.week)}
                      </span>
                      <span className={statusColor}>{statusIndicator}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Fade in animation for backdrop */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Slide in from right for desktop */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Slide up from bottom for mobile */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Thin scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--color-gray-900);
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--color-gray-700);
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: var(--color-gray-600);
        }

        /* Light mode scrollbar */
        .light .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--color-gray-100);
        }

        .light .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--color-gray-300);
        }

        .light .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: var(--color-gray-400);
        }
      `}</style>
    </>
  );
}
