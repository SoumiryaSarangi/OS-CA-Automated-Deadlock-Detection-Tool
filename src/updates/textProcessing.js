/**
 * Text Processing Utilities
 * 
 * Intended Purpose:
 * Provides standalone text manipulation and formatting functions.
 * Useful for string transformations, text analysis, case conversions,
 * and content formatting without any dependency on main application logic.
 * 
 * Includes functions for slug generation, text truncation, word counting,
 * case conversions, and text sanitization.
 */

/**
 * Convert string to slug format (lowercase, hyphenated)
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Convert string to title case
 * @param {string} text - Text to convert
 * @returns {string} Title cased text
 */
export function toTitleCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert string to camelCase
 * @param {string} text - Text to convert
 * @returns {string} camelCase text
 */
export function toCamelCase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Convert string to snake_case
 * @param {string} text - Text to convert
 * @returns {string} snake_case text
 */
export function toSnakeCase(text) {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Count words in a text
 * @param {string} text - Text to analyze
 * @returns {number} Word count
 */
export function countWords(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count characters (excluding spaces)
 * @param {string} text - Text to analyze
 * @returns {number} Character count
 */
export function countCharacters(text) {
  return text.replace(/\s/g, '').length;
}

/**
 * Extract first N words from text
 * @param {string} text - Text to extract from
 * @param {number} wordCount - Number of words to extract
 * @returns {string} Extracted words
 */
export function extractWords(text, wordCount) {
  const words = text.trim().split(/\s+/);
  return words.slice(0, wordCount).join(' ');
}

/**
 * Reverse a string
 * @param {string} text - Text to reverse
 * @returns {string} Reversed text
 */
export function reverseString(text) {
  return text.split('').reverse().join('');
}

/**
 * Check if string is palindrome
 * @param {string} text - Text to check
 * @returns {boolean} True if palindrome
 */
export function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/**
 * Remove HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtmlTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Repeat string N times
 * @param {string} text - Text to repeat
 * @param {number} count - Number of repetitions
 * @param {string} separator - Separator between repetitions
 * @returns {string} Repeated text
 */
export function repeatString(text, count, separator = '') {
  return Array(count).fill(text).join(separator);
}

/**
 * Remove extra whitespace from text
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}
