// components/WorkSection
import { experiences } from "@/presets/work";
import Image from "next/image";

export interface WorkRowProps {
  key: number;
  company: string;
  date?: string;
  role: string;
  img: string;
  className?: string;
}

const WorkRow: React.FC<WorkRowProps> = ({
  company,
  date = "",
  role,
  img,
  className = ""
}) => {
  return <div className={`flex items-center w-full tracking-tighter gap-x-1 sm:gap-x-2 ${className}`}>
    <Image src={img} alt={`Icon for company ${company}`} width={32} height={32} className="rounded-md border border-opacity-5 border-black" />

    { /* Company goes here! */ }
    <span className="font-geist opacity-80 text-xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{ company }</span>

    { /* Date goes here! */ }
    <span className="font-geist text-xl text-black min-w-0 overflow-hidden opacity-20 whitespace-nowrap">{ date }</span>

    { /* Line component is here - don't change. */}
    <div className="flex-grow h-px bg-black opacity-10" aria-hidden="true" />

    { /* Role goes here! */ }
    <span className="font-geist opacity-80 text-xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right">{ role }</span>
  </div>
};

// note: i import experiences from presets/work.ts
const WorkSection = () => {
  return <div className="flex flex-col gap-y-3">
    {experiences.map((i) => (
      <WorkRow key={i.key} company={i.company} date={i.date} role={i.role} img={i.img} />
    ))}
  </div>
}

export default WorkSection;
