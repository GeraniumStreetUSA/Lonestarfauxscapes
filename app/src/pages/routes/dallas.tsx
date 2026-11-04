import { DALLAS } from '../../data/pages/metros/dallas';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={DALLAS} />;
}
