/**
 * Date and Time Utilities Module
 * 
 * Intended Purpose:
 * Provides standalone date/time manipulation and formatting functions.
 * Useful for date calculations, formatting, timezone handling, and relative time
 * displays without any dependency on external libraries or main application logic.
 * 
 * All functions use native JavaScript Date objects and are timezone-aware.
 */

/**
 * Format date to common readable format (YYYY-MM-DD)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time to HH:MM:SS
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format date and time together
 * @param {Date} date - Date object to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const isPast = diffMs < 0;
  
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 }
  ];
  
  for (const unit of units) {
    const count = Math.floor(diffSec / unit.seconds);
    if (count >= 1) {
      const plural = count > 1 ? 's' : '';
      return isPast 
        ? `${count} ${unit.name}${plural} ago`
        : `in ${count} ${unit.name}${plural}`;
    }
  }
  
  return 'just now';
}

/**
 * Add days to a date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add (negative to subtract)
 * @returns {Date} New date object
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 * @param {Date} date - Starting date
 * @param {number} months - Number of months to add (negative to subtract)
 * @returns {Date} New date object
 */
export function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Calculate difference between two dates in days
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in days
 */
export function daysBetween(date1, date2) {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
  return date.getTime() < new Date().getTime();
}

/**
 * Check if a date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isFuture(date) {
  return date.getTime() > new Date().getTime();
}

/**
 * Get start of day for a given date
 * @param {Date} date - Date object
 * @returns {Date} Date at 00:00:00
 */
export function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day for a given date
 * @param {Date} date - Date object
 * @returns {Date} Date at 23:59:59
 */
export function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get day name from date
 * @param {Date} date - Date object
 * @returns {string} Day name (e.g., "Monday")
 */
export function getDayName(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Get month name from date
 * @param {Date} date - Date object
 * @returns {string} Month name (e.g., "January")
 */
export function getMonthName(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
}
