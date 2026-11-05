/**
 * URL for a file in public/. The normal build serves from the site root
 * ("/images/x.webp"); the share build (`npm run build:share`, a private
 * preview link) uses relative paths ("./images/x.webp"), so it works from
 * whatever path the preview is served at.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

/** True in the share build: a preview link, not the live site. */
export const IS_SHARE = import.meta.env.MODE === 'share';
