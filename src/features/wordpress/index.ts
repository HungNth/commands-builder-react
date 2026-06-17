import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { WordPressIcon } from './components/WordPressIcon.tsx';

export const wordpressModule = defineCommandModule({
    id: 'wordpress',
    name: 'WordPress',
    pathSegment: 'wordpress',
    icon: WordPressIcon,
    order: 70,
    templates,
});

export default wordpressModule;
