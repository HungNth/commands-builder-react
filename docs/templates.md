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
