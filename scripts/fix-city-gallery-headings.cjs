/**
 * Fix city gallery headings
 * Changes "Recent [City] installs" to "What We Create in [City]"
 */

const fs = require('fs');
const path = require('path');

const cityFiles = [
  { file: 'dallas.html', city: 'Dallas' },
  { file: 'houston.html', city: 'Houston' },
  { file: 'austin.html', city: 'Austin' },
  { file: 'san-antonio.html', city: 'San Antonio' },
  { file: 'fort-worth.html', city: 'Fort Worth' },
  { file: 'arlington.html', city: 'Arlington' }
];

let totalChanges = 0;

cityFiles.forEach(({ file, city }) => {
  const filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file}: File not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Match "What We Create in [City]" (from previous run)
  const pattern = new RegExp(`<h2>What We Create in ${city}</h2>`, 'g');
  const newHeading = `<h2>What We Can Create in ${city}</h2>`;

  content = content.replace(pattern, newHeading);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}: Updated heading to "What We Create in ${city}"`);
    totalChanges++;
  } else {
    console.log(`⏭️  ${file}: No matching pattern found`);
  }
});

console.log(`\n📊 Total files updated: ${totalChanges}`);
