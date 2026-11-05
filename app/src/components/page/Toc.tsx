import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface TocItem {
  /** The id of the heading it points at. */
  id: string;
  text: string;
  /** 2 for an H2, 3 for an H3 (indented). */
  level: 2 | 3;
}

/**
 * "On this page". Phones: a <details> folded after load (open in the markup,
 * so it is in the HTML for everyone). From 1024 px: a sticky list beside the
 * content, with the section in view marked. Put it in a `.pk-with-toc` wrapper
 * before the content; the highlight is a progressive extra, so without
 * IntersectionObserver it is simply a list of links.
 */
export default function Toc({ items }: { items: readonly TocItem[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const [active, setActive] = useState<string | null>(null);

  /* Folded on phones, always open on desktop (also when the window is resized across 1024 px). */
  useEffect(() => {
    const el = details.current;
    if (!el) return;
    const phone = window.matchMedia('(max-width: 1023px)');
    const sync = () => {
      el.open = !phone.matches;
    };
    sync();
    phone.addEventListener('change', sync);
    return () => phone.removeEventListener('change', sync);
  }, []);

  /* The topmost heading inside the band under the sticky header is the current one. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });
        const current = items.find((item) => inBand.has(item.id));
        if (current) setActive(current.id);
      },
      { rootMargin: '-96px 0px -65% 0px' },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="pk-toc">
      <details ref={details} open>
        <summary className="pk-toc-summary">
          <span>On this page</span>
          <ChevronDown size={18} strokeWidth={2.2} className="pk-toc-chevron" aria-hidden="true" />
        </summary>
        <ol className="pk-toc-list">
          {items.map((item) => (
            <li key={item.id} data-level={item.level}>
              <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
