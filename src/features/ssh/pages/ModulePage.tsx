import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * SSH Page - Hiển thị tất cả SSH templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="SSH Commands"
            description="Tạo nhanh các lệnh SSH thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
