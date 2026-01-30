import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommandTemplate } from "@/shared/types";
import { useActiveTemplate } from "@/shared/context/ActiveTemplateContext";

interface TableOfContentsProps {
  templates: CommandTemplate[];
  className?: string;
}

/**
 * Table of Contents component để điều hướng nhanh đến templates
 * Chỉ highlight khi click vào card hoặc navigation item
 */
export function TableOfContents({ templates, className }: TableOfContentsProps) {
  const { activeId, setActiveId } = useActiveTemplate();

  const handleNavigationClick = (id: string) => {
    // Set active id trước
    setActiveId(id);
    
    // Scroll đến template
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset cho sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Quick Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1">
          <ul className="space-y-1">
            {templates.map((template) => (
              <li key={template.id}>
                <button
                  onClick={() => handleNavigationClick(template.id)}
                  className={cn(
                    "text-left text-sm w-full px-3 py-2 rounded-md transition-all hover:bg-accent hover:text-accent-foreground",
                    activeId === template.id
                      ? "bg-accent text-accent-foreground font-medium border-l-2 border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {template.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
