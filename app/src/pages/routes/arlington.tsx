import { ARLINGTON } from '../../data/pages/metros/arlington';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={ARLINGTON} />;
}
