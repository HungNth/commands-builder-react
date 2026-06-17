import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { featureModules } from '@/app/modules';
import { Github, Home } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

/**
 * Sidebar Component - Navigation menu
 */
export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-56 border-r bg-muted/40 h-full">
            <div className="flex flex-col h-full">
                <div className="p-6">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {/* Home Link */}
                    <Link
                        to="/"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                            location.pathname === '/'
                                ? 'bg-accent text-accent-foreground font-medium'
                                : 'text-muted-foreground'
                        )}
                    >
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Link>

                    {/* Divider */}
                    <div className="my-4 border-t" />

                    {/* Feature Modules */}
                    <div className="space-y-1">
                        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Commands
                        </p>
                        {featureModules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <Link
                                    key={module.path}
                                    to={module.path}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                                        location.pathname === module.path
                                            ? 'bg-accent text-accent-foreground font-medium'
                                            : 'text-muted-foreground'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{module.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="p-4 border-t flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href="https://github.com/Hungnth/commands-builder-react"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="flex flex-col items-center justify-center"
                        >
                            <Github className="size-6" />
                            <p className="text-xs">HungNth</p>
                        </a>
                    </Button>
                </div>
            </div>
        </aside>
    );
}
