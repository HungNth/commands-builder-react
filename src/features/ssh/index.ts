import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { SSHIcon } from './components/SSHIcon';

export const sshModule = defineCommandModule({
    id: 'ssh',
    name: 'SSH',
    pathSegment: 'ssh',
    icon: SSHIcon,
    order: 30,
    templates,
});

export default sshModule;
