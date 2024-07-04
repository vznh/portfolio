// hooks/useCameraProp.tsx
import { useEffect, useState } from 'react';
import { useControlsStore } from '@/stores/useControlsStore';

export const useCameraProp = () => {
  const [hasCameraPermission, setCameraPermission] = useState<boolean>(false); 

  // do off rip 
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then(() => setCameraPermission(true))
      .catch(() => setCameraPermission(false));
  }, []);

  return hasCameraPermission;
};

export const useUserIsOnMobileHook = () => {
  const [userIsOnMobile, setUserIsOnMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setUserIsOnMobile(true);
    }

    useControlsStore.setState({ drawMode: false });
  }, []);

  return userIsOnMobile;
};