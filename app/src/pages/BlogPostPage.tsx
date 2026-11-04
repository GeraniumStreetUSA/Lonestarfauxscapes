import { Check, Plus } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/page/Breadcrumbs';
import CardGrid, { type Card } from '../components/page/CardGrid';
import LinkRows from '../components/page/LinkRows';
import Prose from '../components/page/Prose';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import Toc from '../components/page/Toc';
import Picture from '../components/Picture';
import { CASE_CARDS } from '../data/case-studies';
import {
  pageToc,
  splitPostBody,
  type BlogPost,
  type GuideModule,
  type PostFaqItem,
} from '../data/blog';
import { SITE_URL } from '../data/site';
import { POSTS } from '../generated/posts/index';
import { faqSchemaNode } from '../lib/faq-schema';
import type { Route } from '../routes';
import '../styles/posts.css';
import '../styles/post-embeds.css';

/** The hero frame's width: the right column from 1024 px, the page width less its gutters below. */
const HERO_SIZES = '(min-width: 1024px) 560px, calc(100vw - 32px)';

/** The closing band's words follow the post's topic, so it reads as the next step of the article. */
function bandCopy(post: BlogPost): { title: string; text: string } {
  const quote = 'We email an assessment and a rough quote. A site review sets the final invoice.';
  if (post.city) {
    return { title: `Planning a ${post.city} project?`, text: `Send us your measurements and what the space needs. ${quote}` };
  }
  if (/hoa|property-code/.test(post.slug)) {
    return { title: 'Heading into an HOA review?', text: `Send us your measurements and the look you want. ${quote}` };
  }
  if (post.topic === 'commercial-planning' || post.audience === 'commercial' || /fire|nfpa/.test(post.slug)) {
    return {
      title: 'Specifying greenery for a commercial space?',
      text: 'Tell us the space and the documentation you need. Fire-rated foliage is an upgrade at extra cost (built for NFPA 701); ask for the NFPA 701 documentation for the exact system.',
    };
  }
  if (post.topic === 'living-walls') {
    return { title: 'Planning a living wall?', text: `Send us the wall size and where it goes, indoors or out. ${quote}` };
  }
  if (post.topic === 'artificial-hedges') {
    return { title: 'Planning a hedge or privacy screen?', text: `Send us the run length and the height you need. ${quote}` };
  }
  return { title: 'Send us your measurements.', text: quote };
}

/** A summary cut to about a line and a half for a card. */
function clip(text: string, max = 120): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}...`;
}

/** `What To Verify` as the sentence it should be. */
function sentenceCase(text: string): string {
  return text.charAt(0) + text.slice(1).toLowerCase();
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * The FAQ as questions to open, in the kit's FAQ look: every answer ships
 * open (desktop shows them all, crawlers read them either way) and folds
 * after load on phones. Each question stays an `<h3>` with the id the article
 * has always had, and the FAQPage markup is built from this same list.
 */
function PostFaq({ items, url, id, title }: { items: readonly PostFaqItem[]; url: string; id: string; title: string }) {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || !window.matchMedia('(max-width: 767px)').matches) return;
    el.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
  }, []);

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    ...faqSchemaNode(
      items.map((item) => ({ question: item.question, answer: item.answer })),
      url,
    ),
  }).replace(/</g, '\\u003c');

  return (
    <section aria-labelledby={id} className="po-p-faq">
      <h2 id={id} className="po-p-h2">
        {title}
      </h2>
      <div ref={list} className="pk-faq-list po-p-faq-list">
        {items.map((item) => (
          <details key={item.id ?? item.question} className="faq-item" open>
            <summary className="faq-q">
              <h3 id={item.id} className="po-p-faq-q">
                {item.question}
              </h3>
              <Plus size={18} strokeWidth={2.2} className="faq-icon" aria-hidden="true" />
            </summary>
            <div className="faq-a po-p-faq-a prose" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    </section>
  );
}

/** A flagship guide's up-front help: who it is for, the quick answers and the decision snapshot. */
function GuideSummary({ post }: { post: BlogPost }) {
  const answers = post.quickAnswers ?? [];
  const snapshot = post.decisionSnapshot ?? [];
  return (
    <section aria-label="Guide summary" className="po-p-mod po-p-guide">
      {post.guideAudience ? <p className="po-p-guide-for">{post.guideAudience}</p> : null}
      {answers.length > 0 ? (
        <div className="po-p-guide-block">
          <Callout text="◦ Quick answers" />
          <dl className="po-p-qa">
            {answers.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
      {snapshot.length > 0 ? (
        <div className="po-p-guide-block">
          <Callout text="◦ Decision snapshot" />
          <dl className="po-p-defs">
            {snapshot.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

/** The photo behind a proof module's case-study link, when the link is one of the three documented jobs. */
function ProofCard({ row }: { row: Record<string, string> }) {
  const job = CASE_CARDS.find((card) => card.path === row.href);
  return (
    <a href={row.href} className="po-p-proof card-hover">
      {job ? (
        <div className="photo photo-settle po-p-proof-photo">
          <Picture
            name={job.image as 'case-austin-privacy-wall'}
            alt={job.alt}
            sizes="(min-width: 768px) 320px, 100vw"
          />
        </div>
      ) : null}
      <div className="po-p-proof-copy">
        {job ? <Callout as="span" text={`◦ ${job.city}`} /> : null}
        <span className="po-p-proof-title">{row.title}</span>
        <span className="po-p-proof-text">{row.summary}</span>
        <span className="link-go">Read the project</span>
      </div>
    </a>
  );
}

/** One flagship guide module, drawn from its structured data. Its title is not a heading: the article's own H2 sits above it. */
function GuideModuleView({ module }: { module: GuideModule }) {
  const [left, right] = module.columns;
  let body: ReactNode = null;
  switch (module.type) {
    case 'comparisonMatrix':
      body = (
        <table className="po-p-matrix">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Topic</span>
              </th>
              {module.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {module.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td data-label={left}>{row.left}</td>
                <td data-label={right}>{row.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      break;
    case 'checklist':
      body = (
        <ul className="po-p-checks">
          {module.items.map((item) => (
            <li key={item}>
              <Check size={18} strokeWidth={2.4} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      break;
    case 'timeline': {
      const steps = module.steps.length > 0 ? module.steps : module.items.map((title) => ({ title, description: '' }));
      body = (
        <ol className="po-p-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="po-p-step-n" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="po-p-step-title">{step.title}</p>
                {step.description ? <p className="po-p-step-text">{step.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      );
      break;
    }
    case 'pathCards':
      body = (
        <ul className="po-p-paths">
          {module.cards.map((card) => (
            <li key={card.title}>
              <p className="po-p-path-title">{card.title}</p>
              <p className="po-p-path-text">{card.summary}</p>
              {card.bestFor ? (
                <p className="po-p-path-for">
                  <span>Best for</span> {card.bestFor}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      );
      break;
    case 'planningGrid':
    case 'decisionTree':
      body = (
        <dl className="po-p-defs">
          {module.rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      );
      break;
    case 'proofInsert':
      body = module.rows[0] ? <ProofCard row={module.rows[0]} /> : null;
      break;
  }
  if (!body) return null;
  return (
    <section aria-label={module.title} className="po-p-mod" data-type={module.type}>
      <p className="po-p-mod-title">{module.title}</p>
      {module.intro ? <p className="po-p-mod-intro">{module.intro}</p> : null}
      <div className="po-p-mod-body">{body}</div>
    </section>
  );
}

/**
 * A blog post: the page hero's layout for the header (trail, category,
 * H1, summary, date and reading time, the photo), then the article with its
 * table of contents (folded on phones, sticky beside it on desktop). A
 * flagship guide's data is drawn where its comment markers sit in `bodyHtml`:
 * the quick answers and snapshot above the text, each module in place, then
 * what to verify. The FAQ shows as questions to open (with FAQPage markup),
 * and the page closes with where to go next, related posts and a quote band
 * tuned to the topic. Heading ids are exactly the generated ones.
 */
export default function BlogPostPage({ route, post }: { route: Route; post: BlogPost }) {
  const segments = splitPostBody(post.bodyHtml, post.faq);
  const faq = segments.find((segment) => segment.kind === 'faq');
  const toc = pageToc(post.toc, faq?.inBody ? faq.id : null);
  /* A FAQ the article body does not have gets its own link in the contents. */
  if (faq && !faq.inBody) {
    const refs = toc.findIndex((entry) => entry.id === 'references');
    toc.splice(refs < 0 ? toc.length : refs, 0, { id: faq.id, text: faq.title, level: 2 });
  }
  const modules = new Map((post.guideModules ?? []).map((module) => [module.key, module]));
  const url = `${SITE_URL}${post.path}`;
  const band = bandCopy(post);

  const related: Card[] = post.related.flatMap((slug) => {
    const other = POSTS.find((candidate) => candidate.slug === slug);
    return other
      ? [{ title: other.title, href: other.path, callout: other.category, text: clip(other.summary), linkLabel: 'Read the article' }]
      : [];
  });

  /* A flagship's own next steps first, then the links every post carries (its system, city and pricing). */
  const nextLinks = [...(post.nextSteps ?? []), ...post.supportLinks].filter(
    (link, index, all) => all.findIndex((other) => other.href === link.href) === index,
  );

  const meta = [post.guideType ? post.category : null, `${post.readingMinutes} min read`].filter(Boolean).join(' · ');

  return (
    <Layout route={route}>
      <article>
        <header className="pk-hero po-p-head">
          <div className="wrap">
            <div className="pk-hero-grid" data-media="yes">
              <div className="pk-hero-bar">
                <Breadcrumbs crumbs={route.breadcrumbs} />
              </div>
              <Callout text={`◦ ${post.guideEyebrow ?? post.category}`} className="pk-hero-callout" />
              <h1 className="pk-hero-title po-p-title">{post.title}</h1>
              <p className="pk-hero-lede po-p-summary">{post.summary}</p>
              <p className="pk-hero-price po-p-meta">
                <time dateTime={post.date}>{post.displayDate}</time>
                {post.updated ? (
                  <>
                    {' · Updated '}
                    <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                  </>
                ) : null}
                {` · ${meta}`}
              </p>
              <div className="pk-hero-media lot-frame">
                <div className="photo pk-hero-frame">
                  <picture>
                    {post.imageVariants
                      ? (['avif', 'webp'] as const).map((format) => (
                          <source
                            key={format}
                            type={`image/${format}`}
                            srcSet={post.imageVariants!.widths.map((w) => `${post.imageVariants!.base}-${w}.${format} ${w}w`).join(', ')}
                            sizes={HERO_SIZES}
                          />
                        ))
                      : null}
                    <img
                      src={post.image}
                      width={post.imageWidth}
                      height={post.imageHeight}
                      alt={post.imageAlt}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
                <span className="pin" style={{ left: 0, top: '100%' }} aria-hidden="true" />
              </div>
            </div>
          </div>
        </header>

        <div className="wrap po-p-layout">
          <div className="pk-with-toc po-p-with-toc" data-toc={toc.length > 0 ? 'yes' : 'no'}>
            {toc.length > 0 ? <Toc items={toc} /> : null}
            <div className="po-p-col">
              {post.guideType ? <GuideSummary post={post} /> : null}

              {segments.map((segment, index) => {
                if (segment.kind === 'html') return <Prose key={index} html={segment.html} />;
                if (segment.kind === 'faq') return <PostFaq key={index} items={segment.items} url={url} id={segment.id} title={segment.title} />;
                const module = modules.get(segment.key);
                return module ? <GuideModuleView key={index} module={module} /> : null;
              })}

              {post.verifyItems && post.verifyItems.length > 0 ? (
                <section aria-labelledby="po-verify" className="po-p-verify">
                  <h2 id="po-verify" className="po-p-h2">
                    {sentenceCase(post.verifyTitle ?? 'What to verify')}
                  </h2>
                  <ul className="po-p-checks">
                    {post.verifyItems.map((item) => (
                      <li key={item}>
                        <Check size={18} strokeWidth={2.4} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      {nextLinks.length > 0 ? (
        <Section tone="limestone" callout="◦ Next" title="Where to go next">
          <LinkRows items={nextLinks.map((link) => ({ title: link.label, href: link.href, text: link.description }))} columns={2} />
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section callout="◦ Keep reading" title="More from the blog">
          <CardGrid items={related} />
        </Section>
      ) : null}

      <QuoteBand title={band.title} text={band.text} />
    </Layout>
  );
}
