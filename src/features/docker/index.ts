import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { DockerIcon } from './components/DockerIcon';

export const dockerModule = defineCommandModule({
    id: 'docker',
    name: 'Docker',
    pathSegment: 'docker',
    icon: DockerIcon,
    order: 50,
    templates,
});

export default dockerModule;
