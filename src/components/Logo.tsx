// components/Logo
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/logo/frame1.png",
  "/images/logo/frame2.png",
  "/images/logo/frame3.png",
  "/images/logo/frame4.png",
];

const Logo: React.FC<{ width: number, height: number, className?: string }> = ({ width, height, className = ""}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Image
      src={images[index]}
      alt={`logo frame${index + 1}`}
      className={className}
      width={width}
      height={height}
      priority
    />
  );
}

export default Logo;
