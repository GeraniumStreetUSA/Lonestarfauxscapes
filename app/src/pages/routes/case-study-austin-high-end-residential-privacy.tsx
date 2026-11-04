import { projectBySlug } from '../../data/projects';
import type { PageProps } from '../../routes';
import ProjectPage from '../ProjectPage';

const PROJECT = projectBySlug('austin-high-end-residential-privacy');

export default function CaseStudyPage({ route }: PageProps) {
  return <ProjectPage route={route} project={PROJECT} />;
}
