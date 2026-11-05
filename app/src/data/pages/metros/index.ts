import { ARLINGTON } from './arlington';
import { AUSTIN } from './austin';
import { DALLAS } from './dallas';
import { FORT_WORTH } from './fort-worth';
import { FRISCO } from './frisco';
import { HOUSTON } from './houston';
import { IRVING } from './irving';
import { PLANO } from './plano';
import { SAN_ANTONIO } from './san-antonio';
import { SUGAR_LAND } from './sugar-land';
import { THE_WOODLANDS } from './the-woodlands';
import type { MetroData } from './types';

export type { MetroData, MetroGuide, MetroLink, SystemKey } from './types';

/** The five indexed metros, in the order the site lists them. */
export const METROS: readonly MetroData[] = [DALLAS, FORT_WORTH, HOUSTON, AUSTIN, SAN_ANTONIO];

/** The noindex suburb pages, each linking up to its metro. */
export const SUBURBS: readonly MetroData[] = [PLANO, FRISCO, IRVING, ARLINGTON, SUGAR_LAND, THE_WOODLANDS];

export const ALL_AREAS: readonly MetroData[] = [...METROS, ...SUBURBS];

export function findArea(slug: string): MetroData {
  const area = ALL_AREAS.find((a) => a.slug === slug);
  if (!area) throw new Error(`No metro data for ${slug}`);
  return area;
}
