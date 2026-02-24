import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = './content/blog';
const TIME_ZONE = process.env.PUBLISH_TIMEZONE || 'America/Chicago';
const PUBLISH_HOUR = Number(process.env.PUBLISH_HOUR || '8');
const IGNORE_TIME_WINDOW = process.env.PUBLISH_IGNORE_TIME_WINDOW === 'true';

function getDatePartsInZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const getPart = (type) => parts.find((p) => p.type === type)?.value;
  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: Number(getPart('hour')),
  };
}

function toIsoDateKey(value) {
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const now = new Date();
const nowInZone = getDatePartsInZone(now, TIME_ZONE);
const todayKey = `${nowInZone.year}-${nowInZone.month}-${nowInZone.day}`;
const inPublishWindow = IGNORE_TIME_WINDOW || nowInZone.hour >= PUBLISH_HOUR;

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
let published = 0;
let remaining = 0;

console.log(`Time zone: ${TIME_ZONE}`);
console.log(`Current local time: ${todayKey} ${String(nowInZone.hour).padStart(2, '0')}:00`);
if (!inPublishWindow) {
  console.log(`Publish window not open yet (publishes at ${String(PUBLISH_HOUR).padStart(2, '0')}:00 or later).`);
}

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);

  if (data.draft !== true) continue;

  const postDateKey = toIsoDateKey(data.date);
  if (!postDateKey) {
    console.warn(`  Skipping: ${file} (invalid date: ${data.date})`);
    remaining++;
    continue;
  }

  if (inPublishWindow && postDateKey <= todayKey) {
    const updated = raw.replace(/^draft:\s*true$/m, 'draft: false');
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`  Published: ${file} (date: ${postDateKey})`);
    published++;
  } else {
    console.log(`  Scheduled: ${file} (date: ${postDateKey})`);
    remaining++;
  }
}

console.log(`\n${published} post(s) published. ${remaining} still scheduled.`);
console.log(`PUBLISHED=${published}`);
console.log(`REMAINING=${remaining}`);
