import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * Python Page - Hiển thị tất cả Python templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="Python Commands"
            description="Tạo nhanh các lệnh Python thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
