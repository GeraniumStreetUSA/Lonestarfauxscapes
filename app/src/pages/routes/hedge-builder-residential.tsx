import type { PageProps } from '../../routes';
import HedgeBuilderPage from '../HedgeBuilderPage';

export default function HedgeBuilderResidentialRoute({ route }: PageProps) {
  return <HedgeBuilderPage route={route} kind="residential" />;
}
