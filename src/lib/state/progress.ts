/**
 * Progress state machine for Circle of Reading
 * State transitions: UNSEEN → VISITED → IN_PROGRESS → COMPLETED
 * All functions are pure and return new state objects (immutable patterns)
 */

import type { ReadingState, ReadingProgress, AppState } from '../types/reading';

const STATE_VERSION = 1;

/**
 * Create a new initial application state
 * @returns Fresh AppState with no progress
 */
export function createInitialState(): AppState {
  return {
    progress: {},
    recents: [],
    version: STATE_VERSION,
  };
}

/**
 * Mark a week as visited (first interaction)
 * Transition: UNSEEN → VISITED
 * @param state - Current application state
 * @param week - Week number (1-52)
 * @returns New state with updated progress
 */
export function markVisited(state: AppState, week: number): AppState {
  const current = state.progress[week];
  
  // If already in a later state, don't regress
  if (current && !canTransitionTo(current.state, 'VISITED')) {
    return state;
  }
  
  return {
    ...state,
    progress: {
      ...state.progress,
      [week]: {
        week,
        state: 'VISITED',
        scrollPosition: 0,
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

/**
 * Mark a week as in progress with scroll position
 * Transition: VISITED → IN_PROGRESS (or update existing IN_PROGRESS)
 * @param state - Current application state
 * @param week - Week number (1-52)
 * @param scrollPosition - Current scroll position (0-1 as percentage)
 * @returns New state with updated progress
 */
export function markInProgress(
  state: AppState,
  week: number,
  scrollPosition: number
): AppState {
  const current = state.progress[week];
  
  // If completed, don't regress
  if (current?.state === 'COMPLETED') {
    return state;
  }
  
  return {
    ...state,
    progress: {
      ...state.progress,
      [week]: {
        week,
        state: 'IN_PROGRESS',
        scrollPosition: Math.max(0, Math.min(1, scrollPosition)), // Clamp 0-1
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

/**
 * Mark a week as completed
 * Transition: IN_PROGRESS → COMPLETED (final state)
 * @param state - Current application state
 * @param week - Week number (1-52)
 * @returns New state with updated progress
 */
export function markCompleted(state: AppState, week: number): AppState {
  return {
    ...state,
    progress: {
      ...state.progress,
      [week]: {
        week,
        state: 'COMPLETED',
        scrollPosition: 1, // 100% completion
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

/**
 * Update scroll position for a week in progress
 * Only updates if week is IN_PROGRESS, creates IN_PROGRESS state if VISITED or UNSEEN
 * @param state - Current application state
 * @param week - Week number (1-52)
 * @param position - Scroll position (0-1 as percentage)
 * @returns New state with updated scroll position
 */
export function updateScrollPosition(
  state: AppState,
  week: number,
  position: number
): AppState {
  const current = state.progress[week];
  
  // If completed, don't update scroll
  if (current?.state === 'COMPLETED') {
    return state;
  }
  
  // If not yet in progress, transition to IN_PROGRESS
  if (!current || current.state === 'UNSEEN' || current.state === 'VISITED') {
    return markInProgress(state, week, position);
  }
  
  // Update existing IN_PROGRESS scroll position
  return {
    ...state,
    progress: {
      ...state.progress,
      [week]: {
        ...current,
        scrollPosition: Math.max(0, Math.min(1, position)), // Clamp 0-1
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

/**
 * Get progress information for a specific week
 * @param state - Current application state
 * @param week - Week number (1-52)
 * @returns ReadingProgress for the week, or default UNSEEN state
 */
export function getWeekProgress(state: AppState, week: number): ReadingProgress {
  return (
    state.progress[week] || {
      week,
      state: 'UNSEEN',
      scrollPosition: 0,
      lastUpdated: new Date().toISOString(),
    }
  );
}

/**
 * Check if a state transition is valid
 * Valid transitions: UNSEEN → VISITED → IN_PROGRESS → COMPLETED
 * COMPLETED is final (no transitions out)
 * @param current - Current reading state
 * @param next - Proposed next state
 * @returns True if transition is allowed
 */
export function canTransitionTo(current: ReadingState, next: ReadingState): boolean {
  const stateOrder: ReadingState[] = ['UNSEEN', 'VISITED', 'IN_PROGRESS', 'COMPLETED'];
  const currentIndex = stateOrder.indexOf(current);
  const nextIndex = stateOrder.indexOf(next);
  
  // Can only move forward (or stay in same state)
  return nextIndex >= currentIndex;
}
