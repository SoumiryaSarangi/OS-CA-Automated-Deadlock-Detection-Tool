/**
 * URL Parser and Query String Builder Utility
 * 
 * Intended Purpose:
 * This standalone module provides utilities for parsing URLs, building query strings,
 * manipulating URL parameters, and validating URL formats. Useful for handling
 * navigation, API endpoints, deep linking, and URL manipulation tasks.
 * 
 * This file is completely independent with no imports from the main application.
 * Can be used for routing, API calls, or any URL-related operations.
 */

/**
 * Parse a URL and return its components
 */
export function parseURL(url) {
  try {
    const urlObj = new URL(url);
    return {
      href: urlObj.href,
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse query string into an object
 */
export function parseQueryString(queryString) {
  const params = {};
  const search = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  if (!search) return params;
  
  const pairs = search.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  }
  
  return params;
}

/**
 * Build query string from an object
 */
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) return '';
  
  const pairs = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  
  return pairs.length > 0 ? `?${pairs.join('&')}` : '';
}

/**
 * Add or update a query parameter in a URL
 */
export function addQueryParam(url, key, value) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

/**
 * Remove a query parameter from a URL
 */
export function removeQueryParam(url, key) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(key);
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

/**
 * Get a specific query parameter value from a URL
 */
export function getQueryParam(url, key) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(key);
  } catch (error) {
    return null;
  }
}

/**
 * Check if a URL has a specific query parameter
 */
export function hasQueryParam(url, key) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.has(key);
  } catch (error) {
    return false;
  }
}

/**
 * Validate if a string is a valid URL
 */
export function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if URL uses HTTPS protocol
 */
export function isHTTPS(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return null;
  }
}

/**
 * Extract path segments from URL
 */
export function extractPathSegments(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/').filter(segment => segment.length > 0);
  } catch (error) {
    return [];
  }
}

/**
 * Combine base URL with path
 */
export function joinURL(baseURL, path) {
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base + cleanPath;
}

/**
 * Remove trailing slash from URL
 */
export function removeTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Add trailing slash to URL
 */
export function addTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Get file extension from URL pathname
 */
export function getFileExtension(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const lastDot = pathname.lastIndexOf('.');
    const lastSlash = pathname.lastIndexOf('/');
    
    if (lastDot > lastSlash && lastDot !== -1) {
      return pathname.substring(lastDot + 1);
    }
    return '';
  } catch (error) {
    return '';
  }
}

/**
 * Check if two URLs point to the same resource (ignoring query params and hash)
 */
export function isSameResource(url1, url2) {
  try {
    const obj1 = new URL(url1);
    const obj2 = new URL(url2);
    return obj1.origin === obj2.origin && obj1.pathname === obj2.pathname;
  } catch (error) {
    return false;
  }
}

/**
 * Sanitize URL by removing potentially harmful characters
 */
export function sanitizeURL(url) {
  return url.replace(/[<>"']/g, '');
}

/**
 * Build URL from components
 */
export function buildURL(components) {
  const {
    protocol = 'https',
    hostname = '',
    port = '',
    pathname = '',
    query = {},
    hash = ''
  } = components;
  
  if (!hostname) return '';
  
  let url = `${protocol}://${hostname}`;
  if (port) url += `:${port}`;
  if (pathname) url += pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  const queryString = buildQueryString(query);
  if (queryString) url += queryString;
  
  if (hash) url += hash.startsWith('#') ? hash : `#${hash}`;
  
  return url;
}
