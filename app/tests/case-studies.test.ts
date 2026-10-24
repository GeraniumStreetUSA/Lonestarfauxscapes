import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { CASE_CARDS } from '../src/data/case-studies.ts';

const source = JSON.parse(
  readFileSync(new URL('../../content/case-studies.json', import.meta.url), 'utf8'),
) as { slug: string; title: string; city: string; problemSolved: string; path: string }[];

test('homepage case cards match content/case-studies.json verbatim', () => {
  for (const card of CASE_CARDS) {
    const study = source.find((s) => s.slug === card.slug);
    assert.ok(study, card.slug);
    assert.equal(card.title, study.title);
    assert.equal(card.city, study.city);
    assert.equal(card.problemSolved, study.problemSolved);
    assert.equal(card.path, study.path);
  }
});
