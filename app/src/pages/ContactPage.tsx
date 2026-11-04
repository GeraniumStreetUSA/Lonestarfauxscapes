import { ArrowUpRight, Mail, Phone } from 'lucide-react';

import Layout from '../components/Layout';
import LinkRows from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import { CONTACT_PAGE } from '../data/pages/utility/contact';
import { AREA_ROWS } from '../data/pages/utility/links';
import { BUSINESS } from '../data/site';
import type { PageProps } from '../routes';
import '../styles/utility.css';

const REACH = [
  { label: 'Call', value: BUSINESS.phoneDisplay, href: BUSINESS.phoneHref, Icon: Phone },
  { label: 'Email', value: BUSINESS.email, href: BUSINESS.emailHref, Icon: Mail },
] as const;

/**
 * /contact: phone, email and the five metros, then the quote form (the main
 * event). No map, hours or street address, by owner rule.
 */
export default function ContactPage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <PageHero route={route} callout={CONTACT_PAGE.callout} title={CONTACT_PAGE.title} lede={CONTACT_PAGE.lede} actions />

      <Section className="pt-0">
        <div className="ut-p-contact-grid">
          <div data-reveal>
            <h2 className="sr-only">{CONTACT_PAGE.reach.title}</h2>
            <ul className="ut-p-reach">
              {REACH.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <a href={href} className="ut-p-reach-row">
                    <Icon size={20} strokeWidth={2} className="ut-p-reach-icon" aria-hidden="true" />
                    <span className="ut-p-reach-main">
                      <span className="ut-p-reach-label">{label}</span>
                      <span className="ut-p-reach-value">{value}</span>
                    </span>
                    <ArrowUpRight size={18} strokeWidth={2.2} className="ut-p-reach-arrow" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="ut-p-brand">{CONTACT_PAGE.reach.brand}</p>
          </div>

          <div>
            <h2 className="t-h3 ut-p-areas-title" data-reveal>
              {CONTACT_PAGE.areas.title}
            </h2>
            <p className="t-small text-cedar ut-p-areas-intro" data-reveal>
              {CONTACT_PAGE.areas.intro}
            </p>
            <LinkRows items={AREA_ROWS} />
          </div>
        </div>
      </Section>

      <QuoteSection />
    </Layout>
  );
}
