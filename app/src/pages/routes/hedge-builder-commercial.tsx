import type { PageProps } from '../../routes';
import HedgeBuilderPage from '../HedgeBuilderPage';

export default function HedgeBuilderCommercialRoute({ route }: PageProps) {
  return <HedgeBuilderPage route={route} kind="commercial" />;
}
