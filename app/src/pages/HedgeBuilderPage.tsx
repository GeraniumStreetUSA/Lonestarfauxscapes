import { ArrowRight } from 'lucide-react';
import { useId } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import PageHero from '../components/page/PageHero';
import {
  BASE_MATERIALS,
  CASTERS,
  COMPOSITE_COLORS,
  COMPOSITE_HEIGHTS,
  DEFAULTS,
  DEPTHS,
  HEDGE_BUILDERS,
  HEDGE_NEXT,
  HEIGHTS,
  INSTALL_TYPES,
  LENGTHS,
  MATERIALS,
  YES_NO,
  type Choice,
  type HedgeBuilderKind,
} from '../data/pages/utility/hedge-builder';
import { BUSINESS } from '../data/site';
import type { PageProps } from '../routes';
import '../styles/utility.css';

interface ChoicesProps {
  legend: string;
  name: keyof typeof DEFAULTS;
  options: readonly Choice[];
}

/** A radio group drawn as chips, the quote form's own look. The first option of each live select starts checked. */
function Choices({ legend, name, options }: ChoicesProps) {
  const uid = useId();
  return (
    <fieldset className="ut-p-choices">
      <legend className="field-label">{legend}</legend>
      <div className="ut-p-chips">
        {options.map((option) => (
          <div key={option.value} className="ut-p-chip">
            <input
              id={`${uid}-${option.value}`}
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === DEFAULTS[name]}
              className="chip-input"
            />
            <label htmlFor={`${uid}-${option.value}`} className="chip">
              <span className="chip-dot" aria-hidden="true" />
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'tel' | 'email' | 'date';
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  step?: number;
  when?: string;
  wide?: boolean;
}

/** An underline field with its label always visible. */
function Field({ label, name, type = 'text', when, wide, ...input }: FieldProps) {
  const id = useId();
  return (
    <div data-when={when} className={wide ? 'ut-p-wide' : undefined}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={type === 'number' ? 'numeric' : undefined}
        className="field-input"
        {...input}
      />
    </div>
  );
}

/**
 * The two hedge builders. A plain HTML form: it posts the live fields to
 * /hedge-quote and works without script. The options that only matter for one
 * answer (custom inches, base details) are in the HTML too; CSS (:has) hides
 * the ones that do not apply, and a browser without :has shows them all.
 */
export default function HedgeBuilderPage({ route, kind }: PageProps & { kind: HedgeBuilderKind }) {
  const copy = HEDGE_BUILDERS[kind];
  const uid = useId();
  return (
    <Layout route={route}>
      <PageHero route={route} callout="◦ HEDGE BUILDER" title={copy.title} lede={copy.lede} />

      <section aria-labelledby={`${uid}-title`} className="section pt-0">
        <div className="wrap ut-p-hb">
          <div className="ut-p-hb-side">
            <div className="ut-p-hb-intro" data-reveal>
              <Callout text="◦ SPECS" />
              <h2 id={`${uid}-title`} className="t-h2 mt-5">
                {copy.formTitle}
              </h2>
              <p className="t-lede mt-5 max-w-[34ch] text-cedar">{copy.formIntro}</p>
              <p className="t-small mt-5 text-cedar">
                {copy.other.text}{' '}
                <a href={copy.other.href} className="underline underline-offset-4">
                  {copy.other.label}
                </a>
                . Or call{' '}
                <a href={BUSINESS.phoneHref} className="underline underline-offset-4">
                  {BUSINESS.phoneDisplay}
                </a>
                .
              </p>
            </div>
            <div className="ut-p-hb-next" data-reveal>
              <p className="t-label text-cedar">What happens next</p>
              <ol className="m-0 mt-5 grid list-none gap-4 p-0">
                {HEDGE_NEXT.map((line, index) => (
                  <li key={line} className="flex items-center gap-4">
                    <span className="step-index" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className="text-[17px] leading-snug">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <form method="post" action="/hedge-quote" className="ut-p-form">
            {/* Honeypot: off-screen, unfocusable, unlabelled for people. */}
            <div className="ut-p-honeypot" aria-hidden="true">
              <label htmlFor={`${uid}-website`}>Website</label>
              <input id={`${uid}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <fieldset className="ut-p-set">
              <legend className="ut-p-legend">Size</legend>
              <div className="ut-p-set-body">
                <Choices legend="Height" name="heightOption" options={HEIGHTS} />
                <Field label="Custom height (inches)" name="heightCustom" type="number" min={1} step={1} when="height-custom" />
                <Choices legend="Length" name="lengthOption" options={LENGTHS} />
                <Field label="Custom length (inches)" name="lengthCustom" type="number" min={1} step={1} when="length-custom" />
                <Choices legend="Depth" name="depthOption" options={DEPTHS} />
                <Field label="Custom depth (inches)" name="depthCustom" type="number" min={1} step={1} when="depth-custom" />
              </div>
            </fieldset>

            <fieldset className="ut-p-set">
              <legend className="ut-p-legend">Hedge and base</legend>
              <div className="ut-p-set-body">
                <Choices legend="Hedge material" name="hedgeMaterial" options={MATERIALS} />
                <Choices legend="Install type" name="installType" options={INSTALL_TYPES} />
                <Choices legend="Base included?" name="basePresence" options={YES_NO} />
                <div className="ut-p-base" data-when="base">
                  <Choices legend="Base material" name="baseMaterial" options={BASE_MATERIALS} />
                  <Field label="Custom base material" name="customBaseMaterial" placeholder="Describe the base material" when="base-custom" />
                  <div data-when="base-composite" className="ut-p-sub">
                    <Choices legend="Composite base height" name="compositeBaseHeight" options={COMPOSITE_HEIGHTS} />
                    <Choices legend="Composite base color" name="compositeBaseColor" options={COMPOSITE_COLORS} />
                  </div>
                  <div data-when="base-powder" className="ut-p-sub">
                    <Field label="Powder coat color" name="powderColor" placeholder="A color name or RAL code" />
                    <Field label="Powder coated base height (inches)" name="powderHeight" type="number" min={1} step={1} />
                  </div>
                </div>
                <Choices legend="Casters" name="casters" options={CASTERS} />
              </div>
            </fieldset>

            <fieldset className="ut-p-set">
              <legend className="ut-p-legend">Contact and project</legend>
              <div className="ut-p-set-body">
                <p className="t-small text-cedar">Name, phone and email are required.</p>
                <div className="ut-p-fields">
                  <Field label="Name" name="customerName" required autoComplete="name" maxLength={80} />
                  <Field label="Phone" name="customerPhone" type="tel" required autoComplete="tel" maxLength={40} />
                  <Field label="Email" name="customerEmail" type="email" required autoComplete="email" maxLength={254} />
                  <Field label="Business (optional)" name="customerBusiness" autoComplete="organization" maxLength={120} />
                  <Field label="Number of hedges" name="quantity" type="number" min={1} step={1} defaultValue={1} />
                  <Field label="Need by date (optional)" name="needByDate" type="date" />
                  <div className="ut-p-wide">
                    <label htmlFor={`${uid}-info`} className="field-label">
                      Additional information
                    </label>
                    <textarea
                      id={`${uid}-info`}
                      name="customInfo"
                      rows={4}
                      maxLength={500}
                      placeholder="The site, how it will be installed, anything we should know."
                      className="field-input"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <button type="submit" className="btn btn-primary ut-p-submit" data-primary-cta data-cta="hedge_builder_submit">
              Request quote
              <ArrowRight size={18} strokeWidth={2.2} className="nudge-right" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
