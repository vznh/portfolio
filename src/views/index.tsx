// views/
import ProjectSection from "@/components/ProjectSection";
import WorkSection from "@/components/WorkSection";
import { useActiveSection } from "@/hooks/useActiveSection";
import { motion } from "framer-motion";
import { upcoming, projects, other } from "@/presets/work";
import { MailIcon } from "@/presets/svgs";
import Link from "next/link";

const IndexView = () => {
  const { registerSection, getOpacity, getTransition, activeSection } = useActiveSection(3000)

  return (
    <div className="flex flex-col px-[5%] py-[10%] md:py-[5%] md:px-[20%] gap-y-2">
      <h1 className="font-geist text-4xl tracking-tight">Jason Son</h1>

      <span className="font-geist text-xl opacity-80 tracking-tight">
        Currently leveraging design to bring ideas to collective alignment.
      </span>
      <div>
        <div className="font-jb tracking-tighter opacity-30 flex flex-wrap gap-x-2 items-center">
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

      <br />
      <motion.div
        ref={registerSection("work")}
        data-section="work"
        className="flex flex-col gap-y-3"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: getOpacity("work") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 1, duration: 0.4, ease: "easeInOut" })}
      >
        <div className="flex flex-row justify-between">
          <span className="font-jb tracking-tight opacity-30">PREVIOUSLY</span>
          <span className="font-jb tracking-tight opacity-30">TYPE</span>
        </div>
        <WorkSection />
      </motion.div>

      <br />
      <motion.div
        ref={registerSection("projects")}
        data-section="projects"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: getOpacity("projects") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 1.5, duration: 0.4, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-30">PROJECTS</span>
        {/* PROJECT LAYOUTS + INDIVIDUAL PROJECT */}
        <ProjectSection src={projects} />
      </motion.div>

      <br />
      <motion.div
        ref={registerSection("upcoming")}
        data-section="upcoming"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: getOpacity("upcoming") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 2, duration: 0.4, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-30">UPCOMING</span>
        <ProjectSection src={upcoming} />
      </motion.div>

      <br />
      <motion.div
        ref={registerSection("other")}
        data-section="other"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: getOpacity("other") ?? 1 }}
        exit={{ opacity: 0 }}
        transition={getTransition({ delay: 2.5, duration: 0.4, ease: "easeInOut" })}
        className="flex flex-col gap-y-4"
      >
        <span className="font-jb tracking-tight opacity-30">OTHER</span>
        <ProjectSection src={other} />
      </motion.div>

      {/* Stretch effect at the bottom distorting, and when clicked goes back up. */}
      {/* This section should lowkey typewrite out itself */}
      <br />
      <div className="flex flex-col md:flex-row justify-between gap-y-2 md:gap-y-0">
        <div className="flex flex-row items-center space-x-2">
          <Link
            href="mailto:im@hobin.dev"
            className="font-jb text-xs tracking-tight opacity-30"
          >
            DON&apos;T BE AFRAID TO BE CURIOUS
          </Link>{" "}
          <span className="opacity-30">
            <MailIcon />
          </span>
        </div>
        <Link
          href="https://github.com/vznh/mole/releases/"
          className="font-jb text-xs tracking-tight opacity-30 hover:underline decoration-dashed underline-offset-4"
        >
          Version 1 <span className="text-[11px]">/</span> June 2025 ↗
        </Link>
      </div>
    </div>
  );
};

export default IndexView;
