import { PRODUCTS_HUB } from '../../data/pages/hubs/products';
import type { PageProps } from '../../routes';
import HubPage from '../HubPage';

export default function ProductsPage({ route }: PageProps) {
  return <HubPage route={route} data={PRODUCTS_HUB} />;
}
