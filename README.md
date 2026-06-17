<p align="center">
  <img src="./public/favicon.svg" alt="Command Builder" width="72" />
</p>

# Command Builder

[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![pnpm](https://img.shields.io/badge/pnpm-ready-f69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)

Command Builder is a React app for generating command-line snippets from reusable templates. Users pick a module, fill in placeholder values, copy the rendered command, and run it in their own terminal.

The app currently includes modules for **Git**, **Linux**, **SSH**, **Rclone**, **Docker**, **Python**, and **WordPress**.

> [!NOTE]
> This app only generates commands in the browser. It has no backend, does not execute commands, and does not send placeholder values anywhere.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Run Locally](#run-locally)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Adding New Content](#adding-new-content)
- [Conventions](#conventions)
- [Pre-Merge Checks](#pre-merge-checks)
- [Troubleshooting](#troubleshooting)

## Features

- Render commands from template strings with `${name}` placeholders.
- Automatically create input fields from placeholders used in commands.
- Support commands as plain strings or `{ note, cmd }` objects for per-command notes.
- Copy rendered commands with the Clipboard API.
- Automatically update the sidebar, routes, and home grid when a new module is added.
- Preserve page state across navigation with React `Activity`.
- Test coverage for the template helper, module factory, module registry auto-discovery, and template data conventions.

## Requirements

- **Node.js** `^20.19.0 || >=22.12.0`
- **pnpm** `>=9` recommended
- Git

Quick check:

```bash
node --version
pnpm --version
git --version
```

## Run Locally

```bash
pnpm install
pnpm dev
```

Open the URL printed by Vite in your terminal. It is usually:

```text
http://localhost:5173
```

Build and preview the production bundle:

```bash
pnpm build
pnpm preview
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check the app and build for production |
| `pnpm preview` | Preview the built `dist/` output |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:typecheck` | Type-check test files separately |

## Architecture

```text
src/
  app/
    modules.ts              # Auto-discovers feature modules
    router.tsx              # React Router config
    layouts/                # Header, sidebar, shell layout
  features/
    defineCommandModule.tsx # Factory for page + FeatureModule
    <feature>/
      index.ts              # Module config, default export
      data/templates.ts     # Command templates for the module
      components/*Icon.tsx  # Optional feature icon
  shared/
    templates/              # defineTemplates(), collectPlaceholders()
    components/             # TemplateCard, command output, TOC
    context/                # Active template state
    types/                  # CommandTemplate, FeatureModule
```

Main flow:

1. `src/app/modules.ts` uses `import.meta.glob('/src/features/*/index.ts', { eager: true })`.
2. Each feature default-exports a `FeatureModule` created by `defineCommandModule()`.
3. `src/app/router.tsx`, the sidebar, and the home page all consume the same `featureModules` array.
4. `defineTemplates()` normalizes template data by adding `category`, inferring `placeholders`, and preserving `commands`.

## Adding New Content

See [`docs/templates.md`](docs/templates.md) for the full workflow. The examples below cover the daily path.

### Add a Template to an Existing Module

Edit the module data file, for example `src/features/git/data/templates.ts`:

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

`defineTemplates()` automatically infers placeholders from `${placeholder}`:

```ts
{
    id: 'docker-logs',
    name: 'View Logs',
    description: 'View logs for a container',
    commands: [
        'docker logs -f ${container}',
    ],
}
```

The example above automatically creates a `container` input.

When the input order should differ from first use in the command text, declare `placeholders` explicitly:

```ts
{
    id: 'compress-files-folders',
    name: 'Tar, Zip, RAR',
    description: 'Compress or extract files',
    placeholders: ['folder', 'file_name'],
    commands: [
        'tar -czvf ${file_name}.tar.gz ${folder}',
    ],
}
```

### Add a New Module/Page

Create this folder:

```text
src/features/kubernetes/
  data/templates.ts
  index.ts
  components/KubernetesIcon.tsx
```

`src/features/kubernetes/data/templates.ts`:

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

`src/features/kubernetes/index.ts`:

```ts
import { defineCommandModule } from '@/features/defineCommandModule';
import { templates } from './data/templates';
import { KubernetesIcon } from './components/KubernetesIcon';

export const kubernetesModule = defineCommandModule({
    id: 'kubernetes',
    name: 'Kubernetes',
    pathSegment: 'kubernetes',
    icon: KubernetesIcon,
    order: 80,
    templates,
});

export default kubernetesModule;
```

The app will automatically register the `/kubernetes` route, sidebar item, and home card. No edits are needed in `src/app/modules.ts`, `src/app/router.tsx`, `HomePage`, or `Sidebar`.

## Conventions

- `template.id` must be unique across the app and stable because it is used as an anchor.
- `module.id` should be short, lowercase, and preferably kebab-case when needed.
- `pathSegment` does not need a leading slash; the factory normalizes it.
- `order` should increase by 10 to leave room for inserting modules later.
- Use `${placeholder_name}` for inputs; the helper supports letters, numbers, and `_`.
- Use `{ note, cmd }` when a command needs explanatory text before the output.
- Do not declare `category` in each template when it matches the module name.
- Declare `placeholders` only when you need to control input order.
- Component files should export components only to keep React Fast Refresh stable.

> [!TIP]
> When adding a new module, run the registry tests. They catch duplicate routes, duplicate template IDs, and accidental manual module registration.

## Pre-Merge Checks

```bash
pnpm test
pnpm run test:typecheck
pnpm run lint
pnpm run build
```

Convention and migration checks:

```bash
rg "pages/ModulePage|./pages/ModulePage|../pages/ModulePage" src
rg "from '@/features/(git|docker|wordpress|linux|ssh|python|rclone)'" src/app --glob "!*.test.ts"
rg "category:" src/features --glob "data/templates.ts"
```

Expected result: no matches.

## Troubleshooting

### `pnpm dev` Fails Because of the Node Version

Vite 7 requires Node `^20.19.0 || >=22.12.0`. Update Node, then run:

```bash
node --version
pnpm install
```

### A New Module Does Not Show in the Route or Sidebar

Check `src/features/<feature>/index.ts`:

- It has `export default <moduleName>Module`.
- The file matches the `src/features/*/index.ts` pattern.
- `order`, `id`, `pathSegment`, and `templates` are passed to `defineCommandModule()`.

### An Input Does Not Appear for a Placeholder

Placeholders must use this syntax:

```text
${placeholder_name}
```

If you need custom input ordering, add `placeholders: [...]` to the template.

### Lint Reports a Fast Refresh Export Boundary

Do not export helpers or constants from the same file as a component. Move helpers to a `.ts` file and keep the component in `.tsx`.
