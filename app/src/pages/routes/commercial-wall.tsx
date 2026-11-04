import { COMMERCIAL_WALL } from '../../data/pages/systems/commercial-wall';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function CommercialWallPage({ route }: PageProps) {
  return <SystemPage route={route} data={COMMERCIAL_WALL} />;
}
