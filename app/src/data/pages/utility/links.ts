import type { LinkRow } from '../../../components/page/LinkRows';
import { AREA_LINKS, SYSTEM_LINKS, type NavLink } from '../../site';

const toRow = ({ label, href }: NavLink): LinkRow => ({ title: label, href });

/** The five metros, as LinkRows items. */
export const AREA_ROWS: readonly LinkRow[] = AREA_LINKS.map(toRow);

/** The footer's system links, as LinkRows items. */
export const SYSTEM_ROWS: readonly LinkRow[] = SYSTEM_LINKS.map(toRow);
