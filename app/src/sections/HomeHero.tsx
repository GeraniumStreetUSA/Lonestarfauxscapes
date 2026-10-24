import { ArrowDown, ArrowRight } from 'lucide-react';

import Callout from '../components/Callout';
import { ForkGlyph } from '../components/PlanDrawings';
import Picture from '../components/Picture';
import { HERO } from '../data/home-content';
import { BUSINESS } from '../data/site';

/** Must match the hero preload's imagesizes in index.html. */
export const HERO_SIZES = '(min-width: 1024px) min(640px, 50vw), calc(100vw - 60px)';

/**
 * The thesis: the job in one line, the pain in the next, one way to start.
 * The photo is a real Austin job, set inside a dashed lot line; that line's
 * left side runs on down the page (the spine) into the estimator's plan.
 *
 * DOM order is headline, pitch, photo, provenance: the order a phone shows
 * it. On desktop the photo takes the right column beside both copy blocks.
 */
export default function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-clip">
      <div className="wrap pb-16 pt-9 sm:pt-12 lg:pb-24 lg:pt-16">
        <h1 id="hero-title" className="t-h1">
          <span className="block lg:inline">{HERO.titlePhrases[0]}</span>{' '}
          <span className="block lg:inline">{HERO.titlePhrases[1]}</span>{' '}
          <span className="block">{HERO.titlePhrases[2]}</span>
        </h1>

        <div className="hero-grid mt-8 sm:mt-10 lg:mt-14">
          <div className="hero-pitch">
            <p className="t-lede max-w-[33ch] text-ink">{HERO.sub}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 lg:mt-9">
              <a href="#quote" className="btn btn-primary" data-primary-cta data-cta="hero">
                {HERO.cta}
                <ArrowDown size={18} strokeWidth={2.2} className="nudge-down" aria-hidden="true" />
              </a>
              <p className="t-small text-cedar">
                {HERO.phoneLead}{' '}
                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex min-h-11 items-center font-[640] text-ink underline decoration-control decoration-1 underline-offset-[5px] hover:decoration-ink lg:min-h-0"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <figure className="hero-media m-0">
            <div className="lot-frame">
              <div className="photo aspect-[4/5] md:aspect-[16/10]">
                <Picture
                  name="hero-austin-boxwood-wall"
                  narrow={{ name: 'hero-austin-boxwood-wall-phone', media: '(max-width: 767px)' }}
                  alt={HERO.photoAlt}
                  sizes={HERO_SIZES}
                  priority
                />
              </div>
              {/* The spine leaves the lot's bottom-left corner and runs down
                  into the estimator, where the run starts. Desktop only: on a
                  phone the column it follows does not exist. */}
              <span className="spine left-0 top-full hidden h-[100vh] lg:block" aria-hidden="true" />
              <span className="pin left-0 top-full hidden lg:block" aria-hidden="true" />
            </div>
            <Callout as="figcaption" text={HERO.photoCaption} className="ml-[14px] mt-4 text-cedar lg:ml-4" />
          </figure>

          <div className="hero-provenance">
            <p className="t-small max-w-[40ch] text-cedar [text-wrap:balance]">{HERO.trust}</p>
            <ul className="rule-grid m-0 mt-5 list-none grid-cols-2 p-0">
              {HERO.fork.map((item, index) => (
                <li key={item.href}>
                  <a href={item.href} className="fork-link group">
                    <ForkGlyph kind={index === 0 ? 'homes' : 'businesses'} />
                    <span className="flex items-center gap-2">
                      {item.label}
                      <ArrowRight
                        size={16}
                        strokeWidth={2.2}
                        className="flex-none transition-transform duration-200 group-hover:translate-x-[3px]"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
