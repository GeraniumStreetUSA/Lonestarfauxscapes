import { ArrowRight, Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import LinkRows from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import type { BlogPostSummary } from '../data/blog';
import { BLOG_TOPICS, FEATURED_GUIDE_SLUGS, POSTS } from '../generated/posts/index';
import type { PageProps } from '../routes';
import '../styles/posts.css';

const bySlug = (slug: string): BlogPostSummary | undefined => POSTS.find((post) => post.slug === slug);

/** The old hub's three questions, each with the three places that answer it. Post links read their titles from the data. */
const QUESTIONS = [
  {
    title: 'How should I scope the install?',
    text: 'Installation approach, mounting surface, and when a job needs more than panels on a fence.',
    links: [
      { slug: 'diy-vs-professional-artificial-hedge-installation', title: 'DIY vs professional installation', text: 'Tools, scope and common mistakes' },
      { slug: 'indoor-vs-outdoor-artificial-living-walls-materials-and-design', title: 'Indoor vs outdoor wall planning', text: 'Materials, mounting and exposure' },
      { href: '/installation', title: 'Installation', text: 'The process, step by step' },
    ],
  },
  {
    title: 'What do I need for fire, HOA or spec review?',
    text: 'Start here when documentation, approvals or code questions matter more than the look.',
    links: [
      { slug: 'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery', title: 'NFPA 701 vs ASTM E84', text: 'What each standard covers and when it matters' },
      { slug: 'how-to-get-hoa-approval-for-artificial-hedges-in-texas', title: 'HOA approval guide', text: 'What to submit and how to frame the request' },
      { href: '/commercial-resources', title: 'Commercial resources', text: 'Documentation help and planning for project teams' },
    ],
  },
  {
    title: 'What does this look like in the real world?',
    text: 'Look at finished Texas jobs before you ask for a quote.',
    links: [
      { href: '/case-studies', title: 'Case studies', text: 'The problem, the scope and the result' },
      { href: '/gallery', title: 'Photo gallery', text: 'Texas installs, for ideas' },
      { slug: 'dallas-privacy-without-the-watering-a-real-guide', title: 'A city guide', text: 'How a Texas city guide handles real use cases' },
    ],
  },
] as const;

const SERVICE_PAGES = [
  { title: 'Pricing', href: '/pricing', text: 'What is priced today and what is quoted' },
  { title: 'Artificial hedge', href: '/artificial-hedge', text: 'Privacy screens, hedge walls and fence toppers' },
  { title: 'Living walls', href: '/living-wall', text: 'Interior and exterior greenery walls' },
  { title: 'Residential', href: '/residential', text: 'Backyards, pools, patios and HOA questions' },
  { title: 'Commercial', href: '/commercial', text: 'Hospitality, retail, office and multifamily' },
  { title: 'Texas cities', href: '/locations', text: 'Dallas, Fort Worth, Houston, Austin, San Antonio' },
] as const;

/** One post as a row: the whole row is the link. */
function PostRow({ post }: { post: BlogPostSummary }) {
  return (
    <li className="po-p-row">
      <p className="po-p-row-meta">
        <time dateTime={post.date}>{post.displayDate}</time> · {post.category}
      </p>
      <div>
        <a href={post.path} className="po-p-row-title">
          {post.title}
        </a>
        <p className="po-p-row-text">{post.summary}</p>
      </div>
    </li>
  );
}

/**
 * /guides: the old hub's job, reworked. Research paths by question, the
 * flagship guides first, the posts grouped by topic (each topic a row to open
 * on phones, open on desktop, every link in the markup either way), the
 * service pages, and the latest additions.
 */
export default function GuidesPage({ route }: PageProps) {
  const topics = useRef<HTMLDivElement>(null);

  /* Folded on phones after load, so the topics read as four rows to open. */
  useEffect(() => {
    const el = topics.current;
    if (!el || !window.matchMedia('(max-width: 767px)').matches) return;
    el.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
  }, []);

  const flagships = [
    ...FEATURED_GUIDE_SLUGS.flatMap((slug) => bySlug(slug) ?? []),
    ...POSTS.filter((post) => post.guideType === 'flagship' && !FEATURED_GUIDE_SLUGS.includes(post.slug)),
  ];

  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout="◦ Guide hub"
        title="Guides for artificial hedges, living walls and commercial greenery in Texas"
        lede="Start with the question in front of you: install scope, fire documentation, HOA review, a local project or what a finished job looks like."
      />

      <Section callout="◦ By question" title="Start with the question you have">
        <div className="po-p-paths-grid">
          {QUESTIONS.map((group) => (
            <div key={group.title}>
              <h3 className="po-p-group-title">{group.title}</h3>
              <p className="po-p-group-text">{group.text}</p>
              <LinkRows
                items={group.links.map((link) => {
                  const post = 'slug' in link ? bySlug(link.slug) : undefined;
                  return {
                    title: link.title,
                    href: 'slug' in link ? (post?.path ?? '/blog') : link.href,
                    text: link.text,
                  };
                })}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section tone="limestone" callout="◦ Core guides" title="The strongest planning articles">
        <ul className="po-p-feats">
          {flagships.map((post) => (
            <li key={post.slug} className="po-p-feat">
              <Callout text={`${post.category} · ${post.readingMinutes} min`} />
              <a href={post.path} className="po-p-feat-title">
                {post.title}
              </a>
              <p className="po-p-feat-text">{post.summary}</p>
              <span className="link-go">
                Read the guide
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="topics" callout="◦ By topic" title="Browse every guide by topic">
        <div ref={topics} className="po-p-topics">
          {BLOG_TOPICS.map((topic) => {
            const posts = POSTS.filter((post) => post.topic === topic.id);
            const lead = topic.leadSlug ? bySlug(topic.leadSlug) : undefined;
            return (
              <details key={topic.id} className="po-p-topic faq-item" open>
                <summary>
                  <h3 className="po-p-topic-name">{topic.label}</h3>
                  <span className="po-p-topic-count">{posts.length} articles</span>
                  <Plus size={18} strokeWidth={2.2} className="faq-icon" aria-hidden="true" />
                </summary>
                <div className="po-p-topic-body">
                  <p className="po-p-topic-text">{topic.description}</p>
                  {lead ? (
                    <p className="po-p-topic-start">
                      Start with: <a href={lead.path} className="po-p-inline">{lead.title}</a>
                    </p>
                  ) : null}
                  <ul className="po-p-mini">
                    {posts.map((post) => (
                      <li key={post.slug}>
                        <a href={post.path}>
                          <span>{post.title}</span>
                          <time dateTime={post.date}>{post.displayDate}</time>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a href={topic.href} className="link-go po-p-topic-go">
                    {topic.actionLabel}
                    <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </div>
              </details>
            );
          })}
        </div>
      </Section>

      <Section tone="limestone" callout="◦ Skip the reading" title="Go straight to a service page">
        <LinkRows items={SERVICE_PAGES} columns={2} />
      </Section>

      <Section callout="◦ Latest" title="The latest additions">
        <ul className="po-p-rows">
          {POSTS.slice(0, 8).map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </ul>
        <p className="mt-6">
          <a href="/blog" className="link-go">
            See all {POSTS.length} articles
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </p>
      </Section>

      <QuoteBand />
    </Layout>
  );
}
