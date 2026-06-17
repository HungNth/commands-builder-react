import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { LinuxIcon } from './components/LinuxIcon';

export const linuxModule = defineCommandModule({
    id: 'linux',
    name: 'Linux',
    pathSegment: 'linux',
    icon: LinuxIcon,
    order: 20,
    templates,
});

export default linuxModule;
