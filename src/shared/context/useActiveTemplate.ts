import { useContext } from "react";
import { ActiveTemplateContext } from "./activeTemplateState";

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
