import { describe, expect, it } from 'vitest';
import { dockerModule } from './docker';
import { gitModule } from './git';
import { linuxModule } from './linux';
import { pythonModule } from './python';
import { rcloneModule } from './rclone';
import { sshModule } from './ssh';
import { wordpressModule } from './wordpress';

const modules = [
    gitModule,
    linuxModule,
    sshModule,
    rcloneModule,
    dockerModule,
    pythonModule,
    wordpressModule,
];

describe('feature module exports', () => {
    it('exposes stable IDs and explicit display order', () => {
        expect(modules.map((module) => [module.id, module.order])).toEqual([
            ['git', 10],
            ['linux', 20],
            ['ssh', 30],
            ['rclone', 40],
            ['docker', 50],
            ['python', 60],
            ['wordpress', 70],
        ]);
    });

    it('keeps existing route paths', () => {
        expect(modules.map((module) => module.path)).toEqual([
            '/git',
            '/linux',
            '/ssh',
            '/rclone',
            '/docker',
            '/python',
            '/wordpress',
        ]);
    });

    it('creates page metadata for every module', () => {
        expect(modules.map((module) => module.page.title)).toEqual([
            'Git Commands',
            'Linux Commands',
            'SSH Commands',
            'Rclone Commands',
            'Docker Commands',
            'Python Commands',
            'WordPress Commands',
        ]);
    });
});
