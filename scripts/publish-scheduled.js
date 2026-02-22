import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = './content/blog';

const today = new Date();
today.setHours(0, 0, 0, 0);

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
let published = 0;
let remaining = 0;

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);

  if (data.draft !== true) continue;

  const postDate = new Date(data.date);
  postDate.setHours(0, 0, 0, 0);

  if (postDate <= today) {
    const updated = raw.replace(/^draft:\s*true$/m, 'draft: false');
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`  Published: ${file} (date: ${data.date})`);
    published++;
  } else {
    console.log(`  Scheduled: ${file} (date: ${data.date})`);
    remaining++;
  }
}

console.log(`\n${published} post(s) published. ${remaining} still scheduled.`);
console.log(`PUBLISHED=${published}`);
console.log(`REMAINING=${remaining}`);
