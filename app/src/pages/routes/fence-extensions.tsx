import { FENCE_EXTENSIONS } from '../../data/pages/systems/fence-extensions';
import type { PageProps } from '../../routes';
import SystemPage from '../SystemPage';

export default function FenceExtensionsPage({ route }: PageProps) {
  return <SystemPage route={route} data={FENCE_EXTENSIONS} />;
}
