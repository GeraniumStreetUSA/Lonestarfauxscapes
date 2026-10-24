import { AREA_LINKS } from '../data/site';

/**
 * A vicinity map, the small locator every site plan carries: the five metros
 * as survey pins at their true relative positions (latitude and longitude,
 * longitude scaled by cos 31°), with a north arrow. No state outline, no
 * scale: it says where, not how far. Decorative; the list beside it carries
 * the links.
 */

const INK = '#15211B';
const NOON = '#F2B53A';

const W = 300;
const H = 340;
const LON_MIN = -98.95;
const LAT_MAX = 33.15;
const K = 80; // units per degree of latitude
const LON_SCALE = Math.cos((31 * Math.PI) / 180);

const COORDS: Record<string, [lat: number, lon: number]> = {
  Dallas: [32.78, -96.8],
  'Fort Worth': [32.75, -97.33],
  Houston: [29.76, -95.37],
  Austin: [30.27, -97.74],
  'San Antonio': [29.42, -98.49],
};

/** Which side of its pin each label sits, so Dallas and Fort Worth do not collide. */
const LABEL_SIDE: Record<string, 'left' | 'right'> = {
  Dallas: 'right',
  'Fort Worth': 'left',
  Houston: 'left',
  Austin: 'right',
  'San Antonio': 'right',
};

const round = (n: number) => Math.round(n * 10) / 10;

function project([lat, lon]: [number, number]) {
  return {
    x: round(24 + (lon - LON_MIN) * LON_SCALE * K),
    y: round(24 + (LAT_MAX - lat) * K),
  };
}

export default function VicinityMap() {
  const points = AREA_LINKS.map((area) => ({ label: area.label, ...project(COORDS[area.label]) }));

  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[420px]" aria-hidden="true">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
          <rect
            x={0.5}
            y={0.5}
            width={W - 1}
            height={H - 1}
            fill="#FFFFFF"
            fillOpacity={0.3}
            stroke={INK}
            strokeOpacity={0.45}
            strokeDasharray="12 4 3 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* North arrow, top right. */}
          <path d={`M ${W - 26} 76 L ${W - 26} 40`} stroke={INK} strokeOpacity={0.8} vectorEffect="non-scaling-stroke" />
          <polygon points={`${W - 26},36 ${W - 19},54 ${W - 26},49`} fill={INK} fillOpacity={0.85} />
          <polyline
            points={`${W - 26},36 ${W - 33},54 ${W - 26},49`}
            fill="none"
            stroke={INK}
            strokeOpacity={0.85}
            vectorEffect="non-scaling-stroke"
          />
          {points.map((p) => (
            <circle key={p.label} cx={p.x} cy={p.y} r={5} fill={NOON} stroke={INK} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {points.map((p) => (
          <span
            key={p.label}
            className="plan-label"
            data-side={LABEL_SIDE[p.label]}
            style={{
              left: `${(p.x / W) * 100}%`,
              top: `${(p.y / H) * 100}%`,
              transform: LABEL_SIDE[p.label] === 'left' ? 'translate(calc(-100% - 12px), -50%)' : 'translate(12px, -50%)',
            }}
          >
            {p.label}
          </span>
        ))}
        <span className="plan-label" style={{ left: `${((W - 26) / W) * 100}%`, top: `${(30 / H) * 100}%`, transform: 'translate(-50%, -100%)' }}>
          N
        </span>
      </div>
    </div>
  );
}
