import { PRIVACY } from '../../data/pages/utility/legal';
import type { PageProps } from '../../routes';
import LegalPage from '../LegalPage';

export default function PrivacyRoute({ route }: PageProps) {
  return <LegalPage route={route} doc={PRIVACY} />;
}
