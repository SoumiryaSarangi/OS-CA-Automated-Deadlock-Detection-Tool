/**
 * String Utility Functions
 * 
 * Intended Purpose:
 * A collection of standalone string manipulation and formatting utilities
 * for common text processing tasks. These functions are completely independent
 * and can be used in any JavaScript project without dependencies.
 * 
 * Includes: case conversion, truncation, padding, validation, and formatting helpers.
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The input string
 * @returns {string} String with first letter capitalized
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts string to title case (capitalize each word)
 * @param {string} str - The input string
 * @returns {string} String in title case
 */
export function toTitleCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncates a string to specified length and adds ellipsis
 * @param {string} str - The input string
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength, suffix = '...') {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Pads a string to specified length with given character
 * @param {string} str - The input string
 * @param {number} length - Target length
 * @param {string} char - Padding character (default: ' ')
 * @param {string} position - 'start' or 'end' (default: 'end')
 * @returns {string} Padded string
 */
export function pad(str, length, char = ' ', position = 'end') {
  if (!str) str = '';
  str = String(str);
  
  if (str.length >= length) return str;
  
  const padLength = length - str.length;
  const padding = char.repeat(padLength);
  
  return position === 'start' ? padding + str : str + padding;
}

/**
 * Removes all whitespace from a string
 * @param {string} str - The input string
 * @returns {string} String without whitespace
 */
export function removeWhitespace(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\s+/g, '');
}

/**
 * Converts string to kebab-case
 * @param {string} str - The input string
 * @returns {string} String in kebab-case
 */
export function toKebabCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts string to camelCase
 * @param {string} str - The input string
 * @returns {string} String in camelCase
 */
export function toCamelCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * Checks if string is a valid email format
 * @param {string} email - The email string to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Reverses a string
 * @param {string} str - The input string
 * @returns {string} Reversed string
 */
export function reverse(str) {
  if (!str || typeof str !== 'string') return '';
  return str.split('').reverse().join('');
}

/**
 * Counts occurrences of a substring in a string
 * @param {string} str - The input string
 * @param {string} substring - The substring to count
 * @param {boolean} caseSensitive - Whether to match case (default: true)
 * @returns {number} Number of occurrences
 */
export function countOccurrences(str, substring, caseSensitive = true) {
  if (!str || !substring || typeof str !== 'string') return 0;
  
  const searchStr = caseSensitive ? str : str.toLowerCase();
  const searchSub = caseSensitive ? substring : substring.toLowerCase();
  
  let count = 0;
  let position = 0;
  
  while ((position = searchStr.indexOf(searchSub, position)) !== -1) {
    count++;
    position += searchSub.length;
  }
  
  return count;
}

/**
 * Generates a random string of specified length
 * @param {number} length - Length of random string
 * @param {string} charset - Character set to use (default: alphanumeric)
 * @returns {string} Random string
 */
export function randomString(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
