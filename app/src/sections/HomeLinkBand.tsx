import { AREA_LINKS, SYSTEM_LINKS, type NavLink } from '../data/site';
import { LINK_BAND } from '../data/home-content';

function Row({ label, links }: { label: string; links: readonly NavLink[] }) {
  return (
    <div className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-baseline sm:py-3.5">
      <p className="t-label text-cedar">{label}</p>
      <ul className="link-row flex flex-wrap gap-x-6 gap-y-0">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex min-h-11 items-center text-[16px] font-[560] text-ink underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors hover:text-boxwood hover:decoration-current lg:min-h-9"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Systems and the five metros as plain links, high on the page and compact,
 * so the pages that matter are one click from home for people and crawlers.
 */
export default function HomeLinkBand() {
  return (
    <div className="border-y border-rule bg-limestone">
      <div className="wrap divide-y divide-line py-2">
        <Row label={LINK_BAND.systemsLabel} links={SYSTEM_LINKS} />
        <Row label={LINK_BAND.areasLabel} links={AREA_LINKS} />
      </div>
    </div>
  );
}
