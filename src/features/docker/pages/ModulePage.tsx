import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * Docker Page - Hiển thị tất cả Docker templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="Docker Commands"
            description="Tạo nhanh các lệnh Docker thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
