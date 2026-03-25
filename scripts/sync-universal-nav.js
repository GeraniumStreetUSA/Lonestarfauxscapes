import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const HOMEPAGE_PATH = path.join(ROOT_DIR, 'index.html');
const SHARED_NAV_PATH = path.join(ROOT_DIR, 'scripts', 'shared-nav.js');

const NAV_START_MARKER = '<!-- NAVBAR HTML -->';
const NAV_END_MARKER = '<!-- ALL STYLES - SCOPED & BULLETPROOF -->';
const NAV_BLOCK_PATTERN = /(?:<!-- NAVBAR HTML -->\s*)?<header id="lsfs-header">[\s\S]*?<div id="lsfs-mobile-menu">[\s\S]*?<\/div>/;

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

const writeIfChanged = (filePath, content) => {
  const current = readFile(filePath);
  if (current === content) return false;
  fs.writeFileSync(filePath, content);
  return true;
};

const escapeTemplateLiteral = (value) =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${');

const extractHomepageNavBlock = (homepageHtml) => {
  const start = homepageHtml.indexOf(NAV_START_MARKER);
  const end = homepageHtml.indexOf(NAV_END_MARKER);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Unable to locate homepage nav markers in index.html');
  }

  return homepageHtml.slice(start, end).trimEnd();
};

const syncSharedNavHelper = (navBlock) => {
  const navMarkupOnly = navBlock.replace(`${NAV_START_MARKER}\n`, '').trim();
  const sharedNavSource = readFile(SHARED_NAV_PATH);
  const updatedSharedNavSource = sharedNavSource.replace(
    /export const UNIVERSAL_NAV_MARKUP = `[\s\S]*?`;/,
    `export const UNIVERSAL_NAV_MARKUP = \`${escapeTemplateLiteral(navMarkupOnly)}\`;`,
  );

  if (updatedSharedNavSource === sharedNavSource) return false;
  fs.writeFileSync(SHARED_NAV_PATH, updatedSharedNavSource);
  return true;
};

const syncTopLevelHtmlFiles = (navBlock) => {
  const files = fs
    .readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.join(ROOT_DIR, entry.name));

  const updatedFiles = [];

  for (const filePath of files) {
    const html = readFile(filePath);
    if (!html.includes('<header id="lsfs-header">') || !html.includes('<div id="lsfs-mobile-menu">')) {
      continue;
    }

    if (!NAV_BLOCK_PATTERN.test(html)) {
      throw new Error(`Unable to sync nav block in ${path.basename(filePath)}`);
    }

    const updatedHtml = html.replace(NAV_BLOCK_PATTERN, navBlock);
    if (writeIfChanged(filePath, updatedHtml)) {
      updatedFiles.push(path.relative(ROOT_DIR, filePath));
    }
  }

  return updatedFiles;
};

const homepageHtml = readFile(HOMEPAGE_PATH);
const homepageNavBlock = extractHomepageNavBlock(homepageHtml);

const updatedFiles = syncTopLevelHtmlFiles(homepageNavBlock);
const sharedNavUpdated = syncSharedNavHelper(homepageNavBlock);

if (sharedNavUpdated) {
  updatedFiles.push(path.relative(ROOT_DIR, SHARED_NAV_PATH));
}

if (updatedFiles.length === 0) {
  console.log('Universal nav already in sync.');
} else {
  console.log(`Synced homepage nav to ${updatedFiles.length} file(s):`);
  updatedFiles.forEach((file) => console.log(`  - ${file}`));
}
