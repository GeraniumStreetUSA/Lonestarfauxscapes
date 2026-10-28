import { Check } from 'lucide-react';
import { useId, useState } from 'react';

import { QUESTIONS } from '../../data/home-content';

const C = QUESTIONS.cards.hoa;

/**
 * "Will my HOA allow it?": the submission, as a checklist the visitor can
 * tick (real checkboxes). The statute is cited, approval is never promised;
 * when all three are ticked a "Ready to submit" stamp lands.
 */
export default function HoaCard() {
  const [done, setDone] = useState<boolean[]>(() => C.items.map(() => false));
  const id = useId();
  const ready = done.every(Boolean);

  return (
    <figure className="q-card m-0">
      <div className="q-hoa-sheet" data-ready={ready ? 'true' : undefined}>
        <div className="q-hoa-cite">
          <span className="q-hoa-cite-mark" aria-hidden="true">
            §
          </span>
          <span>
            <strong>{C.cite}</strong>
            <span className="q-hoa-cite-note">{C.citeNote}</span>
          </span>
        </div>
        <fieldset className="q-hoa-list">
          <legend className="q-hoa-heading">{C.heading}</legend>
          {C.items.map((item, index) => (
            <label key={item} htmlFor={`${id}-${index}`} className="q-hoa-item" data-on={done[index] ? 'true' : undefined}>
              <input
                id={`${id}-${index}`}
                type="checkbox"
                checked={done[index]}
                onChange={(e) => setDone((prev) => prev.map((v, i) => (i === index ? e.target.checked : v)))}
                className="q-hoa-input"
              />
              <span className="q-hoa-box" aria-hidden="true">
                <Check size={15} strokeWidth={3} />
              </span>
              <span className="q-hoa-text">{item}</span>
            </label>
          ))}
        </fieldset>
        <p className="q-hoa-note">{C.note}</p>
        <span className="q-hoa-stamp" aria-hidden={!ready}>
          {C.ready}
        </span>
      </div>
    </figure>
  );
}
