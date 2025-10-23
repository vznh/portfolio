// hooks/useHoverContext.tsx
"use client";

import React from 'react';

interface HoverContextType {
  hoveredItem: string | null;
  setHoveredItem: (itemId: string | null) => void;
}

const HoverContext = React.createContext<HoverContextType | undefined>(undefined);

interface HoverProviderProps {
  children: React.ReactNode;
}

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ hoveredItem, setHoveredItem }}>
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
