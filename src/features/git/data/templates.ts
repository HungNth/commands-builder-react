import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Git', [
    {
        id: 'git-add-remote-nth',
        name: '🎉 Config New Repo (HungNth)',
        description: 'Cấu hình một repo hoàn toàn mới với user HungNth',
        commands: [
            { cmd: 'git init && git config user.name "HungNth" && git config user.email "thienhungnth@gmail.com" && git add . && git commit -m "Initial commit" && git branch -M main' },
            { cmd: 'git remote add origin git@hungnth:HungNth/${repo}.git' },
            { cmd: 'git remote set-url origin git@hungnth:HungNth/${repo}.git' },
        ],
    },
    {
        id: 'git-clone',
        name: '📥 Clone Repository (HungNth)',
        description: 'Clone một repository từ GitHub với user HungNth',
        commands: [
            { cmd: 'git clone git@hungnth:HungNth/${repo}.git' },
            { cmd: 'git clone -b ${branch} git@hungnth:HungNth/${repo}.git' },
            { cmd: 'git config user.name "HungNth" && git config user.email "thienhungnth@gmail.com"' }
        ],
    },
    {
        id: 'git-commit',
        name: '💬 Commit Message',
        description: 'Tạo commit message',
        commands: [
            { cmd: 'git commit -m "${message}"' }
        ],
    },
    {
        id: 'git-create-branch',
        name: '🌿 Create & Switch Branch',
        description: 'Tạo và chuyển sang branch mới',
        commands: [
            'git checkout -b ${branch}',
            'git push -u origin ${branch}',
        ],
    },
    {
        id: 'git-merge-branch',
        name: '🔀 Merge Branch',
        description: 'Merge branch vào branch hiện tại',
        commands: [
            { cmd: 'git merge ${branch}' },
            { cmd: 'git push' },
        ],
    },
    {
        id: 'git-tag-release',
        name: '🏷️ Create Release Tag',
        description: 'Tạo tag cho release mới',
        commands: [
            { cmd: 'git tag -a ${version} -m "${message}"' },
            { cmd: 'git push origin ${version}' },
        ],
    },
    {
        id: 'git-reset-hard',
        name: '⚠️ Hard Reset',
        description: 'Reset về commit cụ thể (XÓA mọi thay đổi)',
        commands: [
            { cmd: 'git reset --hard ${commit}' }
        ],
    },
    {
        id: 'git-stash',
        name: '📦 Stash Changes',
        description: 'Lưu tạm thay đổi chưa commit',
        commands: [
            { cmd: 'git stash save "${message}"' },
        ],
    },
]);
