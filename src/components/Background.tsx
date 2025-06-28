// components/Background
import Image from "next/image";

const Background: React.FC<{ dark: boolean }> = ({ dark }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-[-1]">
      <div className="relative w-full h-full">
        <Image
          src={ dark ? "/images/bg/tex.png" : "/images/bg/light.jpg" }
          alt="background"
          className="opacity-50"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default Background;
