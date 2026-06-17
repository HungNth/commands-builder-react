import type { ComponentType } from 'react';
import { ModulePageLayout } from '@/shared/components/ModulePageLayout';
import type { CommandTemplate, FeatureModule, ModulePageMeta } from '@/shared/types';

type IconComponent = ComponentType<{ className?: string }>;

export type CommandModuleConfig = {
    id: string;
    name: string;
    pathSegment: string;
    icon: IconComponent;
    order: number;
    templates: CommandTemplate[];
    page?: Partial<ModulePageMeta>;
};

function normalizePath(pathSegment: string): string {
    const segment = pathSegment.replace(/^\/+|\/+$/g, '');

    return `/${segment}`;
}

export function defineCommandModule(config: CommandModuleConfig): FeatureModule {
    const page: ModulePageMeta = {
        title: config.page?.title ?? `${config.name} Commands`,
        description:
            config.page?.description ??
            `Tạo nhanh các lệnh ${config.name} thông dụng với các template được định nghĩa sẵn`,
    };

    function GeneratedModulePage() {
        return (
            <ModulePageLayout
                title={page.title}
                description={page.description}
                templates={config.templates}
            />
        );
    }

    GeneratedModulePage.displayName = `${config.id}ModulePage`;

    return {
        id: config.id,
        name: config.name,
        path: normalizePath(config.pathSegment),
        order: config.order,
        icon: config.icon,
        element: GeneratedModulePage,
        page,
        templates: config.templates,
    };
}
