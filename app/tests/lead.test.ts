import assert from 'node:assert/strict';
import test from 'node:test';

import { EMPTY_QUOTE, buildLeadPayload, composeMessage, quoteSchema, serviceLine } from '../src/lib/lead.ts';

const filled = {
  ...EMPTY_QUOTE,
  name: ' Pat Rivera ',
  email: 'pat@example.com',
  location: 'Austin',
  system: 'Hedge on your fence or wall',
  projectType: 'Residential',
};

test('service is the chip label, a slash, and the project type', () => {
  assert.equal(serviceLine('Freestanding hedge', 'Residential'), 'Freestanding hedge / Residential');
  assert.equal(serviceLine('Not sure yet', 'Commercial'), 'Not sure yet / Commercial');
});

test('the payload has exactly the fields the Pages Function reads', () => {
  const payload = buildLeadPayload(filled, '', 'token-1');
  assert.deepEqual(Object.keys(payload).sort(), [
    'email',
    'location',
    'message',
    'name',
    'phone',
    'service',
    'turnstileToken',
    'website',
  ]);
  assert.equal(payload.name, 'Pat Rivera');
  assert.equal(payload.service, 'Hedge on your fence or wall / Residential');
  assert.equal(payload.turnstileToken, 'token-1');
});

test('message is never empty: details, then the estimate, then system and place', () => {
  const summary = 'Hedge, 40 ft run × 6 ft high: 24 across × 4 rows = 96 panels, 240 sq ft (20 in panels)';
  assert.equal(composeMessage('Cover the back fence.', summary, 's', 'l'), `Cover the back fence.\n\n${summary}`);
  assert.equal(composeMessage('', summary, 's', 'l'), summary);
  assert.equal(composeMessage('  ', '', 'Living wall / Commercial', 'Houston'), 'Living wall / Commercial, Houston');
  assert.ok(buildLeadPayload(filled, '', '').message.length > 0);
});

test('validation: name, email, city or ZIP, system and project type are required', () => {
  const empty = quoteSchema.safeParse(EMPTY_QUOTE);
  assert.equal(empty.success, false);
  const fields = new Set(empty.error?.issues.map((i) => String(i.path[0])));
  for (const f of ['name', 'email', 'location', 'system', 'projectType']) assert.ok(fields.has(f), f);
  assert.ok(!fields.has('phone'));
  assert.ok(!fields.has('details'));
  assert.equal(quoteSchema.safeParse(filled).success, true);
  assert.equal(quoteSchema.safeParse({ ...filled, email: 'not-an-email' }).success, false);
  assert.equal(quoteSchema.safeParse({ ...filled, system: 'Privacy wall' }).success, true);
  // Both hedge kinds are chips the form accepts.
  assert.equal(quoteSchema.safeParse({ ...filled, system: 'Hedge on your fence or wall' }).success, true);
  assert.equal(quoteSchema.safeParse({ ...filled, system: 'Freestanding hedge' }).success, true);
  assert.equal(quoteSchema.safeParse({ ...filled, system: 'Something else' }).success, false);
});
