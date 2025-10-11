// components/Focus.tsx
import Image from 'next/image';
import React from 'react';

interface FocusProps {
  visible: boolean;
  date?: string; // Jun 2024 - Aug 2024
  role?: string; // Software Engineer (focus role)
  images?: string[];
  desc?: string; // long desc
}

const Focus: React.FC<FocusProps> = ({ visible, date, role, images, desc }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (!images || images.length <= 3 || !visible || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2500); // 2.5 seconds

    return () => clearInterval(interval);
  }, [images, visible, isHovered]);

  React.useEffect(() => {
    if (!visible) {
      setCurrentImageIndex(0);
    }
  }, [visible]);

  const renderImages = () => {
    if (!images || images.length === 0) return null;

    if (images.length <= 3) {
      return (
        <div className="flex flex-row gap-x-2 justify-center">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              width={images.length === 1 ? 160 : images.length === 2 ? 75 : 50}
              height={90}
              className="object-cover"
            />
          ))}
        </div>
      );
    } else {
      return (
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={images[currentImageIndex]}
            alt=""
            width={160}
            height={90}
            className="transition-opacity duration-300"
          />
        </div>
      );
    }
  };

  return (
    <div
      className={`absolute top-1/2 left-1/2 bg-white border-black border-opacity-20 border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      style={{
        width: '288px',
        height: '216px',
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

        <div className="flex ml-2">
          {renderImages()}
        </div>

        <div className="text-xs font-jb items-end p-2 pb-4">
          {desc || 'No description available.'}
        </div>
      </div>
    </div>
  );
};

export default Focus;
