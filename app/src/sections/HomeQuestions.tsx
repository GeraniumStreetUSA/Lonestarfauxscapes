import { ArrowRight } from 'lucide-react';

import { QUESTIONS } from '../data/home-content';

/** The answer's first sentence is the answer: set it heavier, so a skim gets it. */
function answerFirst(answer: string): [string, string] {
  const at = answer.indexOf('. ');
  return at === -1 ? [answer, ''] : [answer.slice(0, at + 1), answer.slice(at + 1)];
}

/**
 * The four fears, in the order people have them, each answered first and
 * plainly, with the guide that goes deeper.
 */
export default function HomeQuestions() {
  return (
    <section aria-labelledby="questions-title" className="section">
      <div className="wrap">
        <h2 id="questions-title" className="t-h2 max-w-[17ch]" data-reveal>
          {QUESTIONS.title}
        </h2>
        <ol className="m-0 mt-10 list-none border-t-2 border-ink p-0 lg:mt-14" data-reveal>
          {QUESTIONS.items.map((item, index) => (
            <li
              key={item.question}
              className="grid gap-x-16 gap-y-4 border-b border-rule py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-11"
            >
              <h3 className="t-h3-lg flex gap-4 sm:gap-6">
                <span className="question-index" aria-hidden="true">
                  {index + 1}
                </span>
                <span>{item.question}</span>
              </h3>
              <div className="pl-[2.6rem] sm:pl-[3.1rem] lg:pl-0 lg:pt-1.5">
                <p className="t-body text-cedar">
                  <strong className="font-[620] text-ink">{answerFirst(item.answer)[0]}</strong>
                  {answerFirst(item.answer)[1]}
                </p>
                <a href={item.link.href} className="link-go mt-3">
                  {item.link.label}
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
