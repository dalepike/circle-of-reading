/**
 * ReaderApp - Main React island for the Circle of Reading reader experience
 *
 * This component orchestrates all reader UI components:
 * - ProgressRail (left navigation)
 * - MicroHeader (sticky top header)
 * - JumpDrawer (week selection overlay)
 * - SmartNext (end-of-reading panel)
 *
 * Uses ReadingProvider for coordinated state management across all components.
 */

import { useState, useEffect, useCallback } from 'react';
import { ReadingProvider, useReading } from '../../lib/state/ReadingContext';
import { ProgressRail } from './ProgressRail';
import { MicroHeader } from './MicroHeader';
import { JumpDrawer } from './JumpDrawer';
import { SmartNext } from './SmartNext';
import { getMonth } from '../../lib/utils/weeks';

export interface WeekInfo {
  week: number;
  title: string;
  russianTitle?: string;
  slug: string;
  month: string;
}

interface ReaderAppProps {
  currentWeek: number;
  title: string;
  russianTitle?: string;
  month: string;
  volume?: number;
  prevWeek: WeekInfo | null;
  nextWeek: WeekInfo | null;
  allWeeks: WeekInfo[];
}

function ReaderAppInner({
  currentWeek,
  title,
  russianTitle,
  month,
  volume,
  prevWeek,
  nextWeek,
  allWeeks,
}: ReaderAppProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSmartNextVisible, setIsSmartNextVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { visitWeek } = useReading();

  // Mark current week as visited on mount
  useEffect(() => {
    visitWeek(currentWeek);
  }, [currentWeek, visitWeek]);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection for SmartNext visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = documentHeight - 400; // Show when within 400px of bottom

      setIsSmartNextVisible(scrollPosition >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handlers - wrapped in useCallback to prevent infinite re-renders
  const handleWeekSelect = useCallback((week: number) => {
    const weekInfo = allWeeks.find(w => w.week === week);
    if (weekInfo) {
      window.location.href = `/week/W${week.toString().padStart(2, '0')}/`;
    }
  }, [allWeeks]);

  const handlePrevClick = useCallback(() => {
    if (prevWeek) {
      window.location.href = `/week/W${prevWeek.week.toString().padStart(2, '0')}/`;
    }
  }, [prevWeek]);

  const handleNextClick = useCallback(() => {
    if (nextWeek) {
      window.location.href = `/week/W${nextWeek.week.toString().padStart(2, '0')}/`;
    }
  }, [nextWeek]);

  const handleMonthClick = useCallback((monthName?: string) => {
    const targetMonth = monthName || month;
    window.location.href = `/${targetMonth.toLowerCase()}/`;
  }, [month]);

  const handleIndexClick = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleRecentClick = useCallback(() => {
    // This will be handled by the SmartNext component using state.recents
    setIsDrawerOpen(false);
  }, []);

  const handleHeaderClick = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      {/* Progress Rail - Hidden on mobile */}
      {!isMobile && (
        <aside className="fixed top-0 left-0 h-full z-30">
          <ProgressRail
            currentWeek={currentWeek}
            onWeekSelect={handleWeekSelect}
            onMonthClick={handleMonthClick}
            collapsed={false}
          />
        </aside>
      )}

      {/* Micro Header */}
      <div className="fixed top-0 left-0 right-0 z-40" style={{ marginLeft: isMobile ? 0 : '5rem' }}>
        <MicroHeader
          week={currentWeek}
          title={title}
          month={month}
          russianTitle={russianTitle}
          volume={volume}
          onHeaderClick={handleHeaderClick}
          onPrevClick={handlePrevClick}
          onNextClick={handleNextClick}
          onIndexClick={handleIndexClick}
          hasPrev={!!prevWeek}
          hasNext={!!nextWeek}
        />
      </div>

      {/* Jump Drawer */}
      <JumpDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onWeekSelect={handleWeekSelect}
        weeks={allWeeks}
        currentWeek={currentWeek}
        initialMonth={month.toLowerCase()}
      />

      {/* Smart Next Panel */}
      <SmartNext
        currentWeek={currentWeek}
        nextWeek={nextWeek}
        onNextClick={handleNextClick}
        onMonthClick={handleMonthClick}
        onRecentClick={handleRecentClick}
        onIndexClick={handleIndexClick}
        isVisible={isSmartNextVisible}
      />
    </>
  );
}

// Wrapper that provides the ReadingContext
export function ReaderApp(props: ReaderAppProps) {
  return (
    <ReadingProvider>
      <ReaderAppInner {...props} />
    </ReadingProvider>
  );
}

export default ReaderApp;
