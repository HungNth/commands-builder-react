import type { CommandTemplate } from '@/shared/types';

export const templates: CommandTemplate[] = [
    {
        id: 'add-ssh-key',
        category: 'SSH',
        name: '✅ Thêm SSH Key',
        description: 'Thêm SSH Key mới vào hệ thống',
        placeholders: ['key'],
        commands: [
            { cmd: 'echo "${key}" >> ~/.ssh/authorized_keys' },
            { cmd: 'chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh' },
            { cmd: 'service ssh restart' },
        ],
    },
    {
        id: 'change-ssh-port',
        category: 'SSH',
        name: '🔄 Đổi SSH Port',
        description: 'Thay đổi cổng SSH (22) sang cổng khác để tăng cường bảo mật',
        placeholders: ['port'],
        commands: [
            { cmd: 'nano /etc/ssh/sshd_config' },
            { cmd: 'sudo ufw allow ${port}/tcp' },
            { cmd: 'sudo ufw delete allow 22/tcp' },
            { cmd: 'sudo systemctl restart ssh && sudo systemctl daemon-reload && sudo systemctl restart ssh.socket' },
        ],
    },
    {
        id: 'ssh-permissions',
        category: 'SSH',
        name: '🔧 Sửa Quyền SSH',
        description: 'Sửa quyền cho tệp SSH',
        placeholders: ['ssh_file_name'],
        commands: [
            { cmd: 'chmod 600 ${ssh_file_name}' },
            { cmd: 'chmod 644 ${ssh_file_name}.pub' },
            { cmd: 'chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh' },
        ],
    }
];
