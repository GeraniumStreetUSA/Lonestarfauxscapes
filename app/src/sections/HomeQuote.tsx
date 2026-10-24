import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Callout from '../components/Callout';
import Turnstile from '../components/Turnstile';
import { ESTIMATOR, QUOTE } from '../data/home-content';
import { BUSINESS } from '../data/site';
import { track, trackFormStart } from '../lib/analytics';
import { useSentEstimate } from '../lib/estimate-store';
import {
  EMPTY_QUOTE,
  PROJECT_TYPES,
  SYSTEM_OPTIONS,
  buildLeadPayload,
  quoteSchema,
  type LeadPayload,
  type QuoteValues,
} from '../lib/lead';

const FORM_NAME = 'home_quote';

function isLocalHost(): boolean {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1' || host.endsWith('.localhost');
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** The deck's error line, with its phone number and email address as links. */
function withContactLinks(text: string) {
  return text.split(/(\(760\) 978-7335|info@lonestarfauxscapes\.com)/).map((part, index) => {
    if (part === BUSINESS.phoneDisplay) {
      return (
        <a key={index} href={BUSINESS.phoneHref} className="underline underline-offset-4">
          {part}
        </a>
      );
    }
    if (part === BUSINESS.email) {
      return (
        <a key={index} href={BUSINESS.emailHref} className="underline underline-offset-4">
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Step 2 of 2. Underline inputs with labels that stay visible, real radio
 * groups, errors tied to their fields. Numbers sent from the estimator fill
 * the System and City or ZIP fields only if the visitor has not touched them.
 *
 * Posts JSON to the existing Pages Function at /api/contact. Turnstile loads
 * on the first touch of the form. On localhost nothing is posted: the payload
 * is shown in a dev-only notice so no real lead is ever sent from dev.
 */
export default function HomeQuote() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const sent = useSentEstimate();

  const [status, setStatus] = useState<Status>('idle');
  const [armed, setArmed] = useState(false);
  const [local, setLocal] = useState(false);
  const [devPayload, setDevPayload] = useState<LeadPayload | null>(null);
  const token = useRef<string | null>(null);
  const tokenWaiters = useRef<((value: string | null) => void)[]>([]);

  useEffect(() => {
    setLocal(isLocalHost());
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    getFieldState,
    formState: { errors },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: EMPTY_QUOTE,
    // Validate on submit, then live as fields change. Validating on blur
    // inserted an error under the field being left, which moved the submit
    // button between mousedown and mouseup and swallowed the click.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // Prefill from the estimator without overwriting anything the visitor typed or picked.
  useEffect(() => {
    if (!sent) return;
    if (!getFieldState('system').isDirty) setValue('system', sent.system, { shouldValidate: false });
    if (sent.location && !getFieldState('location').isDirty) {
      setValue('location', sent.location, { shouldValidate: false });
    }
  }, [sent, getFieldState, setValue]);

  const onToken = useCallback((value: string | null) => {
    token.current = value;
    if (value) {
      tokenWaiters.current.forEach((resolve) => resolve(value));
      tokenWaiters.current = [];
    }
  }, []);

  const waitForToken = (ms: number) =>
    new Promise<string | null>((resolve) => {
      if (token.current) return resolve(token.current);
      tokenWaiters.current.push(resolve);
      window.setTimeout(() => resolve(token.current), ms);
    });

  const arm = () => {
    if (armed) return;
    setArmed(true);
    trackFormStart(FORM_NAME, { form_context: QUOTE.title });
  };

  const onSubmit = async (values: QuoteValues) => {
    const summary = sent?.summary ?? '';
    const eventProps = {
      form_name: FORM_NAME,
      form_context: QUOTE.title,
      audience: values.projectType || 'unspecified',
      service_interest: values.system || 'unspecified',
    };

    if (local) {
      setDevPayload(buildLeadPayload(values, summary, ''));
      return;
    }

    setStatus('sending');
    const verified = token.current ?? (await waitForToken(8000));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildLeadPayload(values, summary, verified ?? '')),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('sent');
      track('form_submit', eventProps);
    } catch {
      setStatus('error');
      track('form_submit_error', eventProps);
    }
  };

  const described = (name: keyof QuoteValues) => (errors[name] ? id(`${name}-error`) : undefined);

  const fieldError = (name: keyof QuoteValues) =>
    errors[name]?.message ? (
      <p id={id(`${name}-error`)} className="field-error">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <section id="quote" aria-labelledby="quote-title" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
        <div data-reveal>
          <Callout text={QUOTE.callout} />
          <h2 id="quote-title" className="t-h2 mt-5">
            {QUOTE.title}
          </h2>
          <p className="t-lede mt-5 max-w-[30ch] text-cedar">{QUOTE.body}</p>

          <div className="mt-10 border-t border-rule pt-6 lg:mt-14">
            <p className="t-label text-cedar">{QUOTE.nextTitle}</p>
            <ol className="m-0 mt-5 grid list-none gap-4 p-0">
              {QUOTE.next.map((line, index) => (
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

        <div>
          {status === 'sent' ? (
            <div role="status" className="border border-boxwood bg-[rgb(46_90_44/0.06)] p-8 lg:p-10">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-boxwood text-caliche">
                <Check size={22} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <p className="t-h3 mt-5 max-w-[24ch]">{QUOTE.success}</p>
            </div>
          ) : (
            <form
              noValidate
              data-lead-form
              onSubmit={handleSubmit(onSubmit)}
              onFocusCapture={arm}
              onPointerDownCapture={arm}
              className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
            >
              {/* Honeypot: off-screen, unfocusable, unlabelled for people. */}
              <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor={id('website')}>Website</label>
                <input id={id('website')} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              <div>
                <label htmlFor={id('name')} className="field-label">
                  {QUOTE.fields.name}
                </label>
                <input
                  id={id('name')}
                  type="text"
                  autoComplete="name"
                  data-lead-first-field
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={described('name')}
                  className="field-input"
                  {...register('name')}
                />
                {fieldError('name')}
              </div>

              <div>
                <label htmlFor={id('email')} className="field-label">
                  {QUOTE.fields.email}
                </label>
                <input
                  id={id('email')}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={described('email')}
                  className="field-input"
                  {...register('email')}
                />
                {fieldError('email')}
              </div>

              <div>
                <label htmlFor={id('phone')} className="field-label">
                  {QUOTE.fields.phone}
                </label>
                <input id={id('phone')} type="tel" autoComplete="tel" className="field-input" {...register('phone')} />
              </div>

              <div>
                <label htmlFor={id('location')} className="field-label">
                  {QUOTE.fields.location}
                </label>
                <input
                  id={id('location')}
                  type="text"
                  autoComplete="postal-code"
                  aria-invalid={errors.location ? true : undefined}
                  aria-describedby={described('location')}
                  className="field-input"
                  {...register('location')}
                />
                {fieldError('location')}
              </div>

              <fieldset className="m-0 min-w-0 border-0 p-0 sm:col-span-2" aria-describedby={described('system')}>
                <legend className="field-label mb-3 p-0">{QUOTE.fields.system}</legend>
                <div className="flex flex-wrap gap-2">
                  {SYSTEM_OPTIONS.map((option) => (
                    <div key={option} className="relative">
                      <input
                        id={id(`system-${option}`)}
                        type="radio"
                        value={option}
                        className="chip-input"
                        {...register('system')}
                      />
                      <label htmlFor={id(`system-${option}`)} className="chip text-[16px] font-[560]">
                        <span className="chip-dot" aria-hidden="true" />
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {fieldError('system')}
              </fieldset>

              <fieldset className="m-0 min-w-0 border-0 p-0 sm:col-span-2" aria-describedby={described('projectType')}>
                <legend className="field-label mb-3 p-0">{QUOTE.fields.projectType}</legend>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((option) => (
                    <div key={option} className="relative">
                      <input
                        id={id(`type-${option}`)}
                        type="radio"
                        value={option}
                        className="chip-input"
                        {...register('projectType')}
                      />
                      <label htmlFor={id(`type-${option}`)} className="chip text-[16px] font-[560]">
                        <span className="chip-dot" aria-hidden="true" />
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {fieldError('projectType')}
              </fieldset>

              <div className="sm:col-span-2">
                <label htmlFor={id('details')} className="field-label">
                  {QUOTE.fields.details}
                </label>
                <textarea
                  id={id('details')}
                  rows={4}
                  placeholder={QUOTE.fields.detailsPlaceholder}
                  className="field-input"
                  {...register('details')}
                />
              </div>

              {sent ? (
                <div className="border-l-[3px] border-boxwood bg-[rgb(46_90_44/0.06)] px-5 py-4 sm:col-span-2" data-estimate-summary>
                  <Callout text={ESTIMATOR.callout} />
                  <p className="mono mt-2.5 text-[14px] leading-relaxed text-ink">{sent.summary}</p>
                </div>
              ) : null}

              {armed && !local ? (
                <div className="sm:col-span-2">
                  <Turnstile onToken={onToken} />
                </div>
              ) : null}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto"
                  disabled={status === 'sending'}
                  data-primary-cta
                  data-cta="quote_submit"
                  data-cta-label={QUOTE.submit}
                >
                  {QUOTE.submit}
                  <ArrowRight size={18} strokeWidth={2.2} className="nudge-right" aria-hidden="true" />
                </button>
                {status === 'error' ? (
                  <p role="alert" className="field-error mt-4 max-w-[52ch] text-[16px]">
                    {withContactLinks(QUOTE.error)}
                  </p>
                ) : null}
                {devPayload ? (
                  <div role="status" className="mt-5 border border-dashed border-cedar bg-limestone p-4">
                    <p className="mono text-[13px] uppercase tracking-[0.06em] text-cedar">
                      Dev only (localhost): not posted to /api/contact
                    </p>
                    <pre className="mono mt-3 overflow-x-auto whitespace-pre-wrap break-words text-[13px] leading-relaxed text-ink">
                      {JSON.stringify(devPayload, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
