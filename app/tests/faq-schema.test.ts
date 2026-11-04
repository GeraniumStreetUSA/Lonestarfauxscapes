import assert from 'node:assert/strict';
import test from 'node:test';

import { faqSchemaNode } from '../src/lib/faq-schema.ts';

test('faqSchemaNode builds a FAQPage from the visible items', () => {
  const node = faqSchemaNode(
    [
      { question: 'One?', answer: 'Yes.' },
      { question: 'Two?', answer: 'No.' },
    ],
    'https://lonestarfauxscapes.com/dallas',
  );
  assert.equal(node['@type'], 'FAQPage');
  assert.equal(node['@id'], 'https://lonestarfauxscapes.com/dallas#faq');
  assert.deepEqual(
    node.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
    [
      ['One?', 'Yes.'],
      ['Two?', 'No.'],
    ],
  );
});
