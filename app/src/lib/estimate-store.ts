import { useSyncExternalStore } from 'react';

/**
 * The numbers a visitor sent from the estimator to the quote form.
 *
 * A tiny module store rather than context: the estimator and the quote form
 * are siblings on the homepage, and nothing here is read on the server
 * (`getServerSnapshot` is null), so prerendered HTML is always the "nothing
 * sent yet" state and hydration matches it.
 */
export interface SentEstimate {
  /** A quote-form System chip label ("Artificial hedge"). */
  system: string;
  /** City or ZIP as typed in the estimator; empty when left blank. */
  location: string;
  /** ≤160 characters of arithmetic, from buildEstimate().summary. */
  summary: string;
}

let current: SentEstimate | null = null;
const listeners = new Set<() => void>();

export function sendEstimate(value: SentEstimate): void {
  current = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;
const getServerSnapshot = (): SentEstimate | null => null;

export function useSentEstimate(): SentEstimate | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Scroll to the quote section and put the keyboard in its first field, so
 * "Send these numbers to my quote" completes without a mouse.
 */
export function scrollToQuote(): void {
  if (typeof document === 'undefined') return;
  const target = document.getElementById('quote');
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    const field = target.querySelector<HTMLElement>('[data-lead-first-field]');
    field?.focus({ preventScroll: true });
  }, 600);
}
