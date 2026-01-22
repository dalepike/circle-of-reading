/**
 * localStorage wrapper for Circle of Reading progress persistence
 * Handles JSON parsing errors gracefully and provides immutable state operations
 */

import type { AppState } from '../types/reading';

const STORAGE_KEY = 'circle-of-reading-progress';

/**
 * Load application state from localStorage
 * @returns AppState object if valid data exists, null otherwise
 */
export function loadState(): AppState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return null;
    }
    
    const parsed = JSON.parse(stored) as AppState;
    
    // Validate that the parsed data has the expected structure
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Invalid state structure in localStorage');
      return null;
    }
    
    if (!parsed.progress || !Array.isArray(parsed.recents)) {
      console.warn('Missing required state properties');
      return null;
    }
    
    return parsed;
  } catch (error) {
    // JSON parsing error or other localStorage error
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Save application state to localStorage
 * @param state - The complete application state to persist
 */
export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // localStorage quota exceeded or serialization error
    console.error('Failed to save state to localStorage:', error);
    
    // Attempt to clear old data and retry once
    try {
      localStorage.removeItem(STORAGE_KEY);
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      console.info('State saved after clearing previous data');
    } catch (retryError) {
      console.error('Failed to save state even after clearing:', retryError);
    }
  }
}

/**
 * Clear all persisted state from localStorage
 * Useful for debugging or resetting user progress
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
}
