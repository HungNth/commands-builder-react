import { useState, useMemo } from 'react';
import type { CommandTemplate, TemplateInputs } from '@/shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CommandOutput } from './CommandOutput';
import { cn, replacePlaceholders, toCapitalize, removeUnderscore } from '@/lib/utils';
import { useActiveTemplate } from '@/shared/context/ActiveTemplateContext';

interface TemplateCardProps {
    template: CommandTemplate;
}

/**
 * Component để render một template với các input fields và output commands
 */
export function TemplateCard({template}: TemplateCardProps) {
    const [inputs, setInputs] = useState<TemplateInputs>({});
    const { activeId, setActiveId } = useActiveTemplate();
    
    const isActive = activeId === template.id;

    const handleCardClick = () => {
        setActiveId(template.id);
    };

    const handleInputFocus = () => {
        setActiveId(template.id);
    };

    const handleInputChange = (key: string, value: string) => {
        setInputs((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Generate commands với placeholders được thay thế
    const generatedCommands: { note: string; cmd: string }[] = useMemo(() => {
        return template.commands.map((cmd) => {
            // If command is a plain string, replace placeholders and wrap into an object
            if (typeof cmd === 'string') {
                return {
                    note: '',
                    cmd: replacePlaceholders(cmd, inputs),
                };
            }

            // If command is already an object { note?, cmd }, replace placeholders for each field safely
            const note = cmd.note ? replacePlaceholders(cmd.note, inputs) : '';
            const command = cmd.cmd
                ? replacePlaceholders(cmd.cmd, inputs)
                : '';

            return {
                note,
                cmd: command,
            };
        });
    }, [template.commands, inputs]);

    // Kiểm tra xem có input nào được điền chưa
    const hasInputs = Object.values(inputs).some((value) => value.trim() !== '');

    return (
        <Card 
            className={cn(
                "w-full transition-all cursor-pointer",
                isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )} 
            id={template.id}
            onClick={handleCardClick}
        >
            <CardHeader>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Input Fields */}
                {template.placeholders.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Nhập thông tin:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {template.placeholders.map((placeholder) => (
                                <div key={placeholder} className="space-y-2">
                                    <Label htmlFor={`${template.id}-${placeholder}`}>
                                        {toCapitalize(placeholder)}
                                    </Label>
                                    <Input
                                        id={`${template.id}-${placeholder}`}
                                        type="text"
                                        placeholder={`Nhập ${removeUnderscore(placeholder)}...`}
                                        value={inputs[placeholder] || ''}
                                        onChange={(e) => handleInputChange(placeholder, e.target.value)}
                                        onFocus={handleInputFocus}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Generated Commands */}
                {(hasInputs || template.placeholders.length === 0) && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Kết quả:
                        </h4>
                        <div className="space-y-3">
                            {generatedCommands.map((command, index) => (
                                <div key={index} className="flex flex-col gap-3">
                                    {command.note && (
                                        <p className='text-sm'>{command.note}</p>
                                    )}
                                    <CommandOutput command={command.cmd} />
                                </div >
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
