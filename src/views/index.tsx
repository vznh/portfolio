// views/
import ProjectSection from "@/components/ProjectSection";
import WorkSection from "@/components/WorkSection";
import { useActiveSection } from "@/hooks/useActiveSection";
import { motion } from "framer-motion";
import { upcoming, projects, open, other } from "@/presets/work";
import { EyeIcon, MailIcon } from "@/presets/svgs";
import Link from "next/link";
import Logo from "@/components/Logo";

const IndexView = () => {
  const { registerSection, getOpacity, getTransition, activeSection } = useActiveSection(3000)

  return (
    <div className="relative min-h-screen overflow-hidden">
    <div className="flex flex-col px-[5%] py-[10%] md:py-[5%] md:px-[20%] gap-y-2 pb-[200px]">
      <div className="w-full flex flex-row justify-between items-start">
        {/* Left: Name, description, links */}
        <div className="flex flex-col gap-y-2">
          <h1 className="font-lora text-5xl tracking-tight">Jason Son</h1>
          <span className="font-geist text-xl opacity-80 tracking-tight">
            Fullstack builder crafting with design-driven solutions.
          </span>
          <div>
            <div className="font-jb tracking-tighter opacity-50 flex flex-wrap gap-x-2 items-center">
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
        className="flex flex-col gap-y-3"
        initial={{ opacity: 0.05 }}
        animate={{ opacity: getOpacity("work") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 1, duration: 0.8, ease: "easeInOut" })}
      >
        <div className="flex flex-row justify-between">
          <span className="font-jb tracking-tight opacity-50">PREVIOUSLY</span>
          <span className="font-jb tracking-tight opacity-50">TYPE</span>
        </div>
        <WorkSection />
      </motion.div>

      <div className="h-16" />
      <motion.div
        ref={registerSection("projects")}
        data-section="projects"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: getOpacity("projects") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 1.5, duration: 1.2, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-50">PROJECTS</span>
        {/* PROJECT LAYOUTS + INDIVIDUAL PROJECT */}
        <ProjectSection src={projects} />
      </motion.div>

      <div className="h-12" />
      <motion.div
        ref={registerSection("upcoming")}
        data-section="upcoming"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: getOpacity("upcoming") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 2, duration: 1.6, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-50">UPCOMING</span>
        <ProjectSection src={upcoming} />
      </motion.div>

      <br/>
      <motion.div
        ref={registerSection("open-source")}
        data-section="open-source"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: getOpacity("open-source") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 2, duration: 2.0, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-50">OPEN-SOURCE</span>
        <ProjectSection src={open} />
      </motion.div>

      <div className="h-12" />
      <motion.div
        ref={registerSection("other")}
        data-section="other"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: getOpacity("other") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 2.5, duration: 2.4, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-50">OTHER</span>
        <ProjectSection src={other} />
      </motion.div>

      {/* Stretch effect at the bottom distorting, and when clicked goes back up. */}
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
            className="font-jb text-xs tracking-tight"
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
            className="font-jb text-xs tracking-tight"
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
            className="font-jb text-xs tracking-tight hover:underline decoration-dashed underline-offset-4"
          >
            Version 3 <span className="text-[11px]">/</span> August 2025 ↗
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
