// components/molecules/Pose
import { useRef, useState, useEffect, FC } from "react";  
import { useControlsStore } from "@/stores/useControlsStore";
import { motion } from "framer-motion";

interface PoseProps {
  videoWidth: number;
  videoHeight: number;
  hand: 'left' | 'right' | 'both';
  pose: string;
  thenType: 'draw';
  thenDetail: string[];
  palmPos: {
    lx: number;
    ly: number;
    rx: number;
    ry: number;
  };
}

export const Pose: FC<PoseProps> = ({ 
  videoWidth, 
  videoHeight, 
  hand, 
  pose, 
  thenType, 
  thenDetail, 
  palmPos 
}) => {
  const currentPoseLeftHand = useControlsStore((state: any) => state.currentPoseL);
  const currentPoseRightHand = useControlsStore((state: any) => state.currentPoseR);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [pt, setPt] = useState({ x: 0, y: 0 });

  const pullTrigger = () => {
    if (hand == "left" && pose === currentPoseLeftHand) {
      setTrigger(true);
      setPt({ x: palmPos.lx, y: palmPos.ly });
    } else if (hand == "right" && pose === currentPoseRightHand) {
      setTrigger(true);
      setPt({ x: palmPos.rx, y: palmPos.ry });
    } else if (
      hand == "both" && 
      pose === currentPoseLeftHand && 
      pose === currentPoseRightHand
    ) {
      setTrigger(true);
      setPt({ x: (palmPos.lx + palmPos.rx) / 2, y: (palmPos.ly + palmPos.ry) / 2 });
    } else {
      setTrigger(false);
    }
  };
  
  useEffect(() => {
    pullTrigger();
  }, [palmPos]);

}