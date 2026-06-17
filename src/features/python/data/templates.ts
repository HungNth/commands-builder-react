import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Python', [
    {
        id: 'python-env-windows',
        name: '📊 Python Env Windows',
        description: 'Cài đặt và quản lý môi trường ảo Python trên Windows',
        commands: [
            { cmd: 'python -m venv .venv' },
            { cmd: '.venv\\Scripts\\activate.bat' },
            { cmd: 'pip install -r requirements.txt' },
        ],
    },
    {
        id: 'python-env-linux',
        name: '📊 Python Env Linux',
        description: 'Cài đặt và quản lý môi trường ảo Python trên Linux',
        commands: [
            { cmd: 'python3 -m venv .venv' },
            { cmd: 'source .venv/bin/activate' },
            { cmd: 'pip install -r requirements.txt' },
        ],
    },
]);
