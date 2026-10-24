import { ArrowDown } from 'lucide-react';
import { useId, useState, type CSSProperties } from 'react';

import Callout from '../components/Callout';
import YardPlan from '../components/YardPlan';
import { ESTIMATOR } from '../data/home-content';
import { scrollToQuote, sendEstimate } from '../lib/estimate-store';
import {
  DEFAULT_SYSTEM_ID,
  RUN,
  SYSTEMS,
  buildEstimate,
  clampHeight,
  clampRun,
  commitDraft,
  formatNumber,
  getSystem,
  type Range,
  type SystemId,
} from '../lib/estimator';

function fill(range: Range, value: number): CSSProperties {
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  return { '--fill': `${pct}%` } as CSSProperties;
}

/** Splits a line of working at its last "=" so the results line up in a column. */
function splitWorking(line: string): [string, string] {
  const at = line.lastIndexOf(' = ');
  return at === -1 ? ['', line] : [line.slice(0, at), line.slice(at + 3)];
}

interface MeasureProps {
  id: string;
  label: string;
  range: Range;
  value: number;
  onCommit: (value: number) => void;
}

/** A slider and a number field editing one value. The field commits on blur or Enter. */
function Measure({ id, label, range, value, onCommit }: MeasureProps) {
  const labelId = `${id}-label`;
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    onCommit(commitDraft(range, draft, value));
    setDraft(null);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label id={labelId} htmlFor={id} className="field-label pb-2.5">
          {label}
        </label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={range.min}
          max={range.max}
          step={1}
          value={draft ?? String(value)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
          }}
          className="num-input"
        />
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={1}
        value={value}
        aria-labelledby={labelId}
        onChange={(event) => {
          setDraft(null);
          onCommit(Number(event.target.value));
        }}
        className="range mt-1"
        style={fill(range, value)}
      />
      <div className="mono -mt-1 flex justify-between text-[13px] tracking-[0.04em] text-cedar" aria-hidden="true">
        <span>{range.min}</span>
        <span>{range.max}</span>
      </div>
    </div>
  );
}

/**
 * Screen 2, the signature. The visitor picks a system and sets the run; the
 * plan draws it and the readout counts the panels, with the working shown.
 * No prices: every quote follows a site review. "Send" carries the numbers
 * into the quote form below (step 2 of 2).
 */
export default function HomeEstimator() {
  const uid = useId();
  const [systemId, setSystemId] = useState<SystemId>(DEFAULT_SYSTEM_ID);
  const [runFt, setRunFt] = useState<number>(RUN.default);
  const [heightFt, setHeightFt] = useState<number>(getSystem(DEFAULT_SYSTEM_ID).height.default);
  const [location, setLocation] = useState('');

  const system = getSystem(systemId);
  const estimate = buildEstimate({ systemId, runFt, heightFt });

  const chooseSystem = (id: SystemId) => {
    setSystemId(id);
    setHeightFt(getSystem(id).height.default);
  };

  const send = () => {
    sendEstimate({ system: system.quoteSystem, location: location.trim().slice(0, 80), summary: estimate.summary });
    scrollToQuote();
  };

  const working = [estimate.lines.across, estimate.lines.rows, estimate.lines.panels, estimate.lines.area];

  return (
    <section id="estimate" aria-labelledby={`${uid}-title`} className="relative overflow-clip">
      <div className="wrap pb-[var(--section-y)] pt-6 lg:pt-8">
        <div className="estimator-grid">
          <div className="estimator-col">
            <div className="estimator-intro">
              <Callout text={ESTIMATOR.callout} />
              <h2 id={`${uid}-title`} className="t-h2 mt-5 max-w-[15ch]">
                {ESTIMATOR.title}
              </h2>
              <p className="t-body mt-5 max-w-[46ch] text-cedar">{ESTIMATOR.body}</p>
            </div>

            <form className="estimator-controls" onSubmit={(event) => event.preventDefault()} noValidate>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="field-label mb-3 p-0">{ESTIMATOR.systemLegend}</legend>
                <div className="chip-grid grid gap-2">
                  {SYSTEMS.map((option) => (
                    <div key={option.id} className="relative">
                      <input
                        id={`${uid}-system-${option.id}`}
                        type="radio"
                        name={`${uid}-system`}
                        value={option.id}
                        checked={option.id === systemId}
                        onChange={() => chooseSystem(option.id)}
                        className="chip-input"
                      />
                      <label htmlFor={`${uid}-system-${option.id}`} className="chip chip-system h-full">
                        <span className="flex items-center gap-2.5">
                          <span className="chip-dot" aria-hidden="true" />
                          <span className="text-[16px] font-[620] leading-tight">{option.label}</span>
                        </span>
                        <span className="chip-note mono text-[13px] uppercase tracking-[0.04em] text-cedar">
                          {option.note}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="mt-8 grid gap-7">
                <Measure id={`${uid}-run`} label={ESTIMATOR.runLabel} range={RUN} value={runFt} onCommit={(v) => setRunFt(clampRun(v))} />
                <Measure
                  id={`${uid}-height`}
                  label={ESTIMATOR.heightLabel}
                  range={system.height}
                  value={heightFt}
                  onCommit={(v) => setHeightFt(clampHeight(system, v))}
                />
                <div>
                  <label htmlFor={`${uid}-location`} className="field-label">
                    {ESTIMATOR.locationLabel}
                  </label>
                  <input
                    id={`${uid}-location`}
                    type="text"
                    autoComplete="postal-code"
                    maxLength={80}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="field-input max-w-[360px]"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="estimator-col">
            <div className="estimator-plan relative">
              {/* The spine arrives from the hero and ends on the corner where the run starts. */}
              <span className="spine estimator-spine hidden lg:block" aria-hidden="true" />
              <YardPlan runFt={estimate.runFt} panelsAcross={estimate.across} moduleNote={system.note} />
            </div>

            <div className="estimator-readout">
              <div aria-live="polite" aria-atomic="true">
                <div className="grid grid-cols-2 border-y border-rule">
                  <p className="py-5 pr-4 sm:py-6">
                    <span className="t-figure block text-[clamp(3.25rem,2.2rem+3.6vw,5.75rem)]">
                      {formatNumber(estimate.panels)}
                    </span>
                    <span className="mt-2 block text-[17px] font-[620] text-cedar">panels</span>
                  </p>
                  <p className="border-l border-rule py-5 pl-5 sm:py-6 sm:pl-7">
                    <span className="t-figure block text-[clamp(3.25rem,2.2rem+3.6vw,5.75rem)]">
                      {formatNumber(estimate.areaSqFt)}
                    </span>
                    <span className="mt-2 block text-[17px] font-[620] text-cedar">sq ft</span>
                  </p>
                </div>
                <ol className="working mono m-0 list-none border-b border-rule p-0 py-5">
                  {working.map((line) => {
                    const [left, result] = splitWorking(line);
                    return (
                      <li key={line} className="working-row">
                        <span className="working-left">{left}</span>
                        <span className="working-eq">=</span>
                        <span className="working-result">{result}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <p className="t-small mt-5 max-w-[48ch] text-cedar">{ESTIMATOR.qualifier}</p>
              <button type="button" onClick={send} className="btn btn-primary mt-6 w-full sm:w-auto" data-primary-cta data-cta="estimator">
                {ESTIMATOR.send}
                <ArrowDown size={18} strokeWidth={2.2} className="nudge-down" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
