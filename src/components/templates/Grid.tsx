// components/templates/Grid
import { useEffect, useState, FC, Fragment } from "react";
import { cn } from "@/utils";

interface GridProps {
  color: string; // #XXXXXX
}

export const Grid: FC<GridProps> = ({ color }) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);  
  const [col, setCol] = useState<number>(0);
  const [row, setRow] = useState<number>(0); 

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
    setCol(Math.floor(windowWidth / 18));
    setRow(Math.floor(windowHeight / 18));
  }, []);

  return (
    <Fragment>
      <div className={cn(
        "flex",                         // flex prop
        "w-screen h-screen",            // width & height adjustment
        "justify-center items-center",  // centering
        "absolute",                     // absolute positioning              
        "opacity-40"                    // opacity                
      )} id="grid">
        <svg width={windowWidth - 18 * 2} height={windowHeight - 18 * 2}>
          <defs>
            <pattern
              id="transformedPattern"
              x="0"
              y="0"
              width={9}
              height={9}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width={9}
                height={9}
                stroke={color}
                fill="transparent"
              />
            </pattern>
          </defs>

          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            stroke={color}
            fill="url(#transformedPattern)"
          />
        </svg>
      </div>
    </Fragment>
  );
}