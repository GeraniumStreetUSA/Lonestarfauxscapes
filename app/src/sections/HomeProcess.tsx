import { ProcessDrawing } from '../components/PlanDrawings';
import Picture from '../components/Picture';
import { PROCESS } from '../data/home-content';

/**
 * Four steps, no timelines. Steps 1 to 3 are drawn on the plan; step 4 is a
 * photo of a real install, the drawing become a fence.
 */
export default function HomeProcess() {
  return (
    <section aria-labelledby="process-title" className="section bg-limestone">
      <div className="wrap">
        <h2 id="process-title" className="t-h2" data-reveal>
          {PROCESS.title}
        </h2>
        <ol className="rule-grid process-grid m-0 mt-10 list-none p-0 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4" data-reveal>
          {PROCESS.steps.map((step, index) => (
            <li key={step.title} className="flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-caliche">
                {index < 3 ? (
                  <ProcessDrawing step={index as 0 | 1 | 2} />
                ) : (
                  <div className="photo h-full">
                    <Picture
                      name="install-austin-panels"
                      alt={PROCESS.installAlt}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, calc(100vw - 34px)"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 px-5 pb-7 pt-5 lg:px-6">
                <span className="step-index" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className="t-h3">{step.title}</h3>
                  <p className="t-small mt-2 text-cedar">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
