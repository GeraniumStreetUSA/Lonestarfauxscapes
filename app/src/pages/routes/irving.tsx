import { IRVING } from '../../data/pages/metros/irving';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={IRVING} />;
}
