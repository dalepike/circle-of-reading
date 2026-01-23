/**
 * Circle of Reading - React Context for State Management
 * Provides reading progress state and actions throughout the app
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AppState, ReadingProgress } from '../types/reading';
import { loadState, saveState } from './storage';
import {
  createInitialState,
  markVisited,
  markInProgress,
  markCompleted,
  updateScrollPosition,
  getWeekProgress,
} from './progress';
import { addToRecents, getRecents } from './recents';

interface ReadingContextValue {
  state: AppState;
  // Actions
  visitWeek: (week: number) => void;
  startReading: (week: number, scrollPosition: number) => void;
  completeReading: (week: number) => void;
  updatePosition: (week: number, position: number) => void;
  // Getters
  getProgress: (week: number) => ReadingProgress;
  getRecentWeeks: () => number[];
  getCurrentWeek: () => number | null;
}

const ReadingContext = createContext<ReadingContextValue | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  // Initialize state - start with empty state, load from localStorage after mount
  const [state, setState] = useState<AppState>(() => createInitialState());
  const [isClient, setIsClient] = useState(false);

  // Load state from localStorage on mount (client-side only)
  useEffect(() => {
    setIsClient(true);
    const savedState = loadState();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  // Save state to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (isClient) {
      saveState(state);
    }
  }, [state, isClient]);

  // Action: Mark a week as visited (wrapped in useCallback for stable reference)
  const visitWeek = useCallback((week: number) => {
    setState((prevState) => {
      let newState = markVisited(prevState, week);
      newState = addToRecents(newState, week);
      return newState;
    });
  }, []);

  // Action: Start reading a week (mark as IN_PROGRESS)
  const startReading = useCallback((week: number, scrollPosition: number = 0) => {
    setState((prevState) => {
      let newState = markInProgress(prevState, week, scrollPosition);
      newState = addToRecents(newState, week);
      return newState;
    });
  }, []);

  // Action: Complete reading a week
  const completeReading = useCallback((week: number) => {
    setState((prevState) => markCompleted(prevState, week));
  }, []);

  // Action: Update scroll position for current week
  const updatePosition = useCallback((week: number, position: number) => {
    setState((prevState) => updateScrollPosition(prevState, week, position));
  }, []);

  // Getter: Get progress for a specific week
  const getProgress = (week: number): ReadingProgress => {
    return getWeekProgress(state, week);
  };

  // Getter: Get recent weeks list
  const getRecentWeeks = (): number[] => {
    return getRecents(state);
  };

  // Getter: Get current week being read (week with IN_PROGRESS state)
  const getCurrentWeek = (): number | null => {
    const inProgressWeeks = Object.values(state.progress).filter(
      (progress) => progress.state === 'IN_PROGRESS'
    );
    // Return the most recently updated IN_PROGRESS week
    if (inProgressWeeks.length > 0) {
      const sorted = inProgressWeeks.sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      return sorted[0].week;
    }
    return null;
  };

  const value: ReadingContextValue = {
    state,
    visitWeek,
    startReading,
    completeReading,
    updatePosition,
    getProgress,
    getRecentWeeks,
    getCurrentWeek,
  };

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>;
}

/**
 * Hook to access reading context
 * Must be used within ReadingProvider
 */
export function useReading() {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within ReadingProvider');
  }
  return context;
}

/**
 * Hook to check if we're on the client (for SSR safety)
 * Useful for conditionally rendering client-only features
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}
