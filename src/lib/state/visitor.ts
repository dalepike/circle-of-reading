/**
 * localStorage wrapper for Circle of Reading visitor state persistence
 * Tracks whether visitors have been introduced to the project
 */

import type { VisitorState } from '../types/visitor';

const VISITOR_KEY = 'circle-of-reading-visitor';

/**
 * Type guard to validate VisitorState shape from JSON.parse
 */
function isVisitorState(value: unknown): value is VisitorState {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.introduced === 'boolean' &&
    typeof obj.acknowledgedRedesign === 'boolean'
  );
}

/**
 * Load visitor state from localStorage
 * @returns VisitorState if valid data exists, null otherwise
 */
export function loadVisitorState(): VisitorState | null {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isVisitorState(parsed)) {
      console.warn('Invalid visitor state structure in localStorage');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load visitor state:', error);
    return null;
  }
}

/**
 * Save visitor state to localStorage
 */
function saveVisitorState(state: VisitorState): void {
  try {
    localStorage.setItem(VISITOR_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save visitor state:', error);
  }
}

/**
 * Mark visitor as introduced (has completed welcome flow)
 */
export function setIntroduced(): void {
  const state = loadVisitorState() || {
    introduced: false,
    acknowledgedRedesign: false,
  };
  state.introduced = true;
  saveVisitorState(state);
}

/**
 * Mark existing user as having acknowledged the redesign
 */
export function setRedesignAcknowledged(): void {
  const state = loadVisitorState() || {
    introduced: true,
    acknowledgedRedesign: false,
  };
  state.acknowledgedRedesign = true;
  saveVisitorState(state);
}

/**
 * Check if user has existing reading progress (pre-redesign user)
 */
export function hasExistingProgress(): boolean {
  try {
    const progress = localStorage.getItem('circle-of-reading-progress');
    if (!progress) return false;
    const parsed = JSON.parse(progress);
    return Object.keys(parsed?.progress || {}).length > 0;
  } catch (error) {
    console.error('Failed to check existing progress:', error);
    return false;
  }
}

/**
 * Check if visitor needs to see the welcome page
 */
export function needsWelcome(): boolean {
  const state = loadVisitorState();
  if (!state) {
    // New visitor with no state—but check for existing progress
    return !hasExistingProgress();
  }
  return !state.introduced;
}

/**
 * Check if existing user needs to acknowledge redesign
 */
export function needsRedesignAcknowledgment(): boolean {
  const state = loadVisitorState();
  if (state?.introduced) return false;
  if (!hasExistingProgress()) return false;
  return !state?.acknowledgedRedesign;
}
