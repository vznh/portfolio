// components/ExperimentSection
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, ProjectProps } from "@/presets/work";
import Link from "next/link";

const ExperimentEntity: React.FC<ProjectProps> = ({
  title,
  videoPath,
  accent,
  leftText,
  rightText,
  url,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video play/pause based on hover only
  useEffect(() => {
    if (!videoRef.current) return;

    if (isHovered) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isHovered]);

  const content = (
    <div
      className={`relative ${url ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container - 1:1 aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xs">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoPath} type="video/mp4" />
        </video>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col justify-end p-4"
            >
              <div className="flex justify-between items-end border-t border-black/50 opacity-50  pt-2">
                <span className="font-jb text-black text-xs  tracking-wide ml-4">
                  {leftText || ""}
                </span>
                <span className="font-jb text-black text-xs uppercase tracking-wide mr-4" >
                  {rightText || ""}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (url) {
    return (
      <Link href={url} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
};

const ExperimentSection = () => {
  return (
    <section className="">
      <div className="c">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {projects.map((project) => (
            <ExperimentEntity
              key={project.key}
              title={project.title}
              videoPath={project.videoPath}
              accent={project.accent}
              leftText={project.leftText}
              rightText={project.rightText}
              url={project.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperimentSection;
