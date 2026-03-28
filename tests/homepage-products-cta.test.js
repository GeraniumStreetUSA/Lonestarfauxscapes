import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const magneticJs = readFileSync(new URL('../magnetic.js', import.meta.url), 'utf8');
const homepageCss = readFileSync(new URL('../homepage.css', import.meta.url), 'utf8');

test('homepage product card CTAs are explicitly scoped for the Drawbridge fix', () => {
  const matches = indexHtml.match(/class="btn btn-outline product-card-cta"/g) ?? [];

  assert.equal(matches.length, 4, 'expected 4 homepage product CTAs with the product-card-cta class');
  assert.match(
    indexHtml,
    /class="btn btn-outline product-card-cta"[^>]*data-magnetic="false"/,
    'expected product CTAs to opt out of magnetic cursor movement'
  );
});

test('magnetic effect skips elements that opt out', () => {
  assert.match(
    magneticJs,
    /querySelectorAll\('\.btn:not\(\[data-magnetic="false"\]\), \.nav-cta:not\(\[data-magnetic="false"\]\), \.arrow-cta span:not\(\[data-magnetic="false"\]\)'\)/,
    'expected magnetic selector to skip data-magnetic="false" elements'
  );
});

test('homepage product card CTAs use dedicated uniform sizing styles', () => {
  assert.match(
    homepageCss,
    /#products\s+\.product-card-cta\s*\{/,
    'expected homepage CSS rule for product card CTA sizing'
  );
  assert.match(
    homepageCss,
    /#products\s+\.product-card-cta[\s\S]*inline-size:\s*min\(100%,\s*12rem\);/,
    'expected homepage product CTAs to have a consistent width cap'
  );
  assert.match(
    homepageCss,
    /#products\s+\.product-card-cta[\s\S]*min-block-size:\s*5\.75rem;/,
    'expected homepage product CTAs to have a consistent minimum height'
  );
});
