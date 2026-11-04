import Layout from '../components/Layout';
import LinkRows from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import { categorySlug } from '../data/blog';
import { BLOG_CATEGORIES, POSTS } from '../generated/posts/index';
import type { PageProps } from '../routes';
import '../styles/posts.css';

const NEXT = [
  { title: 'Guides', href: '/guides', text: 'Planning guides for installation, fire documentation and HOA review.' },
  { title: 'Installation', href: '/installation', text: 'How a project goes from your numbers to a finished install.' },
  { title: 'Commercial resources', href: '/commercial-resources', text: 'Fire-rated options and documentation help for teams specifying greenery.' },
  { title: 'Pricing', href: '/pricing', text: 'What is priced today and what is quoted after a site review.' },
  { title: 'Case studies', href: '/case-studies', text: 'Real Texas installs: the problem, the scope and the result.' },
  { title: 'Photo gallery', href: '/gallery', text: 'Texas installs to look at when you only need ideas.' },
] as const;

/**
 * /blog: every post, newest first. The category chips are links to anchors
 * placed before the list, and the stylesheet hides the other rows while an
 * anchor is the target, so the filter works with no script and with the back
 * button. On phones a row is the date line and the title (about 100 px); the
 * summary joins from 640 px.
 */
export default function BlogIndexPage({ route }: PageProps) {
  const counts = new Map<string, number>();
  POSTS.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));

  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout="◦ Knowledge blog"
        title="Blog: artificial hedges, living walls and Texas project planning"
        lede="Articles on cost, care, fire codes and HOA rules for artificial greenery in Texas."
      />

      <Section
        id="articles"
        callout={`◦ ${POSTS.length} articles`}
        title="All articles, newest first"
        intro={
          <>
            Pick a category, or read them all. Short on time? The{' '}
            <a href="/guides" className="po-p-inline">
              guides
            </a>{' '}
            are the shortest path to a decision.
          </>
        }
      >
        <div className="po-p-filter">
          <span id="f-all" className="po-p-anchor" />
          {BLOG_CATEGORIES.map((category) => (
            <span key={category} id={`f-${categorySlug(category)}`} className="po-p-anchor" />
          ))}
          <ul className="po-p-chips" aria-label="Filter by category">
            <li>
              <a href="#f-all" className="po-p-chip po-p-chip-all">
                All <span>{POSTS.length}</span>
              </a>
            </li>
            {BLOG_CATEGORIES.map((category) => (
              <li key={category}>
                <a href={`#f-${categorySlug(category)}`} className="po-p-chip">
                  {category} <span>{counts.get(category) ?? 0}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="po-p-rows">
            {POSTS.map((post) => (
              <li key={post.slug} className="po-p-row" data-cat={categorySlug(post.category)}>
                <p className="po-p-row-meta">
                  <time dateTime={post.date}>{post.displayDate}</time> · {post.category} · {post.readingMinutes} min
                </p>
                <div>
                  <a href={post.path} className="po-p-row-title">
                    {post.title}
                  </a>
                  <p className="po-p-row-text">{post.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="limestone" callout="◦ Next" title="Looking for something specific?">
        <LinkRows items={NEXT} columns={2} />
      </Section>

      <QuoteBand />
    </Layout>
  );
}
