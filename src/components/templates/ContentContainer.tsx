// components/ContentContainer.tsx
import { FC, ReactNode } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from '@react-spring/three'
import * as drei from '@react-three/drei'
import * as fiber from '@react-three/fiber'
import { cn } from '@/utils';

export const ContentContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={cn(
      "absolute",  // Positioning
      "w-full h-screen", // Dimensions
      "opacity-100" // Appearance
    )}>
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        // trying to convert below => an error..
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      >
        <ShaderGradient
          control='query'
          urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=2&cAzimuthAngle=180&cDistance=2.9&cPolarAngle=80&cameraZoom=20.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=3&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.3&uFrequency=0&uSpeed=0.1&uStrength=1.4&uTime=8&wireframe=false'
        />
      </ShaderGradientCanvas>
      <div className={cn(
        "relative z-10", // Positioning
        "min-h-screen", // Dimensions
        "flex flex-col", // Flex container
        "items-center justify-center", // Alignment
        "p-4" // Spacing
      )}>
        <div className={cn(
          "w-full", // Width
          "max-w-2xl" // Max width
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}
