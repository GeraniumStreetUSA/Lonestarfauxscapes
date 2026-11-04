import { POOL_PRIVACY_HEDGE } from '../../data/pages/systems/pool-privacy-hedge';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function PoolPrivacyHedgePage({ route }: PageProps) {
  return <SystemPage route={route} data={POOL_PRIVACY_HEDGE} />;
}
