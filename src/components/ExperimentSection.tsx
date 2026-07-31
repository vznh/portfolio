import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNearViewportCenter } from "@/hooks/useNearViewportCenter";
import { ProjectProps, projects } from "@/presets/work";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ExperimentEntity: React.FC<ProjectProps> = ({
  videoPath,
  leftText,
  rightText,
  url,
  priority = false,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const desktop = useMediaQuery("(hover: hover) and (pointer: fine)");
  // Touch devices have no hover to play on, so playback follows the scroll.
  const inViewport = useNearViewportCenter(containerRef, {
    threshold: 0.5,
    enabled: !desktop,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoLoaded(true);

      video.currentTime = 0.001;
      video
        .play()
        .then(() => {
          setTimeout(() => {
            video.pause();
            video.currentTime = 0;
          }, 1);
        })
        .catch(console.error);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoPath]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (desktop && hovered) {
      videoRef.current.play().catch(console.error);
    } else if (!desktop && inViewport) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [hovered, inViewport, desktop]);

  const content = (
    <div
      ref={containerRef}
      className={`relative ${url ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media Container - 1:1 aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xs">
        <AnimatePresence>
          {!videoLoaded ? (
            <m.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src="/images/projects/placeholder.png"
                alt="Project placeholder"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={priority}
              />
            </m.div>
          ) : null}
        </AnimatePresence>

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
          {((desktop && hovered) || (!desktop && inViewport)) && (
            <m.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col justify-end p-4"
            >
              <div className="flex justify-between items-end border-t border-black/50 opacity-50 pt-2">
                <span className="font-jb text-black text-xs tracking-wide ml-4">
                  {leftText || ""}
                </span>
                <span className="font-jb text-black text-xs uppercase tracking-wide mr-4">
                  {rightText || ""}
                </span>
              </div>
            </m.div>
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
    <LazyMotion features={domAnimation}>
      <section className="">
        <div className="c">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {projects.map((project, index) => (
              <ExperimentEntity
                key={project.key}
                videoPath={project.videoPath}
                leftText={project.leftText}
                rightText={project.rightText}
                url={project.url}
                priority={index < 2}
              />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default ExperimentSection;
