import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Docker', [
    {
        id: 'docker-compose',
        name: '⬆️ Docker Compose',
        description: 'Khởi động services với Docker Compose',
        commands: [
            { cmd: 'docker-compose up -d' },
            { cmd: 'docker-compose down -v' },
        ],
    },
    {
        id: 'docker-clear',
        name: '🗑️ Docker Clear',
        description: 'Xóa tất cả container, image, volume không sử dụng',
        commands: [
            { cmd: 'docker system prune -a' },
            { cmd: 'docker builder prune --all' },
        ],
    },
    {
        id: 'docker-volume',
        name: '🗂️ Docker Volume',
        description: 'Liệt kê và xóa các volume theo tên',
        commands: [
            { cmd: 'docker volume ls' },
            { cmd: 'docker volume rm ${volume_name}' },
        ],
    },
    {
        id: 'docker-network',
        name: '🖥️ Docker Network',
        description: 'Liệt kê và xóa các network theo tên',
        commands: [
            { cmd: 'docker network ls' },
            { cmd: 'docker network rm ${network_name}' },
        ],
    },
    {
        id: 'docker-image',
        name: '📷 Docker Images',
        description: 'Liệt kê và xóa các image theo tên',
        commands: [
            { cmd: 'docker images ls' },
            { cmd: 'docker rmi ${image_name}' },
        ],
    },
    {
        id: 'docker-exec',
        name: '💻 Execute Command',
        description: 'Thực thi lệnh trong container đang chạy',
        commands: [
            { cmd: 'docker exec -it ${container} ${command}' }
        ],
    },
    {
        id: 'docker-logs',
        name: '📋 View Logs',
        description: 'Xem logs của container',
        commands: [
            { cmd: 'docker logs -f ${container}' }
        ],
    },
    {
        id: 'docker-stop-remove',
        name: '🗑️ Stop & Remove Container',
        description: 'Dừng và xóa container',
        commands: [
            { cmd: 'docker stop ${container}' },
            { cmd: 'docker rm ${container}' },
        ],
    },
]);
