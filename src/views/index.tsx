// views/
import ExperimentSection from "@/components/ExperimentSection";
import WorkSection from "@/components/WorkSection";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useVersion } from "@/hooks/useVersion";
import { motion } from "framer-motion";
import { EyeIcon, MailIcon } from "@/presets/svgs";
import Link from "next/link";
import Logo from "@/components/Logo";

const IndexView = () => {
  const { registerSection, getOpacity, getTransition, activeSection } = useActiveSection(3000)
  const version = useVersion()

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
        initial={{ opacity: 0.8 }}
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
      <div className="relative flex flex-col md:flex-row justify-between gap-y-2 md:gap-y-0">
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
            DON&apos;T BE AFRAID TO BE CURIOUS
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
            BOOK A CHAT
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
        <motion.div
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Link
            href="https://github.com/vznh/mole/releases/"
            className="font-jb text-xs tracking-tight hover:underline decoration-dashed underline-offset-4 text-[#1E1919]"
          >
            Version {version} <span className="text-[11px]">/</span> September 2025 ↗
          </Link>
        </motion.div>
        <div className="md:hidden absolute right-0 top-1/2 transform -translate-y-1/2">
          <Logo width={52} height={52} />
        </div>
      </div>

      <footer className="relative hidden w-full md:flex justify-center md:h-[500px] mb-[-275px]">
        <Logo width={500} height={400} />
      </footer>
    </div>
    </div>
  );
};

export default IndexView;
