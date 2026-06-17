import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { GitIcon } from './components/GitIcon';

export const gitModule = defineCommandModule({
    id: 'git',
    name: 'Git',
    pathSegment: 'git',
    icon: GitIcon,
    order: 10,
    templates,
});

export default gitModule;
