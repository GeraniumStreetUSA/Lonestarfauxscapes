import type { PageProps } from '../../routes';
import LocationsPage from '../LocationsPage';

export default function Page({ route }: PageProps) {
  return <LocationsPage route={route} />;
}
