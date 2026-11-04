import { HOA_APPROVED_ARTIFICIAL_HEDGE } from '../../data/pages/systems/hoa-approved-artificial-hedge';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function HoaApprovedArtificialHedgePage({ route }: PageProps) {
  return <SystemPage route={route} data={HOA_APPROVED_ARTIFICIAL_HEDGE} />;
}
