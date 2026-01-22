/**
 * WeekCard - Individual week card for calendar grid
 * Shows week number, title, status indicator, and Russian title on hover
 */

import { useState, useEffect } from 'react';
import { useReading } from '../../lib/state/ReadingContext';
import { formatWeekNumber } from '../../lib/utils/weeks';
import type { ReadingState } from '../../lib/types/reading';

interface WeekCardProps {
  week: number;
  title: string;
  russianTitle?: string;
  href: string;
}

export function WeekCard({ week, title, russianTitle, href }: WeekCardProps) {
  const { getProgress } = useReading();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const progress = isClient ? getProgress(week) : { state: 'UNSEEN' as ReadingState, week, scrollPosition: 0, lastUpdated: '' };

  // Determine status indicator color
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

  // Determine status label for accessibility
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
        {/* Status Indicator */}
        <div
          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${statusColor}`}
          aria-hidden="true"
        />

        {/* Content */}
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

      {/* Tooltip with Russian Title */}
      {showTooltip && russianTitle && (
        <div className="absolute left-0 top-full mt-2 z-10 px-3 py-2 bg-black light:bg-white border border-[var(--color-gray-700)] light:border-[var(--color-gray-300)] font-serif text-sm whitespace-nowrap pointer-events-none animate-fadeIn">
          {russianTitle}
        </div>
      )}

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
    </div>
  );
}
