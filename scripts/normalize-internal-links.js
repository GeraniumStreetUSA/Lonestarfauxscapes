import fs from 'fs';
import path from 'path';

const ROOT_DIR = '.';
const BLOG_CONTENT_DIR = path.join('content', 'blog');
const HREF_REGEX = /href=(["'])([^"']+)\1/gi;
const MARKDOWN_LINK_REGEX = /(!?\[[^\]]*?\])\(([^)\s]+)([^)]*)\)/g;

const shouldSkipHref = (value) => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value);

const canonicalizeInternalHref = (href) => {
  const raw = typeof href === 'string' ? href.trim() : '';
  if (!raw || shouldSkipHref(raw)) return href;
  if (raw.includes('${')) return href;

  const match = raw.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return href;

  let pathname = match[1] || '';
  const suffix = match[2] || '';
  const lowerPath = pathname.toLowerCase();

  if (lowerPath === '/admin/index.html' || lowerPath === 'admin/index.html') {
    return `/admin/${suffix}`;
  }

  if (lowerPath === '/index.html' || lowerPath === 'index.html') {
    return `/${suffix}`;
  }

  if (lowerPath === '/blog.html' || lowerPath === 'blog.html') {
    return `/blog${suffix}`;
  }

  if (lowerPath.endsWith('.html')) {
    pathname = pathname.slice(0, -5);
  }

  if (!pathname.startsWith('/') && !pathname.startsWith('./') && !pathname.startsWith('../')) {
    pathname = `/${pathname}`;
  }

  if (pathname.length > 1 && pathname.endsWith('/') && pathname !== '/admin/') {
    pathname = pathname.replace(/\/+$/, '');
  }

  pathname = pathname.replace(/\/{2,}/g, '/');
  return `${pathname}${suffix}`;
};

const normalizeHtmlContent = (content) => content.replace(
  HREF_REGEX,
  (match, quote, href) => `href=${quote}${canonicalizeInternalHref(href)}${quote}`,
);

const normalizeMarkdownContent = (content) => {
  const withCanonicalLinks = content.replace(
    MARKDOWN_LINK_REGEX,
    (fullMatch, label, target, rest) => `${label}(${canonicalizeInternalHref(target)}${rest})`,
  );

  return normalizeHtmlContent(withCanonicalLinks);
};

const normalizeFile = (filePath, transformer) => {
  const original = fs.readFileSync(filePath, 'utf-8');
  const updated = transformer(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    return true;
  }
  return false;
};

let htmlUpdated = 0;
let markdownUpdated = 0;

for (const entry of fs.readdirSync(ROOT_DIR)) {
  if (!entry.endsWith('.html')) continue;
  const fullPath = path.join(ROOT_DIR, entry);
  if (normalizeFile(fullPath, normalizeHtmlContent)) {
    htmlUpdated += 1;
  }
}

if (fs.existsSync(BLOG_CONTENT_DIR)) {
  for (const entry of fs.readdirSync(BLOG_CONTENT_DIR)) {
    if (!entry.endsWith('.md')) continue;
    const fullPath = path.join(BLOG_CONTENT_DIR, entry);
    if (normalizeFile(fullPath, normalizeMarkdownContent)) {
      markdownUpdated += 1;
    }
  }
}

console.log(`Normalized links in ${htmlUpdated} root HTML file(s) and ${markdownUpdated} blog markdown file(s).`);
