/**
 * Circle of Reading - Week Mapping Utilities
 * Utilities for mapping weeks to months, volumes, and navigation
 */

/**
 * Maps week numbers (1-52) to their corresponding months
 */
export const WEEK_TO_MONTH: Record<number, string> = {
  // January: W01-W04
  1: 'january', 2: 'january', 3: 'january', 4: 'january',
  // February: W05-W08
  5: 'february', 6: 'february', 7: 'february', 8: 'february',
  // March: W09-W13
  9: 'march', 10: 'march', 11: 'march', 12: 'march', 13: 'march',
  // April: W14-W17
  14: 'april', 15: 'april', 16: 'april', 17: 'april',
  // May: W18-W21
  18: 'may', 19: 'may', 20: 'may', 21: 'may',
  // June: W22-W26
  22: 'june', 23: 'june', 24: 'june', 25: 'june', 26: 'june',
  // July: W27-W30
  27: 'july', 28: 'july', 29: 'july', 30: 'july',
  // August: W31-W34
  31: 'august', 32: 'august', 33: 'august', 34: 'august',
  // September: W35-W39
  35: 'september', 36: 'september', 37: 'september', 38: 'september', 39: 'september',
  // October: W40-W43
  40: 'october', 41: 'october', 42: 'october', 43: 'october',
  // November: W44-W47
  44: 'november', 45: 'november', 46: 'november', 47: 'november',
  // December: W48-W52
  48: 'december', 49: 'december', 50: 'december', 51: 'december', 52: 'december',
};

/**
 * Maps each month to its corresponding week numbers
 */
export const MONTH_TO_WEEKS: Record<string, number[]> = {
  january: [1, 2, 3, 4],
  february: [5, 6, 7, 8],
  march: [9, 10, 11, 12, 13],
  april: [14, 15, 16, 17],
  may: [18, 19, 20, 21],
  june: [22, 23, 24, 25, 26],
  july: [27, 28, 29, 30],
  august: [31, 32, 33, 34],
  september: [35, 36, 37, 38, 39],
  october: [40, 41, 42, 43],
  november: [44, 45, 46, 47],
  december: [48, 49, 50, 51, 52],
};

/**
 * Volume ranges for the Circle of Reading collection
 */
export const VOLUME_RANGES = {
  41: { start: 1, end: 34 },
  42: { start: 35, end: 52 },
} as const;

/**
 * Gets the volume number (41 or 42) for a given week
 * @param week - Week number (1-52)
 * @returns Volume number 41 or 42
 */
export function getVolume(week: number): 41 | 42 {
  if (week < 1 || week > 52) {
    throw new Error(`Invalid week number: ${week}. Must be between 1 and 52.`);
  }
  return week <= VOLUME_RANGES[41].end ? 41 : 42;
}

/**
 * Gets the month name for a given week number
 * @param week - Week number (1-52)
 * @returns Month name in lowercase (e.g., 'january', 'february')
 */
export function getMonth(week: number): string {
  if (week < 1 || week > 52) {
    throw new Error(`Invalid week number: ${week}. Must be between 1 and 52.`);
  }
  return WEEK_TO_MONTH[week];
}

/**
 * Gets all week numbers for a given month
 * @param month - Month name in lowercase (e.g., 'january', 'february')
 * @returns Array of week numbers for that month
 */
export function getWeeksForMonth(month: string): number[] {
  const weeks = MONTH_TO_WEEKS[month.toLowerCase()];
  if (!weeks) {
    throw new Error(`Invalid month name: ${month}`);
  }
  return weeks;
}

/**
 * Gets the next week number in sequence
 * @param week - Current week number (1-52)
 * @returns Next week number, or null if at week 52
 */
export function getNextWeek(week: number): number | null {
  if (week < 1 || week > 52) {
    throw new Error(`Invalid week number: ${week}. Must be between 1 and 52.`);
  }
  return week < 52 ? week + 1 : null;
}

/**
 * Gets the previous week number in sequence
 * @param week - Current week number (1-52)
 * @returns Previous week number, or null if at week 1
 */
export function getPrevWeek(week: number): number | null {
  if (week < 1 || week > 52) {
    throw new Error(`Invalid week number: ${week}. Must be between 1 and 52.`);
  }
  return week > 1 ? week - 1 : null;
}

/**
 * Formats a week number as a zero-padded string (e.g., "W01", "W16")
 * @param week - Week number (1-52)
 * @returns Formatted week string (e.g., "W01")
 */
export function formatWeekNumber(week: number): string {
  if (week < 1 || week > 52) {
    throw new Error(`Invalid week number: ${week}. Must be between 1 and 52.`);
  }
  return `W${week < 10 ? '0' + week : week}`;
}
