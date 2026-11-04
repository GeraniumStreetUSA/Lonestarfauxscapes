import { SAN_ANTONIO } from '../../data/pages/metros/san-antonio';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={SAN_ANTONIO} />;
}
