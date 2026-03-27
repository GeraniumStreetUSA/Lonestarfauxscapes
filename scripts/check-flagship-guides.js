import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function assertContains(content, needle, label, failures) {
  if (!content.includes(needle)) {
    failures.push(`${label}: missing "${needle}"`);
  }
}

const checks = [
  {
    slug: 'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
    required: [
      'data-guide-template="flagship"',
      'Quick Answers',
      'Decision Snapshot',
      'data-guide-module="comparison-matrix"',
      'data-guide-module="checklist"',
      'What To Verify',
      'Where to go next',
    ],
  },
  {
    slug: 'diy-vs-professional-artificial-hedge-installation',
    required: [
      'data-guide-template="flagship"',
      'Quick Answers',
      'Decision Snapshot',
      'data-guide-module="timeline"',
      'data-guide-module="path-cards"',
      'What To Verify',
      'Where to go next',
    ],
  },
  {
    slug: 'how-to-get-hoa-approval-for-artificial-hedges-in-texas',
    required: [
      'data-guide-template="flagship"',
      'Quick Answers',
      'Decision Snapshot',
      'data-guide-module="planning-grid"',
      'data-guide-module="checklist"',
      'What To Verify',
      'Where to go next',
    ],
  },
  {
    slug: 'indoor-vs-outdoor-artificial-living-walls-materials-and-design',
    required: [
      'data-guide-template="flagship"',
      'Quick Answers',
      'Decision Snapshot',
      'data-guide-module="comparison-matrix"',
      'data-guide-module="decision-tree"',
      'data-guide-module="proof-insert"',
      'What To Verify',
      'Where to go next',
    ],
  },
];

const failures = [];

for (const check of checks) {
  const relativePath = path.join('blog', `${check.slug}.html`);
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    failures.push(`${check.slug}: generated file does not exist`);
    continue;
  }

  let html;
  try {
    html = read(relativePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${check.slug}: could not read generated file (${message})`);
    continue;
  }

  check.required.forEach((needle) => {
    assertContains(html, needle, check.slug, failures);
  });
}

if (failures.length > 0) {
  console.error('Flagship guide verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Flagship guide verification passed.');
