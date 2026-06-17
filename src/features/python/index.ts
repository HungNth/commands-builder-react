import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { PythonIcon } from './components/PythonIcon';

export const pythonModule = defineCommandModule({
    id: 'python',
    name: 'Python',
    pathSegment: 'python',
    icon: PythonIcon,
    order: 60,
    templates,
});

export default pythonModule;
