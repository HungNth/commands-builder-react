import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { featureModules } from '@/app/modules';
import { collectPlaceholders } from '@/shared/templates';

const templateSources = [
    ['Git', path.resolve(process.cwd(), 'src/features/git/data/templates.ts')],
    ['Linux', path.resolve(process.cwd(), 'src/features/linux/data/templates.ts')],
    ['SSH', path.resolve(process.cwd(), 'src/features/ssh/data/templates.ts')],
    ['Rclone', path.resolve(process.cwd(), 'src/features/rclone/data/templates.ts')],
    ['Docker', path.resolve(process.cwd(), 'src/features/docker/data/templates.ts')],
    ['Python', path.resolve(process.cwd(), 'src/features/python/data/templates.ts')],
    ['WordPress', path.resolve(process.cwd(), 'src/features/wordpress/data/templates.ts')],
] as const;

const explicitPlaceholderOrderByTemplate = new Map([
    ['compress-files-folders', ['folder', 'file_name']],
]);

describe('feature template data', () => {
    it('uses defineTemplates in every feature data file', () => {
        for (const [category, sourcePath] of templateSources) {
            const source = readFileSync(sourcePath, 'utf8');

            expect(source).toContain("import { defineTemplates } from '@/shared/templates';");
            expect(source).toContain(`defineTemplates('${category}', [`);
            expect(source).not.toContain('CommandTemplate[]');
            expect(source).not.toMatch(/\bcategory:\s*['"]/);
        }
    });

    it('keeps runtime template categories aligned with module names', () => {
        for (const module of featureModules) {
            for (const template of module.templates) {
                expect(template.category).toBe(module.name);
            }
        }
    });

    it('has placeholder metadata matching placeholders used in commands', () => {
        for (const module of featureModules) {
            for (const template of module.templates) {
                const inferredPlaceholders = collectPlaceholders(template.commands);
                const explicitOrder = explicitPlaceholderOrderByTemplate.get(template.id);

                if (explicitOrder) {
                    expect(template.placeholders).toEqual(explicitOrder);
                    expect([...template.placeholders].sort()).toEqual([...inferredPlaceholders].sort());
                    continue;
                }

                expect(template.placeholders).toEqual(inferredPlaceholders);
            }
        }
    });
});
