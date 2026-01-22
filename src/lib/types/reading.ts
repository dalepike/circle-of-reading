/**
 * Reading state types for Circle of Reading progress tracking
 */

export type ReadingState = 'UNSEEN' | 'VISITED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ReadingProgress {
  week: number;
  state: ReadingState;
  scrollPosition: number;
  lastUpdated: string; // ISO timestamp
}

export interface AppState {
  progress: Record<number, ReadingProgress>;
  recents: number[];
  version: number; // Schema version for future migrations
}
