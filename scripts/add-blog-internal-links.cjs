const fs = require('fs');
const path = require('path');

const blogFiles = fs.readdirSync('./blog').filter(f => f.endsWith('.html')).map(f => `blog/${f}`);

// Related products section HTML
const relatedProductsSection = `
      <div class="related-products">
        <h3>Explore Our Products</h3>
        <div class="related-grid">
          <a href="/artificial-hedge.html" class="related-card">
            <span class="related-title">Artificial Hedges</span>
            <span class="related-desc">Premium UV-resistant hedge panels for Texas homes</span>
          </a>
          <a href="/living-wall.html" class="related-card">
            <span class="related-title">Living Walls</span>
            <span class="related-desc">Vertical garden solutions for any space</span>
          </a>
          <a href="/fire-rated-artificial-hedge.html" class="related-card">
            <span class="related-title">Fire-Rated Hedges</span>
            <span class="related-desc">NFPA 701 certified for commercial projects</span>
          </a>
          <a href="/pricing.html" class="related-card">
            <span class="related-title">Pricing Guide</span>
            <span class="related-desc">See our cost breakdown and get a quote</span>
          </a>
        </div>
      </div>
`;

// CSS for related products
const relatedProductsCSS = `
    /* Related Products Section */
    .related-products {
      margin: 3rem 0 2rem;
      padding: 2rem;
      background: rgba(100, 211, 138, 0.05);
      border: 1px solid rgba(100, 211, 138, 0.15);
      border-radius: 12px;
    }
    .related-products h3 {
      font-size: 1.1rem;
      color: #fff;
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .related-card {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .related-card:hover {
      background: rgba(100, 211, 138, 0.1);
      border-color: rgba(100, 211, 138, 0.3);
      transform: translateY(-2px);
    }
    .related-title {
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.35rem;
      font-size: 0.95rem;
    }
    .related-desc {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.6);
      line-height: 1.4;
    }
`;

let updatedCount = 0;

blogFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Check if already has related products section
    if (content.includes('class="related-products"')) {
      console.log(`Skipping ${file} - already has related products`);
      return;
    }

    // Add related products section before article-tags
    if (content.includes('class="article-tags"')) {
      content = content.replace(
        '<div class="article-tags">',
        relatedProductsSection + '\n      <div class="article-tags">'
      );
      modified = true;
    }

    // Add CSS before the article-hero class definition or at end of style block
    if (modified && content.includes('.article-hero {')) {
      content = content.replace(
        '.article-hero {',
        relatedProductsCSS + '\n    .article-hero {'
      );
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      console.log(`Updated: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log(`\nAdded internal links to ${updatedCount} blog posts`);
