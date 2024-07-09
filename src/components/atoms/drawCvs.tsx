// components/atoms/dravCvs
import { useRef, useState, useEffect, FC } from "react";
import { useControlsStore } from "@/stores/useControlsStore";

interface CvsProps {
  videoWidth: number;
  videoHeight: number;
  trigger: boolean;
  point: { x: number; y: number };
  thenDetail: [string, number];
}

export const DrawCvs: FC<CvsProps> = ({ 
  videoWidth, 
  videoHeight, 
  trigger, 
  point, 
  thenDetail 
}) => {
  const reactionRef = useRef(null);
  const memoryRef = useRef(null);

  var scale = 2;
  const clearBtn = useControlsStore((state: any) => state.clearBtn);
  const handColor = useControlsStore((state: any) => state.handColor);
  const [drawArray, setDrawArray] = useState<Array<[number, number]>>([]);
  const [lineArray, setLineArray] = useState<Array<[number, number]>>([]);
  
  useEffect(() => {
    if (lineArray.length !== 0 || drawArray.length !== 0) 
  }, [lineArray, drawArray]);
}