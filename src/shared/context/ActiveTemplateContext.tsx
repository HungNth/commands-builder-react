import { createContext, useContext, useState, type ReactNode } from "react";

interface ActiveTemplateContextType {
  activeId: string;
  setActiveId: (id: string) => void;
}

const ActiveTemplateContext = createContext<ActiveTemplateContextType | undefined>(undefined);

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

/**
 * Hook để sử dụng ActiveTemplateContext
 * @throws Error nếu được sử dụng ngoài ActiveTemplateProvider
 */
export function useActiveTemplate() {
  const context = useContext(ActiveTemplateContext);
  if (!context) {
    throw new Error("useActiveTemplate must be used within ActiveTemplateProvider");
  }
  return context;
}
