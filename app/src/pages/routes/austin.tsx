import { AUSTIN } from '../../data/pages/metros/austin';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={AUSTIN} />;
}
