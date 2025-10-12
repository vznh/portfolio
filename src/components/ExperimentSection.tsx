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
  priority = false,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if we're on desktop (not touch device)
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => {
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);

  // Handle video play/pause based on hover (desktop) or touch (mobile)
  useEffect(() => {
    if (!videoRef.current) return;

    if (isDesktop && isHovered) {
      videoRef.current.play().catch(console.error);
    } else if (!isDesktop && isTouched) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, isTouched, isDesktop]);

  const content = (
    <div
      ref={containerRef}
      className={`relative ${url ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
    >
      {/* Video Container - 1:1 aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xs">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
        >
          <source src={videoPath} type="video/mp4" />
        </video>

        <AnimatePresence>
          {((isDesktop && isHovered) || (!isDesktop && isTouched)) && (
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
          {projects.map((project, index) => (
            <ExperimentEntity
              key={project.key}
              title={project.title}
              videoPath={project.videoPath}
              accent={project.accent}
              leftText={project.leftText}
              rightText={project.rightText}
              url={project.url}
              priority={index < 2} // Prioritize first 2 videos (above the fold)
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperimentSection;
