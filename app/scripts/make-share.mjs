// Turns the share build (dist-share/index.html) into a page body for a
// private Claude artifact preview: the artifact wraps the page in its own
// doctype, html, head and body, so this keeps the title, the inline head
// script, the stylesheet and module links, and the body content, and drops
// the document wrapper and the charset/viewport metas the wrapper provides.
//
//   npm run build:share   ->   dist-share/share.html (+ assets, fonts, images)

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist-share');
const html = await readFile(path.join(dir, 'index.html'), 'utf8');

const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? '';
const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? '';

const keptHead = head
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<!--[\s\S]*?-->\s*/g, '')
  .trim();

const page = `<title>Lone Star Faux Scapes</title>\n${keptHead}\n${body.trim()}\n`;
await writeFile(path.join(dir, 'share.html'), page);
console.log(`share.html: ${page.length} bytes`);
