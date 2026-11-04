import type { Crumb } from '../../routes';

/**
 * The trail to this page, from `route.breadcrumbs` (Home first, this page
 * last). The current page is plain text with aria-current; every other crumb
 * is a link. Renders nothing for an empty trail (the 404 page).
 */
export default function Breadcrumbs({ crumbs }: { crumbs: readonly Crumb[] }) {
  if (crumbs.length === 0) return null;
  const last = crumbs.length - 1;
  return (
    <nav aria-label="Breadcrumb" className="pk-crumbs">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.href}>
            {index < last ? (
              <a href={crumb.href}>{crumb.label}</a>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
            {index < last ? (
              <span className="pk-crumbs-sep" aria-hidden="true">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
