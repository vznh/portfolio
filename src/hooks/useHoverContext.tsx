// hooks/useHoverContext.tsx
"use client";

import React from 'react';

interface HoverContextType {
  hoveredItem: string | null;
  setHoveredItem: React.Dispatch<React.SetStateAction<string | null>>;
  // The row currently in its "dimming" phase — i.e. the one whose Focus popup is
  // showing. Drives the page-wide dim so it stays in sync with the popup instead
  // of the (racy) per-row imperative DOM mutation it replaced.
  focusedItem: string | null;
  setFocusedItem: React.Dispatch<React.SetStateAction<string | null>>;
}

const HoverContext = React.createContext<HoverContextType | undefined>(undefined);

interface HoverProviderProps {
  children: React.ReactNode;
}

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [focusedItem, setFocusedItem] = React.useState<string | null>(null);

  // Memoize so consumers only re-render when a value actually changes, not on
  // every provider render (the setters are stable identities).
  const value = React.useMemo(
    () => ({ hoveredItem, setHoveredItem, focusedItem, setFocusedItem }),
    [hoveredItem, focusedItem]
  );

  return (
    <HoverContext.Provider value={value}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHoverContext = (): HoverContextType => {
  const context = React.useContext(HoverContext);
  if (context === undefined) {
    throw new Error('useHoverContext must be used within a HoverProvider');
  }
  return context;
};
