import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

import Layout from '../components/Layout';
import LinkRows, { type LinkRow } from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import { POSTS } from '../generated/posts/index';
import { allRoutes, type PageProps, type Route } from '../routes';
import '../styles/utility.css';

/** The legal pages are noindex, but a sitemap for people still lists them. */
const LEGAL = ['/privacy', '/terms'];

interface Group {
  title: string;
  test: (route: Route) => boolean;
}

const GROUPS: readonly Group[] = [
  { title: 'Systems', test: (r) => r.type === 'system' || r.path === '/products' },
  {
    title: 'Use cases',
    test: (r) => r.type === 'usecase' || ['/residential', '/commercial', '/commercial-resources'].includes(r.path),
  },
  { title: 'Locations', test: (r) => r.type === 'metro' || r.path === '/locations' },
  { title: 'Guides and posts', test: (r) => r.type === 'post' || ['/guides', '/blog'].includes(r.path) },
  { title: 'Projects', test: (r) => r.type === 'project' || ['/case-studies', '/gallery'].includes(r.path) },
  { title: 'Company', test: (r) => r.path === '/' || ['/pricing', '/installation', '/contact', ...LEGAL].includes(r.path) },
];

const POST_TITLES = new Map(POSTS.map((post) => [post.path, post.title]));

/** A short link text: a post's full title, else the last crumb of its trail, else the home page. */
function labelFor(route: Route): string {
  const post = POST_TITLES.get(route.path);
  if (post) return post;
  const crumbs = route.breadcrumbs;
  return crumbs.length > 0 ? crumbs[crumbs.length - 1].label : 'Home';
}

/** Hub pages lead their group; otherwise the manifest's own order. */
function groupRows(group: Group, routes: readonly Route[]): LinkRow[] {
  const inGroup = routes.filter(
    (route) => (route.robots === 'index' || LEGAL.includes(route.path)) && group.test(route),
  );
  inGroup.sort((a, b) => Number(b.type === 'hub' || b.path === '/') - Number(a.type === 'hub' || a.path === '/'));
  return inGroup.map((route) => ({ title: labelFor(route), href: route.path }));
}

/**
 * /sitemap: every indexable page, grouped, generated from the route manifest
 * so it never drifts. Every group ships open (crawlers and desktop read them
 * all); on phones they fold after load into six headings, like the FAQ.
 */
export default function SitemapPage({ route }: PageProps) {
  const list = useRef<HTMLDivElement>(null);
  const groups = GROUPS.map((group) => ({ group, rows: groupRows(group, allRoutes()) }));

  useEffect(() => {
    const el = list.current;
    if (!el || !window.matchMedia('(max-width: 767px)').matches) return;
    el.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
  }, []);

  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout="◦ ALL PAGES"
        title="Lone Star Faux Scapes HTML sitemap"
        lede="Every page on the site, grouped. The XML version for search engines is at /sitemap.xml."
      />

      <section className="section pt-0" aria-label="Pages by group">
        <div className="wrap">
          <div ref={list} className="ut-p-groups">
            {groups.map(({ group, rows }) => (
              <details key={group.title} className="faq-item ut-p-group" open>
                <summary className="faq-q ut-p-group-q">
                  <h2 className="ut-p-group-title">
                    {group.title} <span className="ut-p-group-count">{rows.length}</span>
                  </h2>
                  <Plus size={18} strokeWidth={2.2} className="faq-icon" aria-hidden="true" />
                </summary>
                <LinkRows items={rows} columns={2} />
              </details>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand />
    </Layout>
  );
}
