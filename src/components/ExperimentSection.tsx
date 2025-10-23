// components/ExperimentSection
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, ProjectProps } from "@/presets/work";
import Link from "next/link";
import Image from "next/image";

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
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isGifLoaded, setIsGifLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if the media is a GIF
  const isGif = videoPath.toLowerCase().endsWith('.gif');

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

  // Handle viewport-based visibility for mobile
  useEffect(() => {
    if (isDesktop) return; // Skip viewport detection on desktop

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Check if element is within 50% of viewport height from center
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const threshold = viewportHeight * 0.5;
      
      setIsInViewport(distanceFromCenter <= threshold);
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDesktop]);

  // Handle media loading events
  useEffect(() => {
    if (isGif) {
      // For GIFs, we'll handle loading differently
      setIsGifLoaded(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoPath, isGif]);

  // Handle video play/pause based on hover (desktop) or viewport (mobile)
  useEffect(() => {
    if (isGif) return; // GIFs don't need play/pause control
    
    if (!videoRef.current) return;

    if (isDesktop && isHovered) {
      videoRef.current.play().catch(console.error);
    } else if (!isDesktop && isInViewport) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, isInViewport, isDesktop, isGif]);

  const content = (
    <div
      ref={containerRef}
      className={`relative ${url ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
    >
      {/* Media Container - 1:1 aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xs">
        {/* Placeholder image - always visible until media loads */}
        <AnimatePresence>
          {(!isGif && !isVideoLoaded) || (isGif && !isGifLoaded) ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src="/images/projects/PLACEHOLDER.png"
                alt="Project placeholder"
                fill
                className="object-cover"
                priority={priority}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Video or GIF element */}
        {isGif ? (
          <Image
            src={videoPath}
            alt={title}
            fill
            className="object-cover"
            priority={priority}
            onLoadingComplete={() => setIsGifLoaded(true)}
            unoptimized // Important for GIFs to work properly
          />
        ) : (
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
        )}

        <AnimatePresence>
          {((isDesktop && isHovered) || (!isDesktop && isInViewport)) && (
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
