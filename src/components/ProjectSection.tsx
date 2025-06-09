// components/ProjectSection
import { useState, useEffect } from "react";
import Image from "next/image";

export interface ProjectRowProps {
  key: number;
  title: string;
  imgPaths: string[]; // in format { public/images/[].png } with always 16:9 aspect ratio
  accent: string;     // in format { #XXXXXX } for hex color
  className?: string;
};

const ProjectEntity: React.FC<ProjectRowProps> = ({
  title,
  imgPaths,
  accent,
  className = ""
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    if (imgPaths && imgPaths.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imgPaths.length);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [imgPaths]);

  const currentImageURL = (imgPaths && imgPaths.length > 0) ? imgPaths[currentImageIndex] : null;

  return <div
    className={`relative rounded-sm border border-black/20 overflow-hidden ${className}`}
    onMouseOver={() => setHovered(true)}
    onMouseOut={() => setHovered(false)}
    style={{ backgroundColor: accent }}
  >
    <div className="relative w-full pt-[56.25%]">
      <div className="absolute inset-0">
        {imgPaths && imgPaths.length > 0 && currentImageURL && (
          <div
            key={currentImageURL}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentImageURL}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={currentImageIndex === 0}
            />
          </div>
        )}

        {hovered && (
          <div className="absolute bottom-0 left-0 w-full p-2 sm:p-3 md:p-4">
            <h3 className="text-black text-4xl font-semibold tracking-tight">{title}</h3>
          </div>
        )}
      </div>
    </div>
  </div>
}

const ProjectSection: React.FC<{ src: ProjectRowProps[] }> = ({ src }) => {
  return <section className="">
    <div className="c">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        {src.map((p) => (
          <ProjectEntity
            key={p.key}
            title={p.title}
            imgPaths={p.imgPaths}
            accent={p.accent}
            className=""
          />
        ))}
      </div>
    </div>
  </section>
}

export default ProjectSection;
