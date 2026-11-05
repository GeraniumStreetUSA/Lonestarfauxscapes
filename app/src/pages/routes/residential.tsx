import { RESIDENTIAL_HUB } from '../../data/pages/hubs/residential';
import type { PageProps } from '../../routes';
import HubPage from '../HubPage';

export default function ResidentialPage({ route }: PageProps) {
  return <HubPage route={route} data={RESIDENTIAL_HUB} />;
}
