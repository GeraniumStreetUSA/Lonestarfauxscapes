import { HOUSTON } from '../../data/pages/metros/houston';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={HOUSTON} />;
}
