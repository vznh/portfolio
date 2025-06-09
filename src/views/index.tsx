// views/
import ProjectSection from "@/components/ProjectSection";
import WorkSection from "@/components/WorkSection";
import { upcoming, projects } from "@/presets/work";

const IndexView = () => {
  return (
    <div className="flex flex-col px-[5%] py-[5%] md:px-[20%] gap-y-2">
      <h1 className="font-tiempos text-4xl tracking-tight">
        Jason Son
      </h1>

      <div>
        <span className="text-xl opacity-80 tracking-tight">
          Currently leveraging design to bring ideas to collective alignment.
        </span>
      </div>

      <br />
      <div className="flex justify-between">
        <span className="tracking-tight opacity-30">PREVIOUSLY</span>
        <span className="tracking-tight opacity-30">TYPE</span>
      </div>
      <WorkSection />

      <br />
      <span className="tracking-tight opacity-30">PROJECTS</span>
      { /* PROJECT LAYOUTS + INDIVIDUAL PROJECT */}
      <ProjectSection src={projects} />

      <br />
      <span className="tracking-tight opacity-30">UPCOMING</span>
      <ProjectSection src={upcoming} />


      { /* Stretch effect at the bottom distorting, and when clicked goes back up. */ }
    </div>
  );
};

export default IndexView;
