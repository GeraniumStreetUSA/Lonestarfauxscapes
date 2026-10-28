/**
 * Small top-down drawings in the site's plan language: dashed property lines,
 * a Boxwood run with one tick per panel, Noon survey pins, hatched building
 * footprints. Static, deterministic, decorative (aria-hidden): every fact
 * they show is also in text beside them.
 */

const INK = '#15211B';
const BOXWOOD = '#2E5A2C';
const NOON = '#F2B53A';

const thin = { vectorEffect: 'non-scaling-stroke' as const };

function ticks(x0: number, x1: number, y: number, gap: number, length: number, dir: 1 | -1 = 1): string {
  const parts: string[] = [];
  for (let x = x0 + gap / 2; x < x1; x += gap) parts.push(`M ${x} ${y} L ${x} ${y + dir * length}`);
  return parts.join(' ');
}

function vticks(x: number, y0: number, y1: number, gap: number, length: number, dir: 1 | -1 = 1): string {
  const parts: string[] = [];
  for (let y = y0 + gap / 2; y < y1; y += gap) parts.push(`M ${x} ${y} L ${x + dir * length} ${y}`);
  return parts.join(' ');
}

function hatch(x: number, y: number, w: number, h: number, gap: number): string {
  const parts: string[] = [];
  for (let c = Math.ceil((x + y) / gap) * gap; c <= x + w + y + h; c += gap) {
    const xa = Math.max(x, c - (y + h));
    const xb = Math.min(x + w, c - y);
    if (xb - xa > 0.5) parts.push(`M ${xa} ${c - xa} L ${xb} ${c - xb}`);
  }
  return parts.join(' ');
}

function Pin({ x, y, r = 3.6 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={NOON} stroke={INK} strokeWidth={1.4} {...thin} />;
}

const DASH = '9 3 2 3';

export type SystemDrawingId = 'hedge' | 'living-wall' | 'fence-extension' | 'commercial' | 'privacy-wall';

/** The plan strip at the top of each system card (240 x 64). */
export function SystemThumb({ id }: { id: SystemDrawingId }) {
  return (
    <svg viewBox="0 0 240 64" className="block h-auto w-full" aria-hidden="true" focusable="false">
      {id === 'hedge' ? (
        <g fill="none">
          <path d="M 10 58 L 10 16 L 232 16" stroke={INK} strokeOpacity={0.45} strokeDasharray={DASH} {...thin} />
          <path d={hatch(150, 40, 66, 18, 5)} stroke={INK} strokeOpacity={0.25} {...thin} />
          <rect x={150} y={40} width={66} height={18} stroke={INK} strokeOpacity={0.7} {...thin} />
          <path d={ticks(10, 176, 16, 8, 6)} stroke={BOXWOOD} strokeWidth={1.2} {...thin} />
          <path d="M 10 16 L 176 16" stroke={BOXWOOD} strokeWidth={2.4} strokeLinecap="round" />
          <Pin x={10} y={16} />
          <Pin x={176} y={16} />
        </g>
      ) : null}

      {id === 'living-wall' ? (
        <g fill="none">
          <path d={hatch(8, 8, 224, 8, 5)} stroke={INK} strokeOpacity={0.3} {...thin} />
          <rect x={8} y={8} width={224} height={8} stroke={INK} strokeOpacity={0.75} {...thin} />
          <path d={ticks(36, 196, 20, 16, 9)} stroke={BOXWOOD} strokeWidth={1.2} {...thin} />
          <path d="M 36 20 L 196 20" stroke={BOXWOOD} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M 36 29 L 196 29" stroke={BOXWOOD} strokeOpacity={0.45} {...thin} />
          <Pin x={36} y={20} />
          <Pin x={196} y={20} />
          <rect x={92} y={42} width={56} height={14} rx={7} stroke={INK} strokeOpacity={0.4} {...thin} />
        </g>
      ) : null}

      {id === 'fence-extension' ? (
        <g fill="none">
          <path d="M 8 28 L 232 28" stroke={INK} strokeOpacity={0.55} {...thin} />
          {[8, 40, 72, 104, 136, 168, 200, 232].map((x) => (
            <rect key={x} x={x - 2.5} y={25.5} width={5} height={5} fill="#EDECE6" stroke={INK} strokeOpacity={0.75} {...thin} />
          ))}
          <path d={ticks(8, 168, 28, 8, 6, -1)} stroke={BOXWOOD} strokeWidth={1.2} {...thin} />
          <path d="M 8 28 L 168 28" stroke={BOXWOOD} strokeWidth={2.4} strokeLinecap="round" />
          <Pin x={8} y={28} />
          <Pin x={168} y={28} />
          <path d="M 8 58 L 8 44 M 232 58 L 232 44" stroke={INK} strokeOpacity={0.35} strokeDasharray={DASH} {...thin} />
        </g>
      ) : null}

      {id === 'commercial' ? (
        <g fill="none">
          <path d={hatch(8, 6, 224, 9, 5)} stroke={INK} strokeOpacity={0.3} {...thin} />
          <path d="M 8 15 L 104 15 M 136 15 L 232 15 M 8 6 L 232 6" stroke={INK} strokeOpacity={0.75} {...thin} />
          <path d="M 104 15 A 14 14 0 0 1 118 29" stroke={INK} strokeOpacity={0.4} {...thin} />
          <path d="M 28 15 L 28 54 L 96 54 M 144 54 L 212 54 L 212 15" stroke={BOXWOOD} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          <path
            d={`${vticks(28, 15, 54, 8, 6)} ${ticks(28, 96, 54, 8, 6, -1)} ${ticks(144, 212, 54, 8, 6, -1)} ${vticks(212, 15, 54, 8, 6, -1)}`}
            stroke={BOXWOOD}
            strokeWidth={1.2}
            {...thin}
          />
          {[56, 80, 160, 184].map((x) => (
            <circle key={x} cx={x} cy={36} r={5} stroke={INK} strokeOpacity={0.45} {...thin} />
          ))}
          <Pin x={96} y={54} />
          <Pin x={144} y={54} />
        </g>
      ) : null}

      {id === 'privacy-wall' ? (
        <g fill="none">
          {/* Freestanding 4 ft units, each on its base, screening a patio from the pool deck. */}
          <path d="M 8 8 L 232 8" stroke={INK} strokeOpacity={0.45} strokeDasharray={DASH} {...thin} />
          {[16, 60, 104, 148].map((x) => (
            <g key={x}>
              <rect x={x - 3} y={17} width={42} height={13} stroke={INK} strokeOpacity={0.4} {...thin} />
              <rect x={x} y={20} width={36} height={7} fill={BOXWOOD} fillOpacity={0.2} stroke={BOXWOOD} strokeWidth={1.2} {...thin} />
            </g>
          ))}
          <rect x={150} y={40} width={76} height={18} rx={8} stroke={INK} strokeOpacity={0.45} {...thin} />
          <Pin x={16} y={23.5} />
          <Pin x={184} y={23.5} />
        </g>
      ) : null}
    </svg>
  );
}

/** The hero's fork: a yard with a house for homes, a storefront patio for businesses (64 x 40). */
export function ForkGlyph({ kind }: { kind: 'homes' | 'businesses' }) {
  return (
    <svg viewBox="0 0 64 40" className="block h-10 w-16 flex-none" aria-hidden="true" focusable="false">
      {kind === 'homes' ? (
        <g fill="none">
          <rect x={1.5} y={6} width={61} height={32.5} stroke={INK} strokeOpacity={0.45} strokeDasharray="6 2 1.5 2" {...thin} />
          <path d={hatch(20, 24, 30, 11, 3.5)} stroke={INK} strokeOpacity={0.3} {...thin} />
          <path d="M 20 24 L 40 24 L 40 28 L 50 28 L 50 35 L 20 35 Z" stroke={INK} strokeOpacity={0.8} {...thin} />
          <path d={ticks(1.5, 44, 6, 4.5, 3.5)} stroke={BOXWOOD} strokeWidth={1} {...thin} />
          <path d="M 1.5 6 L 44 6" stroke={BOXWOOD} strokeWidth={2.2} strokeLinecap="round" />
        </g>
      ) : (
        <g fill="none">
          <path d={hatch(1.5, 2, 61, 6, 3.5)} stroke={INK} strokeOpacity={0.3} {...thin} />
          <path d="M 1.5 8 L 26 8 M 38 8 L 62.5 8 M 1.5 2 L 62.5 2" stroke={INK} strokeOpacity={0.8} {...thin} />
          <path d="M 10 8 L 10 34 L 28 34 M 36 34 L 54 34 L 54 8" stroke={BOXWOOD} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <path d={`${vticks(10, 8, 34, 4.5, 3.5)} ${vticks(54, 8, 34, 4.5, 3.5, -1)}`} stroke={BOXWOOD} strokeWidth={1} {...thin} />
          <circle cx={21} cy={21} r={3} stroke={INK} strokeOpacity={0.5} {...thin} />
          <circle cx={43} cy={21} r={3} stroke={INK} strokeOpacity={0.5} {...thin} />
        </g>
      )}
    </svg>
  );
}

/**
 * Process drawings (320 x 240): 0 numbers, 1 site review, 2 build, 3 the
 * emailed assessment (a rough quote sheet behind a small 3D render). The
 * install step is a photo of a real job.
 */
export function ProcessDrawing({ step }: { step: 0 | 1 | 2 | 3 }) {
  return (
    <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      {step === 0 ? (
        <g fill="none">
          {/* Send your numbers: the run on the yard, dimensioned. */}
          <rect x={36} y={62} width={236} height={150} stroke={INK} strokeOpacity={0.42} strokeDasharray={DASH} {...thin} />
          <path d={hatch(116, 160, 96, 40, 7)} stroke={INK} strokeOpacity={0.22} {...thin} />
          <rect x={116} y={160} width={96} height={40} stroke={INK} strokeOpacity={0.7} {...thin} />
          <circle cx={84} cy={112} r={22} fill={INK} fillOpacity={0.035} stroke={INK} strokeOpacity={0.4} {...thin} />
          <path d="M 36 34 L 200 34" stroke={INK} strokeOpacity={0.7} {...thin} />
          <path d="M 36 54 L 36 28 M 200 54 L 200 28" stroke={INK} strokeOpacity={0.45} {...thin} />
          <path d="M 32 38 L 40 30 M 196 38 L 204 30" stroke={INK} strokeOpacity={0.8} {...thin} />
          <path d={ticks(36, 200, 62, 9, 7)} stroke={BOXWOOD} strokeWidth={1.2} {...thin} />
          <path d="M 36 62 L 200 62" stroke={BOXWOOD} strokeWidth={2.6} strokeLinecap="round" />
          <Pin x={36} y={62} r={4.2} />
          <Pin x={200} y={62} r={4.2} />
        </g>
      ) : null}

      {step === 1 ? (
        <g fill="none">
          {/* Site review: measured on both sides, the gate checked for access. */}
          <path d="M 36 62 L 272 62 L 272 212 L 36 212 L 36 150 M 36 118 L 36 62" stroke={INK} strokeOpacity={0.42} strokeDasharray={DASH} {...thin} />
          {/* The gate: hinged at the foot of the opening, leaf swung open, swing arc dashed. */}
          <path d="M 68 150 A 32 32 0 0 0 36 118" stroke={INK} strokeOpacity={0.5} strokeDasharray="3 3" {...thin} />
          <path d="M 36 150 L 68 150" stroke={INK} strokeOpacity={0.75} {...thin} />
          <path d="M 36 62 L 200 62" stroke={BOXWOOD} strokeWidth={2.2} strokeDasharray="7 5" strokeLinecap="round" />
          <path d="M 36 34 L 200 34 M 36 54 L 36 28 M 200 54 L 200 28" stroke={INK} strokeOpacity={0.55} {...thin} />
          <path d="M 32 38 L 40 30 M 196 38 L 204 30" stroke={INK} strokeOpacity={0.8} {...thin} />
          <path d="M 296 62 L 296 212 M 278 62 L 302 62 M 278 212 L 302 212" stroke={INK} strokeOpacity={0.55} {...thin} />
          <path d="M 292 66 L 300 58 M 292 216 L 300 208" stroke={INK} strokeOpacity={0.8} {...thin} />
          <Pin x={36} y={62} r={4.2} />
          <Pin x={200} y={62} r={4.2} />
          <Pin x={272} y={62} r={4.2} />
          <Pin x={272} y={212} r={4.2} />
        </g>
      ) : null}

      {step === 2 ? (
        <g fill="none">
          {/* Build: panels cut and staged in layout order; the last one trimmed to fit. */}
          {Array.from({ length: 3 }).map((_, row) =>
            Array.from({ length: 6 }).map((__, col) => {
              const x = 46 + col * 38;
              const y = 58 + row * 42;
              const last = col === 5;
              return (
                <g key={`${row}-${col}`}>
                  <rect
                    x={x}
                    y={y}
                    width={last ? 20 : 32}
                    height={32}
                    fill={BOXWOOD}
                    fillOpacity={row === 0 ? 0.16 : 0.08}
                    stroke={row === 0 ? BOXWOOD : INK}
                    strokeOpacity={row === 0 ? 1 : 0.55}
                    {...thin}
                  />
                  {last ? (
                    <path d={`M ${x + 20} ${y - 5} L ${x + 20} ${y + 37}`} stroke={INK} strokeOpacity={0.6} strokeDasharray="3 3" {...thin} />
                  ) : null}
                </g>
              );
            }),
          )}
          <path d="M 46 196 L 256 196" stroke={INK} strokeOpacity={0.55} {...thin} />
          <path d="M 46 190 L 46 202 M 256 190 L 256 202" stroke={INK} strokeOpacity={0.55} {...thin} />
          <path d="M 42 200 L 50 192 M 252 200 L 260 192" stroke={INK} strokeOpacity={0.8} {...thin} />
        </g>
      ) : null}
      {step === 3 ? (
        <g fill="none">
          {/* The emailed rough quote: a sheet with its lines, tucked behind. */}
          <rect x={196} y={34} width={88} height={112} fill="#F6F4EE" stroke={INK} strokeOpacity={0.6} {...thin} />
          <path d="M 208 54 L 262 54 M 208 68 L 272 68 M 208 82 L 252 82 M 208 104 L 272 104 M 208 118 L 240 118" stroke={INK} strokeOpacity={0.35} {...thin} />
          <path d="M 242 128 L 272 128" stroke={BOXWOOD} strokeWidth={2.4} strokeLinecap="round" />
          {/* The 3D render: a hedge run in the same 2:1 axonometric as the hero. */}
          <path d="M 40 150 L 140 100 L 300 180 L 200 230 Z" fill={INK} fillOpacity={0.035} stroke={INK} strokeOpacity={0.25} strokeDasharray="3 4" {...thin} />
          <polygon points="223,198 240,190 240,134 223,142" fill="#1F3D1E" stroke={INK} {...thin} />
          <polygon points="83,128 223,198 223,142 83,72" fill={BOXWOOD} stroke={INK} {...thin} />
          <path d="M 97 79 L 97 135 M 111 86 L 111 142 M 125 93 L 125 149 M 139 100 L 139 156 M 153 107 L 153 163 M 167 114 L 167 170 M 181 121 L 181 177 M 195 128 L 195 184 M 209 135 L 209 191" stroke="#F6F4EE" strokeOpacity={0.22} {...thin} />
          <polygon points="83,72 223,142 240,134 100,64" fill="#5D8A4F" stroke={INK} {...thin} />
          {/* Render frame corners. */}
          <path d="M 30 44 L 30 30 L 44 30 M 30 216 L 30 230 L 44 230 M 176 30 L 186 30" stroke={INK} strokeOpacity={0.55} {...thin} />
        </g>
      ) : null}
    </svg>
  );
}
