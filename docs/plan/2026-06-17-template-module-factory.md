# Template And Module Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor command template and module setup so adding a new template usually changes only one data file, and adding a new command page no longer requires copying a page component or editing the central module registry.

**Architecture:** Keep the current feature-folder structure, but move repeated setup into two shared helpers: `defineTemplates()` for template data normalization and `defineCommandModule()` for route/page metadata. `src/app/modules.ts` will discover feature modules with Vite `import.meta.glob`, sort by explicit `order`, and export the same `featureModules` array shape used by router, sidebar, and home page.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, React Router 7, Tailwind CSS 4, shadcn/ui components, Vitest, Testing Library, jsdom.

## Global Constraints

- Preserve all current public routes: `/git`, `/linux`, `/ssh`, `/rclone`, `/docker`, `/python`, `/wordpress`.
- Preserve current template `id` values so existing table-of-contents anchors keep working.
- Do not add runtime dependencies for this refactor.
- Add test-only dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- Keep template data in `src/features/<feature>/data/templates.ts`.
- Keep feature icons in `src/features/<feature>/components/*Icon.tsx`.
- `pnpm run lint`, `pnpm run build`, and `pnpm test` must pass before merge.

---

## File Structure

- Create `src/shared/templates/defineTemplates.ts`: infers placeholders from command strings and injects the module category into each template.
- Create `src/shared/templates/index.ts`: public export for template helpers.
- Create `src/shared/templates/defineTemplates.test.ts`: unit tests for placeholder inference and category injection.
- Create `src/features/defineCommandModule.tsx`: generates `FeatureModule` objects and their module page components from one config object.
- Create `src/features/defineCommandModule.test.tsx`: tests route normalization, page metadata, and generated page rendering.
- Modify `src/shared/types/index.ts`: add `id`, `order`, and `page` metadata to `FeatureModule`, and replace `React.ComponentType` references with imported `ComponentType`.
- Modify `src/app/modules.ts`: replace manual imports with Vite eager module discovery.
- Create `src/app/modules.test.ts`: verifies discovered modules, route stability, sort order, and unique paths/template IDs.
- Modify `src/app/router.tsx`: keep route creation from `featureModules`; remove the router-to-metadata coupling if no local import still needs it.
- Modify `src/pages/HomePage.tsx`: import `featureModules` from `@/app/modules`.
- Modify `src/app/layouts/components/Sidebar.tsx`: import `featureModules` from `@/app/modules`.
- Modify each `src/features/<feature>/index.ts`: export a named module and default module via `defineCommandModule()`.
- Delete each duplicated `src/features/<feature>/pages/ModulePage.tsx` after its feature uses the generated page.
- Modify each `src/features/<feature>/data/templates.ts`: wrap arrays with `defineTemplates('<Category>', [...])` and remove repeated `category` fields.
- Create `src/features/templates.test.ts`: verifies template source files use the shared helper and runtime templates remain valid.
- Create `docs/templates.md`: documents the new workflow for adding templates and pages.
- Modify `package.json`, `vite.config.ts`, and create `src/test/setup.ts`: add the Vitest test harness.

---

### Task 1: Add Vitest Test Harness

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/smoke.test.ts`

**Interfaces:**
- Consumes: existing Vite config and `pnpm` project scripts.
- Produces: `pnpm test` and `pnpm test:watch` scripts for later tasks.

- [ ] **Step 1: Install test dependencies**

Run:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: `package.json` and `pnpm-lock.yaml` include the new dev dependencies.

- [ ] **Step 2: Add test scripts to `package.json`**

Replace the current `scripts` block with this exact block:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Configure Vitest in `vite.config.ts`**

Replace the file with:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: true,
    },
})
```

- [ ] **Step 4: Create Testing Library setup**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Create a smoke test**

Create `src/test/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
    it('runs Vitest in the Vite project', () => {
        expect(1 + 1).toBe(2);
    });
});
```

- [ ] **Step 6: Run tests**

Run:

```bash
pnpm test
```

Expected: PASS with `src/test/smoke.test.ts`.

- [ ] **Step 7: Run static checks**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: both commands pass.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml vite.config.ts src/test/setup.ts src/test/smoke.test.ts
git commit -m "test: add vitest harness"
```

---

### Task 2: Add Template Definition Helper

**Files:**
- Create: `src/shared/templates/defineTemplates.test.ts`
- Create: `src/shared/templates/defineTemplates.ts`
- Create: `src/shared/templates/index.ts`

**Interfaces:**
- Consumes: `CommandTemplate` and existing command shape from `src/shared/types/index.ts`.
- Produces: `collectPlaceholders(commands: readonly CommandDefinition[]): string[]` and `defineTemplates(category: string, definitions: readonly TemplateDefinition[]): CommandTemplate[]`.

- [ ] **Step 1: Write failing tests**

Create `src/shared/templates/defineTemplates.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
pnpm test -- src/shared/templates/defineTemplates.test.ts
```

Expected: FAIL with an import error for `./defineTemplates`.

- [ ] **Step 3: Implement `defineTemplates`**

Create `src/shared/templates/defineTemplates.ts`:

```ts
import type { CommandTemplate } from '@/shared/types';

export type CommandDefinition = CommandTemplate['commands'][number];

export type TemplateDefinition = Omit<
    CommandTemplate,
    'category' | 'placeholders' | 'commands'
> & {
    category?: string;
    placeholders?: readonly string[];
    commands: readonly CommandDefinition[];
};

const PLACEHOLDER_PATTERN = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

function getCommandParts(command: CommandDefinition): string[] {
    if (typeof command === 'string') {
        return [command];
    }

    return [command.cmd, command.note ?? ''];
}

export function collectPlaceholders(
    commands: readonly CommandDefinition[]
): string[] {
    const seen = new Set<string>();
    const placeholders: string[] = [];

    for (const command of commands) {
        for (const part of getCommandParts(command)) {
            for (const match of part.matchAll(PLACEHOLDER_PATTERN)) {
                const placeholder = match[1];

                if (!seen.has(placeholder)) {
                    seen.add(placeholder);
                    placeholders.push(placeholder);
                }
            }
        }
    }

    return placeholders;
}

export function defineTemplates(
    category: string,
    definitions: readonly TemplateDefinition[]
): CommandTemplate[] {
    return definitions.map((definition) => {
        const {
            category: templateCategory,
            placeholders,
            commands,
            ...rest
        } = definition;

        return {
            ...rest,
            category: templateCategory ?? category,
            placeholders: [...(placeholders ?? collectPlaceholders(commands))],
            commands: [...commands],
        };
    });
}
```

- [ ] **Step 4: Add the public export**

Create `src/shared/templates/index.ts`:

```ts
export {
    collectPlaceholders,
    defineTemplates,
} from './defineTemplates';
export type {
    CommandDefinition,
    TemplateDefinition,
} from './defineTemplates';
```

- [ ] **Step 5: Run the helper tests**

Run:

```bash
pnpm test -- src/shared/templates/defineTemplates.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run static checks**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: both commands pass.

- [ ] **Step 7: Commit**

```bash
git add src/shared/templates/defineTemplates.ts src/shared/templates/index.ts src/shared/templates/defineTemplates.test.ts
git commit -m "feat: add template definition helper"
```

---

### Task 3: Add Command Module Factory

**Files:**
- Modify: `src/shared/types/index.ts`
- Create: `src/features/defineCommandModule.test.tsx`
- Create: `src/features/defineCommandModule.tsx`

**Interfaces:**
- Consumes: `ModulePageLayout` and `CommandTemplate[]`.
- Produces: `defineCommandModule(config: CommandModuleConfig): FeatureModule`.

- [ ] **Step 1: Update shared type expectations with a failing factory test**

Create `src/features/defineCommandModule.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CommandTemplate } from '@/shared/types';
import { defineCommandModule } from './defineCommandModule';

function DemoIcon({ className }: { className?: string }) {
    return <svg className={className} aria-hidden="true" />;
}

const templates: CommandTemplate[] = [
    {
        id: 'demo-command',
        category: 'Demo',
        name: 'Demo template',
        description: 'Render a demo command',
        placeholders: [],
        commands: ['echo demo'],
    },
];

describe('defineCommandModule', () => {
    it('normalizes route and exposes page metadata', () => {
        const module = defineCommandModule({
            id: 'demo',
            name: 'Demo',
            pathSegment: '/demo/',
            icon: DemoIcon,
            order: 30,
            templates,
        });

        expect(module.id).toBe('demo');
        expect(module.name).toBe('Demo');
        expect(module.path).toBe('/demo');
        expect(module.order).toBe(30);
        expect(module.templates).toBe(templates);
        expect(module.page).toEqual({
            title: 'Demo Commands',
            description: 'Tạo nhanh các lệnh Demo thông dụng với các template được định nghĩa sẵn',
        });
    });

    it('renders a generated module page through ModulePageLayout', () => {
        const module = defineCommandModule({
            id: 'demo',
            name: 'Demo',
            pathSegment: 'demo',
            icon: DemoIcon,
            order: 30,
            templates,
        });

        render(<module.element />);

        expect(screen.getByRole('heading', { name: 'Demo Commands' })).toBeInTheDocument();
        expect(screen.getByText('Demo template')).toBeInTheDocument();
    });

    it('uses explicit page copy when provided', () => {
        const module = defineCommandModule({
            id: 'demo',
            name: 'Demo',
            pathSegment: 'demo',
            icon: DemoIcon,
            order: 30,
            templates,
            page: {
                title: 'Custom Demo',
                description: 'Custom description',
            },
        });

        expect(module.page).toEqual({
            title: 'Custom Demo',
            description: 'Custom description',
        });
    });
});
```

- [ ] **Step 2: Run the factory test and verify it fails**

Run:

```bash
pnpm test -- src/features/defineCommandModule.test.tsx
```

Expected: FAIL with an import error for `./defineCommandModule`.

- [ ] **Step 3: Extend `FeatureModule` types**

Replace `src/shared/types/index.ts` with:

```ts
import type { ComponentType } from 'react';

/**
 * Shared types for Command Builder application
 */

/**
 * Represents a command template with placeholders
 */
export type CommandTemplate = {
  /** ID duy nhất cho template */
  id: string;

  /** Tên của module (ví dụ: 'Git', 'Docker') */
  category: string;

  /** Tên hiển thị của template (có thể dùng emoji) */
  name: string;

  /** Mô tả ngắn về template */
  description: string;

  /**
   * Danh sách các 'key' cho placeholder.
   * Ứng dụng sẽ tự động tạo ra các ô Input dựa trên các key này.
   */
  placeholders: string[];

  /**
   * Một mảng các template string hoặc object với note và cmd.
   * Sử dụng cú pháp `${key}` để tham chiếu đến các giá trị từ 'placeholders'.
   * Ví dụ: 'git remote add origin git@${user}:${user}/${repo}.git'
   * Hoặc: { note: 'Mô tả', cmd: 'git remote add origin git@${user}:${user}/${repo}.git' }
   */
  commands: (string | { note?: string; cmd: string })[];
};

/**
 * Một đối tượng Record để lưu trạng thái input của người dùng.
 * Key là placeholder (ví dụ: 'user'), value là giá trị (ví dụ: 'gemini-dev')
 */
export type TemplateInputs = Record<string, string>;

export type ModulePageMeta = {
  /** Tiêu đề hiển thị trong trang module */
  title: string;

  /** Mô tả ngắn hiển thị dưới tiêu đề */
  description: string;
};

/**
 * Represents a feature module configuration
 */
export type FeatureModule = {
  /** ID ổn định dùng cho registry và test */
  id: string;

  /** Tên hiển thị của module */
  name: string;

  /** Đường dẫn route */
  path: string;

  /** Thứ tự hiển thị trong navigation */
  order: number;

  /** Icon component */
  icon: ComponentType<{ className?: string }>;

  /** Element component để render */
  element: ComponentType;

  /** Metadata của trang module */
  page: ModulePageMeta;

  /** Danh sách templates của module */
  templates: CommandTemplate[];
};
```

- [ ] **Step 4: Implement `defineCommandModule`**

Create `src/features/defineCommandModule.tsx`:

```tsx
import type { ComponentType } from 'react';
import { ModulePageLayout } from '@/shared/components';
import type { CommandTemplate, FeatureModule, ModulePageMeta } from '@/shared/types';

type IconComponent = ComponentType<{ className?: string }>;

export type CommandModuleConfig = {
    id: string;
    name: string;
    pathSegment: string;
    icon: IconComponent;
    order: number;
    templates: CommandTemplate[];
    page?: Partial<ModulePageMeta>;
};

function normalizePath(pathSegment: string): string {
    const segment = pathSegment.replace(/^\/+|\/+$/g, '');

    return `/${segment}`;
}

export function defineCommandModule(config: CommandModuleConfig): FeatureModule {
    const page: ModulePageMeta = {
        title: config.page?.title ?? `${config.name} Commands`,
        description:
            config.page?.description ??
            `Tạo nhanh các lệnh ${config.name} thông dụng với các template được định nghĩa sẵn`,
    };

    function GeneratedModulePage() {
        return (
            <ModulePageLayout
                title={page.title}
                description={page.description}
                templates={config.templates}
            />
        );
    }

    GeneratedModulePage.displayName = `${config.id}ModulePage`;

    return {
        id: config.id,
        name: config.name,
        path: normalizePath(config.pathSegment),
        order: config.order,
        icon: config.icon,
        element: GeneratedModulePage,
        page,
        templates: config.templates,
    };
}
```

- [ ] **Step 5: Run the factory tests**

Run:

```bash
pnpm test -- src/features/defineCommandModule.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Run static checks**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: both commands pass.

- [ ] **Step 7: Commit**

```bash
git add src/shared/types/index.ts src/features/defineCommandModule.tsx src/features/defineCommandModule.test.tsx
git commit -m "feat: add command module factory"
```

---

### Task 4: Migrate Feature Modules To The Factory

**Files:**
- Create: `src/features/modules.test.ts`
- Modify: `src/features/git/index.ts`
- Modify: `src/features/linux/index.ts`
- Modify: `src/features/ssh/index.ts`
- Modify: `src/features/rclone/index.ts`
- Modify: `src/features/docker/index.ts`
- Modify: `src/features/python/index.ts`
- Modify: `src/features/wordpress/index.ts`
- Delete: `src/features/git/pages/ModulePage.tsx`
- Delete: `src/features/linux/pages/ModulePage.tsx`
- Delete: `src/features/ssh/pages/ModulePage.tsx`
- Delete: `src/features/rclone/pages/ModulePage.tsx`
- Delete: `src/features/docker/pages/ModulePage.tsx`
- Delete: `src/features/python/pages/ModulePage.tsx`
- Delete: `src/features/wordpress/pages/ModulePage.tsx`

**Interfaces:**
- Consumes: `defineCommandModule(config)` from Task 3.
- Produces: every feature index exports both a named module and a default `FeatureModule`.

- [ ] **Step 1: Write failing tests for migrated feature modules**

Create `src/features/modules.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the new tests and verify they fail**

Run:

```bash
pnpm test -- src/features/modules.test.ts
```

Expected: FAIL because current feature modules do not expose `id`, `order`, or `page`.

- [ ] **Step 3: Replace `src/features/git/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { GitIcon } from './components/GitIcon';

export const gitModule = defineCommandModule({
    id: 'git',
    name: 'Git',
    pathSegment: 'git',
    icon: GitIcon,
    order: 10,
    templates,
});

export default gitModule;
```

- [ ] **Step 4: Replace `src/features/linux/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { LinuxIcon } from './components/LinuxIcon';

export const linuxModule = defineCommandModule({
    id: 'linux',
    name: 'Linux',
    pathSegment: 'linux',
    icon: LinuxIcon,
    order: 20,
    templates,
});

export default linuxModule;
```

- [ ] **Step 5: Replace `src/features/ssh/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { SSHIcon } from './components/SSHIcon';

export const sshModule = defineCommandModule({
    id: 'ssh',
    name: 'SSH',
    pathSegment: 'ssh',
    icon: SSHIcon,
    order: 30,
    templates,
});

export default sshModule;
```

- [ ] **Step 6: Replace `src/features/rclone/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { RcloneIcon } from './components/RcloneIcon';

export const rcloneModule = defineCommandModule({
    id: 'rclone',
    name: 'Rclone',
    pathSegment: 'rclone',
    icon: RcloneIcon,
    order: 40,
    templates,
});

export default rcloneModule;
```

- [ ] **Step 7: Replace `src/features/docker/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { DockerIcon } from './components/DockerIcon';

export const dockerModule = defineCommandModule({
    id: 'docker',
    name: 'Docker',
    pathSegment: 'docker',
    icon: DockerIcon,
    order: 50,
    templates,
});

export default dockerModule;
```

- [ ] **Step 8: Replace `src/features/python/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { PythonIcon } from './components/PythonIcon';

export const pythonModule = defineCommandModule({
    id: 'python',
    name: 'Python',
    pathSegment: 'python',
    icon: PythonIcon,
    order: 60,
    templates,
});

export default pythonModule;
```

- [ ] **Step 9: Replace `src/features/wordpress/index.ts`**

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { WordPressIcon } from './components/WordPressIcon';

export const wordpressModule = defineCommandModule({
    id: 'wordpress',
    name: 'WordPress',
    pathSegment: 'wordpress',
    icon: WordPressIcon,
    order: 70,
    templates,
});

export default wordpressModule;
```

- [ ] **Step 10: Delete duplicated module page files**

Delete these files after all indexes above no longer import them:

```text
src/features/git/pages/ModulePage.tsx
src/features/linux/pages/ModulePage.tsx
src/features/ssh/pages/ModulePage.tsx
src/features/rclone/pages/ModulePage.tsx
src/features/docker/pages/ModulePage.tsx
src/features/python/pages/ModulePage.tsx
src/features/wordpress/pages/ModulePage.tsx
```

- [ ] **Step 11: Run tests**

Run:

```bash
pnpm test -- src/features/modules.test.ts src/features/defineCommandModule.test.tsx
```

Expected: PASS.

- [ ] **Step 12: Run static checks**

Run:

```bash
pnpm run lint
pnpm run build
```

Expected: both commands pass and no deleted `pages/ModulePage.tsx` import remains.

- [ ] **Step 13: Commit**

```bash
git add src/features
git add -u src/features
git commit -m "refactor: generate module pages from feature config"
```

---

### Task 5: Auto-Discover Feature Modules

**Files:**
- Create: `src/app/modules.test.ts`
- Modify: `src/app/modules.ts`
- Modify: `src/app/router.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/app/layouts/components/Sidebar.tsx`

**Interfaces:**
- Consumes: default exports from `src/features/*/index.ts`.
- Produces: `featureModules: FeatureModule[]` sorted by `order`, with no manual feature imports in `src/app/modules.ts`.

- [ ] **Step 1: Write failing tests for registry discovery**

Create `src/app/modules.test.ts`:

```ts
import { readFileSync } from 'node:fs';
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
        const source = readFileSync(new URL('./modules.ts', import.meta.url), 'utf8');

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
```

- [ ] **Step 2: Run the registry tests and verify they fail**

Run:

```bash
pnpm test -- src/app/modules.test.ts
```

Expected: FAIL because `src/app/modules.ts` still uses manual imports and does not contain `import.meta.glob`.

- [ ] **Step 3: Replace `src/app/modules.ts`**

```ts
import type { FeatureModule } from '@/shared/types';

type FeatureModuleFile = {
    default: FeatureModule;
};

const featureModuleFiles = import.meta.glob<FeatureModuleFile>(
    '/src/features/*/index.ts',
    { eager: true }
);

export const featureModules = Object.values(featureModuleFiles)
    .map((moduleFile) => moduleFile.default)
    .sort((first, second) => {
        const orderDelta = first.order - second.order;

        if (orderDelta !== 0) {
            return orderDelta;
        }

        return first.name.localeCompare(second.name);
    });
```

- [ ] **Step 4: Keep `src/app/router.tsx` focused on routing**

Replace `src/app/router.tsx` with:

```tsx
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { RootError } from './layouts/RootError';
import { featureModules } from './modules';

// Pages
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Tự động tạo routes từ feature modules
 */
const featureRoutes = featureModules.map((module) => ({
    path: module.path,
    element: <module.element />,
}));

/**
 * Router configuration với dynamic routes
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <RootError />,
        children: [
            { index: true, element: <HomePage /> },
            ...featureRoutes,
            { path: 'about', element: <AboutPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);
```

- [ ] **Step 5: Decouple home page from router exports**

In `src/pages/HomePage.tsx`, replace:

```ts
import { featureModules } from '@/app/router';
```

with:

```ts
import { featureModules } from '@/app/modules';
```

- [ ] **Step 6: Decouple sidebar from router exports**

In `src/app/layouts/components/Sidebar.tsx`, replace:

```ts
import { featureModules } from '@/app/router';
```

with:

```ts
import { featureModules } from '@/app/modules';
```

- [ ] **Step 7: Run registry tests**

Run:

```bash
pnpm test -- src/app/modules.test.ts
```

Expected: PASS.

- [ ] **Step 8: Run the full test suite and static checks**

Run:

```bash
pnpm test
pnpm run lint
pnpm run build
```

Expected: all commands pass.

- [ ] **Step 9: Commit**

```bash
git add src/app/modules.ts src/app/modules.test.ts src/app/router.tsx src/pages/HomePage.tsx src/app/layouts/components/Sidebar.tsx
git commit -m "refactor: auto-discover command modules"
```

---

### Task 6: Migrate Template Data To `defineTemplates`

**Files:**
- Create: `src/features/templates.test.ts`
- Modify: `src/features/git/data/templates.ts`
- Modify: `src/features/linux/data/templates.ts`
- Modify: `src/features/ssh/data/templates.ts`
- Modify: `src/features/rclone/data/templates.ts`
- Modify: `src/features/docker/data/templates.ts`
- Modify: `src/features/python/data/templates.ts`
- Modify: `src/features/wordpress/data/templates.ts`

**Interfaces:**
- Consumes: `defineTemplates(category, definitions)` from Task 2.
- Produces: template data files that do not repeat `category` in every object and can omit `placeholders` when command strings already contain all placeholders in the desired order.

- [ ] **Step 1: Write failing tests for template-data conventions**

Create `src/features/templates.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { featureModules } from '@/app/modules';
import { collectPlaceholders } from '@/shared/templates';

const templateSources = [
    ['Git', new URL('./git/data/templates.ts', import.meta.url)],
    ['Linux', new URL('./linux/data/templates.ts', import.meta.url)],
    ['SSH', new URL('./ssh/data/templates.ts', import.meta.url)],
    ['Rclone', new URL('./rclone/data/templates.ts', import.meta.url)],
    ['Docker', new URL('./docker/data/templates.ts', import.meta.url)],
    ['Python', new URL('./python/data/templates.ts', import.meta.url)],
    ['WordPress', new URL('./wordpress/data/templates.ts', import.meta.url)],
] as const;

describe('feature template data', () => {
    it('uses defineTemplates in every feature data file', () => {
        for (const [category, sourceUrl] of templateSources) {
            const source = readFileSync(sourceUrl, 'utf8');

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
                expect(template.placeholders).toEqual(collectPlaceholders(template.commands));
            }
        }
    });
});
```

- [ ] **Step 2: Run the template convention tests and verify they fail**

Run:

```bash
pnpm test -- src/features/templates.test.ts
```

Expected: FAIL because feature template files still import `CommandTemplate`, repeat `category`, and use `CommandTemplate[]`.

- [ ] **Step 3: Migrate `src/features/git/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Git', [
```

Then remove every line equal to:

```ts
category: 'Git',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 4: Migrate `src/features/linux/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Linux', [
```

Then remove every line equal to:

```ts
category: 'Linux',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 5: Migrate `src/features/ssh/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('SSH', [
```

Then remove every line equal to:

```ts
category: 'SSH',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 6: Migrate `src/features/rclone/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Rclone', [
```

Then remove every line equal to:

```ts
category: 'Rclone',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 7: Migrate `src/features/docker/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Docker', [
```

Then remove every line equal to:

```ts
category: 'Docker',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 8: Migrate `src/features/python/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Python', [
```

Then remove every line equal to:

```ts
category: 'Python',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 9: Migrate `src/features/wordpress/data/templates.ts`**

Change the import and export wrapper:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('WordPress', [
```

Then remove every line equal to:

```ts
category: 'WordPress',
```

Remove every `placeholders: [...]` line in this file because `collectPlaceholders()` infers the same values from the existing commands. Keep every current `id`, `name`, `description`, and `commands` value unchanged. Close the file with:

```ts
]);
```

- [ ] **Step 10: Run template tests**

Run:

```bash
pnpm test -- src/features/templates.test.ts src/shared/templates/defineTemplates.test.ts
```

Expected: PASS.

- [ ] **Step 11: Run the full test suite and static checks**

Run:

```bash
pnpm test
pnpm run lint
pnpm run build
```

Expected: all commands pass.

- [ ] **Step 12: Commit**

```bash
git add src/features/*/data/templates.ts src/features/templates.test.ts
git commit -m "refactor: normalize template definitions"
```

---

### Task 7: Document The New Template And Page Workflow

**Files:**
- Create: `docs/templates.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: `defineTemplates()`, `defineCommandModule()`, and auto-discovered `featureModules`.
- Produces: a short, concrete workflow for adding a template and adding a new command page.

- [ ] **Step 1: Create workflow documentation**

Create `docs/templates.md`:

````md
# Template And Module Workflow

## Add A Template To An Existing Page

Edit the feature data file, for example `src/features/git/data/templates.ts`.

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Git', [
    {
        id: 'git-clean-branches',
        name: 'Clean Local Branches',
        description: 'Delete local branches already merged into main',
        commands: [
            'git checkout main',
            'git branch --merged main | grep -v "main" | xargs -r git branch -d',
        ],
    },
]);
```

`defineTemplates()` adds the `category` automatically and infers `placeholders` from `${placeholder}` usage in `commands` and `note`.

Use explicit `placeholders` only when the input order should differ from first use in the commands:

```ts
export const templates = defineTemplates('Git', [
    {
        id: 'git-release',
        name: 'Release Tag',
        description: 'Create an annotated release tag',
        placeholders: ['message', 'version'],
        commands: [
            'git tag -a ${version} -m "${message}"',
        ],
    },
]);
```

## Add A New Command Page

Create this folder shape:

```text
src/features/kubernetes/
  components/KubernetesIcon.tsx
  data/templates.ts
  index.ts
```

Create `src/features/kubernetes/data/templates.ts`:

```ts
import { defineTemplates } from '@/shared/templates';

export const templates = defineTemplates('Kubernetes', [
    {
        id: 'kubectl-get-pods',
        name: 'List Pods',
        description: 'List pods in a namespace',
        commands: [
            'kubectl get pods -n ${namespace}',
        ],
    },
]);
```

Create `src/features/kubernetes/index.ts`:

```ts
import { Boxes } from 'lucide-react';
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';

export const kubernetesModule = defineCommandModule({
    id: 'kubernetes',
    name: 'Kubernetes',
    pathSegment: 'kubernetes',
    icon: Boxes,
    order: 80,
    templates,
});

export default kubernetesModule;
```

The app discovers `src/features/*/index.ts` automatically. No edit is needed in `src/app/modules.ts`, `src/app/router.tsx`, `src/pages/HomePage.tsx`, or `src/app/layouts/components/Sidebar.tsx`.

## Verify Changes

Run:

```bash
pnpm test
pnpm run lint
pnpm run build
```
````

- [ ] **Step 2: Link the workflow from `README.md`**

Add this section near the existing project usage instructions in `README.md`:

```md
## Adding Templates And Pages

Template and module setup is documented in [`docs/templates.md`](docs/templates.md). Use `defineTemplates()` for command data and `defineCommandModule()` for new command pages so the router, sidebar, and home page stay automatic.
```

- [ ] **Step 3: Run verification**

Run:

```bash
pnpm test
pnpm run lint
pnpm run build
```

Expected: all commands pass.

- [ ] **Step 4: Commit**

```bash
git add docs/templates.md README.md
git commit -m "docs: explain template module workflow"
```

---

## Final Verification

- [ ] Run the full test suite:

```bash
pnpm test
```

Expected: all tests pass, including `src/app/modules.test.ts`, `src/features/modules.test.ts`, `src/features/templates.test.ts`, `src/features/defineCommandModule.test.tsx`, and `src/shared/templates/defineTemplates.test.ts`.

- [ ] Run lint:

```bash
pnpm run lint
```

Expected: no ESLint errors.

- [ ] Run production build:

```bash
pnpm run build
```

Expected: TypeScript build and Vite build both pass.

- [ ] Search for deleted page imports:

```bash
rg "pages/ModulePage|./pages/ModulePage|../pages/ModulePage" src
```

Expected: no matches.

- [ ] Search for repeated feature registry imports:

```bash
rg "from '@/features/(git|docker|wordpress|linux|ssh|python|rclone)'" src/app --glob "!*.test.ts"
```

Expected: no matches.

- [ ] Search for repeated template category declarations:

```bash
rg "category:" src/features/*/data/templates.ts
```

Expected: no matches.

---

## Self-Review

- Spec coverage: the plan reduces copy work for templates through `defineTemplates()`, reduces copy work for pages through `defineCommandModule()`, and removes central registry edits through Vite module discovery.
- Placeholder scan: the plan contains concrete paths, commands, code blocks, and expected command outcomes.
- Type consistency: `FeatureModule`, `ModulePageMeta`, `CommandModuleConfig`, `TemplateDefinition`, `defineCommandModule()`, and `defineTemplates()` names are consistent across tests, implementation, migration, and docs.
