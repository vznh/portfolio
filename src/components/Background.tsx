// components/Background
import Image from "next/image";

const Background = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-[-1]">
      <div className="relative w-full h-full">
        <Image 
          src="/images/bg/rs.png" 
          alt="background" 
          className="opacity-45" 
          fill 
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default Background;