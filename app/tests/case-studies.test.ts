import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { CASE_CARDS } from '../src/data/case-studies.ts';
import { PROJECTS } from '../src/data/projects.ts';
import { allRoutes, findRoute } from '../src/routes.ts';

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

/*
 * The three project pages. Their routes carry the live pages' own <title> and
 * meta description (case-studies/<slug>.html, em-dashes replaced), and the
 * project data matches content/case-studies.json.
 */
const LIVE = [
  {
    slug: 'austin-high-end-residential-privacy',
    title: 'Austin Residential Privacy Wall Case Study | Lone Star Faux Scapes',
    description:
      'See how a large Austin privacy screen was converted from failing live plants to a maintenance-light artificial greenery wall.',
  },
  {
    slug: 'houston-restaurant-hedges',
    title: 'Houston Restaurant Patio Hedge Barrier Case Study | Lone Star Faux Scapes',
    description:
      'See how a Houston restaurant used mounted artificial hedge barriers to define patio seating and improve foot-traffic control.',
  },
  {
    slug: 'houston-storefront-hedges',
    title: 'Houston Storefront Hedge Screening Case Study | Lone Star Faux Scapes',
    description:
      'See how existing concrete barriers at a Houston storefront were upgraded with UV-stabilized artificial hedge panels.',
  },
];

test('the three case-study routes exist with the live titles and descriptions', () => {
  const routes = allRoutes().filter((route) => route.path.startsWith('/case-studies/'));
  assert.equal(routes.length, 3);
  for (const live of LIVE) {
    const route = findRoute(`/case-studies/${live.slug}`);
    assert.ok(route, live.slug);
    assert.equal(route.type, 'project');
    assert.equal(route.title, live.title);
    assert.equal(route.description, live.description);
    assert.equal(route.robots, 'index');
    assert.equal(route.sitemap, true);
    assert.equal(route.hasQuoteForm, true);
    assert.deepEqual(
      route.breadcrumbs.map((crumb) => crumb.label).slice(0, 2),
      ['Home', 'Case Studies'],
    );
    assert.equal(route.breadcrumbs.at(-1)?.href, route.path);
    assert.doesNotMatch(route.title + route.description, /\u2014/);
  }
});

test('project data matches content/case-studies.json (title, city, path) and shows no area', () => {
  assert.equal(PROJECTS.length, 3);
  for (const project of PROJECTS) {
    const study = source.find((s) => s.slug === project.slug);
    assert.ok(study, project.slug);
    assert.equal(project.title, study.title);
    assert.equal(project.city, study.city);
    assert.equal(project.path, study.path);
    const text = JSON.stringify(project);
    assert.doesNotMatch(text, /\d\s*(sq\.? ?ft|square f)/i, `${project.slug} states an area`);
    assert.doesNotMatch(text, /\u2014/, project.slug);
    for (const photo of project.photos) assert.ok(photo.alt && photo.caption, `${project.slug} photo ${photo.name}`);
  }
});
