// components/Focus.tsx
import React from 'react';

interface FocusProps {
  isVisible: boolean;
}

const Focus: React.FC<FocusProps> = ({ isVisible}) => {
  return (
    <div
      className={`absolute top-1/2 left-1/2 bg-white border-black border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
      style={{
        width: '288px',
        height: '192px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-[#1E1919] text-xs font-medium px-2">
      </div>
    </div>
  );
};

export default Focus;
