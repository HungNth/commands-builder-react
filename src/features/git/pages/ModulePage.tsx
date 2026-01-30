import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * Git Page - Hiển thị tất cả Git templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="Git Commands"
            description="Tạo nhanh các lệnh Git thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
