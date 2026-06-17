import { useState, type ReactNode } from "react";
import { ActiveTemplateContext } from "./activeTemplateState";

interface ActiveTemplateProviderProps {
  children: ReactNode;
}

/**
 * Provider để quản lý state của template đang active
 * Cho phép đồng bộ giữa TableOfContents và TemplateCard
 */
export function ActiveTemplateProvider({ children }: ActiveTemplateProviderProps) {
  const [activeId, setActiveId] = useState<string>("");

  return (
    <ActiveTemplateContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveTemplateContext.Provider>
  );
}
