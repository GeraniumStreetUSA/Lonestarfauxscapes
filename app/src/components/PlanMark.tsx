interface PlanMarkProps {
  className?: string;
}

/**
 * The wordmark's plan-mark: a square property line, dashed, with one solid
 * side in Boxwood. It is the estimator's yard in miniature: a lot, and the
 * back line made green.
 */
export default function PlanMark({ className }: PlanMarkProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path
        d="M3.5 6 V20.5 H20.5 V6"
        fill="none"
        stroke="#15211B"
        strokeWidth="1.5"
        strokeDasharray="4.5 1.6 1.2 1.6"
      />
      <path d="M3 4.75 H21" fill="none" stroke="#2E5A2C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
