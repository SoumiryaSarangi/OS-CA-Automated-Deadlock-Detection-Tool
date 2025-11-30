/**
 * Performance Metrics Calculator Utility
 * 
 * Intended Purpose:
 * This standalone module provides functions for calculating common performance
 * metrics and statistics. Useful for benchmarking, profiling, analyzing data sets,
 * and measuring algorithm efficiency. Includes statistical analysis, timing utilities,
 * and throughput calculations.
 * 
 * This file is completely independent with no imports from the main application.
 * Can be used for testing, monitoring, or data analysis tasks.
 */

/**
 * Calculate the average (mean) of an array of numbers
 */
export function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

/**
 * Calculate the median of an array of numbers
 */
export function calculateMedian(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate the standard deviation of an array of numbers
 */
export function calculateStandardDeviation(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const avg = calculateAverage(numbers);
  const squaredDiffs = numbers.map(num => Math.pow(num - avg, 2));
  const variance = calculateAverage(squaredDiffs);
  return Math.sqrt(variance);
}

/**
 * Find the minimum value in an array
 */
export function findMin(numbers) {
  if (!numbers || numbers.length === 0) return null;
  return Math.min(...numbers);
}

/**
 * Find the maximum value in an array
 */
export function findMax(numbers) {
  if (!numbers || numbers.length === 0) return null;
  return Math.max(...numbers);
}

/**
 * Calculate the range (max - min) of an array
 */
export function calculateRange(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  return findMax(numbers) - findMin(numbers);
}

/**
 * Calculate percentile value from an array of numbers
 */
export function calculatePercentile(numbers, percentile) {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Simple timer class for measuring execution time
 */
export class PerformanceTimer {
  constructor() {
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = performance.now();
    this.endTime = null;
  }

  stop() {
    if (!this.startTime) {
      throw new Error('Timer not started. Call start() first.');
    }
    this.endTime = performance.now();
    return this.getElapsed();
  }

  getElapsed() {
    if (!this.startTime) return 0;
    const end = this.endTime || performance.now();
    return end - this.startTime;
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
  }
}

/**
 * Measure the execution time of a function
 */
export async function measureExecutionTime(fn, iterations = 1) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const timer = new PerformanceTimer();
    timer.start();
    await fn();
    times.push(timer.stop());
  }
  
  return {
    iterations,
    times,
    average: calculateAverage(times),
    median: calculateMedian(times),
    min: findMin(times),
    max: findMax(times),
    stdDev: calculateStandardDeviation(times)
  };
}

/**
 * Calculate throughput (operations per second)
 */
export function calculateThroughput(operations, timeInMs) {
  if (timeInMs === 0) return 0;
  return (operations / timeInMs) * 1000;
}

/**
 * Calculate memory usage percentage
 */
export function calculateMemoryUsage(used, total) {
  if (total === 0) return 0;
  return (used / total) * 100;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format milliseconds to human-readable time string
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`;
  return `${(ms / 3600000).toFixed(2)}h`;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Generate a summary statistics object for an array of numbers
 */
export function generateStatsSummary(numbers) {
  if (!numbers || numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      min: null,
      max: null,
      range: 0,
      stdDev: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p95: 0,
      p99: 0
    };
  }

  return {
    count: numbers.length,
    sum: numbers.reduce((acc, val) => acc + val, 0),
    mean: calculateAverage(numbers),
    median: calculateMedian(numbers),
    min: findMin(numbers),
    max: findMax(numbers),
    range: calculateRange(numbers),
    stdDev: calculateStandardDeviation(numbers),
    p25: calculatePercentile(numbers, 25),
    p50: calculatePercentile(numbers, 50),
    p75: calculatePercentile(numbers, 75),
    p95: calculatePercentile(numbers, 95),
    p99: calculatePercentile(numbers, 99)
  };
}
