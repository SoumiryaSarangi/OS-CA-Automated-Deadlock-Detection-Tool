/**
 * Data Validator Utility Module
 * 
 * Intended Purpose:
 * Provides standalone validation functions for common data types and formats.
 * These validators can be used independently for form validation, API input checking,
 * or data sanitization without any connection to the main application logic.
 * 
 * All functions return { valid: boolean, error?: string }
 */

/**
 * Validates if a value is a non-empty string
 */
export function validateNonEmptyString(value) {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Value must be a string' };
  }
  if (value.trim().length === 0) {
    return { valid: false, error: 'String cannot be empty' };
  }
  return { valid: true };
}

/**
 * Validates if a value is a positive integer
 */
export function validatePositiveInteger(value) {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a number' };
  }
  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Value must be an integer' };
  }
  if (num <= 0) {
    return { valid: false, error: 'Value must be positive' };
  }
  return { valid: true };
}

/**
 * Validates if a value is within a specified range
 */
export function validateRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a number' };
  }
  if (num < min || num > max) {
    return { valid: false, error: `Value must be between ${min} and ${max}` };
  }
  return { valid: true };
}

/**
 * Validates email format using regex
 */
export function validateEmail(email) {
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

/**
 * Validates array of specific type
 */
export function validateArrayOfType(arr, typeChecker) {
  if (!Array.isArray(arr)) {
    return { valid: false, error: 'Value must be an array' };
  }
  if (arr.length === 0) {
    return { valid: false, error: 'Array cannot be empty' };
  }
  for (let i = 0; i < arr.length; i++) {
    if (!typeChecker(arr[i])) {
      return { valid: false, error: `Invalid element at index ${i}` };
    }
  }
  return { valid: true };
}

/**
 * Validates object has required keys
 */
export function validateRequiredKeys(obj, requiredKeys) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return { valid: false, error: 'Value must be an object' };
  }
  const missingKeys = requiredKeys.filter(key => !(key in obj));
  if (missingKeys.length > 0) {
    return { valid: false, error: `Missing required keys: ${missingKeys.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validates URL format
 */
export function validateURL(url) {
  if (typeof url !== 'string') {
    return { valid: false, error: 'URL must be a string' };
  }
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validates string length constraints
 */
export function validateStringLength(value, minLength, maxLength) {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Value must be a string' };
  }
  if (value.length < minLength) {
    return { valid: false, error: `String must be at least ${minLength} characters` };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `String must not exceed ${maxLength} characters` };
  }
  return { valid: true };
}

/**
 * Validates hex color code
 */
export function validateHexColor(color) {
  if (typeof color !== 'string') {
    return { valid: false, error: 'Color must be a string' };
  }
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(color)) {
    return { valid: false, error: 'Invalid hex color format' };
  }
  return { valid: true };
}
