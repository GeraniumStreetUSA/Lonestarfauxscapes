import { ArrowUpRight } from 'lucide-react';

import Callout from '../components/Callout';
import Picture from '../components/Picture';
import { FIRE_CHAPTER } from '../data/home-content';

/**
 * The one dark chapter: commercial work and fire code. Ink ground, Noon for
 * the callout and focus ring, Live leaf for links. The two standards are
 * explained, never certified: no certificate claims.
 */
export default function HomeFireChapter() {
  return (
    <section aria-labelledby="fire-title" className="on-ink section bg-ink text-caliche">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
        <div data-reveal>
          <Callout text={FIRE_CHAPTER.callout} />
          <h2 id="fire-title" className="t-h2 mt-5 max-w-[15ch] text-caliche">
            {FIRE_CHAPTER.title}
          </h2>
          <p className="t-body mt-6 text-grass">{FIRE_CHAPTER.body}</p>
          <ul className="m-0 mt-9 grid list-none border-t border-[rgb(169_179_173/0.28)] p-0 sm:grid-cols-2 sm:gap-x-8">
            {FIRE_CHAPTER.links.map((link) => (
              <li key={link.href} className="border-b border-[rgb(169_179_173/0.28)]">
                <a
                  href={link.href}
                  className="group flex min-h-[52px] items-center justify-between gap-4 py-3 text-[16px] font-[600] text-caliche transition-colors hover:text-leaf"
                >
                  {link.label}
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2.2}
                    className="flex-none text-leaf transition-transform duration-200 group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <figure className="m-0 lg:pt-2" data-reveal>
          <div className="lot-frame">
            <div className="photo aspect-[16/10] bg-[#1d2a23]">
              <Picture
                name="commercial-houston-patio"
                alt={FIRE_CHAPTER.photoAlt}
                sizes="(min-width: 1024px) min(640px, 50vw), calc(100vw - 60px)"
              />
            </div>
          </div>
          <Callout as="figcaption" text={FIRE_CHAPTER.photoCaption} className="caption-on-ink ml-[14px] mt-4 lg:ml-4" />
        </figure>
      </div>
    </section>
  );
}
