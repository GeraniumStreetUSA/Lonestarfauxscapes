import { THE_WOODLANDS } from '../../data/pages/metros/the-woodlands';
import type { PageProps } from '../../routes';
import MetroPage from '../MetroPage';

export default function Page({ route }: PageProps) {
  return <MetroPage route={route} metro={THE_WOODLANDS} />;
}
