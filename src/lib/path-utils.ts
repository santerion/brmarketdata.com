/**
 * Prefixes a path with the base path when in production environment
 * This is necessary for GitHub Pages deployment where the site is served from a subdirectory
 */
export function getPublicPath(path: string): string {
  // Get the base path from environment variable
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Combine base path with clean path
  return `${basePath}/${cleanPath}`;
} 