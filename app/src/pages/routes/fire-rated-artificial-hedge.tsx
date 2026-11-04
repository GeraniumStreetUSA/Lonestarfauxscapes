import { FIRE_RATED_ARTIFICIAL_HEDGE } from '../../data/pages/systems/fire-rated-artificial-hedge';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function FireRatedArtificialHedgePage({ route }: PageProps) {
  return <SystemPage route={route} data={FIRE_RATED_ARTIFICIAL_HEDGE} />;
}
