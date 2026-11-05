import { projectBySlug } from '../../data/projects';
import type { PageProps } from '../../routes';
import ProjectPage from '../ProjectPage';

const PROJECT = projectBySlug('houston-storefront-hedges');

export default function CaseStudyPage({ route }: PageProps) {
  return <ProjectPage route={route} project={PROJECT} />;
}
