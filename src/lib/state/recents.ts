/**
 * Recent readings tracker for Circle of Reading
 * Maintains a list of recently accessed weeks (LRU pattern)
 * Uses functional immutable patterns
 */

import type { AppState } from '../types/reading';

const MAX_RECENTS = 10;

/**
 * Add a week to the recent readings list
 * Implements LRU (Least Recently Used) pattern:
 * - Removes week if already in list
 * - Adds week to front of list
 * - Trims list to MAX_RECENTS entries
 * 
 * @param state - Current application state
 * @param week - Week number to add to recents
 * @returns New state with updated recents list
 */
export function addToRecents(state: AppState, week: number): AppState {
  // Remove the week if it's already in the list (will be re-added at front)
  const filtered = state.recents.filter((w) => w !== week);
  
  // Add the week to the front of the list
  const updated = [week, ...filtered];
  
  // Trim to MAX_RECENTS entries
  const trimmed = updated.slice(0, MAX_RECENTS);
  
  return {
    ...state,
    recents: trimmed,
  };
}

/**
 * Get the list of recent readings
 * Returns weeks in order from most to least recently accessed
 * 
 * @param state - Current application state
 * @returns Array of week numbers, most recent first
 */
export function getRecents(state: AppState): number[] {
  return [...state.recents]; // Return a copy to maintain immutability
}

/**
 * Clear all recent readings
 * Useful for debugging or user-initiated reset
 * 
 * @param state - Current application state
 * @returns New state with empty recents list
 */
export function clearRecents(state: AppState): AppState {
  return {
    ...state,
    recents: [],
  };
}

/**
 * Remove a specific week from recents
 * Useful if a week becomes invalid or is removed from content
 * 
 * @param state - Current application state
 * @param week - Week number to remove
 * @returns New state with week removed from recents
 */
export function removeFromRecents(state: AppState, week: number): AppState {
  return {
    ...state,
    recents: state.recents.filter((w) => w !== week),
  };
}
