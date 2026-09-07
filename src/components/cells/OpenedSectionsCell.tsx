import { sections } from "@/presets/content";
import { useExpandedSections } from "@/hooks/useExpandedSections";

// Right column cell below the clocks: the subheadings of every section the
// user has opened, in the order they opened them. Each line fades in on
// arrival and leaves when its section is closed.
export function OpenedSectionsCell() {
  const { expanded } = useExpandedSections();
  const opened = expanded
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => section?.heading);

  return (
    <ul className="flex flex-col gap-1">
      {opened.map((section) => (
        <li key={section!.id} className="animate-fade-in font-heading text-[13px] text-black opacity-80">
          {section!.heading}
        </li>
      ))}
    </ul>
  );
}
