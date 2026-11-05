/**
 * The 404 drawing: a site plan where the visitor's sightline runs into a
 * hedge, and the page they wanted sits behind it as a dashed outline. The
 * homepage promise ("out of sight") turned on its head. Deterministic SVG,
 * so the prerender and hydration match; the cone's sweep and the pin's pulse
 * are CSS animations (off under reduced motion and ?qa=1).
 */
const EYE = { x: 112, y: 200 };
const HEDGE = { x: 330, y: 92, w: 26, h: 216 };
const PAGE = { x: 438, y: 136, w: 118, h: 128 };

export default function LostDrawing() {
  const coneTop = { x: HEDGE.x, y: 124 };
  const coneBottom = { x: HEDGE.x, y: 276 };

  return (
    <svg
      viewBox="0 0 640 400"
      className="ut-p-lost-svg"
      role="img"
      aria-label="Site plan: your sightline runs into a hedge, and the page you wanted is out of sight behind it"
    >
      <defs>
        <pattern id="lost-leaves" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="8" height="8" className="ut-p-lost-hedge-fill" />
          <line x1="0" y1="4" x2="8" y2="4" className="ut-p-lost-hedge-hatch" />
        </pattern>
      </defs>

      {/* The lot: a dashed boundary with a survey pin at each corner. */}
      <rect x="40" y="40" width="560" height="320" className="ut-p-lost-lot" />
      {[
        [40, 40],
        [600, 40],
        [40, 360],
        [600, 360],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} className="ut-p-lost-pin" transform={`translate(${x} ${y})`}>
          <circle r="5" />
          <line x1="-9" y1="0" x2="9" y2="0" />
          <line x1="0" y1="-9" x2="0" y2="9" />
        </g>
      ))}

      {/* The sightline, stopped by the hedge. */}
      <polygon
        points={`${EYE.x},${EYE.y} ${coneTop.x},${coneTop.y} ${coneBottom.x},${coneBottom.y}`}
        className="ut-p-lost-cone"
        style={{ transformOrigin: `${EYE.x}px ${EYE.y}px` }}
      />
      <line x1={EYE.x} y1={EYE.y} x2={coneTop.x} y2={coneTop.y} className="ut-p-lost-ray" />
      <line x1={EYE.x} y1={EYE.y} x2={coneBottom.x} y2={coneBottom.y} className="ut-p-lost-ray" />

      {/* The hedge. */}
      <rect x={HEDGE.x} y={HEDGE.y} width={HEDGE.w} height={HEDGE.h} fill="url(#lost-leaves)" className="ut-p-lost-hedge" />
      <polyline points={`${HEDGE.x + 13},${HEDGE.y - 4} ${HEDGE.x + 13},62 ${HEDGE.x + 40},62`} className="ut-p-lost-leader" />
      <text x={HEDGE.x + 46} y="66" className="ut-p-lost-label">
        SIGHTLINE: BLOCKED
      </text>

      {/* The page, out of sight. */}
      <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className="ut-p-lost-page" />
      <text x={PAGE.x + PAGE.w / 2} y={PAGE.y + 22} textAnchor="middle" className="ut-p-lost-label">
        THE PAGE
      </text>
      <text x={PAGE.x + PAGE.w / 2} y={PAGE.y + 88} textAnchor="middle" className="ut-p-lost-code">
        404
      </text>

      {/* You are here. */}
      <circle cx={EYE.x} cy={EYE.y} r="16" className="ut-p-lost-pulse" />
      <circle cx={EYE.x} cy={EYE.y} r="7" className="ut-p-lost-eye" />
      <text x={EYE.x} y={EYE.y + 32} textAnchor="middle" className="ut-p-lost-label">
        YOU ARE HERE
      </text>

      {/* North arrow. */}
      <g className="ut-p-lost-north" transform="translate(566 74)">
        <line x1="0" y1="26" x2="0" y2="0" />
        <polygon points="0,-4 6,10 0,6" />
        <text x="0" y="-10" textAnchor="middle" className="ut-p-lost-label">
          N
        </text>
      </g>

      {/* Title block. */}
      <line x1="40" y1="378" x2="600" y2="378" className="ut-p-lost-rule" />
      <text x="600" y="394" textAnchor="end" className="ut-p-lost-label">
        SHEET 404 · NOT ON THIS SURVEY
      </text>
    </svg>
  );
}
