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
