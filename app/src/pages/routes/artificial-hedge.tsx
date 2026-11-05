import { ARTIFICIAL_HEDGE } from '../../data/pages/systems/artificial-hedge';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function ArtificialHedgePage({ route }: PageProps) {
  return <SystemPage route={route} data={ARTIFICIAL_HEDGE} />;
}
