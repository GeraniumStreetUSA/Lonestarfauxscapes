import { applySeoFoundation, isNoindexDirective, routeFromFilename } from './foundation.js';

export function seoFoundationPlugin() {
  const seenTitles = new Map();
  const seenDescriptions = new Map();

  const trackDuplicate = (map, value, route, field) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return;

    const existingRoute = map.get(normalized);
    if (existingRoute && existingRoute !== route) {
      console.warn(`[seo-foundation] Duplicate ${field}: "${value}" on ${existingRoute} and ${route}`);
      return;
    }

    map.set(normalized, route);
  };

  return {
    name: 'seo-foundation',
    transformIndexHtml(html, ctx) {
      const filename = ctx?.filename;
      if (!filename) return html;

      const route = routeFromFilename(filename);
      const result = applySeoFoundation(html, route);
      if (!result.data) return html;

      if (!isNoindexDirective(result.data.robots)) {
        trackDuplicate(seenTitles, result.data.title, result.data.route, 'title');
        trackDuplicate(seenDescriptions, result.data.description, result.data.route, 'description');
      }

      return result.html;
    },
  };
}
