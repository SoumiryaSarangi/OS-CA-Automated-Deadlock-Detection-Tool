/**
 * Pagination Helpers
 * 
 * Intended Purpose:
 * A standalone utility module providing pagination calculation and data slicing functions.
 * Useful for implementing paginated views, data tables, API responses, and list navigation.
 * Includes functions for calculating page ranges, generating page metadata, and slicing datasets.
 * 
 * This module is independent and requires no external dependencies.
 */

/**
 * Calculate the total number of pages needed for a dataset
 * @param {number} totalItems - Total number of items in the dataset
 * @param {number} itemsPerPage - Number of items to display per page
 * @returns {number} Total number of pages
 */
export function calculateTotalPages(totalItems, itemsPerPage) {
  if (itemsPerPage <= 0) {
    throw new Error('Items per page must be greater than 0');
  }
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Get a slice of data for a specific page
 * @param {Array} data - The complete dataset
 * @param {number} currentPage - The page number (1-indexed)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Array} Slice of data for the requested page
 */
export function getPageData(data, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}

/**
 * Generate pagination metadata object
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination metadata
 */
export function getPaginationInfo(totalItems, currentPage, itemsPerPage) {
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    hasNext,
    hasPrev,
    startItem,
    endItem,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
}

/**
 * Generate an array of page numbers to display in pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} maxVisible - Maximum number of page buttons to show
 * @returns {Array<number|string>} Array of page numbers (includes '...' for gaps)
 */
export function getPageNumbers(currentPage, totalPages, maxVisible = 7) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const halfVisible = Math.floor(maxVisible / 2);
  
  // Always show first page
  pages.push(1);

  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if we're near the beginning
  if (currentPage <= halfVisible) {
    end = maxVisible - 1;
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    start = totalPages - maxVisible + 2;
  }

  // Add ellipsis after first page if needed
  if (start > 2) {
    pages.push('...');
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (end < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Calculate offset and limit values for database queries
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Object with offset and limit properties
 */
export function getOffsetLimit(page, limit) {
  const offset = (page - 1) * limit;
  return { offset, limit };
}

/**
 * Validate pagination parameters and return sanitized values
 * @param {number} page - Requested page number
 * @param {number} itemsPerPage - Requested items per page
 * @param {number} totalItems - Total items available
 * @param {Object} options - Optional constraints
 * @returns {Object} Validated pagination parameters
 */
export function validatePaginationParams(
  page, 
  itemsPerPage, 
  totalItems,
  options = {}
) {
  const { minPerPage = 1, maxPerPage = 100, defaultPerPage = 10 } = options;

  // Sanitize items per page
  let validItemsPerPage = parseInt(itemsPerPage, 10);
  if (isNaN(validItemsPerPage) || validItemsPerPage < minPerPage) {
    validItemsPerPage = defaultPerPage;
  }
  if (validItemsPerPage > maxPerPage) {
    validItemsPerPage = maxPerPage;
  }

  // Calculate total pages
  const totalPages = calculateTotalPages(totalItems, validItemsPerPage);

  // Sanitize page number
  let validPage = parseInt(page, 10);
  if (isNaN(validPage) || validPage < 1) {
    validPage = 1;
  }
  if (validPage > totalPages && totalPages > 0) {
    validPage = totalPages;
  }

  return {
    page: validPage,
    itemsPerPage: validItemsPerPage,
    totalPages,
    totalItems
  };
}

/**
 * Create a paginated result object (useful for API responses)
 * @param {Array} data - The complete dataset
 * @param {number} page - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Paginated result with data and metadata
 */
export function createPaginatedResult(data, page, itemsPerPage) {
  const totalItems = data.length;
  const paginationInfo = getPaginationInfo(totalItems, page, itemsPerPage);
  const pageData = getPageData(data, page, itemsPerPage);

  return {
    data: pageData,
    pagination: paginationInfo
  };
}
