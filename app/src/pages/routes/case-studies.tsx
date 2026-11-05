import { CASE_STUDIES_HUB } from '../../data/pages/hubs/case-studies';
import type { PageProps } from '../../routes';
import HubPage from '../HubPage';

export default function CaseStudiesPage({ route }: PageProps) {
  return <HubPage route={route} data={CASE_STUDIES_HUB} />;
}
