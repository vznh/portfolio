// views/

import WorkSection from "@/components/WorkSection";

const IndexView = () => {
  return (
    <div className="flex flex-col px-[5%] py-[5%] md:px-[20%] gap-y-2">
      <h1 className="text-4xl tracking-tight">
        Jason Son
      </h1>

      <div>
        <span className="text-xl opacity-80 tracking-tight">
          The devil is in the details. But so is salvation.
        </span>

        <br />

        <span className="text-xl opacity-80 tracking-tight">
          I&apos;m an engineer leveraging design to bring ideas to collective alignment.
        </span>
      </div>

      <br />

      <span className="tracking-tight opacity-30">PREVIOUSLY</span>
      <WorkSection />

      <br />

      <span className="tracking-tight opacity-30">WORK</span>
      { /* PROJECT LAYOUTS + INDIVIDUAL PROJECT */}

    </div>
  );
};

export default IndexView;
