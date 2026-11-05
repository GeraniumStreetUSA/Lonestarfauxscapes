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
  /** A quote-form System chip label ("Hedge on your fence or wall"). */
  system: string;
  /** City or ZIP as typed in the estimator; empty when left blank. */
  location: string;
  /** ≤160 characters of arithmetic, from buildEstimate().summary. */
  summary: string;
}

const KEY = 'lsfs-sent-estimate';
const listeners = new Set<() => void>();

/* Kept in sessionStorage too, so numbers sent from any page's estimator are
   waiting in the form on /quote. Read lazily, on the client only. */
let current: SentEstimate | null | undefined;

function read(): SentEstimate | null {
  if (current !== undefined) return current;
  try {
    current = JSON.parse(window.sessionStorage.getItem(KEY) ?? 'null') as SentEstimate | null;
  } catch {
    current = null;
  }
  return current;
}

export function sendEstimate(value: SentEstimate): void {
  current = value;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Private mode or storage off: the form on this page still gets them.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => read();
const getServerSnapshot = (): SentEstimate | null => null;

export function useSentEstimate(): SentEstimate | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
