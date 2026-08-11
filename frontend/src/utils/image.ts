/**
 * Resolves a media/image path to a browser-accessible URL.
 *
 * - If path is already an absolute URL (http/https/blob/data), return as-is.
 * - If path starts with /media/ or is a relative /... path, return it as-is
 *   so the Vite dev proxy forwards it to the backend automatically.
 *   In production, configure your reverse proxy (nginx/etc.) to serve /media/.
 * - Empty/null returns empty string.
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '';

  // Already an absolute URL (external or blob/data URIs) — use as-is
  if (
    path.startsWith('blob:') ||
    path.startsWith('data:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  // Relative path: return as-is — Vite proxy will forward /media/* to the backend
  // In production the web server handles /media/* directly
  if (path.startsWith('/')) {
    return path;
  }

  // No leading slash: prepend one
  return `/${path}`;
}
