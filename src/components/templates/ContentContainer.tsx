// components/ContentContainer.tsx
import { FC, ReactNode } from 'react'; 
import { cn } from '@/utils';

export const ContentContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">{children}</div>
    </div>
  )
} 