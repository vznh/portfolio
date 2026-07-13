// components/ImageOverlay.tsx
import Image from 'next/image';
import React from 'react';

interface ImageOverlayProps {
  visible: boolean;
  images: string[];
  aspectRatio?: string;
  scale?: number;
  zoom?: number;
  objectPosition?: string;
  origin?: string;
}

const BASE_WIDTH_PX = 640;
const BASE_MAX_HEIGHT_VH = 40;

const ImageOverlay: React.FC<ImageOverlayProps> = ({ visible, images, aspectRatio, scale = 1, zoom = 1, objectPosition = 'center', origin = 'center' }) => {
  const widthPx = Math.round(BASE_WIDTH_PX * scale);
  const maxHeightVh = BASE_MAX_HEIGHT_VH * scale;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-1 pointer-events-none transition-opacity duration-150 ease-in-out ${
        visible ? 'opacity-90' : 'opacity-0'
      }`}
    >
      {images.map((src) => {
        if (aspectRatio) {
          return (
            <div
              key={src}
              className="relative overflow-hidden border-[0.5px] border-[#22222240]"
              style={{ width: `min(${widthPx}px, 80vw)`, aspectRatio }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes={`min(${widthPx}px, 80vw)`}
                className="object-cover"
                style={{ objectPosition, transformOrigin: origin, transform: `scale(${zoom})` }}
              />
            </div>
          );
        }
        return (
          <Image
            key={src}
            src={src}
            alt=""
            width={widthPx}
            height={Math.round(widthPx * 0.75)}
            className="object-contain border-[0.5px] border-[#22222240]"
            style={{ maxWidth: `min(${widthPx}px, 80vw)`, maxHeight: `${maxHeightVh}vh` }}
          />
        );
      })}
    </div>
  );
};

export default ImageOverlay;
