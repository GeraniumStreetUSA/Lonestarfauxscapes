import { LIVING_WALL } from '../../data/pages/systems/living-wall';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function LivingWallPage({ route }: PageProps) {
  return <SystemPage route={route} data={LIVING_WALL} />;
}
