// views/
import ProjectSection from "@/components/ProjectSection";
import WorkSection from "@/components/WorkSection";
import { upcoming, projects } from "@/presets/work";
import Link from "next/link";

const IndexView = () => {
  return (
    <div className="flex flex-col px-[5%] py-[5%] md:px-[20%] gap-y-2">
      <h1 className="font-geist text-4xl tracking-tight">
        Jason Son
      </h1>

      <div className="flex flex-col gap-y-3">
        <span className="font-geist text-xl opacity-80 tracking-tight">
          Currently leveraging design to bring ideas to collective alignment.
        </span>

        <div className="font-jb tracking-tighter opacity-30 flex flex-row gap-x-2 items-center">
          <Link className="hover:underline underline-offset-4 decoration-dashed" href="https://x.com/@vivivinh">X</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" href="https://x.com/@vivivinh">LinkedIn</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" href="https://x.com/@vivivinh">Substack</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" href="https://x.com/@vivivinh">Spotify</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" href="https://x.com/@vivivinh">GitHub</Link>
          <span className="text-sm">\</span>
          <Link className="hover:underline underline-offset-4 decoration-dashed" href="https://x.com/@vivivinh">CV</Link>
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


      { /* Stretch effect at the bottom distorting, and when clicked goes back up. */ }
    </div>
  );
};

export default IndexView;
