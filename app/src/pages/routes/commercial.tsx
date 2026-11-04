import { COMMERCIAL_HUB } from '../../data/pages/hubs/commercial';
import type { PageProps } from '../../routes';
import HubPage from '../HubPage';

export default function CommercialPage({ route }: PageProps) {
  return <HubPage route={route} data={COMMERCIAL_HUB} />;
}
