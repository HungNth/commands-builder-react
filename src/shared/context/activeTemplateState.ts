import { createContext } from "react";

export interface ActiveTemplateContextType {
  activeId: string;
  setActiveId: (id: string) => void;
}

export const ActiveTemplateContext = createContext<ActiveTemplateContextType | undefined>(undefined);
