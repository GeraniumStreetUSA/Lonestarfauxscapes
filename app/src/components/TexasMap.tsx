import { useEffect, useRef } from 'react';

import { SERVICE_AREA } from '../data/home-content';
import { AREA_LINKS } from '../data/site';
import { motionAllowed } from '../lib/motion';

/**
 * Texas as a survey sheet: the state line from real border coordinates
 * (simplified), a 2° graticule, a north arrow and a true 100 mi scale bar,
 * with the five metros pinned at their real latitude and longitude.
 *
 * Projection: equirectangular, longitude scaled by cos 31° (Texas's middle
 * latitude), so shapes and the scale bar read true within a few percent.
 * Deterministic, so prerendered and hydrated markup match.
 */

const K = 40; // drawing units per degree of latitude
const LON_SCALE = Math.cos((31 * Math.PI) / 180);
const LON_MIN = -106.75;
const LAT_MAX = 36.6;
const PAD = 18;
const MILES_PER_DEG_LAT = 69;

/* [lon, lat], clockwise from the Panhandle's north-west corner. */
const BORDER: Array<[number, number]> = [
  [-103.04, 36.5],
  [-100.0, 36.5],
  [-100.0, 34.56],
  [-99.2, 34.38],
  [-98.6, 34.15],
  [-98.1, 34.13],
  [-97.6, 33.95],
  [-97.2, 33.8],
  [-96.6, 33.85],
  [-95.8, 33.86],
  [-95.2, 33.95],
  [-94.48, 33.64],
  [-94.04, 33.55],
  [-94.04, 33.02],
  [-94.04, 31.99],
  [-93.8, 31.7],
  [-93.53, 31.18],
  [-93.6, 30.6],
  [-93.72, 30.06],
  [-93.84, 29.69],
  [-94.37, 29.55],
  [-94.8, 29.3],
  [-95.3, 28.95],
  [-96.0, 28.6],
  [-96.6, 28.3],
  [-97.0, 27.95],
  [-97.2, 27.6],
  [-97.35, 27.0],
  [-97.4, 26.4],
  [-97.15, 25.96],
  [-97.5, 25.9],
  [-98.2, 26.1],
  [-98.8, 26.4],
  [-99.2, 26.9],
  [-99.5, 27.5],
  [-100.0, 28.1],
  [-100.4, 28.6],
  [-100.65, 29.1],
  [-101.0, 29.6],
  [-101.4, 29.77],
  [-102.0, 29.8],
  [-102.4, 29.75],
  [-102.7, 29.6],
  [-102.9, 29.2],
  [-103.15, 28.97],
  [-103.5, 29.15],
  [-104.0, 29.35],
  [-104.5, 29.7],
  [-104.7, 30.1],
  [-105.0, 30.68],
  [-105.6, 31.08],
  [-106.2, 31.47],
  [-106.53, 31.78],
  [-106.62, 32.0],
  [-103.06, 32.0],
];

export const METRO_COORDS: Record<string, [lon: number, lat: number]> = {
  Dallas: [-96.8, 32.78],
  'Fort Worth': [-97.33, 32.76],
  Houston: [-95.37, 29.76],
  Austin: [-97.74, 30.27],
  'San Antonio': [-98.49, 29.42],
};

/** Which side of its pin each label sits, so Dallas and Fort Worth do not collide. */
const LABEL_SIDE: Record<string, 'left' | 'right'> = {
  Dallas: 'right',
  'Fort Worth': 'left',
  Houston: 'right',
  Austin: 'left',
  'San Antonio': 'left',
};

const r1 = (n: number) => Math.round(n * 10) / 10;

function project([lon, lat]: [number, number]) {
  return { x: r1(PAD + (lon - LON_MIN) * LON_SCALE * K), y: r1(PAD + (LAT_MAX - lat) * K) };
}

const W = Math.round(PAD * 2 + (-93.5 - LON_MIN) * LON_SCALE * K);
const H = Math.round(PAD * 2 + (LAT_MAX - 25.75) * K);

const borderPath = `M ${BORDER.map((p) => {
  const q = project(p);
  return `${q.x} ${q.y}`;
}).join(' L ')} Z`;

/* Graticule every 2°: dashed survey lines, clipped to the sheet. */
const meridians = [-106, -104, -102, -100, -98, -96, -94].map((lon) => ({ lon, ...project([lon, LAT_MAX]), y2: project([lon, 25.75]).y }));
const parallels = [36, 34, 32, 30, 28, 26].map((lat) => ({ lat, ...project([LON_MIN, lat]), x2: project([-93.5, lat]).x }));

/* A true 100 mi bar: 100 / 69 degrees of latitude, in drawing units. */
const SCALE_UNITS = r1((100 / MILES_PER_DEG_LAT) * K);
const scaleAt = { x: PAD + 6, y: H - PAD - 8 };

export function formatCoords([lon, lat]: [number, number]): string {
  return `${lat.toFixed(2)}° N, ${Math.abs(lon).toFixed(2)}° W`;
}

export default function TexasMap({
  active,
  onActive,
}: {
  active: string | null;
  onActive: (label: string | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null);

  /* Draw the state line in when the map scrolls into view. Armed only when
     it starts below the fold and motion is allowed; fails open. */
  useEffect(() => {
    const el = root.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.draw = 'armed';
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.dataset.draw = 'go';
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const deadline = window.setTimeout(() => {
      if (el.dataset.draw === 'armed') el.dataset.draw = 'go';
    }, 8000);
    return () => {
      io.disconnect();
      window.clearTimeout(deadline);
      delete el.dataset.draw;
    };
  }, []);

  const pins = AREA_LINKS.map((area) => ({ ...area, ...project(METRO_COORDS[area.label]) }));

  return (
    <div ref={root} className="tx-map" data-active={active ?? undefined}>
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={SERVICE_AREA.mapLabel}>
          <g className="tx-grid">
            {meridians.map((m) => (
              <line key={m.lon} x1={m.x} y1={PAD} x2={m.x} y2={m.y2} />
            ))}
            {parallels.map((p) => (
              <line key={p.lat} x1={PAD} y1={p.y} x2={p.x2} y2={p.y} />
            ))}
          </g>
          <path d={borderPath} className="tx-fill" />
          <path d={borderPath} className="tx-line" pathLength={1} />

          {/* North arrow */}
          <g className="tx-north" transform={`translate(${W - PAD - 14} ${PAD + 10})`}>
            <line x1="0" y1="34" x2="0" y2="2" />
            <polygon points="0,-2 7,16 0,11" />
            <polyline points="0,-2 -7,16 0,11" />
          </g>

          {/* Scale bar: true 100 miles */}
          <g className="tx-scale" transform={`translate(${scaleAt.x} ${scaleAt.y})`}>
            <rect x="0" y="-4" width={SCALE_UNITS / 2} height="4" className="tx-scale-solid" />
            <rect x={SCALE_UNITS / 2} y="-4" width={SCALE_UNITS / 2} height="4" className="tx-scale-open" />
          </g>

          {pins.map((p, i) => (
            <g
              key={p.label}
              className="tx-pin"
              data-on={active === p.label ? 'true' : undefined}
              style={{ ['--i' as string]: i }}
              transform={`translate(${p.x} ${p.y})`}
            >
              <circle r="15" className="tx-pin-halo" />
              <circle r="6.5" className="tx-pin-dot" />
            </g>
          ))}
        </svg>

        {pins.map((p) => (
          <a
            key={p.label}
            href={p.href}
            className="tx-label"
            data-side={LABEL_SIDE[p.label]}
            data-on={active === p.label ? 'true' : undefined}
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
            onPointerEnter={() => onActive(p.label)}
            onPointerLeave={() => onActive(null)}
            onFocus={() => onActive(p.label)}
            onBlur={() => onActive(null)}
            tabIndex={-1}
            aria-hidden="true"
          >
            {p.label}
          </a>
        ))}
        <span className="tx-scale-label" style={{ left: `${(scaleAt.x / W) * 100}%`, top: `${(scaleAt.y / H) * 100}%` }} aria-hidden="true">
          {SERVICE_AREA.scale}
        </span>
        <span className="tx-n" style={{ left: `${((W - PAD - 14) / W) * 100}%`, top: `${((PAD + 6) / H) * 100}%` }} aria-hidden="true">
          N
        </span>
      </div>
    </div>
  );
}
