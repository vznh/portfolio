// views/
import React from "react";
import ExperimentSection from "@/components/ExperimentSection";
import WorkSection from "@/components/WorkSection";
import Crypted from "@/components/Crypted";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useVersion } from "@/hooks/useVersion";
import { motion } from "framer-motion";
import { EyeIcon, MailIcon } from "@/presets/svgs";
import Link from "next/link";
import Logo from "@/components/Logo";

const IndexView = () => {
  const { registerSection, getOpacity, getTransition, activeSection } = useActiveSection(3000)
  const version = useVersion()
  const [showCrypted, setShowCrypted] = React.useState(false)
  const [currentCryptedIndex, setCurrentCryptedIndex] = React.useState(0)
  const [hasStarted, setHasStarted] = React.useState(false)
  const footerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const threshold = viewportHeight * 0.6;
      
      const shouldShow = distanceFromCenter <= threshold;
      
      if (shouldShow && !hasStarted) {
        setHasStarted(true);
        setShowCrypted(true);
      }
      
      if (hasStarted) {
        setShowCrypted(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleCryptedComplete = () => {
    setCurrentCryptedIndex(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
    <div className="main-content flex flex-col px-[5%] py-[10%] md:py-[5%] md:px-[20%] gap-y-2 pb-[200px] bg-[#F8FBF8]">
      <div className="w-full flex flex-row justify-between items-start">
        <div className="flex flex-col gap-y-2">
          <h1 className="font-lora text-5xl tracking-tight text-[#1E1919]">Jason Son</h1>
          <span className="font-geist text-xl opacity-80 tracking-tight text-[#1E1919]">
            Fullstack builder crafting with design-driven solutions.
          </span>
          <div>
            <div className="font-jb tracking-tighter opacity-50 flex flex-wrap gap-x-2 items-center text-[#1E1919]">
              <Link
                className="hover:underline underline-offset-4 decoration-dashed"
                target="_blank"
                href="https://x.com/@vivivinh"
              >
                X
              </Link>
              <span className="text-sm">\</span>
              <Link
                className="hover:underline underline-offset-4 decoration-dashed"
                target="_blank"
                href="https://linkedin.com/in/vznh"
              >
                LinkedIn
              </Link>
              <span className="text-sm">\</span>
              <Link
                className="hover:underline underline-offset-4 decoration-dashed"
                target="_blank"
                href="https://venh.substack.com"
              >
                Substack
              </Link>
              <span className="text-sm">\</span>
              <Link
                className="hover:underline underline-offset-4 decoration-dashed"
                target="_blank"
                href="https://open.spotify.com/user/31axml7xyxvqdf55teottiazjpc4"
              >
                Spotify
              </Link>
              <span className="text-sm">\</span>
              <Link
                className="hover:underline underline-offset-4 decoration-dashed"
                target="_blank"
                href="https://github.com/vznh"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-12" />

      <motion.div
        ref={registerSection("work")}
        data-section="work"
        className="work-section-container flex flex-col gap-y-3"
        initial={{ opacity: 0.05 }}
        animate={{ opacity: getOpacity("work") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 1, duration: 0.8, ease: "easeInOut" })}
      >
        <div className="flex flex-row justify-between">
          <span className="font-jb tracking-tight opacity-50 text-[#1E1919]">PREVIOUSLY</span>
          <span className="font-jb tracking-tight opacity-50 text-[#1E1919]">TYPE</span>
        </div>
        <WorkSection />
      </motion.div>

      <div className="h-16" />
      <motion.div
        ref={registerSection("projects")}
        data-section="projects"
        initial={{ opacity: 0.05 }}
        animate={{ opacity: getOpacity("projects") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 1.3, duration: 1.0, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-50 text-[#1E1919]">PROJECTS</span>
        <ExperimentSection />
      </motion.div>


      {/* This section should lowkey typewrite out itself */}
      <div className="h-24" />


      <footer ref={footerRef} className="relative hidden w-full md:flex justify-center md:h-[500px] mb-[-275px]">
        <Logo width={500} height={400} />
        
        <div className="absolute top-20 left-0 flex flex-col gap-y-2">
          <motion.div
            className="flex flex-row items-center space-x-2 group"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Link
              href="mailto:jasonvinhson@gmail.com"
              className="font-jb text-xs tracking-tight text-[#1E1919]"
            >
              {showCrypted && currentCryptedIndex >= 0 ? (
                <Crypted 
                  text="REQUEST A RESUME" 
                  delay={15} 
                  onComplete={currentCryptedIndex === 0 ? handleCryptedComplete : undefined}
                />
              ) : showCrypted ? (
                ""
              ) : (
                "REQUEST A RESUME"
              )}
            </Link>{" "}
            <span className="relative flex items-center">
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 0.7, scale: 1.2 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  boxShadow: "0 0 16px 8px rgba(255, 255, 255, 0.5)",
                  filter: "blur(4px)",
                }}
              />
              <div className="relative z-10">
                <MailIcon />
              </div>
            </span>
          </motion.div>
          
          <motion.div
            className="flex flex-row items-center space-x-2 group"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Link
              href="https://cal.com/jason-son-suncdj/15min"
              className="font-jb text-xs tracking-tight text-[#1E1919]"
            >
              {showCrypted && currentCryptedIndex >= 1 ? (
                <Crypted 
                  text="BOOK A CALL" 
                  delay={15} 
                  onComplete={currentCryptedIndex === 1 ? handleCryptedComplete : undefined}
                />
              ) : showCrypted ? (
                ""
              ) : (
                "BOOK A CALL"
              )}
            </Link>{" "}
            <span className="relative flex items-center">
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 0.7, scale: 1.2 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  boxShadow: "0 0 16px 8px rgba(255, 255, 255, 0.5)",
                  filter: "blur(4px)",
                }}
              />
              <div className="relative z-10">
                <EyeIcon />
              </div>
            </span>
          </motion.div>
        </div>
        
        <div className="absolute top-20 right-0 flex flex-col gap-y-2">
          <motion.div
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Link
              href="https://github.com/vznh/mole/releases/"
              className="font-jb text-xs tracking-tight hover:underline decoration-dashed underline-offset-4 text-[#1E1919]"
            >
              {showCrypted && currentCryptedIndex >= 2 ? (
                <>
                  <Crypted 
                    text={`Version ${version}`} 
                    delay={15} 
                    onComplete={currentCryptedIndex === 2 ? handleCryptedComplete : undefined}
                  /> <span className="text-[11px]">/</span> <Crypted text="September 2025" delay={15} />
                </>
              ) : showCrypted ? (
                ""
              ) : (
                <>
                  Version {version} <span className="text-[11px]">/</span> September 2025
                </>
              )}
            </Link>{" "}
            <span className="text-[#1E1919] text-[11px]">↗</span>
          </motion.div>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default IndexView;
