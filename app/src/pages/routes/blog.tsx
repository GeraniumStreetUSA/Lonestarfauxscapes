import BlogIndexPage from '../BlogIndexPage';
import type { PageProps } from '../../routes';

/** /blog: every post, newest first, with category filters. */
export default function Page({ route }: PageProps) {
  return <BlogIndexPage route={route} />;
}
