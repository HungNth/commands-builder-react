import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { featureModules } from './modules';

describe('featureModules registry', () => {
    it('discovers modules and sorts them by explicit order', () => {
        expect(featureModules.map((module) => module.id)).toEqual([
            'git',
            'linux',
            'ssh',
            'rclone',
            'docker',
            'python',
            'wordpress',
        ]);
    });

    it('keeps existing route paths stable', () => {
        expect(featureModules.map((module) => module.path)).toEqual([
            '/git',
            '/linux',
            '/ssh',
            '/rclone',
            '/docker',
            '/python',
            '/wordpress',
        ]);
    });

    it('has unique module paths and template IDs', () => {
        const modulePaths = featureModules.map((module) => module.path);
        const templateIds = featureModules.flatMap((module) =>
            module.templates.map((template) => template.id)
        );

        expect(new Set(modulePaths).size).toBe(modulePaths.length);
        expect(new Set(templateIds).size).toBe(templateIds.length);
    });

    it('uses Vite module discovery instead of manual feature imports', () => {
        const source = readFileSync(path.resolve(process.cwd(), 'src/app/modules.ts'), 'utf8');

        expect(source).toContain('import.meta.glob');
        expect(source).not.toContain("from '@/features/git'");
        expect(source).not.toContain("from '@/features/docker'");
        expect(source).not.toContain("from '@/features/wordpress'");
        expect(source).not.toContain("from '@/features/linux'");
        expect(source).not.toContain("from '@/features/ssh'");
        expect(source).not.toContain("from '@/features/python'");
        expect(source).not.toContain("from '@/features/rclone'");
    });
});
