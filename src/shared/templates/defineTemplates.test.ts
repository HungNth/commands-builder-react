import { describe, expect, it } from 'vitest';
import {
    collectPlaceholders,
    defineTemplates,
} from './defineTemplates';

describe('collectPlaceholders', () => {
    it('collects unique placeholders from string and object commands in first-use order', () => {
        const placeholders = collectPlaceholders([
            'git clone git@github.com:${owner}/${repo}.git',
            {
                note: 'Open ${repo} after cloning',
                cmd: 'cd ${repo} && git checkout ${branch}',
            },
            'echo ${owner}',
        ]);

        expect(placeholders).toEqual(['owner', 'repo', 'branch']);
    });

    it('returns an empty array when commands do not contain placeholders', () => {
        expect(collectPlaceholders([
            { cmd: 'docker-compose up -d' },
            'docker system prune -a',
        ])).toEqual([]);
    });
});

describe('defineTemplates', () => {
    it('injects category and inferred placeholders', () => {
        const templates = defineTemplates('Git', [
            {
                id: 'git-clone',
                name: 'Clone Repository',
                description: 'Clone a repository and check out a branch',
                commands: [
                    'git clone git@github.com:${owner}/${repo}.git',
                    'git checkout ${branch}',
                ],
            },
        ]);

        expect(templates).toEqual([
            {
                id: 'git-clone',
                category: 'Git',
                name: 'Clone Repository',
                description: 'Clone a repository and check out a branch',
                placeholders: ['owner', 'repo', 'branch'],
                commands: [
                    'git clone git@github.com:${owner}/${repo}.git',
                    'git checkout ${branch}',
                ],
            },
        ]);
    });

    it('keeps an explicit placeholder order when a template provides one', () => {
        const templates = defineTemplates('Git', [
            {
                id: 'git-release',
                name: 'Release Tag',
                description: 'Create a release tag',
                placeholders: ['message', 'version'],
                commands: [
                    'git tag -a ${version} -m "${message}"',
                ],
            },
        ]);

        expect(templates[0].placeholders).toEqual(['message', 'version']);
    });

    it('allows a template-level category override', () => {
        const templates = defineTemplates('Linux', [
            {
                id: 'wsl-commands',
                category: 'WSL',
                name: 'WSL Commands',
                description: 'Manage WSL distributions',
                commands: ['wsl --install ${distro}'],
            },
        ]);

        expect(templates[0].category).toBe('WSL');
    });
});
