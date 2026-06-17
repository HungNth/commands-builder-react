import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Linux', [
    {
        id: 'linux-file-folder',
        name: '💽 Files, Folders',
        description: 'Các thao tác với file, folder trên Linux',
        commands: [
            'ls -lh ${name} # Liệt kê file/folder với thông tin chi tiết',
            'du -sh ${name} # Kiểm tra dung lượng folder',
            'du -ah ${name} # Kiểm tra dung lượng file/folder chi tiết',
            'df -h # Kiểm tra dung lượng ổ đĩa',
        ],
    },
    {
        id: 'find-delete-files-by-extension',
        name: '🗑️ Delete Files',
        description: 'Tìm và xóa file theo định dạng, tên trong thư mục (*.vtt || test-*.js)',
        commands: [
            'find "${folder}" -type f -name "${file}" -delete',
        ],
    },
    {
        id: 'compress-files-folders',
        name: '📦 Tar, Zip, RAR',
        description: 'Nén file với tar.gz hoặc giải nén file tar.gz',
        placeholders: ['folder', 'file_name'],
        commands: [
            'tar -czvf ${file_name}.tar.gz ${folder} # Nén TAR',
            'tar -xzvf ${file_name}.tar.gz # Giải nén TAR',
            'zip -r ${file_name}.zip ${folder} # Nén ZIP',
            'unzip ${file_name}.zip # Giải nén ZIP',
            'unrar x ${file_name}.rar # Giải nén RAR',
        ],
    },
    {
        id: 'linux-temux',
        name: '🧮 Tmux',
        description: 'Tạo, quản lý phiên làm việc với Tmux',
        commands: [
            { cmd: 'tmux ls', note: 'Liệt kê tmux' },
            { cmd: 'tmux new -s ${session}', note: 'Tạo phiên làm việc mới' },
            { cmd: 'tmux attach -t ${session}', note: 'Quay lại phiên làm việc' },
            { cmd: 'tmux detach -s ${session}', note: 'Rời phiên làm việc' },
            { cmd: 'tmux kill-session -t ${session}', note: 'Xóa phiên làm việc' },
            { cmd: '# Ctrl + B -> D để detach khỏi phiên làm việc hiện tại' },
        ],
    },
    {
        id: 'wsl-commands',
        name: '⌨️ WSL Commands',
        description: 'Các lệnh quản lý Windows Subsystem for Linux (WSL)',
        commands: [
            { cmd: 'wsl --update # Cập nhật WSL lên phiên bản mới nhất' },
            { cmd: 'wsl --list --online # Liệt kê các bản Linux có sẵn để cài đặt' },
            { cmd: 'wsl -l -v # Liệt kê các bản WSL đã cài' },
            { cmd: 'wsl --install ${distro} # Cài đặt bản Ubuntu 24.04' },
            { cmd: 'wsl -t ${distro} # Dừng bản WSL đang chạy' },
            { cmd: 'wsl --unregister ${distro} # Gỡ cài đặt bản WSL' },
        ],
    }
]);
