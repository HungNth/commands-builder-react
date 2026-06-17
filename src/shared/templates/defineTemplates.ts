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
