// hooks/useHoverContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HoverContextType {
  hoveredItem: string | null;
  setHoveredItem: (itemId: string | null) => void;
}

const HoverContext = createContext<HoverContextType | undefined>(undefined);

interface HoverProviderProps {
  children: ReactNode;
}

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ hoveredItem, setHoveredItem }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHoverContext = (): HoverContextType => {
  const context = useContext(HoverContext);
  if (context === undefined) {
    throw new Error('useHoverContext must be used within a HoverProvider');
  }
  return context;
};
