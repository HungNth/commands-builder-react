import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * WordPress Page - Hiển thị tất cả WordPress templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="WordPress Commands"
            description="Tạo nhanh các lệnh cho WordPress thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
