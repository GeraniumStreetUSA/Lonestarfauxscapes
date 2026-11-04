import { SUGAR_LAND } from '../../data/pages/metros/sugar-land';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={SUGAR_LAND} />;
}
