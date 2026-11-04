/**
 * Small cross-sections, one per system, in the plan-sheet language of
 * PlanDrawings: ink lines, hatch, a Boxwood foliage layer, a ground line and
 * mono dimension labels. Static and deterministic (no randomness, no window),
 * so the prerendered and hydrated markup match. Every label states a released
 * fact only. All colors and stroke styles live in styles/pricing.css (the
 * `pr-d-*` classes); strokes do not scale, so the lines stay crisp at 120 px
 * (phones) and 240 px (desktop).
 */
import type { ComponentType } from 'react';

import '../../styles/pricing.css';

export type SectionDrawingId =
  | 'hedge'
  | 'hedge-freestanding'
  | 'fence-extension'
  | 'living-wall'
  | 'privacy-wall'
  | 'commercial';

/** What each drawing shows, for the title and aria-label. */
export const SECTION_DRAWING_LABELS: Readonly<Record<SectionDrawingId, string>> = {
  hedge: 'Section of a thin hedge, 2 to 3 in deep, fixed to the face of a fence or wall',
  'hedge-freestanding': 'Section of a freestanding hedge, 6 ft tall and 7 in deep, on a post set in concrete',
  'fence-extension':
    'Section of a 3 ft fence extension fixed to the face of the fence on a steel tube, overlapping it by 1.5 ft',
  'living-wall': 'Section of a living wall layer on a wall, custom size',
  'privacy-wall': 'Elevation of a 4 ft by 4 ft privacy wall unit on its base',
  commercial: 'Section of foliage panels on a building facade',
};

/* ------------------------------------------------------------- helpers
   Each returns an SVG path string. Everything is drawn in a 120 x 88 box. */

const R = (n: number) => Math.round(n * 100) / 100;

/** Diagonal hatch (rising to the right) clipped to a rectangle. */
function hatch(x: number, y: number, w: number, h: number, gap: number): string {
  const parts: string[] = [];
  for (let c = Math.ceil((x + y) / gap) * gap; c <= x + w + y + h; c += gap) {
    const xa = Math.max(x, c - (y + h));
    const xb = Math.min(x + w, c - y);
    if (xb - xa > 0.5) parts.push(`M ${R(xa)} ${R(c - xa)} L ${R(xb)} ${R(c - xb)}`);
  }
  return parts.join(' ');
}

/** The other diagonal (falling to the right), for concrete. */
function hatchBack(x: number, y: number, w: number, h: number, gap: number): string {
  const parts: string[] = [];
  for (let c = Math.ceil((y - (x + w)) / gap) * gap; c <= y + h - x; c += gap) {
    const xa = Math.max(x, y - c);
    const xb = Math.min(x + w, y + h - c);
    if (xb - xa > 0.5) parts.push(`M ${R(xa)} ${R(xa + c)} L ${R(xb)} ${R(xb + c)}`);
  }
  return parts.join(' ');
}

/** A foliage layer: straight top and bottom, scalloped outer face (and inner face when `both`). */
function layer(xl: number, xr: number, y0: number, y1: number, bumps: number, bump: number, both = false): string {
  const step = (y1 - y0) / bumps;
  let d = `M ${xl} ${y0} L ${xr} ${y0}`;
  for (let i = 0; i < bumps; i += 1) {
    d += ` Q ${R(xr + bump * 2)} ${R(y0 + step * (i + 0.5))} ${xr} ${R(y0 + step * (i + 1))}`;
  }
  d += ` L ${xl} ${y1}`;
  if (both) {
    for (let i = bumps - 1; i >= 0; i -= 1) {
      d += ` Q ${R(xl - bump * 2)} ${R(y0 + step * (i + 0.5))} ${xl} ${R(y0 + step * i)}`;
    }
  }
  return `${d} Z`;
}

/** The ground line with a short tick under it every 6 units, skipping the listed gaps. */
function ground(x0: number, x1: number, y: number, skip: ReadonlyArray<readonly [number, number]> = []): string {
  const ticks: string[] = [];
  for (let x = x0 + 6; x < x1; x += 6) {
    if (skip.some(([a, b]) => x > a && x < b)) continue;
    ticks.push(`M ${x} ${y} L ${x - 3.5} ${y + 3.5}`);
  }
  return ticks.join(' ');
}

/** A horizontal dimension: the line, a slash at each end. */
function dimH(x0: number, x1: number, y: number): string {
  return `M ${x0} ${y} L ${x1} ${y} M ${x0 - 1.5} ${y + 1.5} L ${x0 + 1.5} ${y - 1.5} M ${x1 - 1.5} ${y + 1.5} L ${x1 + 1.5} ${y - 1.5}`;
}

/** A vertical dimension. */
function dimV(x: number, y0: number, y1: number): string {
  return `M ${x} ${y0} L ${x} ${y1} M ${x - 1.5} ${y0 + 1.5} L ${x + 1.5} ${y0 - 1.5} M ${x - 1.5} ${y1 + 1.5} L ${x + 1.5} ${y1 - 1.5}`;
}

function Label({ x, y, anchor = 'start', children }: { x: number; y: number; anchor?: 'start' | 'middle' | 'end'; children: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={9} className="pr-d-text">
      {children}
    </text>
  );
}

/* ---------------------------------------------------------------- views */

function Hedge() {
  return (
    <>
      {/* The fence in section, a thin hedge on its face. */}
      <path d={hatch(42, 22, 8, 54, 4)} className="pr-d-fine" />
      <rect x={42} y={22} width={8} height={54} className="pr-d-ink" />
      <path d={layer(50, 56, 26, 74, 9, 1.5)} className="pr-d-leaf" />
      <path d="M 50 14 L 50 24 M 56 14 L 56 24" className="pr-d-fine" />
      <path d={dimH(50, 56, 14)} className="pr-d-dim" />
      <Label x={62} y={17}>2 to 3 in</Label>
      <path d="M 6 76 L 114 76" className="pr-d-ground" />
      <path d={ground(6, 114, 76)} className="pr-d-fine" />
    </>
  );
}

function HedgeFreestanding() {
  return (
    <>
      {/* A footing below grade, a post through it, a 3D hedge on the post. */}
      <path d={hatchBack(50, 64, 18, 16, 4)} className="pr-d-fine" />
      <rect x={50} y={64} width={18} height={16} className="pr-d-ink" />
      <rect x={56} y={52} width={5} height={28} className="pr-d-steel" />
      <path d={layer(50, 66, 14, 56, 8, 1.5, true)} className="pr-d-leaf" />
      <path d={hatch(51, 14, 14, 42, 5)} className="pr-d-vein" />
      <path d="M 6 64 L 114 64" className="pr-d-ground" />
      <path d={ground(6, 114, 64, [[48, 70]])} className="pr-d-fine" />
      <path d="M 34 14 L 48 14 M 34 56 L 48 56" className="pr-d-fine" />
      <path d={dimV(34, 14, 56)} className="pr-d-dim" />
      <Label x={30} y={38} anchor="end">6 ft</Label>
      <path d="M 50 6 L 50 12 M 66 6 L 66 12" className="pr-d-fine" />
      <path d={dimH(50, 66, 8)} className="pr-d-dim" />
      <Label x={71} y={11}>7 in</Label>
    </>
  );
}

function FenceExtension() {
  return (
    <>
      {/* The fence, a steel square tube on its face, the extension over the tube. */}
      <path d={hatch(40, 46, 7, 30, 4)} className="pr-d-fine" />
      <rect x={40} y={46} width={7} height={30} className="pr-d-ink" />
      <rect x={47} y={18} width={3} height={41} className="pr-d-steel" />
      <path d={layer(50, 57, 16, 61, 8, 1.5)} className="pr-d-leaf" />
      <path d="M 30 46 L 66 46" className="pr-d-fine pr-d-dash" />
      <path d="M 61 16 L 72 16 M 61 46 L 72 46 M 61 61 L 72 61" className="pr-d-fine" />
      <path d={dimV(69, 16, 46)} className="pr-d-dim" />
      <path d={dimV(69, 46, 61)} className="pr-d-dim" />
      <Label x={74} y={34}>3 ft</Label>
      <Label x={74} y={56}>1.5 ft</Label>
      <path d="M 6 76 L 114 76" className="pr-d-ground" />
      <path d={ground(6, 114, 76)} className="pr-d-fine" />
    </>
  );
}

function LivingWall() {
  return (
    <>
      {/* A wall with a foliage mat on its face; the size is the customer's. */}
      <path d={hatch(36, 14, 16, 62, 4)} className="pr-d-fine" />
      <rect x={36} y={14} width={16} height={62} className="pr-d-ink" />
      <path d={layer(52, 60, 18, 72, 10, 1.5)} className="pr-d-leaf" />
      <path d="M 64 18 L 76 18 M 64 72 L 76 72" className="pr-d-fine" />
      <path d={dimV(73, 18, 72)} className="pr-d-dim" />
      <Label x={79} y={42}>custom</Label>
      <Label x={79} y={53}>size</Label>
      <path d="M 6 76 L 114 76" className="pr-d-ground" />
      <path d={ground(6, 114, 76)} className="pr-d-fine" />
    </>
  );
}

function PrivacyWall() {
  return (
    <>
      {/* A 4 x 4 ft unit seen from the front, on its base. */}
      <rect x={38} y={24} width={40} height={40} rx={2} className="pr-d-leaf" />
      <path d={hatch(38, 24, 40, 40, 6)} className="pr-d-vein" />
      <path d={hatch(30, 64, 56, 9, 4)} className="pr-d-fine" />
      <rect x={30} y={64} width={56} height={9} className="pr-d-ink" />
      <path d="M 6 73 L 114 73" className="pr-d-ground" />
      <path d={ground(6, 114, 73)} className="pr-d-fine" />
      <path d="M 38 22 L 38 12 M 78 22 L 78 12" className="pr-d-fine" />
      <path d={dimH(38, 78, 15)} className="pr-d-dim" />
      <Label x={58} y={11} anchor="middle">4 ft</Label>
      <path d="M 80 24 L 92 24 M 80 64 L 92 64" className="pr-d-fine" />
      <path d={dimV(90, 24, 64)} className="pr-d-dim" />
      <Label x={94} y={47}>4 ft</Label>
    </>
  );
}

function Commercial() {
  return (
    <>
      {/* A facade in section with foliage panels in a stack. */}
      <path d={hatch(40, 10, 18, 66, 4)} className="pr-d-fine" />
      <rect x={40} y={10} width={18} height={66} className="pr-d-ink" />
      <path d={layer(58, 65, 14, 30, 3, 1.3)} className="pr-d-leaf" />
      <path d={layer(58, 65, 35, 51, 3, 1.3)} className="pr-d-leaf" />
      <path d={layer(58, 65, 56, 72, 3, 1.3)} className="pr-d-leaf" />
      <path d="M 6 76 L 114 76" className="pr-d-ground" />
      <path d={ground(6, 114, 76)} className="pr-d-fine" />
    </>
  );
}

const VIEWS: Readonly<Record<SectionDrawingId, ComponentType>> = {
  hedge: Hedge,
  'hedge-freestanding': HedgeFreestanding,
  'fence-extension': FenceExtension,
  'living-wall': LivingWall,
  'privacy-wall': PrivacyWall,
  commercial: Commercial,
};

/** One system's section drawing: fills its container's width (120 to 240 px). */
export function SectionDrawing({ id, className }: { id: SectionDrawingId; className?: string }) {
  const View = VIEWS[id];
  const label = SECTION_DRAWING_LABELS[id];
  return (
    <svg
      viewBox="0 0 120 88"
      className={className ? `pr-d ${className}` : 'pr-d'}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <title>{label}</title>
      <View />
    </svg>
  );
}

export default SectionDrawing;
