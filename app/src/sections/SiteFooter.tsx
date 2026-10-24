import PlanMark from '../components/PlanMark';
import { FOOTER } from '../data/home-content';
import { AREA_LINKS, BUSINESS, COMPANY_LINKS, SYSTEM_LINKS, type NavLink } from '../data/site';

function Column({ title, links }: { title: string; links: readonly NavLink[] }) {
  return (
    <div>
      <p className="t-label text-cedar">{title}</p>
      <ul className="m-0 mt-4 grid list-none gap-0.5 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex min-h-11 items-center text-[15px] text-ink underline decoration-transparent underline-offset-4 hover:text-boxwood hover:decoration-current lg:min-h-8"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-caliche pb-[88px] lg:pb-0">
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:py-20">
        <div className="col-span-2 lg:col-span-1">
          <a href="/" className="inline-flex min-h-11 items-center gap-2.5">
            <PlanMark className="h-6 w-6 flex-none" />
            <span className="text-[18px] font-[720] leading-none tracking-[-0.012em] [font-stretch:112%]">{BUSINESS.name}</span>
          </a>
        </div>
        <Column title={FOOTER.columns.systems} links={SYSTEM_LINKS} />
        <Column title={FOOTER.columns.areas} links={AREA_LINKS} />
        <Column title={FOOTER.columns.company} links={COMPANY_LINKS} />
      </div>
      <div className="border-t border-line">
        <p className="wrap py-6 text-[14px] text-cedar">{FOOTER.bottom}</p>
      </div>
    </footer>
  );
}
