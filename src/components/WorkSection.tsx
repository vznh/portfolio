// components/WorkSection
import { experiences } from "@/presets/work";

export interface WorkRowProps {
  key: number;
  company: string;
  date: string;
  role: string;
  className?: string;
}

const WorkRow: React.FC<WorkRowProps> = ({
  company,
  date,
  role,
  className = ""
}) => {
  return <div className={`flex items-center w-full tracking-tighter gap-x-1 sm:gap-x-2 ${className}`}>
    { /* Company goes here! */ }
    <span className="text-2xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{ company }</span>

    { /* Date goes here! */ }
    <span className="text-2xl text-muted-foreground min-w-0 overflow-hidden opacity-50 whitespace-nowrap">{ date }</span>

    { /* Line component is here - don't change. */}
    <div className="flex-grow h-px bg-white opacity-20" aria-hidden="true" />

    { /* Role goes here! */ }
    <span className="text-2xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right">{ role }</span>
  </div>
};

// note: i import experiences from presets/work.ts
const WorkSection = () => {
  return <div className="">
    {experiences.map((i) => (
      <WorkRow key={i.key} company={i.company} date={i.date} role={i.role} />
    ))}
  </div>
}

export default WorkSection;
