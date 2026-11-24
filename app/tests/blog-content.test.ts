import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

import type { BlogPost } from '../src/data/blog.ts';
import { POSTS } from '../src/generated/posts/index.ts';
import { allRoutes } from '../src/routes.ts';

const routes = allRoutes();
const postsDir = new URL('../src/generated/posts/', import.meta.url);
const slugs = POSTS.map((post) => post.slug);

const posts = new Map<string, BlogPost>();
for (const slug of slugs) {
  const module = (await import(new URL(`${slug}.ts`, postsDir).href)) as { post: BlogPost };
  posts.set(slug, module.post);
}

/** Table A rows 29-62 of REDIRECTS.md: the blog post URLs, read from the file itself. */
const tableABlogPaths = readFileSync(new URL('../../REDIRECTS.md', import.meta.url), 'utf8')
  .split('\n')
  .flatMap((line) => {
    const row = /^\| (\d+) \| `([^`]+)` \|/.exec(line);
    if (!row) return [];
    const n = Number(row[1]);
    return n >= 29 && n <= 62 ? [row[2]] : [];
  });

/**
 * What the live pages have (captured with curl, tests/fixtures/live-blog-seo.json):
 * the `<title>`, the meta description, the ids of the h2/h3 headings in the
 * article and the table of contents' links.
 */
interface LiveSeo {
  title: string;
  description: string;
  ids: string[];
  tocHrefs: string[];
}
const live = JSON.parse(readFileSync(new URL('./fixtures/live-blog-seo.json', import.meta.url), 'utf8')) as Record<
  string,
  LiveSeo
>;

const decode = (text: string) =>
  text.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
/** The owner's no-em-dash rule: the one change the generated text makes to the live text. */
const noEmDash = (text: string) => text.replace(/\s*—\s*/g, ', ');
const headingIds = (html: string) => [...html.matchAll(/<h[23] id="([^"]*)"/g)].map((match) => match[1]);

test('the Table A blog rows were read (34 posts) and every one has a route', () => {
  assert.equal(tableABlogPaths.length, 34);
  assert.equal(POSTS.length, 34);
  for (const path of tableABlogPaths) {
    const route = routes.find((candidate) => candidate.path === path);
    assert.ok(route, `${path} has no route`);
    assert.equal(route.type, 'post', path);
    assert.equal(route.robots, 'index', path);
    assert.ok(route.sitemap, path);
  }
  const postRoutes = routes.filter((route) => route.type === 'post').map((route) => route.path);
  assert.deepEqual([...postRoutes].sort(), [...tableABlogPaths].sort());
});

test('each post has its route title and description, a page chunk and breadcrumbs', () => {
  for (const [slug, post] of posts) {
    const route = routes.find((candidate) => candidate.path === `/blog/${slug}`)!;
    assert.equal(route.title, post.seoTitle, slug);
    assert.equal(route.description, post.description, slug);
    assert.deepEqual(
      route.breadcrumbs.map((crumb) => crumb.href),
      ['/', '/blog', `/blog/${slug}`],
      slug,
    );
    assert.ok(existsSync(new URL(`${slug}.page.tsx`, postsDir)), `${slug}.page.tsx`);
  }
});

test('the generated folder holds exactly the posts (no stale files)', () => {
  const expected = new Set(['index.ts', ...slugs.flatMap((slug) => [`${slug}.ts`, `${slug}.page.tsx`])]);
  assert.deepEqual(new Set(readdirSync(postsDir)), expected);
});

/*
 * Deliberate changes from the live <title> and meta description (owner rule:
 * one brand spelling, 2026-11-04). Everything else must match live exactly.
 */
const DELIBERATE: Record<string, { title?: string; description?: string }> = {
  // Approved Website Factory proposal-20260901-060008, chg-1-title-meta.
  'green-wall-maintenance-in-texas-what-it-actually-takes': {
    title: 'Green Wall Maintenance Dallas TX: Care & Planning',
    description:
      'Planning a green wall in Dallas? Compare living wall upkeep, irrigation checks, pruning, and artificial wall cleaning before choosing a system.',
  },
  'artificial-living-walls-and-hedges-in-san-antonio': {
    description:
      'Get artificial living walls and faux hedges in San Antonio, TX: clean, low-maintenance greenery for homes and businesses. Ask Lone Star Faux Scapes.',
  },
  'artificial-living-walls-and-hedges-in-houston': {
    description:
      'Houston artificial living walls and faux hedges that stay green in heat and humidity. Options, safety notes, and a quote from Lone Star Faux Scapes.',
  },
};

test('title, description and heading ids match the live pages (em-dashes aside)', () => {
  for (const [slug, post] of posts) {
    const expected = live[slug];
    assert.ok(expected, `no live capture for ${slug}`);
    assert.equal(post.seoTitle, DELIBERATE[slug]?.title ?? noEmDash(expected.title), `${slug} <title>`);
    assert.equal(post.description, DELIBERATE[slug]?.description ?? noEmDash(expected.description), `${slug} meta description`);
    assert.deepEqual(headingIds(post.bodyHtml), expected.ids, `${slug} heading ids`);
    assert.deepEqual(
      post.toc.map((entry) => entry.id),
      expected.tocHrefs,
      `${slug} table of contents`,
    );
  }
});

test('title, description and heading ids match the old committed blog/ HTML where it exists', () => {
  let compared = 0;
  for (const [slug, post] of posts) {
    const file = new URL(`../../blog/${slug}.html`, import.meta.url);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    const title = decode(/<title>([\s\S]*?)<\/title>/.exec(html)![1]);
    const description = decode(/<meta name="description" content="([^"]*)"/.exec(html)![1]);
    const article = html.slice(html.indexOf('<article class="article-content"'));
    assert.equal(post.seoTitle, DELIBERATE[slug]?.title ?? noEmDash(title), `${slug} <title>`);
    assert.equal(post.description, DELIBERATE[slug]?.description ?? noEmDash(description), `${slug} meta description`);
    assert.deepEqual(headingIds(article), headingIds(post.bodyHtml), `${slug} heading ids`);
    compared += 1;
  }
  // blog/ goes away with the old site; until then it must still agree.
  console.log(`compared with ${compared} old blog/*.html files`);
});

test('headings in bodyHtml: no <h1>, and every toc entry has its id in the body', () => {
  for (const [slug, post] of posts) {
    assert.ok(!/<h1[\s>]/i.test(post.bodyHtml), `${slug} has an <h1> in bodyHtml`);
    for (const entry of post.toc) {
      assert.ok(post.bodyHtml.includes(`id="${entry.id}"`), `${slug}: #${entry.id} is not in the body`);
    }
  }
});

test('no em-dash in any generated field, and the heading id that had one is unchanged', () => {
  for (const [slug, post] of posts) {
    assert.ok(!JSON.stringify(post).includes('—'), `${slug} has an em-dash`);
  }
  const post = posts.get('indoor-vs-outdoor-artificial-living-walls-materials-and-design')!;
  // The live heading is "Which costs more—indoor or outdoor ...": its id drops the dash with no space.
  assert.ok(post.bodyHtml.includes('<h3 id="which-costs-moreindoor-or-outdoor-artificial-livin">Which costs more: indoor'));
  assert.ok(!JSON.stringify(POSTS).includes('—'));
});

test('slugs, paths and images are well formed', () => {
  for (const [slug, post] of posts) {
    assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.equal(post.path, `/blog/${slug}`);
    assert.ok(post.image.startsWith('/images/'), `${slug} image ${post.image}`);
    assert.ok(existsSync(new URL(`../..${post.image}`, import.meta.url)), `${slug}: ${post.image} is missing`);
    assert.ok(post.imageWidth > 0 && post.imageHeight > 0, slug);
    assert.ok(post.related.length > 0 && post.related.every((other) => posts.has(other) && other !== slug), slug);
    for (const img of post.bodyHtml.match(/<img\b[^>]*>/g) ?? []) {
      assert.ok(/\ssrc=/.test(img) && /\salt=/.test(img) && /\swidth=/.test(img) && /\sheight=/.test(img), `${slug}: ${img}`);
    }
  }
});

test('internal links in the body are slashless paths with no .html', () => {
  for (const [slug, post] of posts) {
    for (const [, href] of post.bodyHtml.matchAll(/href="([^"]+)"/g)) {
      if (!href.startsWith('/')) continue;
      const pathname = href.split(/[?#]/)[0];
      assert.ok(!pathname.endsWith('.html') && (pathname === '/' || !pathname.endsWith('/')), `${slug}: ${href}`);
    }
  }
});

test('flagship guides keep their structured fields and a placeholder per module', () => {
  const flagships = POSTS.filter((post) => post.guideType === 'flagship');
  assert.equal(flagships.length, 4);
  for (const { slug } of flagships) {
    const post = posts.get(slug)!;
    assert.ok(post.guidePromise && post.guideEyebrow, slug);
    assert.ok((post.quickAnswers?.length ?? 0) > 0 && (post.guideModules?.length ?? 0) > 0, slug);
    for (const module of post.guideModules!) {
      assert.ok(post.bodyHtml.includes(`<!-- guide-module:${module.key} -->`), `${slug}: ${module.key}`);
    }
  }
});

test('hub data: featured guides exist and categories are listed', async () => {
  const hub = await import('../src/generated/posts/index.ts');
  assert.deepEqual(hub.FEATURED_GUIDE_SLUGS, [
    'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
    'indoor-vs-outdoor-artificial-living-walls-materials-and-design',
    'diy-vs-professional-artificial-hedge-installation',
  ]);
  for (const slug of hub.FEATURED_GUIDE_SLUGS) assert.ok(posts.has(slug), slug);
  assert.deepEqual(new Set(hub.BLOG_CATEGORIES), new Set(POSTS.map((post) => post.category)));
  assert.equal(hub.BLOG_TOPICS.length, 4);
  // Newest first.
  const dates = POSTS.map((post) => post.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test('public/content JSON: 34 posts, and case-studies.json is the repo copy', () => {
  const postsJson = JSON.parse(readFileSync(new URL('../public/content/posts.json', import.meta.url), 'utf8')) as {
    slug: string;
    title: string;
    category: string;
  }[];
  assert.deepEqual(postsJson.map((post) => post.slug), slugs);
  assert.ok(postsJson.every((post) => post.title && post.category));
  assert.equal(
    readFileSync(new URL('../public/content/case-studies.json', import.meta.url), 'utf8'),
    readFileSync(new URL('../../content/case-studies.json', import.meta.url), 'utf8'),
  );
});

/*
 * Blog posts never quote dollar figures: prices come only from
 * src/data/starting-prices.ts (see tasks/rebuild-page-rules.md).
 */
test('no blog post quotes a dollar figure', () => {
  const found = [...posts].filter(([, post]) => /\$\s?\d/.test(JSON.stringify(post))).map(([slug]) => slug);
  assert.deepEqual(found, []);
});

test('post bodies carry no scripts and no block left hidden for a script to reveal', () => {
  for (const [slug, post] of posts) {
    assert.ok(!/<script\b/i.test(post.bodyHtml), `${slug} has a <script> in its body`);
    for (const [, prefix] of post.bodyHtml.matchAll(/class="[^"]*\b([a-z]+)-reveal\b[^"]*"/g)) {
      assert.ok(post.bodyHtml.includes(`${prefix}-visible`), `${slug}: ${prefix}-reveal block never made visible`);
    }
  }
});

test('no <style> block in any post body: the embedded components are styled by src/styles/post-embeds.css', () => {
  for (const [slug, post] of posts) {
    assert.ok(!/<style\b/i.test(post.bodyHtml), `${slug} has a <style> in its body`);
    assert.ok(!/\sstyle=/i.test(post.bodyHtml.replace(/\sstyle="--w:\d+%"/g, '')), `${slug} has an inline style`);
  }
});

test('every body image has a real alt: not empty, not a file name', () => {
  let images = 0;
  for (const [slug, post] of posts) {
    for (const tag of post.bodyHtml.match(/<img\b[^>]*>/g) ?? []) {
      images += 1;
      const alt = /\salt="([^"]*)"/.exec(tag)?.[1] ?? '';
      assert.ok(alt.trim().length >= 12, `${slug}: empty or tiny alt in ${tag}`);
      assert.ok(!/\s\d{1,4}$/.test(alt.trim()), `${slug}: alt ends in a number like a file name: "${alt}"`);
      assert.ok(!/_/.test(alt), `${slug}: alt has an underscore: "${alt}"`);
      assert.ok(!/\.(jpe?g|png|webp|avif|gif|svg)\b/i.test(alt), `${slug}: alt has a file extension: "${alt}"`);
      assert.ok(alt.trim().split(/\s+/).length >= 3, `${slug}: alt is under three words: "${alt}"`);
    }
  }
  assert.ok(images > 0);
});

test('hero and body photos have responsive variants on disk, and the original src stays as the fallback', () => {
  const publicDir = new URL('../public', import.meta.url);
  for (const [slug, post] of posts) {
    assert.ok(post.imageVariants, `${slug} has no hero variants`);
    const { base, widths } = post.imageVariants;
    assert.ok(widths.length > 0 && widths.every((w) => w <= 1200), slug);
    for (const w of widths) {
      for (const ext of ['avif', 'webp']) {
        assert.ok(existsSync(new URL(`.${base}-${w}.${ext}`, publicDir.href + '/')), `${slug}: ${base}-${w}.${ext}`);
      }
    }
    for (const [, picture] of post.bodyHtml.matchAll(/<picture>([\s\S]*?)<\/picture>/g)) {
      assert.ok(/<source type="image\/avif"/.test(picture) && /<source type="image\/webp"/.test(picture), slug);
      assert.ok(/<img\b[^>]*\ssrc="\/images\/(?!blog-r\/)[^"]+"/.test(picture), `${slug}: the fallback src is not the original`);
      assert.ok(/loading="lazy"/.test(picture), `${slug}: body picture is not lazy`);
      assert.ok(!/fetchpriority/i.test(picture), `${slug}: only the hero gets fetchpriority`);
    }
  }
});
