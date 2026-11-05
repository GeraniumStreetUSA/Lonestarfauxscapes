import { useEffect, useRef, type MutableRefObject } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SCRIPT_ID = 'cf-turnstile-script';

export const TURNSTILE_SITE_KEY = '0x4AAAAAACV8gs7CEDMYDaQu';

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
  return scriptPromise;
}

interface TurnstileProps {
  onToken: (token: string | null) => void;
  /** Filled with a function that asks the widget for a new token (tokens are single-use). */
  resetRef?: MutableRefObject<(() => void) | null>;
}

/**
 * Cloudflare Turnstile, mounted only after the visitor first touches the form
 * (its 28 kB script stays off the page load). "interaction-only" keeps it
 * invisible unless Cloudflare needs the visitor to act. Never rendered on
 * localhost: dev shows the payload instead of posting.
 */
export default function Turnstile({ onToken, resetRef }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let cancelled = false;
    let widgetId: string | null = null;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          appearance: 'interaction-only',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => {
            onTokenRef.current(null);
            return true;
          },
        });
        if (resetRef) {
          resetRef.current = () => {
            if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
          };
        }
      })
      .catch(() => onTokenRef.current(null));

    return () => {
      cancelled = true;
      if (resetRef) resetRef.current = null;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // Already removed.
        }
      }
    };
  }, []);

  return <div ref={containerRef} className="min-h-0" />;
}
