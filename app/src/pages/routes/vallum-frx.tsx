import { VALLUM_FRX } from '../../data/pages/systems/vallum-frx';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function VallumFrxPage({ route }: PageProps) {
  return <SystemPage route={route} data={VALLUM_FRX} />;
}
