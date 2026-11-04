import { PRIVACY_WALL } from '../../data/pages/systems/privacy-wall';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function PrivacyWallPage({ route }: PageProps) {
  return <SystemPage route={route} data={PRIVACY_WALL} />;
}
