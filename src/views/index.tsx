// views/
import ProjectSection from "@/components/ProjectSection";
import WorkSection from "@/components/WorkSection";
import { upcoming, projects, other } from "@/presets/work";
import Link from "next/link";

const IndexView = () => {
  return (
    <div className="flex flex-col px-[5%] py-[10%] md:py-[5%] md:px-[20%] gap-y-2">
      <h1 className="font-geist text-4xl tracking-tight">
        Jason Son
      </h1>

      <div className="flex flex-col gap-y-3">
        <span className="font-geist text-xl opacity-80 tracking-tight">
          Currently leveraging design to bring ideas to collective alignment.
        </span>

        <div className="font-jb tracking-tighter opacity-30 flex flex-row gap-x-2 items-center">
          <Link className="hover:underline underline-offset-4 decoration-dashed" target="_blank" href="https://x.com/@vivivinh">X</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" target="_blank" href="https://linkedin.com/in/vznh">LinkedIn</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" target="_blank" href="https://venh.substack.com">Substack</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" target="_blank" href="https://open.spotify.com/user/31axml7xyxvqdf55teottiazjpc4">Spotify</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" target="_blank" href="https://github.com/vznh">GitHub</Link>
        </div>
      </div>

      <br />
      <div className="flex justify-between">
        <span className="font-jb tracking-tight opacity-30">PREVIOUSLY</span>
        <span className="font-jb tracking-tight opacity-30">TYPE</span>
      </div>
      <WorkSection />

      <br />
      <span className="font-jb tracking-tight opacity-30">PROJECTS</span>
      { /* PROJECT LAYOUTS + INDIVIDUAL PROJECT */}
      <ProjectSection src={projects} />

      <br />
      <span className="font-jb tracking-tight opacity-30">UPCOMING</span>
      <ProjectSection src={upcoming} />

      <br />
      <span className="font-jb tracking-tight opacity-30">OTHER</span>
      <ProjectSection src={other} />

      { /* Stretch effect at the bottom distorting, and when clicked goes back up. */ }

      <br />
      <div className="flex flex-row justify-between gap-y-2">
        <span className="font-jb text-xs tracking-tight opacity-30">DON&apos;T BE SO AFRAID TO BE CURIOUS</span>
        <span className="font-jb text-xs tracking-tight opacity-30">Version 1</span>
      </div>
    </div>
  );
};

export default IndexView;
