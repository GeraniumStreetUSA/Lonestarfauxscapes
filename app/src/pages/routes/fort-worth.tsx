import { FORT_WORTH } from '../../data/pages/metros/fort-worth';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={FORT_WORTH} />;
}
