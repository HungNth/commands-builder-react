import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('WordPress', [
    {
        id: 'wp-plugin-block-create',
        name: '⏏️ Tạo WordPress Plugin Block Mới',
        description: 'Tạo một WordPress Plugin Block mới với cấu trúc chuẩn',
        commands: [
            'npx @wordpress/create-block ${plugin_name} --textdomain ${plugin_name} --namespace ${plugin_name}'
        ],
    },
    {
        id: 'wp-block-create',
        name: '📥 Tạo WordPress Block Mới (Không Plugin)',
        description: 'Tạo một WordPress Block bên trong một Plugin hiện có',
        commands: [
            'npx @wordpress/create-block ${block_name} --no-plugin --textdomain ${plugin_name} --namespace ${plugin_name}'
        ],
    }
]);
