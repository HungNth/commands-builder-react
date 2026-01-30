import type { ReactNode } from 'react';
import type { CommandTemplate } from '@/shared/types';
import { ActiveTemplateProvider } from '@/shared/context/ActiveTemplateContext';
import { TemplateCard } from './TemplateCard';
import { TableOfContents } from './TableOfContents';

interface ModulePageLayoutProps {
    title: string;
    description: string;
    templates: CommandTemplate[];
    children?: ReactNode;
}

/**
 * Shared layout component cho tất cả các module pages
 * Tự động wrap với ActiveTemplateProvider để đồng bộ state giữa cards và navigation
 */
export function ModulePageLayout({ title, description, templates }: ModulePageLayoutProps) {
    return (
        <ActiveTemplateProvider>
            <div className="flex gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground mt-2">{description}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {templates.map((template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </div>

                {/* Table of Contents - Sticky */}
                <aside className="hidden xl:block w-64 shrink-0">
                    <div className="sticky top-20">
                        <TableOfContents templates={templates} />
                    </div>
                </aside>
            </div>
        </ActiveTemplateProvider>
    );
}
