import GuidesPage from '../GuidesPage';
import type { PageProps } from '../../routes';

/** /guides: the guide hub. */
export default function Page({ route }: PageProps) {
  return <GuidesPage route={route} />;
}
