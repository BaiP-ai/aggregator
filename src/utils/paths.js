/**
 * Utility functions for path handling with base URL support
 */

/**
 * Get a site path with proper base URL prefix
 * @param {string} path - The path to prefix
 * @returns {string} - The path with proper base URL prefix
 */
export function getSitePath(path) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Ensure path starts with a slash but doesn't have a trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure baseUrl doesn't end with a slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // For root path
  if (cleanPath === '/') {
    return baseUrl;
  }
  
  // For other paths
  return `${cleanBase}${cleanPath}`;
}

/**
 * Get an asset path with proper base URL prefix
 * @param {string} path - The asset path to prefix
 * @returns {string} - The asset path with proper base URL prefix
 */
export function getAssetPath(path) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure baseUrl doesn't end with a slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBase}${cleanPath}`;
}
