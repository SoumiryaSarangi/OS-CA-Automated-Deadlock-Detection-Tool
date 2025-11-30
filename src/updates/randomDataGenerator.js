/**
 * Random Data Generator Utility
 * 
 * Intended Purpose:
 * This standalone module provides various utility functions for generating
 * random data for testing, prototyping, and mock scenarios. It includes
 * generators for numbers, strings, dates, colors, and common data patterns.
 * 
 * This file is completely independent and does not import from the main
 * application. It can be used in isolation for any testing or development needs.
 */

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

/**
 * Generate a random boolean with optional probability
 */
export function randomBoolean(trueProbability = 0.5) {
  return Math.random() < trueProbability;
}

/**
 * Pick a random element from an array
 */
export function randomChoice(array) {
  if (!array || array.length === 0) return null;
  return array[randomInt(0, array.length - 1)];
}

/**
 * Generate a random string of specified length
 */
export function randomString(length = 10, charset = 'alphanumeric') {
  const charsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789ABCDEF',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  };

  const chars = charsets[charset] || charsets.alphanumeric;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generate a random email address
 */
export function randomEmail() {
  const providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
  const username = randomString(8, 'lowercase');
  const provider = randomChoice(providers);
  return `${username}@${provider}`;
}

/**
 * Generate a random hex color code
 */
export function randomHexColor() {
  return '#' + randomString(6, 'hex');
}

/**
 * Generate a random RGB color object
 */
export function randomRGBColor() {
  return {
    r: randomInt(0, 255),
    g: randomInt(0, 255),
    b: randomInt(0, 255)
  };
}

/**
 * Generate a random date between start and end dates
 */
export function randomDate(start = new Date(2020, 0, 1), end = new Date()) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Generate a random UUID v4
 */
export function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate an array of random integers
 */
export function randomIntArray(length, min, max) {
  return Array.from({ length }, () => randomInt(min, max));
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a random name (first + last)
 */
export function randomName() {
  const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  return `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
}

/**
 * Generate random lorem ipsum text
 */
export function randomLoremIpsum(wordCount = 10) {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud'
  ];
  
  const result = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(randomChoice(words));
  }
  
  return result.join(' ');
}
