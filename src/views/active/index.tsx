// views/active/index.tsx
import { useControlsStore } from '@/stores/useControlsStore';
import { useUserIsOnMobileHook } from '@/hooks/useCameraProp';
import { FC, Fragment, Suspense, useState, useEffect } from 'react';
import { Grid } from '@/components/templates/Grid';

interface ActiveProps {}

export const ActiveView: FC<ActiveProps> = () => {
  const leftHand = useControlsStore((state: any) => state.leftHand);
  const rightHand = useControlsStore((state: any) => state.rightHand);
  const currentPoseLeftHand = useControlsStore((state: any) => state.currentPoseL);
  const currentPoseRightHand = useControlsStore((state: any) => state.currentPoseR);

  const handIndicator = useControlsStore((state: any) => state.handIndicator); // this should be points
  const handColor = useControlsStore((state: any) => state.handColor); // this should auto be white

  const playgroundBgColor = useControlsStore((state: any) => state.playgroundBgColor); // this should be black
  
  const cameraFeed = useControlsStore((state: any) => state.cameraFeed);

  const userIsOnMobile = useUserIsOnMobileHook();

  useEffect(() => {
    if (
      currentPoseLeftHand === "thumbs_up" &&
      currentPoseRightHand === "thumbs_up" &&
      window.location.href !== 'playground'
    ) {
      window.location.href = 'playground';
    }
  }, [currentPoseLeftHand, currentPoseRightHand]);

  useEffect(() => {
    useControlsStore.setState({ toggleTemplate: true });
    useControlsStore.setState({ currentTab: "none" });
  }, []);

  if (!userIsOnMobile) {
    return (
      <Fragment>

      </Fragment>
    )
  }

  return (
    <Fragment>
      <div>
        <Grid color={handColor} />
      </div>
    </Fragment>
  )
};