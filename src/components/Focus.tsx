// components/Focus.tsx
import React from 'react';

interface FocusProps {
  visible: boolean;
  date?: string; // Jun 2024 - Aug 2024
  role?: string; // Software Engineer (focus role)
  desc?: string; // long desc
}

const Focus: React.FC<FocusProps> = ({ visible, date, role, desc }) => {
  return (
    <div
      className={`absolute top-1/2 left-1/2 bg-white border-black border-opacity-20 border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
      style={{
        width: '288px',
        height: '192px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col h-full text-black text-xs justify-between font-medium px-2">
        <div className="flex flex-row justify-between">
        <div className="text-xs font-jb items-start p-2 pt-4 opacity-50">
          <span>{date || 'DATE'}</span>
        </div>
        <div className="text-xs font-jb items-start p-2 pt-4 text-right opacity-50">
          <span>{role || 'ROLE'}</span>
        </div>
        </div>

        <div className="text-xs font-jb items-end p-2 pb-4">
          {desc || 'No description available.'}
        </div>
      </div>
    </div>
  );
};

export default Focus;
