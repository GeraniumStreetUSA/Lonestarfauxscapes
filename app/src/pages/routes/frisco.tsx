import { FRISCO } from '../../data/pages/metros/frisco';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={FRISCO} />;
}
