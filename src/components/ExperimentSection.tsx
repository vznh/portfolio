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
  // Touch state is only read inside event handlers, never rendered — a ref keeps
  // it without triggering a re-render on every touchstart/touchend.
  const touchedRef = useRef<boolean>(false);
  const [desktop, setDesktop] = useState<boolean>(false);
  const [inViewport, setInViewport] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setDesktop(
        window.matchMedia("(hover: hover) and (pointer: fine)").matches,
      );
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  useEffect(() => {
    if (desktop) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const threshold = viewportHeight * 0.5;

      setInViewport(distanceFromCenter <= threshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [desktop]);

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
      onTouchStart={() => { touchedRef.current = true; }}
      onTouchEnd={() => { touchedRef.current = false; }}
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
                src="/images/projects/PLACEHOLDER.png"
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
