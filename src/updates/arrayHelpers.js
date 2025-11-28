/**
 * Array Helper Utilities
 * 
 * Intended Purpose:
 * This module provides a collection of utility functions for common array operations
 * including chunking, flattening, removing duplicates, shuffling, and statistical
 * calculations. These are standalone helpers that can be used in various contexts
 * without any dependencies on the main application.
 * 
 * @module arrayHelpers
 */

/**
 * Splits an array into chunks of specified size
 * @param {Array} array - The array to chunk
 * @param {number} size - The size of each chunk
 * @returns {Array[]} Array of chunked arrays
 */
export function chunkArray(array, size) {
  if (!Array.isArray(array) || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens a nested array to a specified depth
 * @param {Array} array - The array to flatten
 * @param {number} depth - The depth to flatten (default: 1)
 * @returns {Array} Flattened array
 */
export function flattenArray(array, depth = 1) {
  if (!Array.isArray(array) || depth <= 0) return array;
  return array.reduce((acc, val) => {
    return acc.concat(
      Array.isArray(val) && depth > 1 
        ? flattenArray(val, depth - 1) 
        : val
    );
  }, []);
}

/**
 * Removes duplicate values from an array
 * @param {Array} array - The array to deduplicate
 * @returns {Array} Array with unique values
 */
export function removeDuplicates(array) {
  return [...new Set(array)];
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculates the sum of numeric values in an array
 * @param {number[]} array - Array of numbers
 * @returns {number} Sum of all values
 */
export function sum(array) {
  return array.reduce((acc, val) => acc + (Number(val) || 0), 0);
}

/**
 * Calculates the average of numeric values in an array
 * @param {number[]} array - Array of numbers
 * @returns {number} Average value or 0 if empty
 */
export function average(array) {
  if (!array.length) return 0;
  return sum(array) / array.length;
}

/**
 * Finds the maximum value in an array
 * @param {number[]} array - Array of numbers
 * @returns {number} Maximum value or -Infinity if empty
 */
export function max(array) {
  return array.length ? Math.max(...array) : -Infinity;
}

/**
 * Finds the minimum value in an array
 * @param {number[]} array - Array of numbers
 * @returns {number} Minimum value or Infinity if empty
 */
export function min(array) {
  return array.length ? Math.min(...array) : Infinity;
}

/**
 * Groups array elements by a key function
 * @param {Array} array - The array to group
 * @param {Function} keyFn - Function to determine grouping key
 * @returns {Object} Object with grouped arrays
 */
export function groupBy(array, keyFn) {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Partitions an array into two arrays based on a predicate
 * @param {Array} array - The array to partition
 * @param {Function} predicate - Function to test each element
 * @returns {Array[]} Array containing [matching, nonMatching]
 */
export function partition(array, predicate) {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item) 
        ? [[...pass, item], fail] 
        : [pass, [...fail, item]];
    },
    [[], []]
  );
}

/**
 * Returns the intersection of two arrays
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} Array containing common elements
 */
export function intersection(array1, array2) {
  const set2 = new Set(array2);
  return array1.filter(item => set2.has(item));
}

/**
 * Returns the difference between two arrays (elements in first but not in second)
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} Array containing elements only in array1
 */
export function difference(array1, array2) {
  const set2 = new Set(array2);
  return array1.filter(item => !set2.has(item));
}
