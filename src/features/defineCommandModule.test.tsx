import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CommandTemplate } from '@/shared/types';
import { defineCommandModule } from './defineCommandModule';

function DemoIcon({ className }: { className?: string }) {
    return <svg className={className} aria-hidden="true" />;
}

const templates: CommandTemplate[] = [
    {
        id: 'demo-command',
        category: 'Demo',
        name: 'Demo template',
        description: 'Render a demo command',
        placeholders: [],
        commands: ['echo demo'],
    },
];

describe('defineCommandModule', () => {
    it('normalizes route and exposes page metadata', () => {
        const module = defineCommandModule({
            id: 'demo',
            name: 'Demo',
            pathSegment: '/demo/',
            icon: DemoIcon,
            order: 30,
            templates,
        });

        expect(module.id).toBe('demo');
        expect(module.name).toBe('Demo');
        expect(module.path).toBe('/demo');
        expect(module.order).toBe(30);
        expect(module.templates).toBe(templates);
        expect(module.page).toEqual({
            title: 'Demo Commands',
            description: 'Tạo nhanh các lệnh Demo thông dụng với các template được định nghĩa sẵn',
        });
    });

    it('renders a generated module page through ModulePageLayout', () => {
        const module = defineCommandModule({
            id: 'demo',
            name: 'Demo',
            pathSegment: 'demo',
            icon: DemoIcon,
            order: 30,
            templates,
        });

        render(<module.element />);

        expect(screen.getByRole('heading', { name: 'Demo Commands' })).toBeInTheDocument();
        expect(screen.getAllByText('Demo template')[0]).toBeInTheDocument();
    });

    it('uses explicit page copy when provided', () => {
        const module = defineCommandModule({
            id: 'demo',
            name: 'Demo',
            pathSegment: 'demo',
            icon: DemoIcon,
            order: 30,
            templates,
            page: {
                title: 'Custom Demo',
                description: 'Custom description',
            },
        });

        expect(module.page).toEqual({
            title: 'Custom Demo',
            description: 'Custom description',
        });
    });
});
