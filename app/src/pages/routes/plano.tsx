import { PLANO } from '../../data/pages/metros/plano';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={PLANO} />;
}
