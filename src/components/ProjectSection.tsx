// components/ProjectSection
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface ProjectRowProps {
  key: number;
  title: string;
  desc?: string; // Optional description text
  imgPaths: string[]; // in format { public/images/[].png } with always 16:9 aspect ratio
  accent: string; // in format { #XXXXXX } for hex color
  url?: string;
  categories?: string[];
  className?: string;
}

const ProjectEntity: React.FC<ProjectRowProps> = ({
  title,
  desc,
  imgPaths,
  accent,
  url = "",
  categories = [],
  className = "",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);

  // custom mobile states
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [titleSize, setCustomTitleSize] = useState<"text-4xl" | "text-2xl">(
    "text-4xl",
  );
  const [blurState, setCustomBlurState] = useState<
    "backdrop-blur-sm" | "backdrop-blur-xs"
  >("backdrop-blur-sm");
  const [backdropState, setCustomBackdropState] = useState<
    "bg-white/60" | "bg-white/80"
  >("bg-white/60");
  const [fontSelection, setCustomFontSelection] = useState<
    "font-khmer" | "font-geist"
  >("font-khmer");

  useEffect(() => {
    if (imgPaths && imgPaths.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imgPaths.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [imgPaths]);

  // attach hook that checks if you can't hover
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
    ) {
      setHovered(true);
      setIsMobile(true);
      setCustomTitleSize("text-2xl");
      setCustomBlurState("backdrop-blur-xs");
      setCustomBackdropState("bg-white/80");
      setCustomFontSelection("font-geist");
    }
  }, []);

  const currentImageURL =
    imgPaths && imgPaths.length > 0 ? imgPaths[currentImageIndex] : null;

  const Wrapper = url ? "a" : "div";
  const wrapperProps = url
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper {...wrapperProps} className="block">
      <div
        className={`relative rounded-sm border border-black/20 overflow-hidden ${className}`}
        onMouseOver={() => !isMobile && setHovered(true)}
        onMouseOut={() => !isMobile && setHovered(false)}
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

            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  // Black gradient overlay, covers about 70% of the height, white text
                  className="absolute left-0 bottom-0 w-full flex flex-col justify-end"
                  style={{
                    height: "70%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.0) 100%)",
                    color: "#fff",
                    padding: "0.5rem 0.75rem 1rem 0.75rem",
                  }}
                >
                  <h3
                    className={`${fontSelection} tracking-tight ${titleSize} text-2xl text-white`}
                  >
                    {title}
                  </h3>
                  {desc && (
                    <p className="font-geist text-sm text-white/80 leading-relaxed">
                      {desc}
                    </p>
                  )}
                  <div className="flex flex-col md:flex-row gap-0.5 md:gap-1.5 md:items-center md:justify-between mt-2">
                    <div className="flex flex-row gap-1.5">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="font-jb underline underline-offset-4 uppercase text-white text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    {url && (
                      <span className="font-jb text-xs text-white">VIEW LIVE PROJECT↗</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const ProjectSection: React.FC<{ src: ProjectRowProps[] }> = ({ src }) => {
  return (
    <section className="">
      <div className="c">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {src.map((p) => (
            <ProjectEntity
              key={p.key}
              title={p.title}
              desc={p.desc}
              url={p.url}
              categories={p.categories}
              imgPaths={p.imgPaths}
              accent={p.accent}
              className=""
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
