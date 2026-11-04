import { ArrowDown } from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

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
  isHeightLocked,
  isPerUnit,
  type Range,
  type SystemId,
} from '../lib/estimator';

function fill(range: Range, value: number): CSSProperties {
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  return { '--fill': `${pct}%` } as CSSProperties;
}

interface MeasureProps {
  id: string;
  label: string;
  range: Range;
  value: number;
  onCommit: (value: number) => void;
}

/** A slider and a number field editing one value, in whole feet or the range's step. The field commits on blur or Enter. */
function Measure({ id, label, range, value, onCommit }: MeasureProps) {
  const labelId = `${id}-label`;
  const step = range.step ?? 1;
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
          inputMode={step < 1 ? 'decimal' : 'numeric'}
          min={range.min}
          max={range.max}
          step={step}
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
        step={step}
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

interface HomeEstimatorProps {
  /** The system chip selected on load; the homepage leaves it at the default. */
  initialSystem?: SystemId;
  /** Heading overrides for pages other than the homepage (the kit's EstimatorSection). */
  callout?: string;
  title?: string;
  body?: string;
}

/**
 * Screen 2, the signature. The visitor picks a system and sets the run; the
 * plan draws it, and the readout leads with the starting material figure from
 * the released prices with the arithmetic shown, never a panel or unit count.
 * Every figure carries the installation caveat. "Send" carries the numbers into the
 * quote form below (step 2 of 2).
 */
export default function HomeEstimator({
  initialSystem = DEFAULT_SYSTEM_ID,
  callout = ESTIMATOR.callout,
  title = ESTIMATOR.title,
  body = ESTIMATOR.body,
}: HomeEstimatorProps) {
  const uid = useId();
  const [systemId, setSystemId] = useState<SystemId>(initialSystem);
  const [runFt, setRunFt] = useState<number>(RUN.default);
  const [heightFt, setHeightFt] = useState<number>(getSystem(initialSystem).height.default);
  const [location, setLocation] = useState('');

  const system = getSystem(systemId);
  const estimate = buildEstimate({ systemId, runFt, heightFt });
  const { price } = estimate;

  /* Phones: the dock shows while the controls are on screen and the full
     readout (with its own Send button) is not. */
  const controls = useRef<HTMLFormElement>(null);
  const readout = useRef<HTMLDivElement>(null); // the price figure, not the whole readout
  const [dock, setDock] = useState(false);
  useEffect(() => {
    const c = controls.current;
    const r = readout.current;
    if (!c || !r || typeof IntersectionObserver === 'undefined') return;
    const phone = window.matchMedia('(max-width: 1023px)');
    let controlsIn = false;
    let readoutIn = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === c) controlsIn = e.isIntersecting;
          if (e.target === r) readoutIn = e.isIntersecting;
        });
        setDock(phone.matches && controlsIn && !readoutIn);
      },
      /* The bottom 20% is where the dock and the Call / Quote bar sit. */
      { rootMargin: '0px 0px -20% 0px', threshold: 0.6 },
    );
    io.observe(c);
    io.observe(r);
    return () => io.disconnect();
  }, []);

  /* While the dock is up, the page's Call / Quote bar steps aside. */
  useEffect(() => {
    document.documentElement.toggleAttribute('data-est-dock', dock);
    return () => document.documentElement.removeAttribute('data-est-dock');
  }, [dock]);

  const chooseSystem = (id: SystemId) => {
    setSystemId(id);
    setHeightFt(getSystem(id).height.default);
  };

  const send = () => {
    sendEstimate({ system: system.quoteSystem, location: location.trim().slice(0, 80), summary: estimate.summary });
    scrollToQuote();
  };


  return (
    <section id="estimate" aria-labelledby={`${uid}-title`} className="relative overflow-clip">
      <div className="wrap pb-[var(--section-y)] pt-6 lg:pt-8">
        <div className="estimator-grid">
          <div className="estimator-col">
            <div className="estimator-intro">
              <Callout text={callout} />
              <h2 id={`${uid}-title`} className="t-h2 mt-5 max-w-[15ch]">
                {title}
              </h2>
              <p className="t-body mt-5 max-w-[46ch] text-cedar">{body}</p>
            </div>

            <form ref={controls} className="estimator-controls" onSubmit={(event) => event.preventDefault()} noValidate>
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
                {isPerUnit(system) ? null : isHeightLocked(system) ? (
                  <p className="field-label">
                    {ESTIMATOR.heightFixedLabel}: {estimate.heightFt} ft{' '}
                    <span className="font-normal text-cedar">({ESTIMATOR.heightFixedNote})</span>
                  </p>
                ) : (
                  <div>
                    <Measure
                      id={`${uid}-height`}
                      label={system.heightLabel}
                      range={system.height}
                      value={heightFt}
                      onCommit={(v) => setHeightFt(clampHeight(system, v))}
                    />
                    {system.heightNote ? <p className="t-small mt-3 max-w-[46ch] text-cedar">{system.heightNote}</p> : null}
                  </div>
                )}
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
              <YardPlan runFt={estimate.runFt} depthIn={system.depthIn} />
            </div>

            <div className="estimator-readout">
              {/* Live regions hold figures and arithmetic only; the caption between them is read in place. */}
              <div ref={readout} aria-live="polite" aria-atomic="true">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="estimate-price-word">from</span>{' '}
                  <span className="t-figure text-[clamp(3.25rem,2.2rem+3.6vw,5.75rem)]">{price.amount}</span>
                  {price.per ? <> <span className="estimate-price-word">{price.per}</span></> : null}
                </p>
                {price.arithmetic ? (
                  <p className="mono mt-4 text-[13px] leading-relaxed tracking-[0.01em] text-ink sm:text-[14px]">
                    {price.arithmetic}
                  </p>
                ) : null}
              </div>
              <p className="t-small mt-2 max-w-[52ch] text-cedar">{price.caption}</p>
              <p className="t-small mt-2 max-w-[52ch] text-cedar">{price.frNote}</p>

              <div aria-live="polite" aria-atomic="true" className="mt-7">
                <div className={estimate.areaSqFt === null ? 'border-y border-rule' : 'grid grid-cols-2 border-y border-rule'}>
                  <p className="py-4 pr-4">
                    <span className="t-figure block text-[clamp(2.25rem,1.7rem+1.4vw,3rem)]">
                      {formatNumber(estimate.runFt)}
                    </span>{' '}
                    <span className="mt-1.5 block text-[16px] font-[620] text-cedar">linear ft</span>
                  </p>
                  {estimate.areaSqFt === null ? null : (
                    <p className="border-l border-rule py-4 pl-5 sm:pl-7">
                      <span className="t-figure block text-[clamp(2.25rem,1.7rem+1.4vw,3rem)]">
                        {formatNumber(estimate.areaSqFt)}
                      </span>{' '}
                      <span className="mt-1.5 block text-[16px] font-[620] text-cedar">sq ft</span>
                    </p>
                  )}
                </div>
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

      {/* Phones only (hidden by CSS from 1024 px). Mirrors the readout's
          figures; the readout itself stays the accessible live region. */}
      <div className="est-dock" data-on={dock ? 'true' : undefined} aria-hidden={!dock} inert={!dock}>
        <p className="est-dock-figure m-0">
          <span className="est-dock-price">
            <small>from </small>
            {price.amount}
            {price.per ? <small> {price.per}</small> : null}
          </span>
          <span className="est-dock-meta">
            {formatNumber(estimate.runFt)} linear ft
            {estimate.areaSqFt === null ? '' : ` · ${formatNumber(estimate.areaSqFt)} sq ft`} · {system.label}
          </span>
        </p>
        <button type="button" onClick={send} className="btn" data-cta="estimator-dock">
          {ESTIMATOR.dockSend}
          <ArrowDown size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
