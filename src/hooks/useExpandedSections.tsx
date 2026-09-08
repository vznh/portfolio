import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ExpandedSections {
  expanded: string[];
  isExpanded: (id: string) => boolean;
  toggle: (id: string) => void;
}

const ExpandedSectionsContext = createContext<ExpandedSections | null>(null);

export function ExpandedSectionsProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const toggle = useCallback((id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
  const value = useMemo<ExpandedSections>(
    () => ({ expanded, isExpanded: (id) => expanded.includes(id), toggle }),
    [expanded, toggle],
  );
  return <ExpandedSectionsContext.Provider value={value}>{children}</ExpandedSectionsContext.Provider>;
}

export function useExpandedSections() {
  const ctx = useContext(ExpandedSectionsContext);
  if (!ctx) throw new Error("useExpandedSections must be used inside ExpandedSectionsProvider");
  return ctx;
}
