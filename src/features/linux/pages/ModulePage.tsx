import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * Linux Page - Hiển thị tất cả Linux templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="Linux Commands"
            description="Tạo nhanh các lệnh Linux thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
