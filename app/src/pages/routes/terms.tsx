import { TERMS } from '../../data/pages/utility/legal';
import type { PageProps } from '../../routes';
import LegalPage from '../LegalPage';

export default function TermsRoute({ route }: PageProps) {
  return <LegalPage route={route} doc={TERMS} />;
}
