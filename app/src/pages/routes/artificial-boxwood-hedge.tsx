import { ARTIFICIAL_BOXWOOD_HEDGE } from '../../data/pages/systems/artificial-boxwood-hedge';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function ArtificialBoxwoodHedgePage({ route }: PageProps) {
  return <SystemPage route={route} data={ARTIFICIAL_BOXWOOD_HEDGE} />;
}
