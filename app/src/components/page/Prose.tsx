import clsx from 'clsx';
import type { ReactNode } from 'react';

/**
 * Long-form content (blog posts, legal pages): the `.prose` rhythm for
 * headings, lists, quotes, figures, code and tables. Works on JSX and on
 * HTML set with `dangerouslySetInnerHTML`, since the styles reach plain
 * elements; a bare <table> scrolls inside itself, or wrap one in
 * `<div className="table-wrap">`.
 */
export default function Prose({
  children,
  className,
  html,
}: {
  children?: ReactNode;
  className?: string;
  /** Trusted, build-time HTML (the blog pipeline's output); use instead of children. */
  html?: string;
}) {
  return html === undefined ? (
    <div className={clsx('prose', className)}>{children}</div>
  ) : (
    <div className={clsx('prose', className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
