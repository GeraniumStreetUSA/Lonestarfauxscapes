import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), 'utf8');
}

function expectIncludes(content, needle, description, failures) {
  if (!content.includes(needle)) {
    failures.push(`Missing ${description}: ${needle}`);
  }
}

function expectExcludes(content, needle, description, failures) {
  if (content.includes(needle)) {
    failures.push(`Unexpected ${description}: ${needle}`);
  }
}

const indexHtml = read('index.html');
const guidesHtml = read('guides.html');
const blogHtml = read('blog.html');
const installationHtml = read('installation.html');

const failures = [];

expectIncludes(indexHtml, '<a href="/case-studies" class="lsfs-link">Projects</a>', 'desktop Projects nav link', failures);
expectIncludes(indexHtml, '<a href="/case-studies" class="lsfs-mobile-link">Projects</a>', 'mobile Projects nav link', failures);
expectIncludes(indexHtml, '<a href="/guides" class="lsfs-link">Guides</a>', 'desktop Guides nav link', failures);
expectIncludes(indexHtml, '<a href="/guides" class="lsfs-mobile-link">Guides</a>', 'mobile Guides nav link', failures);
expectExcludes(indexHtml, '<a href="/blog" class="lsfs-link">Blog</a>', 'desktop Blog nav link', failures);
expectExcludes(indexHtml, '<a href="/blog" class="lsfs-mobile-link">Blog</a>', 'mobile Blog nav link', failures);
expectExcludes(indexHtml, '<a href="/gallery" class="lsfs-link">Gallery</a>', 'desktop Gallery nav link', failures);
expectExcludes(indexHtml, '<a href="/gallery" class="lsfs-mobile-link">Gallery</a>', 'mobile Gallery nav link', failures);

expectIncludes(guidesHtml, 'Guide hub', 'guide-hub language in guides page', failures);
expectIncludes(guidesHtml, 'Start with the question you are trying to answer', 'question-led guide hub section', failures);
expectIncludes(guidesHtml, 'href="/blog"', 'blog archive access from guides page', failures);
expectIncludes(guidesHtml, '/case-studies', 'projects access from the guide hub', failures);
expectExcludes(guidesHtml, '<a href="/gallery" class="lsfs-link">Gallery</a>', 'legacy Gallery nav on guides page', failures);
expectExcludes(guidesHtml, '<a href="/gallery" class="lsfs-mobile-link">Gallery</a>', 'legacy mobile Gallery nav on guides page', failures);

expectIncludes(blogHtml, '<title>Texas Blog', 'blog archive title', failures);
expectIncludes(blogHtml, 'Knowledge blog', 'knowledge-blog language on blog page', failures);
expectIncludes(blogHtml, 'href="/guides"', 'guides access from blog page', failures);
expectExcludes(blogHtml, '<a href="/gallery" class="lsfs-link">Gallery</a>', 'legacy Gallery nav on blog page', failures);
expectExcludes(blogHtml, '<a href="/gallery" class="lsfs-mobile-link">Gallery</a>', 'legacy mobile Gallery nav on blog page', failures);

expectIncludes(installationHtml, 'Recent installation projects', 'installation project-proof heading', failures);
expectIncludes(installationHtml, 'data-lsfs-case-studies=', 'installation case-study proof block', failures);
expectIncludes(installationHtml, '<script src="/case-study-proofs.js"', 'installation proof script include', failures);
expectIncludes(installationHtml, 'href="/case-studies"', 'installation projects CTA', failures);
expectExcludes(installationHtml, '<a href="/gallery" class="lsfs-link">Gallery</a>', 'legacy Gallery nav on installation page', failures);
expectExcludes(installationHtml, '<a href="/gallery" class="lsfs-mobile-link">Gallery</a>', 'legacy mobile Gallery nav on installation page', failures);

if (failures.length > 0) {
  console.error('Guides and blog verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Guides and blog verification passed.');
