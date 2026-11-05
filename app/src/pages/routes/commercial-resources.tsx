import { COMMERCIAL_RESOURCES_HUB } from '../../data/pages/hubs/commercial-resources';
import type { PageProps } from '../../routes';
import HubPage from '../HubPage';

export default function CommercialResourcesPage({ route }: PageProps) {
  return <HubPage route={route} data={COMMERCIAL_RESOURCES_HUB} />;
}
