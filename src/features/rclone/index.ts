import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { RcloneIcon } from './components/RcloneIcon';

export const rcloneModule = defineCommandModule({
    id: 'rclone',
    name: 'Rclone',
    pathSegment: 'rclone',
    icon: RcloneIcon,
    order: 40,
    templates,
});

export default rcloneModule;
