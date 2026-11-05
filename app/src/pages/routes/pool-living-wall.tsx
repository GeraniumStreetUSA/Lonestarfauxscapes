import { POOL_LIVING_WALL } from '../../data/pages/systems/pool-living-wall';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function PoolLivingWallPage({ route }: PageProps) {
  return <SystemPage route={route} data={POOL_LIVING_WALL} />;
}
