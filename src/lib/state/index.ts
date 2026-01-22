/**
 * Circle of Reading - State Management Index
 * Central export point for all state management utilities
 */

// React Context and Hooks
export { ReadingProvider, useReading, useIsClient } from './ReadingContext';

// State Management Functions
export {
  createInitialState,
  markVisited,
  markInProgress,
  markCompleted,
  updateScrollPosition,
  getWeekProgress,
  canTransitionTo,
} from './progress';

// Recents Management
export { addToRecents, getRecents, clearRecents, removeFromRecents } from './recents';

// Storage Functions
export { loadState, saveState, clearState } from './storage';

// Types (re-exported from types/reading)
export type { AppState, ReadingProgress, ReadingState } from '../types/reading';
