import { ModulePageLayout } from '@/shared/components';
import { templates } from '../data/templates.ts';

/**
 * Rclone Page - Hiển thị tất cả Rclone templates
 */
export function ModulePage() {
    return (
        <ModulePageLayout
            title="Rclone Commands"
            description="Tạo nhanh các lệnh Rclone thông dụng với các template được định nghĩa sẵn"
            templates={templates}
        />
    );
}
