import { sections } from "@/presets/content";
import { useExpandedSections } from "@/hooks/useExpandedSections";

function scrollToHeading(id: string) {
  const heading = document.getElementById(id)?.querySelector("h2");
  heading?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function OpenedSectionsCell() {
  const { expanded } = useExpandedSections();
  const opened = expanded
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => section?.heading);

  return (
    <ul className="flex flex-col gap-4">
      {opened.map((section) => (
        <li key={section!.id} className="animate-fade-in">
          <button
            type="button"
            onClick={() => scrollToHeading(section!.id)}
            className="cursor-pointer font-heading text-[13px] text-black opacity-80 transition-opacity hover:opacity-100"
          >
            {section!.heading}
          </button>
        </li>
      ))}
    </ul>
  );
}
