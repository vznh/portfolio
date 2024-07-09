// hooks/useViewport.tsx
import { useEffect, useState } from 'react';

export const useViewport = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleWindowResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize); 
    
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return windowWidth;
};