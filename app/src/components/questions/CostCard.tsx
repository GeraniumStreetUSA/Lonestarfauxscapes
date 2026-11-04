import { ArrowDown } from 'lucide-react';
import { useId, useState } from 'react';

import { QUESTIONS } from '../../data/home-content';
import { buildEstimate, getSystem, type SystemId } from '../../lib/estimator';

const C = QUESTIONS.cards.cost;
/* The three systems priced by length or area; the per-unit privacy wall lives in the full estimator. */
const CHOICES: SystemId[] = ['hedge', 'hedge-freestanding', 'fence-extension', 'living-wall'];

/**
 * "What will it cost?": the answer, live. Pick a system, set the run, and the
 * published starting price does the arithmetic (the same estimator module as
 * the full tool), with the installation caveat under it.
 */
export default function CostCard() {
  const [systemId, setSystemId] = useState<SystemId>('hedge');
  const [run, setRun] = useState(40);
  const id = useId();
  const system = getSystem(systemId);
  const estimate = buildEstimate({ systemId, runFt: run, heightFt: system.height.default });

  return (
    <figure className="q-card m-0">
      <div className="q-cost">
        <fieldset className="q-cost-chips">
          <legend className="sr-only">System</legend>
          {CHOICES.map((choice) => {
            const s = getSystem(choice);
            return (
              <label key={choice} className="q-chip" data-on={choice === systemId ? 'true' : undefined}>
                <input
                  type="radio"
                  name={`${id}-system`}
                  value={choice}
                  checked={choice === systemId}
                  onChange={() => setSystemId(choice)}
                  className="sr-only"
                />
                {s.label}
              </label>
            );
          })}
        </fieldset>

        <div className="q-cost-run">
          <label htmlFor={`${id}-run`} className="q-cost-label">
            {C.runLabel}
          </label>
          <span className="q-cost-run-value tabular" aria-hidden="true">
            {run} ft
          </span>
        </div>
        <input
          id={`${id}-run`}
          type="range"
          min={10}
          max={200}
          step={5}
          value={run}
          onChange={(e) => setRun(Number(e.target.value))}
          className="range"
          style={{ ['--fill' as string]: `${(((run - 10) / 190) * 100).toFixed(1)}%` }}
        />

        <div className="q-cost-out" aria-live="polite">
          <p className="q-cost-figure">
            <span className="q-cost-from">from</span> <span>{estimate.price.amount}</span>
          </p>
          {estimate.price.arithmetic ? <p className="q-cost-math tabular">{estimate.price.arithmetic}</p> : null}
        </div>
        <p className="q-cost-caption">{estimate.price.caption}</p>
        <p className="q-cost-caption">{estimate.price.frNote}</p>

        <a href="#estimate" className="link-go mt-4" data-cta="questions-estimator">
          {C.full}
          <ArrowDown size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </div>
    </figure>
  );
}
